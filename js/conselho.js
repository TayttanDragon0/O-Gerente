// ===== O Conselho (Fase 4): sprite próprio + máscaras orbitando =====
// Corpo: assets/conselho/conselho_1.png e conselho_2.png (64x96, dois quadros de idle)
// Máscaras: assets/conselho/mask_1..3.png (16x16)
// Se alguma imagem não carregar, o jogo usa o desenho original por código (nada quebra).
(()=>{
'use strict';
if(typeof window.dC!=='function')return;
const CFG={
  scale:.5,        // tamanho do corpo na tela (0.5 = 32x48 de jogo; com RS>=2 fica nítido)
  maskScale:.5,    // tamanho das máscaras
  baseY:46,        // linha dos pés, em px abaixo do topo da hitbox
  headY:8,         // altura da cabeça (centro da órbita), em px abaixo do topo da hitbox
  orbitR:27,       // raio horizontal da órbita
  orbitRY:5.5,     // "profundidade" da elipse (quanto sobe/desce ao passar atrás/na frente)
  spin:.04,        // velocidade normal da órbita
  spinHot:.1,      // velocidade durante ataques
  frameTicks:24    // ticks por quadro do idle
};
const FILES={body:['conselho_1.png','conselho_2.png'],mask:['mask_1.png','mask_2.png','mask_3.png']};
const IM={body:[],mask:[],ok:false};
const isFile=location.protocol==='file:';
let pending=0;
function load(name,arr,i){
  pending++;
  const im=new Image(),E=window.OG_SPRITES||{};
  if(!isFile)im.crossOrigin='anonymous'; // evita "tainted canvas" no pós-processamento WebGL
  im.onload=()=>{if(--pending===0)IM.ok=IM.body.every(x=>x.naturalWidth)&&IM.mask.every(x=>x.naturalWidth)};
  im.onerror=()=>{if(E[name]&&im.src!==E[name]){im.src=E[name]}else{pending--;}};
  im.src=(isFile&&E[name])?E[name]:'assets/conselho/'+name;
  arr[i]=im;
}
FILES.body.forEach((n,i)=>load(n,IM.body,i));
FILES.mask.forEach((n,i)=>load(n,IM.mask,i));

const oldC=window.dC;
window.dC=function(b){
  if(!IM.ok)return oldC(b);
  const t=typeof tick==='number'?tick:0,st=b.st,rage=b.ph>1,cx=b.x+b.w/2;
  const hot=st=='beams'&&b.t<60||st=='orbs'&&b.t<22||st=='dive'&&b.t<26||st=='summon'&&b.t<24||st=='roar'||st=='gavel'&&b.t<30||st=='ring'&&b.t<24||st=='chairs'&&b.t<20;
  g.save();
  g.globalAlpha=(st=='dead'&&t%4<2?.4:1)*(b.al==null?1:b.al);
  const rs=typeof RS==='number'?RS:2;
  g.imageSmoothingEnabled=!(rs>=2&&rs%2===0); // pixel perfeito quando a escala é par
  // brilho de raiva / ataque (igual ao original)
  if(rage||hot)C4(cx,b.y+22,(hot?34:28)+Math.sin(t*.3)*2,'rgba(255,40,70,'+(hot?.2:.1)+')');
  // órbita das máscaras (acumula ângulo para a velocidade mudar sem "pulos")
  b._ma=(b._ma||0)+(hot?CFG.spinHot:CFG.spin);
  const hy=b.y+CFG.headY,ms=CFG.maskScale;
  const ms3=IM.mask.map((img,i)=>{const a=b._ma+i*Math.PI*2/3,z=Math.sin(a);return{img,x:cx+Math.cos(a)*CFG.orbitR,y:hy+z*CFG.orbitRY,z,k:ms*(1+.2*z)}}).sort((p,q)=>p.z-q.z);
  const drawMask=m=>{const w=m.img.naturalWidth*m.k,h=m.img.naturalHeight*m.k;g.drawImage(m.img,m.x-w/2,m.y-h/2,w,h)};
  // atrás do corpo
  const ga=g.globalAlpha;
  ms3.filter(m=>m.z<0).forEach(m=>{g.globalAlpha=ga*.78;drawMask(m)});
  g.globalAlpha=ga;
  // corpo
  const fr=IM.body[Math.floor(t/(hot?10:CFG.frameTicks))%2],w=fr.naturalWidth*CFG.scale,h=fr.naturalHeight*CFG.scale;
  const bob=Math.round(Math.sin(t*.06)*1.2*10)/10;
  g.drawImage(fr,cx-w/2,b.y+CFG.baseY-h*88/96+bob,w,h);
  // à frente do corpo
  ms3.filter(m=>m.z>=0).forEach(drawMask);
  // martelo do ataque (mesmo desenho do original)
  if(st=='gavel'){const k=b.t<30?-2.6:.3;g.save();g.translate(cx+14,b.y+4);g.rotate(k);px(0,-2,22,4,'#5a3a20');px(18,-9,12,18,'#c9a227');px(20,-7,8,3,'rgba(255,255,255,.6)');g.restore()}
  g.restore();
};
})();
