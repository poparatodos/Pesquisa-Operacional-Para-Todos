# 06: 404 real + `.htaccess`

**What to build:** Uma URL inexistente passa a devolver um HTTP 404 de verdade servindo uma página 404 própria, em vez de conteúdo mascarado de "200" (soft-404). Como todas as rotas legítimas agora existem como HTML pré-renderizado, o catch-all de SPA deixa de ser necessário.

**Blocked by:** 03 (todas as rotas legítimas precisam existir como HTML antes de remover o catch-all, senão os deep links quebram).

**Status:** ready-for-agent

- [ ] `.htaccess` de produção usa `ErrorDocument 404 /404.html` e **remove** a regra `mod_rewrite` que hoje reescreve tudo para `index.html`
- [ ] O build produz uma `404.html` própria de "página não encontrada" (não mais uma cópia da `index.html`)
- [ ] Verificável: uma rota inexistente devolve status HTTP 404 servindo a `404.html`; um deep link legítimo (ex.: `/po1/aula-5`) continua respondendo 200 com o HTML pré-renderizado
- [ ] `npm run build` passa
