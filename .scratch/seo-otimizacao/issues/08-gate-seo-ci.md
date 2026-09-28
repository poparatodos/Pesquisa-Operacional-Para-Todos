# 08: Gate de SEO no CI

**What to build:** O pipeline barra regressões de SEO antes de qualquer publicação: um passo automatizado verifica o artefato de build e falha o CI se a qualidade de SEO cair. Torna o critério de "otimizado" objetivo e verificável, não uma promessa.

**Blocked by:** 04 (canonical/OG) e 05 (JSON-LD) — a superfície de metadados precisa estar completa para ser validada.

**Status:** ready-for-agent

- [ ] Script node (prior art: `scripts/validate-content.ts`) que varre o `dist/` e afirma, por rota, `<title>` e `<meta description>` únicos e não vazios + `<link rel="canonical">` presente; falha com código de saída ≠ 0 se qualquer rota falhar
- [ ] Lighthouse CI (`@lhci/cli`) roda sobre o `preview` do `dist/` e **falha o build se a nota de SEO for < 100**
- [ ] Ambos os passos plugados no workflow de CI (rodam no mesmo build usado para homologação/produção)
- [ ] Uma regressão proposital (ex.: remover um título) faz o gate falhar (verificação do próprio gate)
