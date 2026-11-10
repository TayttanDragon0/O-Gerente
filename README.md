# O Gerente · Grupo 2 – Com IA

Jogo educativo de Administração em pixel art. Abra `index.html` (ou publique no GitHub Pages).

## Publicar no GitHub Pages
1. Suba todo o conteúdo desta pasta na raiz de um repositório (o `index.html` precisa ficar na raiz).
2. Em **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`.
3. O link sai como `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

## Estrutura
- `index.html`: o jogo (Fases 1–4, menu, modos).
- `js/fase5-undertale.js`: Fase 5 "Andar Zero" (estilo Undertale).
- `js/conselho.js`: sprite do Conselho + máscaras orbitando. As constantes `CFG` no topo ajustam tamanho, raio e velocidade da órbita.
- `assets/conselho/`: PNGs do Conselho (corpo 64×96 em 2 quadros, máscaras 16×16).
- `assets/sprites-embed.js`: cópia dos PNGs em base64, usada só ao abrir o arquivo direto no computador (file://).

## Trocar um sprite
1. Substitua o PNG em `assets/conselho/` mantendo o mesmo nome e tamanho (fundo transparente, pés na mesma linha nos 2 quadros).
2. Rode `python3 tools/embed_sprites.py` (só é necessário para testar abrindo o arquivo direto; no GitHub Pages os PNGs são lidos normalmente).
3. Se algum PNG falhar ao carregar, o jogo usa o desenho original por código.
