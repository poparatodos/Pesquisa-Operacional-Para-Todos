#!/usr/bin/env bash
#
# Deploy de PRODUÇÃO por "pull", rodando no próprio servidor Apache da UNIRIO.
#
# Por que existe: o GitHub Actions não alcança o servidor (o SSH é bloqueado
# fora da rede da UNIRIO), então em vez de o CI empurrar o build, o servidor
# puxa a `main` todo dia à 00:00, e só publica se houver commit novo e se
# testes + build + gate de SEO passarem. Se algo falhar, o Apache continua
# servindo a versão atual, intocada.
#
# Uso (no servidor, como o usuário que faz o deploy, NÃO como root):
#   ./deploy-servidor.sh instalar   # 1x: clona, ajusta permissões, agenda o cron, 1º deploy
#   ./deploy-servidor.sh executar   # o que o cron roda: publica só se a main mudou
#   ./deploy-servidor.sh executar --forcar   # rebuild + publica mesmo sem commit novo
#   ./deploy-servidor.sh status     # versão no ar, versão da main, último log, cron
#   ./deploy-servidor.sh reverter   # volta para a release anterior e bloqueia o commit atual
#   ./deploy-servidor.sh desinstalar  # remove a entrada do cron (não apaga arquivos)
#
# Configuração por variável de ambiente (valores padrão abaixo):
#   PO_BASE      pasta de trabalho do deploy (repo, releases, logs)
#   PO_DOCROOT   DocumentRoot servido pelo Apache
#   PO_REPO      URL do repositório
#   PO_BRANCH    branch publicada
#   PO_MANTER    quantas releases antigas manter para rollback
#   PO_HORARIO   horário do cron (formato crontab, fuso do servidor)
#
# Layout em $PO_BASE:
#   repo/                clone do GitHub (resetado para origin/main a cada deploy)
#   releases/<data>-<sha>/   cópia de cada dist publicado (para rollback)
#   logs/deploy-<data>.log   um log por dia, mantidos 30 dias
#   bin/deploy-servidor.sh   cópia deste script que o cron executa (ver nota abaixo)
#   PUBLICADO            sha do commit no ar
#   BLOQUEADO            sha que o `reverter` marcou para não republicar
#
# Nota: o cron roda a cópia em bin/, não o arquivo dentro de repo/. O bash lê o
# script aos poucos enquanto executa; se o `git reset` reescrevesse o próprio
# arquivo no meio da execução, o deploy quebraria de formas imprevisíveis.

set -Eeuo pipefail

PO_BASE="${PO_BASE:-$HOME/po-deploy}"
PO_DOCROOT="${PO_DOCROOT:-/var/www/html}"
PO_REPO="${PO_REPO:-https://github.com/poparatodos/Pesquisa-Operacional-Para-Todos.git}"
PO_BRANCH="${PO_BRANCH:-main}"
PO_MANTER="${PO_MANTER:-5}"
PO_HORARIO="${PO_HORARIO:-0 0 * * *}"
# Mesma faixa exigida pelo jsdom (testes) no package-lock; versões fora dela
# quebram o `npm test` com ERR_REQUIRE_ESM.
NODE_FAIXA="^22.22.2 || ^24.15.0 || >=26"

REPO="$PO_BASE/repo"
RELEASES="$PO_BASE/releases"
LOGS="$PO_BASE/logs"
BIN="$PO_BASE/bin/deploy-servidor.sh"
PUBLICADO="$PO_BASE/PUBLICADO"
BLOQUEADO="$PO_BASE/BLOQUEADO"
CRON_TAG="# po-para-todos-deploy"

log() { printf '[%s] %s\n' "$(date '+%F %T')" "$*"; }
erro() { log "ERRO: $*" >&2; exit 1; }

# O cron roda com PATH mínimo e sem o shell de login: carrega o nvm se o Node
# foi instalado por ele.
carregar_node() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  # shellcheck disable=SC1091
  [[ -s "$NVM_DIR/nvm.sh" ]] && . "$NVM_DIR/nvm.sh" >/dev/null
  export PATH="$PATH:/usr/local/bin:/usr/bin:/bin"
}

