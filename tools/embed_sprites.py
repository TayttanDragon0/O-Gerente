#!/usr/bin/env python3
"""Gera assets/sprites-embed.js a partir dos PNGs em assets/conselho/.
Rode depois de trocar qualquer PNG:  python3 tools/embed_sprites.py
(O embed só é usado quando o jogo é aberto direto do arquivo, file://. No GitHub Pages os PNGs são carregados normalmente.)"""
import base64,glob,json,os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d={os.path.basename(f):'data:image/png;base64,'+base64.b64encode(open(f,'rb').read()).decode() for f in sorted(glob.glob(root+'/assets/conselho/*.png'))}
open(root+'/assets/sprites-embed.js','w').write('window.OG_SPRITES='+json.dumps(d)+';\n')
print('ok',list(d))
