# 09: CI/CD de deploy de produção (`main` → rsync/ssh)

**What to build:** Toda alteração aprovada em `main` publica automaticamente no servidor Apache de produção da UNIRIO, com o build (SSG) e o gate de SEO rodando no CI antes de subir. É o ticket que integra tudo e coloca a versão otimizada no ar. O ambiente de homologação (GitHub Pages) permanece em paralelo.

**Blocked by:** 06 (404/`.htaccess` de produção), 07 (sitemap/robots) e 08 (gate de SEO deve existir para gatear o deploy).

**Status:** ready-for-agent

- [ ] Workflow disparado em `push` para `main`: roda os testes + o gate de SEO (ticket 08) e só então `vite-ssg build` com `VITE_BASE=/`
- [ ] Publica o `dist/` (incluindo `.htaccess`, `404.html`, `CNAME`, `sitemap.xml`, `robots.txt`, `materiais/`) no `DocumentRoot` do servidor Apache via `rsync`/`scp` sobre SSH
- [ ] Credenciais SSH (host, usuário, chave privada) e o caminho do `DocumentRoot` lidos de **GitHub Secrets** — nada de segredo no repositório
- [ ] O workflow de homologação no GitHub Pages permanece funcional em paralelo (disparo manual / branches)
- [ ] **Dependências operacionais a confirmar com o mantenedor antes do primeiro deploy** (fora do código): caminho do `DocumentRoot`; host/usuário/chave SSH cadastrados como Secrets; DNS de `pesquisaoperacional.uniriotec.br` apontando para o servidor com HTTPS válido