checar_dependencias() {
  carregar_node
  local faltando=()
  for cmd in git node npm rsync flock crontab; do
    command -v "$cmd" >/dev/null 2>&1 || faltando+=("$cmd")
  done
  ((${#faltando[@]} == 0)) || erro "comandos ausentes: ${faltando[*]} (ex.: sudo apt install git rsync util-linux cron; Node 24 LTS via nvm)"
  node -e '
    const [M, m, p] = process.versions.node.split(".").map(Number)
    const ok = (M === 22 && (m > 22 || (m === 22 && p >= 2))) || (M === 24 && m >= 15) || M >= 26
    process.exit(ok ? 0 : 1)' || erro "Node $NODE_FAIXA necessário (encontrado: $(node -v)). Ex.: nvm install 24"
}

sha_publicado() { cat "$PUBLICADO" 2>/dev/null || true; }
curto() { if [[ -n "${1:-}" ]]; then echo "${1:0:7}"; else echo "nenhuma"; fi; }

# Copia uma release para o DocumentRoot. --delay-updates grava tudo em arquivos
# temporários e só troca no fim, então o site nunca fica servindo metade de um
# build. --delete remove o que não existe mais na release.
publicar_release() {
  local release="$1"
  [[ -f "$release/index.html" ]] || erro "release sem index.html: $release"
  rsync -a --delete --delay-updates "$release/" "$PO_DOCROOT/"
}

podar_releases() {
  # Mantém as $PO_MANTER mais novas; o nome começa com data, então ordem
  # alfabética = ordem cronológica.
  local antigas
  mapfile -t antigas < <(ls -1d "$RELEASES"/*/ 2>/dev/null | sort | head -n "-$PO_MANTER")
  ((${#antigas[@]} == 0)) || rm -rf "${antigas[@]}"
  find "$LOGS" -name 'deploy-*.log' -mtime +30 -delete 2>/dev/null || true
}

cmd_executar() {
  local forcar=0
  [[ "${1:-}" == "--forcar" ]] && forcar=1

  mkdir -p "$RELEASES" "$LOGS"
  # Tudo o que segue vai para o log do dia e para a tela.
  exec > >(tee -a "$LOGS/deploy-$(date +%F).log") 2>&1

  # Impede duas execuções simultâneas (ex.: cron + execução manual).
  exec 9>"$PO_BASE/.lock"
  flock -n 9 || { log "Outro deploy já está rodando; saindo."; exit 0; }

  checar_dependencias
  log "Verificando $PO_BRANCH em $PO_REPO"

  if [[ ! -d "$REPO/.git" ]]; then
    log "Clonando repositório em $REPO"
    git clone --quiet --branch "$PO_BRANCH" "$PO_REPO" "$REPO"
  fi
  git -C "$REPO" fetch --quiet origin "$PO_BRANCH"

  local remoto atual
  remoto="$(git -C "$REPO" rev-parse "origin/$PO_BRANCH")"
  atual="$(sha_publicado)"

  if [[ "$remoto" == "$atual" && $forcar -eq 0 ]]; then
    log "Sem commits novos ($(curto "$atual") já está no ar). Nada a fazer."
    return 0
  fi
  if [[ "$remoto" == "$(cat "$BLOQUEADO" 2>/dev/null || true)" && $forcar -eq 0 ]]; then
    log "Commit $(curto "$remoto") foi bloqueado por 'reverter'; aguardando um commit novo na $PO_BRANCH."
    return 0
  fi

  log "Publicando $(curto "$remoto") (no ar: $(curto "$atual"))"
  trap 'log "FALHOU — nada foi publicado; o site continua servindo $(curto "$atual"). Veja o log acima."' ERR

  git -C "$REPO" reset --quiet --hard "$remoto"
  git -C "$REPO" clean --quiet -fdx -e website/node_modules

  cd "$REPO/website"
  log "npm ci";              npm ci --no-audit --no-fund --loglevel=error
  log "testes";              npm test --silent
  log "build (VITE_BASE=/)"; VITE_BASE=/ npm run build --silent
  log "gate de SEO";         npm run seo:gate --silent
  cd "$PO_BASE"

  local release
  release="$RELEASES/$(date +%Y%m%d-%H%M%S)-${remoto:0:7}"
  cp -a "$REPO/website/dist" "$release"
  printf '%s\n' "$remoto" > "$release/.commit"

  log "Sincronizando $release -> $PO_DOCROOT"
  publicar_release "$release"
  printf '%s\n' "$remoto" > "$PUBLICADO"
  rm -f "$BLOQUEADO"
  trap - ERR

  # Atualiza a cópia do script usada pelo cron. `mv` troca o arquivo (inode
  # novo), então não afeta esta execução em andamento.
  if ! cmp -s "$REPO/ops/deploy-servidor.sh" "$BIN" 2>/dev/null; then
    install -m 755 "$REPO/ops/deploy-servidor.sh" "$BIN.novo" && mv "$BIN.novo" "$BIN"
    log "Script de deploy atualizado a partir do repositório."
  fi

  podar_releases
  log "OK — $(curto "$remoto") no ar: $(git -C "$REPO" log -1 --format='%s' "$remoto")"
}

cmd_reverter() {
  mkdir -p "$LOGS"
  exec > >(tee -a "$LOGS/deploy-$(date +%F).log") 2>&1
  exec 9>"$PO_BASE/.lock"
  flock -n 9 || erro "um deploy está rodando agora; tente de novo em alguns minutos."

  local atual anterior=""
  atual="$(sha_publicado)"
  [[ -n "$atual" ]] || erro "nenhuma versão foi publicada por este script ainda; nada a reverter."
  # A release anterior é a mais nova cujo commit difere do que está no ar.
  while read -r dir; do
    if [[ "$(cat "$dir/.commit" 2>/dev/null)" != "$atual" ]]; then anterior="$dir"; break; fi
  done < <(ls -1d "$RELEASES"/*/ 2>/dev/null | sed 's:/$::' | sort -r)
  [[ -n "$anterior" ]] || erro "não há release anterior em $RELEASES para voltar."

  log "Revertendo $(curto "$atual") -> $(basename "$anterior")"
  publicar_release "$anterior"
  # Bloqueia o commit ruim para o cron da meia-noite não republicá-lo; o
  # bloqueio cai sozinho quando entrar um commit novo na main.
  printf '%s\n' "$atual" > "$BLOQUEADO"
  cat "$anterior/.commit" > "$PUBLICADO"
  log "OK — revertido. $(curto "$atual") bloqueado até o próximo commit na $PO_BRANCH."
}

cmd_status() {
  carregar_node
  local atual
  atual="$(sha_publicado)"
  echo "No ar:        ${atual:-nenhum}"
  if [[ -d "$REPO/.git" ]]; then
    git -C "$REPO" fetch --quiet origin "$PO_BRANCH" 2>/dev/null || echo "(sem acesso ao GitHub agora)"
    echo "origin/$PO_BRANCH: $(git -C "$REPO" rev-parse "origin/$PO_BRANCH")  $(git -C "$REPO" log -1 --format='%s (%cr)' "origin/$PO_BRANCH")"
  fi
  [[ -f "$BLOQUEADO" ]] && echo "Bloqueado:    $(cat "$BLOQUEADO") (por 'reverter')"
  echo "Releases:     $(ls -1 "$RELEASES" 2>/dev/null | tr '\n' ' ')"
  echo "Cron:         $(crontab -l 2>/dev/null | grep -F "$CRON_TAG" || echo 'não agendado')"
  local ultimo
  ultimo="$(ls -1t "$LOGS"/deploy-*.log 2>/dev/null | head -1 || true)"
  if [[ -n "$ultimo" ]]; then echo "--- $ultimo (fim)"; tail -n 8 "$ultimo"; fi
}

cmd_instalar() {
  [[ $EUID -ne 0 ]] || erro "rode como o usuário de deploy, não como root (o sudo é pedido só onde precisa)."
  checar_dependencias
  mkdir -p "$PO_BASE/bin" "$RELEASES" "$LOGS"

  if [[ ! -d "$REPO/.git" ]]; then
    log "Clonando $PO_REPO em $REPO"
    git clone --quiet --branch "$PO_BRANCH" "$PO_REPO" "$REPO"
  fi
  install -m 755 "$REPO/ops/deploy-servidor.sh" "$BIN"

  # O deploy grava no DocumentRoot sem sudo: o usuário de deploy vira dono e o
  # grupo www-data mantém leitura para o Apache.
  if [[ ! -w "$PO_DOCROOT" ]] || [[ -n "$(find "$PO_DOCROOT" ! -user "$USER" -print -quit 2>/dev/null)" ]]; then
    log "Ajustando permissões de $PO_DOCROOT (pede a senha do sudo)"
    sudo chown -R "$USER:www-data" "$PO_DOCROOT"
    sudo chmod -R u+rwX,g+rX,o+rX "$PO_DOCROOT"
  fi

  # Guarda o que está no ar hoje como primeira release, para o `reverter`
  # ter para onde voltar caso o primeiro deploy automático dê problema.
  if [[ -z "$(ls -A "$RELEASES" 2>/dev/null)" && -f "$PO_DOCROOT/index.html" ]]; then
    local backup="$RELEASES/00000000-000000-inicial"
    log "Guardando o site atual em $backup"
    cp -a "$PO_DOCROOT" "$backup"
    printf 'inicial\n' > "$backup/.commit"
  fi

  # Agenda o cron (idempotente: substitui a linha anterior, se houver).
  local linha="$PO_HORARIO PO_BASE=$PO_BASE PO_DOCROOT=$PO_DOCROOT PO_BRANCH=$PO_BRANCH $BIN executar >/dev/null 2>&1 $CRON_TAG"
  { crontab -l 2>/dev/null | grep -vF "$CRON_TAG" || true; echo "$linha"; } | crontab -
  log "Cron agendado: $PO_HORARIO (fuso do servidor: $(date +%Z))"

  log "Rodando o primeiro deploy agora"
  "$BIN" executar --forcar
}

cmd_desinstalar() {
  { crontab -l 2>/dev/null | grep -vF "$CRON_TAG" || true; } | crontab -
  log "Entrada do cron removida. Arquivos em $PO_BASE e o site em $PO_DOCROOT foram mantidos."
}

case "${1:-}" in
  instalar)    cmd_instalar ;;
  executar)    shift; cmd_executar "$@" ;;
  status)      cmd_status ;;
  reverter)    cmd_reverter ;;
  desinstalar) cmd_desinstalar ;;
  *) sed -n '2,/^set -Eeuo/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'; exit 1 ;;
esac
