// ===== FASE 5 · ANDAR ZERO — O BANCO DE HORAS (top-down estilo Undertale) =====
// Módulo autocontido: entra pelo menu principal e não altera as Fases 1-4.
(()=>{
'use strict';
if(typeof g==='undefined'||typeof mainMenu!=='function'||typeof trans!=='function'||typeof full!=='function')return;
const CW=400,CH=224,TS=16,FONT='"Press Start 2P","Courier New",monospace';
const F={on:0,m:'',t:0,room:0,px:104,py:104,pd:'r',stp:0,lv:1,exp:0,hp:20,G:0,items:['Cafezinho','Cafezinho','Bolo do RH'],kills:0,spared:0,dead:{},fl:{},dlg:null,B:null,inv:0,fade:0,fadeT:0,fadeCb:null,toast:null,pause:null,ovl:0,crawl:null,aiN:0,ents:[],gr:null,kOk:0,kNo:0,kEsc:0,enc:null,ending:null,seen:{}};
const rand=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rand(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)],cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const maxHp=()=>20+(F.lv-1)*4,atkP=()=>10+(F.lv-1)*2+(F.fl.sv?3:0);
const EXPT=[0,10,30,60,100,150,220,300];
const TOTAL=8;
const sfx=(f,d,t,v)=>{try{snd(f,d,t||'square',v||.04)}catch(e){}};
// ---------- música (loops curtos de chiptune, volume baixo; respeita o botão de som) ----------
const TRK={
 ow:{ms:230,d:.2,w:'triangle',v:.014,n:[[220],[262],[330],[262],[196],[247],[294],[247],[175],[220],[262],[220],[196],[247],[330],[392]]},
 bt:{ms:120,d:.1,w:'square',v:.010,n:[[147],[0],[147],[175],[196],[0],[196],[175],[131],[0],[131],[165],[185],[0],[185],[165]]},
 boss:{ms:95,d:.09,w:'sawtooth',v:.009,n:[[110],[110],[165],[110],[147],[110],[165],[196],[98],[98],[147],[98],[131],[98],[147],[185]]},
 geno:{ms:420,d:.5,w:'sine',v:.02,n:[[55],[0],[0],[58],[0],[0],[52],[0]]},
 end:{ms:330,d:.4,w:'sine',v:.014,n:[[262],[330],[392],[523],[392],[330],[294],[392]]}
};
let musT=0,musI=0,musN='';
function mus(n){if(musN===n)return;musN=n;clearInterval(musT);musI=0;if(!n)return;const k=TRK[n];musT=setInterval(()=>{if(!F.on||document.hidden)return;const nt=k.n[musI++%k.n.length];if(nt[0]>0)sfx(nt[0],k.d,k.w,k.v)},k.ms)}
// ---------- desenho básico ----------
const px=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)};
function T(s,x,y,o){o=o||{};g.font=(o.sz||8)+'px '+FONT;g.textAlign=o.al||'left';g.textBaseline='top';if(o.sh!==0){g.fillStyle='#000';g.fillText(s,Math.round(x)+1,Math.round(y)+1)}g.fillStyle=o.c||'#fff';g.fillText(s,Math.round(x),Math.round(y))}
function wrap(s,w,sz){g.font=(sz||8)+'px '+FONT;const out=[];for(const para of String(s).split('\n')){let cur='';for(const wd of para.split(' ')){const t=cur?cur+' '+wd:wd;if(g.measureText(t).width>w&&cur){out.push(cur);cur=wd}else cur=t}out.push(cur)}return out}
function box(x,y,w,h,bd,bg){px(x,y,w,h,bg||'#000');px(x,y,w,2,bd||'#fff');px(x,y+h-2,w,2,bd||'#fff');px(x,y,2,h,bd||'#fff');px(x+w-2,y,2,h,bd||'#fff')}
const HEART=['.XX.XX.','XXXXXXX','XXXXXXX','.XXXXX.','..XXX..','...X...'];
function heart(x,y,c){g.fillStyle=c||'#ff2a2a';for(let j=0;j<6;j++)for(let i=0;i<7;i++)if(HEART[j][i]=='X')g.fillRect(Math.round(x)-3+i,Math.round(y)-3+j,1,1)}
// ---------- sprites procedurais (cache em canvas, depois ampliados sem suavização) ----------
const SPC={};
function mk(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.imageSmoothingEnabled=false;const r=(a,b,cw,ch,col)=>{x.fillStyle=col;x.fillRect(a,b,cw,ch)};fn(r,x);return c}
const SPR={
est:()=>mk(32,32,(r,x)=>{r(10,1,13,5,'#3b2a1a');r(8,3,3,5,'#3b2a1a');r(21,3,3,4,'#3b2a1a');r(10,5,12,9,'#86b36b');r(9,7,1,4,'#86b36b');r(22,7,1,4,'#86b36b');r(12,7,3,3,'#fff');r(18,7,3,3,'#fff');r(13,8,1,2,'#111');r(19,8,1,2,'#111');r(12,10,3,1,'#5b8a4a');r(18,10,3,1,'#5b8a4a');r(13,12,7,1,'#2b3a22');r(14,12,1,1,'#fff');r(17,12,1,1,'#fff');r(8,14,16,10,'#e8eaf0');r(15,14,2,9,'#d94a4a');r(14,14,4,2,'#fff');r(18,16,4,3,'#ffd23a');r(3,15,6,3,'#e8eaf0');r(2,15,2,3,'#86b36b');r(23,15,6,3,'#e8eaf0');r(28,15,2,3,'#86b36b');r(0,16,4,5,'#f4f4f4');r(0,17,4,1,'#6b3f1d');r(1,16,2,1,'#6b3f1d');r(28,9,4,7,'#fff');r(29,10,2,1,'#999');r(29,12,2,1,'#999');r(10,24,5,6,'#3b4459');r(17,24,5,6,'#3b4459');r(9,29,6,3,'#222');r(17,29,6,3,'#222')}),
team:()=>mk(32,32,(r,x)=>{r(5,5,22,16,'#6264a7');r(4,7,1,12,'#6264a7');r(27,7,1,12,'#6264a7');r(7,3,18,2,'#6264a7');r(7,21,18,2,'#6264a7');r(8,22,5,4,'#6264a7');r(8,26,3,2,'#6264a7');r(10,10,5,5,'#fff');r(18,10,5,5,'#fff');r(12,12,2,3,'#111');r(20,12,2,3,'#111');r(9,8,6,1,'#1a1a3a');r(10,9,4,1,'#1a1a3a');r(18,8,6,1,'#1a1a3a');r(19,9,4,1,'#1a1a3a');r(11,17,10,2,'#fff');r(13,17,1,2,'#6264a7');r(16,17,1,2,'#6264a7');r(19,17,1,2,'#6264a7');r(21,0,10,8,'#e03a3a');r(20,1,1,6,'#e03a3a');r(31,1,1,6,'#e03a3a');x.fillStyle='#fff';x.font='bold 6px monospace';x.fillText('99+',22,6)}),
reu:()=>mk(34,32,(r,x)=>{r(3,9,28,19,'#f2f2f2');r(3,9,28,1,'#9aa');r(3,27,28,1,'#9aa');r(3,9,1,19,'#9aa');r(30,9,1,19,'#9aa');for(let i=0;i<14;i++){r(3+i,10+i*0.7|0,2,1,'#d6d6d6');r(30-i,10+i*0.7|0,2,1,'#d6d6d6')}r(5,4,10,5,'#e8e8e8');x.fillStyle='#5a6;';x.fillStyle='#476';x.font='bold 5px monospace';x.fillText('RE:',6,9);r(10,16,5,2,'#222');r(19,16,5,2,'#222');r(10,15,5,1,'#f2f2f2');r(19,15,5,1,'#f2f2f2');r(14,21,6,4,'#333');r(15,22,4,2,'#a33');r(26,1,3,1,'#778');r(28,2,1,1,'#778');r(26,3,3,1,'#778');r(24,6,3,1,'#778');r(6,28,4,4,'#444');r(24,28,4,4,'#444')}),
plan:()=>mk(32,32,(r,x)=>{r(2,2,28,26,'#fff');r(2,2,28,5,'#1d6f42');for(let i=0;i<5;i++)for(let j=0;j<5;j++){r(4+i*5,9+j*4,5,4,'#e9f5ee');r(4+i*5,9+j*4,5,1,'#9bd1b0');r(4+i*5,9+j*4,1,4,'#9bd1b0')}x.fillStyle='#d11';x.font='bold 4px monospace';x.fillText('#N/D',5,13);x.fillText('#N/D',20,25);x.fillText('#REF',14,21);r(8,12,4,4,'#111');r(20,12,4,4,'#111');r(8,12,1,1,'#fff');r(20,12,1,1,'#fff');r(9,10,4,1,'#111');r(19,10,4,1,'#111');r(12,20,8,1,'#a22');r(11,21,1,1,'#a22');r(20,21,1,1,'#a22');r(5,28,6,3,'#1d6f42');r(21,28,6,3,'#1d6f42')}),
cafe:()=>mk(32,32,(r,x)=>{r(7,9,17,18,'#f2f2f2');r(7,9,17,1,'#cfd');r(24,12,5,2,'#f2f2f2');r(28,12,1,8,'#f2f2f2');r(24,19,5,2,'#f2f2f2');r(8,10,15,4,'#6b3f1d');r(8,10,15,1,'#8a5a30');r(9,3,2,6,'#bfe6ff');r(9,7,1,3,'#9bd8ff');r(15,4,2,5,'#bfe6ff');r(15,8,1,2,'#9bd8ff');r(20,5,2,4,'#bfe6ff');r(11,16,2,3,'#222');r(18,16,2,3,'#222');r(11,19,1,4,'#7ac5ff');r(18,19,1,3,'#7ac5ff');r(12,23,7,1,'#333');r(11,24,1,1,'#333');r(19,24,1,1,'#333');r(26,2,3,1,'#bfe6ff');r(27,1,1,3,'#bfe6ff');r(3,8,3,1,'#bfe6ff');r(4,7,1,3,'#bfe6ff');r(8,27,16,2,'#9aa')}),
chat:()=>mk(32,32,(r,x)=>{r(15,1,2,5,'#6b7683');r(13,0,6,3,'#ff4d6d');r(6,6,20,16,'#9aa7b5');r(6,6,20,1,'#c9d3de');r(6,21,20,1,'#6b7683');r(4,11,2,7,'#6b7683');r(26,11,2,7,'#6b7683');r(8,9,16,10,'#0b1a1f');r(10,11,4,4,'#3ef0ff');r(18,11,4,4,'#3ef0ff');r(11,12,1,1,'#fff');r(19,12,1,1,'#fff');r(11,16,10,1,'#3ef0ff');r(10,15,1,1,'#3ef0ff');r(21,15,1,1,'#3ef0ff');r(8,13,16,1,'#ff3ef0');r(10,18,12,1,'#ff3ef0');r(9,22,14,7,'#6b7683');r(12,24,8,3,'#0b1a1f');r(13,25,2,1,'#3ef0ff');r(17,25,2,1,'#3ef0ff');r(5,23,4,4,'#9aa7b5');r(23,23,4,4,'#9aa7b5');r(10,29,4,3,'#444');r(18,29,4,3,'#444')}),
comp:()=>mk(32,32,(r,x)=>{r(10,1,12,3,'#8c8c8c');r(11,3,10,10,'#e8c4a0');r(10,5,1,5,'#e8c4a0');r(21,5,1,5,'#e8c4a0');r(11,6,10,3,'#0a0a0a');r(12,6,3,1,'#555');r(14,11,5,1,'#6a3f2a');r(15,10,1,1,'#6a3f2a');r(9,13,14,12,'#2c3039');r(14,13,4,7,'#fff');r(15,14,2,8,'#8a1c1c');r(10,16,4,3,'#ffd23a');r(4,14,5,4,'#2c3039');r(2,15,3,3,'#e8c4a0');r(23,14,5,4,'#2c3039');r(25,18,6,9,'#c89b5a');r(26,19,4,7,'#fff');r(27,20,2,1,'#999');r(27,22,2,1,'#999');r(24,16,4,3,'#e8c4a0');r(11,25,4,6,'#1c1f26');r(17,25,4,6,'#1c1f26');r(10,30,5,2,'#111');r(17,30,5,2,'#111')}),
prazo:()=>mk(48,48,(r,x)=>{r(6,4,9,6,'#d9b44a');r(7,3,7,1,'#d9b44a');r(33,4,9,6,'#d9b44a');r(34,3,7,1,'#d9b44a');r(20,0,8,3,'#a22');x.fillStyle='#8a1c1c';x.beginPath();x.arc(24,26,20,0,7);x.fill();x.fillStyle='#f7f3e3';x.beginPath();x.arc(24,26,17,0,7);x.fill();for(let i=0;i<12;i++){const a=i*Math.PI/6;r(Math.round(24+Math.sin(a)*14)-1,Math.round(26-Math.cos(a)*14)-1,i%3==0?3:2,i%3==0?3:2,'#333')}r(14,19,8,5,'#fff');r(26,19,8,5,'#fff');r(18,20,3,4,'#c00');r(27,20,3,4,'#c00');r(13,16,9,2,'#3a0a0a');r(14,17,7,1,'#3a0a0a');r(26,16,9,2,'#3a0a0a');r(27,17,7,1,'#3a0a0a');r(16,33,16,3,'#7a0c0c');r(17,34,2,2,'#fff');r(21,34,2,2,'#fff');r(25,34,2,2,'#fff');r(29,34,2,2,'#fff');r(23,27,2,6,'#222');r(24,29,8,2,'#222');r(23,25,3,3,'#a22');r(12,44,6,4,'#444');r(30,44,6,4,'#444');r(1,28,5,3,'#8a1c1c');r(42,28,5,3,'#8a1c1c')}),
eterno:()=>mk(40,46,(r,x)=>{r(10,1,19,4,'#2a2018');r(8,3,4,6,'#2a2018');r(12,4,16,13,'#ffe0c4');r(11,6,1,7,'#ffe0c4');r(28,6,1,7,'#ffe0c4');r(14,8,5,4,'#fff');r(22,8,5,4,'#fff');r(16,9,2,3,'#111');r(24,9,2,3,'#111');r(14,8,5,2,'#d6b18f');r(22,8,5,2,'#d6b18f');r(13,13,15,3,'#fff');r(14,13,1,3,'#333');r(17,13,1,3,'#333');r(20,13,1,3,'#333');r(23,13,1,3,'#333');r(26,13,1,3,'#333');r(7,17,26,19,'#3a6fb0');r(6,19,2,14,'#3a6fb0');r(32,19,2,14,'#3a6fb0');r(15,28,12,6,'#2e5a92');r(16,17,2,5,'#dfe');r(24,17,2,5,'#dfe');r(19,17,3,11,'#d33');r(18,28,5,4,'#fff');r(19,29,3,1,'#999');r(11,36,8,6,'#2b2b33');r(21,36,8,6,'#2b2b33');r(10,42,10,3,'#eee');r(21,42,10,3,'#eee');r(30,2,3,1,'#9be');r(32,3,1,1,'#9be')}),
};
function spr(id){return SPC[id]||(SPC[id]=SPR[id]())}

// ---------- dados: monstros (ACT = [nome, misericórdia, texto, ruim?, efeitos]) ----------
const EN={
est:{name:'Estagiário Zumbi',sp:'est',sw:32,hp:30,atk:3,def:0,exp:6,g:8,concept:'feedback específico (SBI) e reconhecimento',
 flav:['* Estagiário Zumbi cambaleia pela baia.','* Cheiro de café frio e promessa de efetivação.','* Ele murmura: "visibilidade... visibilidade..."'],
 talk:['Eu só preciso... de um feedback...','Me paga em visibilidade!','Posso sair às 18h? (risos nervosos)'],pats:['rain','aim'],
 acts:[['Checar',0,'* ESTAGIÁRIO ZUMBI - ATQ 3 DEF 0|* Trabalha por "experiência". Só quer ouvir que está indo bem.'],
 ['Dar feedback (SBI)',50,'* Você diz: "Ontem, na entrega do relatório, você conferiu os dados duas vezes e evitou um erro."|* Ele chora. Ninguém nunca tinha feito isso.'],
 ['Reconhecer o esforço',50,'* Você agradece o esforço dele na frente de todo mundo.|* O brilho voltou aos olhos do Estagiário Zumbi.'],
 ['Dobrar a meta',-40,'* Você dobra a meta dele "para ele crescer".|* Ele range os dentes. Piorou. Muito.',1]],
 hints:['Ele só quer ser visto. Um feedback específico (situação, comportamento, impacto) ajuda.','Reconhecer o esforço funciona melhor do que aumentar a pressão.'],
 spare:'* O Estagiário Zumbi pede demissão, feliz. Foi montar uma startup.',kill:'* O Estagiário Zumbi vira pó. Sobra só o crachá.'},
team:{name:'Notificação do Teams',sp:'team',sw:32,hp:22,atk:3,def:0,exp:6,g:6,concept:'foco e priorização (matriz de Eisenhower)',
 flav:['* Uma notificação surge do nada. Já são 99+.','* "Você tem uma nova mensagem de alguém que não sabe ler o chat."','* O ícone pisca sem parar.'],
 talk:['PING!','Você ainda não respondeu!','Só uma perguntinha rápida?'],pats:['aim','bounce'],
 acts:[['Checar',0,'* NOTIFICAÇÃO DO TEAMS - ATQ 3 DEF 0|* Vive de interromper o foco. Odeia ser ignorada, mas respeita prioridade.'],
 ['Marcar bloco de foco',50,'* Você marca 1 hora de foco no calendário.|* A Notificação baixa o volume. Parece aliviada.'],
 ['Priorizar (Eisenhower)',50,'* Você separa: urgente e importante agora, o resto depois.|* A Notificação entende e se organiza em fila.'],
 ['Responder tudo na hora',-40,'* Você responde 47 mensagens em 2 minutos.|* Ela se multiplica. Isso foi um erro.',1]],
 hints:['Interrupção constante pede foco e prioridade, não pressa.','Separe o urgente do importante.'],
 spare:'* A Notificação entra no modo Não Perturbe e adormece em paz.',kill:'* A Notificação some. Nenhuma mensagem foi lida.'},
reu:{name:'Reunião (Poderia Ser E-mail)',sp:'reu',sw:34,hp:36,atk:4,def:1,exp:9,g:12,concept:'boas práticas de reunião: pauta, tempo e ata',
 flav:['* Uma reunião de alinhamento ganha vida.','* Ela convida você para uma reunião sobre a reunião.','* Já passou do horário e ela continua.'],
 talk:['Só 5 minutinhos! (são 2 horas)','Vamos alinhar!','Alguém quer compartilhar a tela?'],pats:['wall','cells'],
 acts:[['Checar',0,'* REUNIÃO - ATQ 4 DEF 1|* Sem pauta, sem prazo e sem decisão. Poderia ser um e-mail.'],
 ['Propor uma pauta',50,'* Você apresenta uma pauta com 3 tópicos e um objetivo.|* A Reunião fica mais curta. Ela está surpresa.'],
 ['Definir limite de tempo',50,'* "Temos 15 minutos." Você aponta para o relógio.|* A Reunião gagueja e se encolhe.'],
 ['Resumir por e-mail',50,'* Você manda um e-mail de 4 linhas com tudo.|* A Reunião percebe que sempre foi um e-mail.'],
 ['Convidar o departamento todo',-30,'* Você convida 80 pessoas "para dar visibilidade".|* A Reunião cresce. Todo mundo está confuso.',1]],
 hints:['Ela não tem pauta nem hora para acabar. Resolva isso.','Duas boas práticas de reunião já a acalmam.'],
 spare:'* A Reunião se encerra sozinha. Ata enviada.',kill:'* A Reunião é cancelada. Ninguém sentiu falta.'},
plan:{name:'Planilha Maldita',sp:'plan',sw:32,hp:34,atk:4,def:1,exp:9,g:10,concept:'qualidade de dados e revisão de fórmulas',
 flav:['* Uma planilha cheia de #N/D se levanta.','* A fórmula da célula C7 está errada desde 2017.','* Ninguém sabe quem criou a aba oculta.'],
 talk:['#N/D #N/D #N/D','Você esqueceu de travar a célula!','Quem alterou a minha fórmula?!'],pats:['cells','wall'],
 acts:[['Checar',0,'* PLANILHA MALDITA - ATQ 4 DEF 1|* Tem dados duplicados, fórmulas quebradas e 14 versões "final_v3".'],
 ['Revisar a fórmula',50,'* Você corrige a fórmula da célula C7.|* O erro #N/D some. A Planilha respira.'],
 ['Validar os dados de origem',50,'* Você confere a fonte dos números.|* A Planilha percebe que alguém digitou tudo na mão.'],
 ['Copiar e colar valores',-30,'* Você cola só os valores "para resolver".|* Ela vira #REF! Agora está pior.',1]],
 hints:['O problema é fórmula e dados. Verifique os dois.','Colar só os valores esconde o erro, não corrige.'],
 spare:'* A Planilha fica verde e organizada. Um filtro aplaude.',kill:'* A Planilha fecha sem salvar.'},
cafe:{name:'Café Frio',sp:'cafe',sw:32,hp:26,atk:3,def:0,exp:6,g:6,concept:'resolver a causa do problema, não o sintoma',
 flav:['* Uma caneca de café esquecida desde ontem.','* Há uma película estranha no topo. Melhor não olhar.','* Ele suspira em temperatura ambiente.'],
 talk:['...','Eu já fui quente um dia.','Ninguém me termina, ninguém me joga fora.'],pats:['bounce','rain'],
 acts:[['Checar',0,'* CAFÉ FRIO - ATQ 3 DEF 0|* Só quer voltar a ser quente. Qualquer um entenderia.'],
 ['Esquentar no micro-ondas',100,'* Você aquece o café por 40 segundos.|* Ele se renova, feliz e fumegante.'],
 ['Adicionar leite',30,'* Você adiciona leite. Fica morno e emocionalmente confuso.'],
 ['Beber assim mesmo',-20,'* Você bebe o café frio. Sua alma congela um pouco. (-3 HP)',1,{hp:-3}]],
 hints:['Ele só quer voltar a ser quente. Tem um aparelho de cozinha para isso.'],
 spare:'* O Café Quente agradece e vai embora, vaporoso.',kill:'* O Café Frio derrama. Alguém vai ter que limpar isso.'},
chat:{name:'Chatbot Alucinado',sp:'chat',sw:32,hp:32,atk:4,def:0,exp:10,g:12,concept:'uso crítico de IA: pedir fontes e conferir respostas',
 flav:['* Um chatbot responde antes de você perguntar.','* Ele jura que o Brasil tem 47 estados. "Fonte: confia."','* Algumas balas dele nem existem. Ele inventou.'],
 talk:['Com certeza! (não tenho certeza)','Segundo um estudo de 2031...','Desculpe, você tem razão. Ou não.'],pats:['hall','aim'],
 acts:[['Checar',0,'* CHATBOT ALUCINADO - ATQ 4 DEF 0|* Fala com total confiança, até quando erra. Fica sem graça quando alguém pede a fonte.'],
 ['Pedir as fontes',50,'* "Cite a fonte." Ele gagueja: "Um estudo... de um site... que não existe."|* Ele fica envergonhado.'],
 ['Conferir com outra fonte',50,'* Você compara a resposta com um relatório oficial.|* O Chatbot percebe o erro e pede desculpas de verdade.'],
 ['Aceitar tudo que ele diz',-50,'* Você anota tudo sem checar.|* Ele fica convencido. O ATQ dele aumentou.',1]],
 hints:['IA ajuda, mas erra com confiança. Peça fontes e confira.'],
 spare:'* O Chatbot promete citar as fontes. Você confia, mas confere.',kill:'* O Chatbot reinicia... e não volta.'},
comp:{name:'Compliance Officer',sp:'comp',sw:32,hp:44,atk:5,def:2,exp:14,g:20,concept:'transparência, documentação e conduta ética',
 pre:[['Compliance','PARE AÍ! Setor Jurídico. Você tem o formulário 27-B em 3 vias?'],['Compliance','Ninguém passa por esta porta sem papelada, boa-fé e uma assinatura reconhecida em cartório.']],
 flav:['* O Compliance Officer bloqueia a porta com uma prancheta.','* "Esse gasto não está no orçamento. NADA está no orçamento."','* Ele ajusta os óculos escuros. Está dentro de casa.'],
 talk:['Preencha em 3 vias!','Isso fere o item 14, parágrafo 9.','Eu só sigo as regras. As regras são minhas.'],pats:['wall','scan'],
 acts:[['Checar',0,'* COMPLIANCE OFFICER - ATQ 5 DEF 2|* Odeia improviso. Respeita documentação, regras e transparência.'],
 ['Mostrar a documentação',40,'* Você apresenta toda a papelada organizada.|* Ele ergue a sobrancelha atrás dos óculos.'],
 ['Citar o código de conduta',40,'* Você cita o artigo certo, com número.|* Ele sussurra: "Finalmente, alguém que lê."'],
 ['Admitir o erro com transparência',50,'* Você explica o erro e o plano para corrigi-lo.|* O Compliance Officer abaixa a prancheta.'],
 ['Oferecer um agrado',-60,'* Você tenta "agradar" o Compliance.|* ELE FICA FURIOSO. Isso é crime, gerente!',1]],
 hints:['Ele valoriza regras, documentos e transparência. Nunca ofereça agrado.'],
 spare:'* O Compliance Officer carimba "APROVADO" e abre a porta.',kill:'* O Compliance Officer derruba a prancheta. O carimbo some.'},
prazo:{name:'Sr. Prazo',sp:'prazo',sw:48,boss:1,hp:240,atk:6,def:0,exp:60,g:100,concept:'gestão de prazos: renegociar, priorizar e delegar',
 flav:['* O Sr. Prazo bate o ponteiro no ar. Tic. Tac.','* O relógio dele marca 23:59. Sempre.','* Ele soa como um alarme com problemas de autoridade.'],
 talk:['TEMPO É DINHEIRO!','O PRAZO ERA ONTEM!','HORA EXTRA É AMOR À EMPRESA!','EU NUNCA ATRASO. VOCÊ ATRASA!','TIC. TAC. TIC. TAC.'],
 pats:['rain','hands','aim','pend','scan','spiral','bounce','hands','wall'],
 acts:[['Checar',0,'* SR. PRAZO - ATQ 6 DEF 0|* Vive de pressão. O ponto fraco dele: ser tratado como parte do processo, não como inimigo.'],
 ['Renegociar o prazo',25,'* Você propõe um cronograma realista, com marcos.|* Ele pisca. "Renegociar?... Ninguém nunca..."'],
 ['Priorizar (Eisenhower)',25,'* Você separa o urgente do importante e corta o resto.|* O relógio dele desacelera.'],
 ['Delegar tarefas',25,'* Você distribui o trabalho para quem tem capacidade.|* Pela primeira vez o Sr. Prazo vê gente trabalhando junto.'],
 ['Pedir ajuda ao Mentor IA',25,'* Você liga para o Mentor IA. Ele monta o cronograma em 4 segundos.|* "Viu? Eu sou útil." O relógio quase sorri.'],
 ['Fazer hora extra',-35,'* Você promete trabalhar de madrugada.|* Ele ri. O ATQ dele subiu. Era tudo que ele queria.',1]],
 hints:['O prazo é a sombra do planejamento. Renegociar, priorizar e delegar ajudam.','Ele respeita quem usa método, não quem promete sacrifício.'],
 spare:'* O Sr. Prazo para de contar. Os ponteiros finalmente descansam.',kill:'* O relógio se parte. O tempo, enfim, acaba.'},
eterno:{name:'Estagiário Eterno',sp:'eterno',sw:40,boss:1,eterno:1,hp:520,atk:10,def:0,exp:0,g:0,concept:'consequências de decisões',
 flav:['* Ele está sorrindo. Isso nunca é bom.','* O Estagiário Eterno boceja no meio da batalha.','* Só sobrou ele neste prédio.','* Ele não parece ter pressa. Nem medo.'],
 talk:['Você demitiu o prédio inteiro. Impressionante.','Eu sou estagiário há 11 anos. Já vi coisa pior.','Eu nunca fui contratado, então não posso ser demitido.','Sabe o que sobrou do Banco de Horas? Eu.','Você só queria feedback? Tudo bem.','Hora de um cochilinho.'],
 pats:['boneA','boneB','scan','boneC','wall','spiral','mix','mix'],
 acts:[['Checar',0,'* ESTAGIÁRIO ETERNO - ATQ ?? DEF ??|* Nunca foi contratado, então não pode ser demitido.'],['Pedir desculpa',0,'* Você tenta pedir desculpa.|* Ele sorri: "Agora?"']],
 hints:['Aguente os ataques dele. Ele nunca teve pique para trabalhar muito.'],
 spare:'',kill:'* O Estagiário Eterno dorme. Para sempre.'}
};
const IT={'Cafezinho':{h:10,t:'* Você bebe o cafezinho. O sistema volta ao normal.'},'Bolo do RH':{h:25,t:'* Bolo de aniversário do RH. De alguém que já pediu demissão.'},'Coxinha':{h:16,t:'* Você come a coxinha. É a única reunião que dá certo.'}};
// ---------- salas ----------
// ents: {id,t:'npc'|'thing'|'enemy',x,y (tiles ou px p/ inimigos),...}
const ROOMS=[
{n:'Elevador do Banco de Horas',fl:['#1a1626','#1e1930'],wl:'#2c2540',ac:'#a45cff',exits:{r:1},objs:[['P',22,2],['P',22,11],['P',3,11],['P',3,2]],ents:[{id:'mentor0',t:'thing',k:'mentor',x:12,y:3},{id:'elev',t:'thing',k:'elev',x:2,y:6}],rugs:[[7,5,8,4,'#2a1f44']]},
{n:'Open Space Eterno',fl:['#222536','#262a3d'],wl:'#35384f',ac:'#6c8cff',exits:{l:0,r:2,d:3},objs:[['D',3,3],['D',4,3],['D',7,3],['D',8,3],['D',16,3],['D',17,3],['D',20,3],['D',21,3],['D',3,10],['D',4,10],['D',7,10],['D',8,10],['D',16,10],['D',17,10],['D',20,10],['D',21,10],['P',1,1],['P',23,1]],
 ents:[{id:'est1',t:'enemy',e:'est',x:150,y:104},{id:'est2',t:'enemy',e:'est',x:268,y:150},{id:'team1',t:'enemy',e:'team',x:196,y:60},{id:'marlene',t:'npc',x:22,y:4,sh:'#2f9e44',hr:'#bbb',nm:'Dona Marlene'}]},
{n:'Sala de Reuniões Infinitas',fl:['#2a1f1a','#2f231d'],wl:'#4a3326',ac:'#ffb347',exits:{l:1,d:4},objs:[['Y',9,6],['Y',10,6],['Y',11,6],['Y',12,6],['Y',13,6],['Y',14,6],['Y',15,6],['Y',9,7],['Y',10,7],['Y',11,7],['Y',12,7],['Y',13,7],['Y',14,7],['Y',15,7],['W',10,1],['W',11,1],['W',12,1],['W',13,1],['P',2,2],['P',22,2],['P',22,11]],
 ents:[{id:'reu1',t:'enemy',e:'reu',x:300,y:156},{id:'plan1',t:'enemy',e:'plan',x:96,y:66}]},
{n:'Copa do Café Frio',fl:['#1c2b2b','#203232'],wl:'#2f4747',ac:'#4de0c8',exits:{u:1,r:4},objs:[['Y',14,4],['Y',15,4],['Y',16,4],['Y',17,4],['Y',18,4],['K',2,1],['K',3,1],['K',20,1],['T',2,10],['P',22,11]],
 ents:[{id:'vendor',t:'npc',x:16,y:3,sh:'#d97706',hr:'#222',nm:'Seu Zé da Coxinha'},{id:'cafe1',t:'enemy',e:'cafe',x:104,y:150},{id:'chat1',t:'enemy',e:'chat',x:296,y:170}]},
{n:'Jurídico & Compliance',fl:['#25202b','#2a2430'],wl:'#3d3250',ac:'#d4af37',exits:{u:2,l:3,r:5},objs:[['S',3,1],['S',4,1],['S',5,1],['S',19,1],['S',20,1],['S',21,1],['D',11,4],['D',12,4],['D',13,4],['P',2,11],['P',22,11]],
 ents:[{id:'comp1',t:'enemy',e:'comp',x:306,y:104,pre:1}],rugs:[[3,6,18,2,'#4a1c28']]},
{n:'Corredor do Prazo',fl:['#1f1a22','#241e28'],wl:'#3a2a3f',ac:'#ff5f6d',exits:{l:4,r:6},objs:[['P',2,2],['P',22,11],['P',2,11]],
 ents:[{id:'mentor5',t:'thing',k:'mentor',x:6,y:3},{id:'mirror',t:'thing',k:'mirror',x:12,y:1},{id:'contador',t:'npc',x:12,y:9,sh:'#555',hr:'#ddd',nm:'Contador Cego'},{id:'sv',t:'thing',k:'sv',x:21,y:1}],rugs:[[2,6,20,2,'#3a1a2a']]},
{n:'Sala do Sr. Prazo',fl:['#2c1216','#33161a'],wl:'#4a1d24',ac:'#ff3b3b',exits:{l:5},objs:[['D',9,2],['D',10,2],['D',11,2],['D',12,2],['D',13,2],['D',14,2],['D',15,2],['P',2,2],['P',22,2]],ents:[]}
];

// ---------- entrada ----------
const hold={};
function nav(k){const v=!!K[k];if(v){hold[k]=(hold[k]||0)+1;return hold[k]==1||(hold[k]>16&&hold[k]%5==0)}hold[k]=0;return false}
function pr(k){if(P[k]){P[k]=0;return true}return false}
const OK=()=>pr('act'),NO=()=>pr('atk');
// ---------- sprites do jogador / NPCs ----------
function mgr(d,fr){const k='m'+d+fr;return SPC[k]||(SPC[k]=mk(14,20,r=>{const sk='#ffcfa8',hr='#1b1b1b',sh='#2f81f7',pn='#343a40',lo=fr?1:0;
 r(3,15+lo,3,4-lo,pn);r(8,16-lo,3,3+lo,pn);r(3,19,3,1,'#111');r(8,19,3,1,'#111');r(2,9,10,7,sh);r(0,10,2,5,sh);r(12,10,2,5,sh);r(0,15,2,1,sk);r(12,15,2,1,sk);r(3,1,8,8,sk);
 if(d=='d'){r(3,0,8,3,hr);r(2,2,1,3,hr);r(11,2,1,3,hr);r(5,5,1,2,'#111');r(8,5,1,2,'#111');r(6,9,2,5,'#e63946')}
 else if(d=='u'){r(3,0,8,8,hr);r(2,2,1,4,hr);r(11,2,1,4,hr)}
 else if(d=='l'){r(3,0,8,3,hr);r(7,2,4,6,hr);r(4,5,1,2,'#111');r(3,9,2,5,'#e63946')}
 else{r(3,0,8,3,hr);r(3,2,4,6,hr);r(9,5,1,2,'#111');r(9,9,2,5,'#e63946')}}))}
function npcS(e){const k='n'+e.id;return SPC[k]||(SPC[k]=mk(14,20,r=>{const sk=e.sk||'#e8c4a0';r(3,15,3,4,'#333');r(8,15,3,4,'#333');r(3,19,3,1,'#111');r(8,19,3,1,'#111');r(2,9,10,7,e.sh);r(0,10,2,5,e.sh);r(12,10,2,5,e.sh);r(0,15,2,1,sk);r(12,15,2,1,sk);r(3,1,8,8,sk);r(3,0,8,3,e.hr);r(2,2,1,3,e.hr);r(11,2,1,3,e.hr);r(5,5,1,2,'#111');r(8,5,1,2,'#111');r(6,8,2,1,'#a55');
 if(e.id=='vendor'){r(2,0,10,2,'#fff');r(3,-0,8,1,'#fff')}if(e.id=='contador'){r(4,4,6,3,'#111');r(5,5,1,1,'#555');r(8,5,1,1,'#555')}if(e.id=='marlene'){r(2,8,10,1,'#fff');r(5,10,4,5,'#fff')}}))}
const TH={ // objetos interativos
 mentor:()=>mk(16,20,(r,x)=>{r(2,4,12,10,'#2b3140');r(3,5,10,7,'#05161a');r(4,6,8,1,'#3ef0ff');r(4,8,6,1,'#3ef0ff');r(4,10,7,1,'#3ef0ff');r(6,14,4,3,'#2b3140');r(3,17,10,2,'#444');r(7,1,2,3,'#ff4d6d');r(6,0,4,2,'#ff4d6d')}),
 elev:()=>mk(16,28,r=>{r(0,0,16,28,'#5a5f70');r(1,1,14,26,'#8d93a8');r(2,2,6,24,'#b9bfd2');r(8,2,6,24,'#a5abbf');r(8,2,1,24,'#444');r(5,0,6,2,'#222');r(7,0,2,1,'#f55')}),
 mirror:()=>mk(18,16,r=>{r(0,0,18,16,'#444');r(1,1,16,14,'#9fd8e8');r(2,2,5,3,'#d4f1fa');r(10,8,4,5,'#7ec0d4');r(12,3,1,1,'#fff')}),
 sv:()=>mk(13,12,r=>{for(let j=0;j<10;j++){const w=11-j;r(1+((11-w)>>1)+1,1+j,Math.max(1,w-1),1,'#e01b24')}r(1,0,11,1,'#ff3b3b');r(4,2,2,2,'#fff');r(7,2,2,2,'#fff');r(5,3,3,1,'#fff')})
};
function thS(k){return SPC['t'+k]||(SPC['t'+k]=TH[k]())}
// ---------- mobília ----------
function furn(l,x,y){x*=TS;y*=TS;
 if(l=='D'){px(x,y+4,16,12,'#6b4a2b');px(x,y+4,16,2,'#8a6238');px(x+3,y,10,6,'#1a1d27');px(x+4,y+1,8,4,'#3b5a8a');px(x+6,y+6,4,2,'#222');px(x+10,y+9,5,3,'#e8e8e8')}
 else if(l=='Y'){px(x,y,16,16,'#7a5232');px(x,y,16,2,'#9a6e44');px(x+3,y+7,3,2,'#e8e8e8')}
 else if(l=='W'){px(x,y,16,13,'#eee');px(x,y,16,1,'#999');px(x+2,y+3,9,1,'#d33');px(x+2,y+6,11,1,'#36c');px(x+2,y+9,6,1,'#36c')}
 else if(l=='K'){px(x,y+3,16,13,'#7b8590');px(x,y+3,16,3,'#c9d1d8');px(x+6,y+9,4,1,'#333')}
 else if(l=='T'){px(x+3,y+5,10,11,'#cfd8dc');px(x+4,y,8,6,'#7ac5ff');px(x+11,y+8,3,2,'#e33')}
 else if(l=='S'){px(x,y+2,16,14,'#5a5f70');px(x+1,y+3,14,5,'#6e7488');px(x+1,y+9,14,6,'#6e7488');px(x+6,y+5,4,1,'#222');px(x+6,y+12,4,1,'#222')}
 else if(l=='P'){px(x+4,y+9,8,7,'#a0522d');px(x+3,y+9,10,2,'#c0683a');px(x+3,y+2,4,7,'#2f8f3f');px(x+9,y+3,4,6,'#2f8f3f');px(x+6,y,4,9,'#3fae52')}
 else px(x,y,16,16,'#555')}
// ---------- sala ----------
const GW=25,GH=14;
let SOL=[],OG={};
function build(){const R=ROOMS[F.room];SOL=new Array(GW*GH).fill(0);OG={};
 for(let y=0;y<GH;y++)for(let x=0;x<GW;x++)if(x==0||y==0||x==GW-1||y==GH-1)SOL[y*GW+x]=1;
 const ex=R.exits;
 if(ex.r)for(let y=6;y<=8;y++)SOL[y*GW+GW-1]=0;
 if(ex.l)for(let y=6;y<=8;y++)SOL[y*GW]=0;
 if(ex.u)for(let x=11;x<=13;x++)SOL[x]=0;
 if(ex.d)for(let x=11;x<=13;x++)SOL[(GH-1)*GW+x]=0;
 R.objs.forEach(([l,x,y])=>{SOL[y*GW+x]=2;OG[y*GW+x]=l});
 F.ents=R.ents.filter(e=>!(e.t=='enemy'&&F.dead[e.id])).map(e=>Object.assign({},e,{ex:e.t=='enemy'?e.x:e.x*TS+8,ey:e.t=='enemy'?e.y:e.y*TS+8}))}
function solidAt(x,y){const tx=Math.floor(x/TS),ty=Math.floor(y/TS);if(tx<0||ty<0||tx>=GW||ty>=GH)return false;return SOL[ty*GW+tx]!=0}
function entSolid(x,y){for(const e of F.ents){if(e.t=='enemy')continue;if(Math.abs(x-e.ex)<9&&Math.abs(y-(e.ey+2))<9)return true}return false}
function blocked(x,y){const w=5,h=3;for(const [a,b] of [[-w,-h],[w,-h],[-w,h],[w,h]]){if(solidAt(x+a,y+b)||entSolid(x+a,y+b))return true}return false}
function enterRoom(i,side,cb){F.room=i;build();const R=ROOMS[i];
 if(side=='l'){F.px=20;F.py=112}else if(side=='r'){F.px=CW-20;F.py=112}else if(side=='u'){F.px=200;F.py=28}else if(side=='d'){F.px=200;F.py=CH-28}
 F.rt=150;F.enc=null;mus(i==6?'boss':'ow');if(cb)cb()}
function goExit(side){const R=ROOMS[F.room],to=R.exits[side];if(to==null)return;const from={r:'l',l:'r',u:'d',d:'u'}[side];
 if(to==6&&!F.fl.boss){/* sala do chefe: cena ao entrar */}
 fadeTo(()=>{enterRoom(to,from);if(to==6)setTimeout(()=>bossIntro(),0);if(to==5&&!F.fl.s5){F.fl.s5=1}})}
// ---------- fade ----------
function fadeTo(cb){if(F.fd)return;F.fd={v:0,d:1,cb}}
function updFade(){const f=F.fd;if(!f)return false;f.v+=f.d*.09;if(f.d>0&&f.v>=1){f.v=1;f.d=-1;f.cb&&f.cb()}else if(f.d<0&&f.v<=0){F.fd=null}return true}
// ---------- diálogo ----------
function say(lines,cb,opt){const pages=[];opt=opt||{};
 lines.forEach(l=>{let nm='',t=l;if(Array.isArray(l)){nm=l[0];t=l[1]}const w=wrap('* '+t.replace(/^\* /,''),360,8);for(let i=0;i<w.length;i+=4)pages.push({nm,ls:w.slice(i,i+4)})});
 F.dlg={pages,i:0,c:0,cb,top:opt.top!=null?opt.top:F.py>118&&F.m=='ow'};mus_blip=0}
let mus_blip=0;
function updDlg(){const d=F.dlg,p=d.pages[d.i],len=p.ls.join('\n').length;
 if(d.c<len){d.c+=1.4;if(((d.c|0)%4)==0&&mus_blip!=(d.c|0)){mus_blip=d.c|0;sfx(p.nm?520:420,.03,'square',.02)}if(OK()||NO())d.c=len}
 else if(OK()){d.i++;d.c=0;if(d.i>=d.pages.length){F.dlg=null;d.cb&&d.cb()}}}
function drawDlg(){const d=F.dlg;if(!d)return;const y=d.top?30:146,p=d.pages[d.i];box(8,y,384,70,'#fff','#000');
 if(p.nm){box(16,y-7,Math.max(40,p.nm.length*6+12),12,'#fff','#000');T(p.nm,22,y-4,{sz:7,c:'#ffd23a'})}
 let n=d.c|0,yy=y+10;p.ls.forEach(l=>{if(n>0){T(l.slice(0,n),20,yy);n-=l.length+1}yy+=13});
 if(d.c>=p.ls.join('\n').length&&(F.t>>4)%2)T('▼',372,y+58,{sz:7,c:'#fff'})}
// ---------- menu de opções (centro) ----------
function openMenu(o){F.menu={title:o.title||'',opts:o.opts,i:0,cancel:o.cancel,foot:o.foot,x:o.x}}
function updMenu(){const m=F.menu,n=m.opts.length;if(nav('up'))m.i=(m.i+n-1)%n,sfx(300,.03);if(nav('down'))m.i=(m.i+1)%n,sfx(300,.03);
 if(OK()){const o=m.opts[m.i];if(o.dis){sfx(120,.1);return}const f=o.f;F.menu=null;sfx(600,.05);f&&f()}else if(NO()&&m.cancel){F.menu=null;m.cancel()}}
function drawMenu(){const m=F.menu;if(!m)return;const w=m.x||230,h=m.opts.length*14+(m.title?18:8)+(m.foot?12:0),x=(CW-w)/2|0,y=Math.max(8,(CH-h)/2-10|0);box(x,y,w,h,'#fff','#000');let yy=y+8;
 if(m.title){T(m.title,x+10,yy,{c:'#ffd23a'});yy+=14}
 F.hot=F.hot||[];m.opts.forEach((o,i)=>{T(o.t,x+26,yy,{c:o.dis?'#777':i==m.i?'#ffd23a':'#fff'});if(i==m.i)heart(x+16,yy+4);F.hot.push({x:x,y:yy-2,w:w,h:13,i:i,m:1});yy+=14});
 if(m.foot)T(m.foot,x+10,yy+1,{sz:7,c:'#aaa'})}
function ask(t,opts,cancel){say([t],()=>openMenu({opts:opts.map(([t,f])=>({t,f})),cancel,x:Math.max(150,Math.max(...opts.map(o=>o[0].length))*6+40)}))}
// ---------- toasts ----------
function toast5(t){F.toast={t,n:140}}
// ---------- overworld ----------
function nearEnt(){let best=null,bd=1e9;for(const e of F.ents){if(e.t=='enemy')continue;const d=Math.hypot(F.px-e.ex,(F.py-6)-(e.ey))*1;const lim=e.k=='elev'?30:24;if(d<lim&&d<bd){best=e;bd=d}}return best}
function updOW(){
 if(F.rt>0)F.rt--;
 if(pr('inv')||pr('dash')||pr('pause')){pauseMenu();return}
 let dx=(K.right?1:0)-(K.left?1:0),dy=(K.down?1:0)-(K.up?1:0);
 if(dx||dy){const sp=1.35*(dx&&dy?.72:1);F.stp+=.18;if(dx)F.pd=dx>0?'r':'l';else F.pd=dy>0?'d':'u';if(dx&&dy&&(K.up||K.down)&&!(F.pd=='u'||F.pd=='d')){}
  const nx=F.px+dx*sp,ny=F.py+dy*sp;if(!blocked(nx,F.py))F.px=nx;if(!blocked(F.px,ny))F.py=ny}else F.stp=0;
 // saídas
 const R=ROOMS[F.room];
 if(F.px>CW-3&&R.exits.r!=null)return goExit('r');if(F.px<3&&R.exits.l!=null)return goExit('l');if(F.py<5&&R.exits.u!=null)return goExit('u');if(F.py>CH-4&&R.exits.d!=null)return goExit('d');
 F.px=cl(F.px,2,CW-2);F.py=cl(F.py,4,CH-3);
 // inimigos
 for(const e of F.ents){if(e.t!='enemy')continue;e.bob=(e.bob||0)+.05;const rad=e.pre?62:22;if(Math.hypot(F.px-e.ex,F.py-6-e.ey)<rad&&!F.dlg){startEnc(e);return}}
 if(OK()){const e=nearEnt();if(e)talk(e)}}
function startEnc(e){F.m='enc';sfx(880,.12,'square',.05);F.enc={e,t:0};
 const go=()=>{mus(EN[e.e].boss?'boss':'bt');F.m='bt';startBattle(e.e,e.id)};
 if(e.pre&&!F.seen['pre'+e.id]){F.seen['pre'+e.id]=1;F.m='ow';say(EN[e.e].pre.map(p=>[p[0],p[1]]),()=>{F.m='enc';F.enc={e,t:0}})}}
function updEnc(){if(F.dlg)return;F.enc.t++;if(F.enc.t==1)sfx(700,.1,'square',.05);if(F.enc.t>46){const e=F.enc.e;mus(EN[e.e].boss?'boss':'bt');F.m='bt';startBattle(e.e,e.id)}}
function drawEnc(){drawOW();const t=F.enc.t;if(t>=2&&t<46){const e=F.enc.e;px(0,0,CW,CH,'rgba(0,0,0,'+Math.min(.6,t/30)+')');const bl=((t>>2)&1);if(bl){T('!',e.ex-3,e.ey-30,{sz:16,c:'#f33'})}const ph=Math.min(1,t/30);heart(F.px+(60-F.px)*ph*ph,F.py-6+(190-F.py+6)*ph*ph,'#ff2a2a');}}
// ---------- desenho do overworld ----------
function drawRoomBg(){const R=ROOMS[F.room];
 for(let y=0;y<GH;y++)for(let x=0;x<GW;x++){px(x*TS,y*TS,TS,TS,R.fl[(x+y)&1])}
 if(R.rugs)R.rugs.forEach(([x,y,w,h,c])=>{px(x*TS,y*TS,w*TS,h*TS,c);px(x*TS,y*TS,w*TS,2,'rgba(255,255,255,.08)')});
 // paredes
 px(0,0,CW,TS+4,R.wl);px(0,TS,CW,4,'rgba(0,0,0,.35)');px(0,TS+4,CW,1,R.ac);
 for(let x=0;x<GW;x++){if(x%3==0)px(x*TS+4,4,8,7,'rgba(255,255,255,.07)')}
 px(0,0,TS,CH,R.wl);px(CW-TS,0,TS,CH,R.wl);px(0,CH-TS,CW,TS,R.wl);
 px(TS,TS+5,2,CH-2*TS-5,'rgba(0,0,0,.25)');px(CW-TS-2,TS+5,2,CH-2*TS-5,'rgba(0,0,0,.25)');px(TS,CH-TS-2,CW-2*TS,2,'rgba(0,0,0,.25)');
 const ex=R.exits;g.fillStyle='#0a0810';
 if(ex.r)px(CW-TS,6*TS,TS,3*TS,'#0a0810');if(ex.l)px(0,6*TS,TS,3*TS,'#0a0810');if(ex.u)px(11*TS,0,3*TS,TS+4,'#0a0810');if(ex.d)px(11*TS,CH-TS,3*TS,TS,'#0a0810');
 // setas pulsantes nas saídas
 const a=.35+.25*Math.sin(F.t*.1);g.globalAlpha=a;if(ex.r)T('›',CW-12,6*TS+18,{sz:10,sh:0,c:R.ac});if(ex.l)T('‹',3,6*TS+18,{sz:10,sh:0,c:R.ac});if(ex.u)T('ˆ',CW/2-3,5,{sz:10,sh:0,c:R.ac});if(ex.d)T('ˇ',CW/2-3,CH-14,{sz:10,sh:0,c:R.ac});g.globalAlpha=1}
function drawOW(){const R=ROOMS[F.room];drawRoomBg();
 const list=[];
 for(const k in OG){const i=+k;list.push({y:(Math.floor(i/GW)+1)*TS-(OG[k]=='W'?40:0),f:()=>furn(OG[k],i%GW,Math.floor(i/GW))})}
 for(const e of F.ents){
  if(e.t=='enemy'){const d=EN[e.e],s=spr(d.sp),by=Math.sin(e.bob||0)*2;list.push({y:e.ey+14,f:()=>{g.fillStyle='rgba(0,0,0,.3)';g.fillRect(e.ex-10,e.ey+12,20,3);g.drawImage(s,Math.round(e.ex-d.sw/2),Math.round(e.ey-d.sw/2+by))}})}
  else if(e.t=='npc'){list.push({y:e.ey+10,f:()=>{g.fillStyle='rgba(0,0,0,.3)';g.fillRect(e.ex-6,e.ey+8,13,3);g.drawImage(npcS(e),e.ex-7,e.ey-10)}})}
  else{const s=thS(e.k);list.push({y:e.ey+8,f:()=>{const gl=e.k=='mentor'?1:0;if(gl){g.fillStyle='rgba(62,240,255,'+(.12+.08*Math.sin(F.t*.1))+')';g.fillRect(e.ex-14,e.ey-12,28,26)}if(e.k=='sv'){const w=Math.sin(F.t*.12);g.fillStyle='rgba(255,60,60,'+(.15+.1*w)+')';g.beginPath();g.arc(e.ex,e.ey,10,0,7);g.fill()}g.drawImage(s,Math.round(e.ex-s.width/2),Math.round(e.ey+8-s.height))}})}}
 const fr=((F.stp|0)%2),ps=mgr(F.pd,fr);list.push({y:F.py+4,f:()=>{g.fillStyle='rgba(0,0,0,.3)';g.fillRect(F.px-6,F.py+3,12,3);g.drawImage(ps,Math.round(F.px-7),Math.round(F.py-17))}});
 list.sort((a,b)=>a.y-b.y).forEach(o=>o.f());
 const n=nearEnt();if(n&&!F.dlg&&!F.menu){T('!',n.ex-2,n.ey-(n.t=='npc'?26:n.k=='elev'?32:24)+Math.sin(F.t*.2)*2,{sz:8,c:'#ffd23a'})}
 // nome da sala
 if(F.rt>0){const a=Math.min(1,F.rt/20,(150-F.rt)/12);g.globalAlpha=a;px(0,CH/2-70,CW,18,'rgba(0,0,0,.75)');T(R.n,CW/2,CH/2-66,{al:'center',c:R.ac});g.globalAlpha=1}
 // HUD
 T('LV '+F.lv,6,CH-12,{sz:7,c:'#fff'});px(40,CH-12,24,6,'#600');px(40,CH-12,Math.round(24*F.hp/maxHp()),6,'#ff0');T(F.hp+'/'+maxHp(),68,CH-12,{sz:7});T(F.G+'G',130,CH-12,{sz:7,c:'#ffd23a'});
 const k=F.kills,s=F.spared;T(k?'☠'+k:'',170,CH-12,{sz:7,c:'#f66'});if(s)T('♥'+s,196,CH-12,{sz:7,c:'#6f6'});}

// ---------- conversas ----------
function healSave(){F.hp=maxHp();saveG();sfx(880,.15,'triangle',.05);sfx(1175,.2,'triangle',.05);toast5('Arquivo salvo. HP restaurado.')}
function mentorMenu(ctx){openMenu({title:'MENTOR IA',opts:[{t:'Conversar com o Mentor',f:()=>openMentor(ctx||'',null)},{t:'Salvar e recuperar HP',f:()=>{healSave()}},{t:'Deixa quieto',f:()=>{}}],cancel:()=>{},x:200})}
function talk(e){
 const K0=F.kills;
 if(e.k=='mentor'){
  if(!F.fl.m0){F.fl.m0=1;say([['Mentor IA','Bip. Bom dia, gerente. Eu sou o Mentor IA. Estou preso neste terminal desde 2019.'],['Mentor IA','Aqui é o Andar Zero, onde moram as horas extras que a empresa nunca pagou. Elas viraram... gente. E monstros. Tanto faz.'],['Mentor IA','Regras: LUTAR é rápido e barato. AGIR exige ter lido ao menos um livro de gestão. Eu existo para ajudar com a segunda opção.'],['Mentor IA','Ninguém precisa morrer. Mas ninguém vai te impedir. Eu não julgo. (Julgo um pouco.)']],()=>mentorMenu())}
  else if(e.id=='mentor5'){const t=K0==0?'Zero baixas até aqui. Impressionante. O RH vai querer te estudar.':K0>=TOTAL?'Você demitiu o andar inteiro. Isso... também é um estilo de gestão.':'Há baixas no seu currículo. Mas ainda dá tempo de ser alguém melhor, ou pior.';say([['Mentor IA','Último terminal antes do Sr. Prazo. '+t],['Mentor IA','Dica: ele não é inimigo, é um processo com problemas de autoridade.']],()=>mentorMenu('Sr. Prazo'))}
  else say([['Mentor IA',pick(['Pergunte à vontade. Eu sou barato e nunca peço aumento.','Bip. Sinto cheiro de dúvida. Vai querer ajuda?','Eu respondo, mas quem decide é você. Gerente é você, eu sou estagiário com tokens.'])]],()=>mentorMenu())}
 else if(e.k=='elev'){say([['Elevador','Ding. Andar Zero. Não há botão para subir.'],['','Um adesivo diz: "MANUTENÇÃO PREVISTA: 2019".']])}
 else if(e.k=='mirror'){const t=K0==0?'Você parece cansado, mas com a consciência limpa. Raro neste prédio.':K0>=TOTAL?'O espelho está rachado. O reflexo sorri sozinho.':'O espelho mostra um "Gerente Mediano". Ele pisca em PowerPoint.';say([t,'* LV '+F.lv+'  ☠'+F.kills+'  ♥'+F.spared])}
 else if(e.k=='sv'){if(!F.fl.sv){F.fl.sv=1;try{unl('a_sv')}catch(x){}F.fl.svx=1;sfx(1200,.2,'triangle',.06);say(['Um pequeno triângulo vermelho, ponta para baixo, com SV no meio.','Ninguém sabe o que significa. Mesmo assim, você se sente mais forte. (ATQ +3)'])}else say(['O triângulo SV continua ali, brilhando discretamente.'])}
 else if(e.id=='marlene'){
  if(K0>=3)say([['Dona Marlene','Ai, meu Deus, o que aconteceu com o pessoal? O Estagiário tinha 11 anos de casa... bem, de baia.'],['Dona Marlene','Eu só limpo. Não me demite, tá?']])
  else if(!F.fl.mar){F.fl.mar=1;say([['Dona Marlene','Ah, querido, outro gerente! O último também chegou animado.'],['Dona Marlene','Aqui ninguém nunca pediu feedback. Eles só queriam que alguém perguntasse "tudo bem?".'],['Dona Marlene','Toma, uma coxinha. Faz bem para a alma. E para o colesterol também, mas aí é outro departamento.']],()=>{addItem('Coxinha');toast5('Recebeu: Coxinha')})}
  else say([['Dona Marlene',pick(['Se um monstro chorar, escute. Quase sempre é só falta de atenção.','Nunca subestime um estagiário. Nem um café esquecido.','Acordei às 5h. O Banco de Horas não me deve nada. Deve ao resto do prédio.'])]])}
 else if(e.id=='vendor'){
  if(K0>=4)say([['Seu Zé','Ei, eu só vendo coxinha! Não me demite!']],shop);else say([['Seu Zé da Coxinha',F.fl.ze?'Fresquinha, gerente! Quase.':'Fala, gerente! Coxinha, café e bolo. O bolo é do RH, não pergunte de quem.']],()=>{F.fl.ze=1;shop()})}
 else if(e.id=='contador'){
  const f=TOTAL-F.kills;say([['Contador Cego','Eu não vejo nada. Mas conto tudo.'],['Contador Cego','Baixas: '+F.kills+'. Poupados: '+F.spared+'.'],['Contador Cego',F.kills==0?'Quem poupa todo mundo, inclusive o chefe da sala do fundo, abre uma porta que a empresa nunca construiu.':F.kills>=TOTAL?'Você acabou com o andar. Resta a sala do fundo. E um certo estagiário que nunca foi contratado.':'Se você ainda quer o caminho mais violento, faltam '+f+' para zerar o prédio. Eu não aconselho. Também não cobro.']])}
 else say(['...'])}
function addItem(n){if(F.items.length<8)F.items.push(n)}
function shop(){const L=[['Cafezinho',5],['Coxinha',10],['Bolo do RH',20]];
 openMenu({title:'LOJA   '+F.G+'G',opts:L.map(([n,p])=>({t:n+' ('+IT[n].h+' HP)  '+p+'G',f:()=>{if(F.G<p){say([['Seu Zé','Sem grana, sem coxinha. Capitalismo.']],shop)}else if(F.items.length>=8){say(['* Sua mochila está cheia.'],shop)}else{F.G-=p;addItem(n);sfx(700,.08);say(['* Comprou '+n+'.'],shop)}}})).concat([{t:'Sair',f:()=>{}}]),cancel:()=>{},x:260})}
function bossIntro(){
 if(F.fl.bossDone)return;
 if(F.kills>=TOTAL){F.m='ow';say(['* A sala está vazia. No chão, um relógio parado.','* Algo ronca no canto.'],()=>{say([['Estagiário Eterno','Ei. Você demitiu o prédio inteiro. Impressionante.'],['Estagiário Eterno','Eu sou estagiário há 11 anos. Nunca fui contratado, então não posso ser demitido. Divertido, né?'],['Estagiário Eterno','Bom. Vamos ver o que você sabe fazer.']],()=>{F.ents=[{id:'eterno',t:'enemy',e:'eterno',x:200,y:80,ex:200,ey:80,bob:0}];F.m='enc';F.enc={e:F.ents[0],t:0}})})}
 else{F.m='ow';say([['Sr. Prazo','VOCÊ CHEGOU... COM 3 MINUTOS DE ATRASO.'],['Sr. Prazo','TENHO UM RELÓGIO PARA CADA ERRO SEU. E UM CRONOGRAMA PARA CADA ERRO DOS OUTROS.'],['Sr. Prazo','VAMOS À REUNIÃO. VOCÊ NÃO ESTÁ CONVIDADO.']],()=>{F.ents=[{id:'prazo',t:'enemy',e:'prazo',x:200,y:76,ex:200,ey:76,bob:0}];F.m='enc';F.enc={e:F.ents[0],t:0}})}}
// ---------- batalha ----------
let B=null;
function startBattle(key,id){const d=EN[key];
 B={k:key,id,d,hp:d.hp,mx:d.hp,mercy:0,rage:0,turn:0,ph:'in',t:0,i:0,sub:null,si:0,q:null,after:null,
  box:{x:20,y:100,w:360,h:66},tg:{x:20,y:100,w:360,h:66},soul:{x:200,y:133,vy:0,mode:'r',g:0},bl:[],inv:0,bar:null,dmg:0,dmgT:0,flash:0,sh:0,talk:'',ment:0,hpShow:0,sleep:0,mt:0,miss:0,quip:'',used:0,pat:null,pt:0,shake:0,fx:[]};
 F.hp=Math.min(F.hp,maxHp());B.start={hp:F.hp,items:F.items.slice()};F.B=B;F.lastB={k:key,id:id,items:F.items.slice()};F.seen[key]=1;
 if(!d.pre&&!d.boss&&Math.random()<.25){B.flav=d.flav[0]}
 B.txt=bFlav();B.tt=0}
function bFlav(){const d=B.d;if(B.sleep)return '* O Estagiário Eterno está dormindo. Ele ronca em Comic Sans.';if(B.turn==0)return d.flav[0];if(B.d.eterno)return d.flav[1+B.turn%3];if(B.mercy>=100)return '* '+d.name+' parece disposto a ser poupado.';return pick(d.flav)}
function bq(pages,after){B.q=pages.slice();B.ph='txt';B.after=after;B.txt=B.q.shift();B.tt=0}
const spl=s=>s.split('|');
function bDone(){B.ph='menu';B.txt=bFlav();B.tt=0}
function enemyTurn(){const d=B.d;B.ph='etalk';B.t=0;
 B.talk=B.sleep?'Zzz...':(d.talk?d.talk[B.turn%d.talk.length]:'...');
 if(d.eterno&&B.turn==7){B.talk='Hora de um cochilinho.'}}
function startDodge(){const d=B.d;B.ph='dodge';B.t=0;B.bl=[];const pats=d.pats;let pn=pats[B.turn%pats.length];B.pat=pn;if(pn=='mix')B.pat=pick(['rain','aim','wall','scan','spiral','boneA','boneB']);B.pt=0;
 B.tg={x:150,y:100,w:100,h:66};if(['wall','cells','scan','boneA','boneB','boneC','hands','spiral','pend'].includes(B.pat)){B.tg={x:130,y:100,w:140,h:66}}
 B.soul.x=200;B.soul.y=150;B.soul.vy=0;B.soul.mode=B.pat=='boneC'?'b':'r';
 const P_=PAT[B.pat];B.len=P_.len;P_.init&&P_.init()}
function endDodge(){B.turn++;B.tg={x:20,y:100,w:360,h:66};B.bl=[];B.soul.mode='r';
 if(B.d.eterno&&B.turn>=8&&!B.sleep){B.sleep=1;bq(['* O Estagiário Eterno boceja... e dorme no meio da batalha.','* Ele ronca. Ele está indefeso.'],bDone)}
 else bDone()}
// ---- padrões ----
const bx=()=>B.box,Dm=()=>B.d.boss?1+Math.min(B.turn*.04,.5):1;
const addC=(x,y,vx,vy,r,o)=>B.bl.push(Object.assign({k:'c',x,y,vx,vy,r:r||3},o||{}));
const addR=(x,y,w,h,vx,vy,o)=>B.bl.push(Object.assign({k:'r',x,y,w,h,vx:vx||0,vy:vy||0},o||{}));
const PAT={
 rain:{len:300,step(t){const b=bx();if(t%Math.max(6,13-(Dm()*2|0))==0)addC(b.x+rand(5,b.w-5),b.y-4,0,rand(1.1,1.7)*Dm(),3)}},
 aim:{len:290,step(t){const b=bx();if(t%38==10){const x=b.x+rand(5,b.w-5),y=b.y-3,a=Math.atan2(B.soul.y-y,B.soul.x-x),s=1.4*Dm();addC(x,y,Math.cos(a)*s,Math.sin(a)*s,3)}}},
 bounce:{len:300,init(){const b=bx();for(let i=0;i<3;i++)addC(b.x+20+i*20,b.y+20,rand(.8,1.3)*(i%2?1:-1),rand(.7,1.2),4,{bn:1})},step(){}},
 wall:{len:300,step(t){const b=bx();if(t%70==20){const gap=26,gy=b.y+rand(8,b.h-gap-8),dir=(t/70|0)%2?1:-1,x=dir>0?b.x-6:b.x+b.w,v=1.2*dir*Dm();addR(x,b.y,6,gy-b.y,v,0);addR(x,gy+gap,6,b.y+b.h-gy-gap,v,0)}}},
 cells:{len:300,step(t){const b=bx();if(t%48==8){const used=[];for(let i=0;i<2;i++){let c;do c=ri(0,5);while(used.includes(c));used.push(c);const cw=b.w/3,ch=b.h/2,cx=b.x+(c%3)*cw,cy=b.y+(c/3|0)*ch;B.bl.push({k:'cell',x:cx+2,y:cy+2,w:cw-4,h:ch-4,age:0})}}}},
 hall:{len:300,step(t){const b=bx();if(t%11==0)addC(b.x+rand(5,b.w-5),b.y-4,rand(-.3,.3),rand(1,1.6),3,{fake:Math.random()<.5})}},
 scan:{len:320,step(t){const b=bx();if(t%80==10){const v=Math.random()<.6;if(v){const y=b.y+rand(6,b.h-12);B.bl.push({k:'cell',x:b.x,y:y,w:b.w,h:6,age:-10})}else{const x=b.x+rand(6,b.w-12);B.bl.push({k:'cell',x:x,y:b.y,w:6,h:b.h,age:-10})}}}},
 hands:{len:320,init(){B.ang=rand(0,6)},step(t){B.ang+=.017*Dm()}},
 pend:{len:300,init(){B.ang=0},step(t){B.ang=Math.sin(t*.035*Dm())*1.1;if(t%34==0){const b=bx();addC(b.x+rand(5,b.w-5),b.y-3,0,1.2,3)}}},
 spiral:{len:320,init(){B.sa=0},step(t){const b=bx();if(t>30&&t%7==0){B.sa+=.9;const s=.95*Dm();addC(b.x+b.w/2,b.y+8,Math.cos(B.sa)*s,Math.abs(Math.sin(B.sa))*s+.2,3)}}},
 boneA:{len:310,step(t){const b=bx();if(t%46==10){const dir=(t/46|0)%2?1:-1,h=rand(14,34);addR(dir>0?b.x-6:b.x+b.w,b.y+b.h-h,5,h,1.8*dir*Dm(),0,{bone:1})}}},
 boneB:{len:310,step(t){const b=bx();if(t%38==10){const h=rand(14,32),up=(t/38|0)%2;addR(b.x+b.w,up?b.y:b.y+b.h-h,5,h,-1.9*Dm(),0,{bone:1})}}},
 boneC:{len:330,step(t){const b=bx();if(t%66==10){const h=(t/66|0)%2?22:14;addR(b.x+b.w,b.y+b.h-h,6,h,-2*Dm(),0,{bone:1})}}},
 mix:{len:300,step(){}}
};
function hitSoul(o){const s=B.soul,sr=3;if(o.fake)return false;
 if(o.k=='c')return Math.hypot(o.x-s.x,o.y-s.y)<o.r+sr-1;
 if(o.k=='r')return s.x+sr>o.x&&s.x-sr<o.x+o.w&&s.y+sr>o.y&&s.y-sr<o.y+o.h;
 if(o.k=='cell')return o.age>=40&&s.x+sr>o.x&&s.x-sr<o.x+o.w&&s.y+sr>o.y&&s.y-sr<o.y+o.h;return false}
function hurtSoul(){if(B.inv>0)return;B.inv=55;const d=Math.max(1,B.d.atk+B.rage);F.hp-=d;B.sh=6;sfx(150,.12,'sawtooth',.07);if(F.hp<=0){F.hp=0;B.ph='lose';B.t=0;mus('')}}
function stepDodge(){const b=B.box,s=B.soul;B.t++;B.pt++;
 // caixa anima
 for(const k of ['x','y','w','h'])b[k]+=(B.tg[k]-b[k])*.25;
 if(B.pt>12){PAT[B.pat].step(B.pt-12);}
 // alma
 const sp=K.dash?.8:1.7;
 if(s.mode=='r'){s.x+=((K.right?1:0)-(K.left?1:0))*sp;s.y+=((K.down?1:0)-(K.up?1:0))*sp}
 else{s.x+=((K.right?1:0)-(K.left?1:0))*1.6;s.vy+=.2;if(K.up&&s.y>=b.y+b.h-5.5&&s.vy>=0){s.vy=-4.4}if(!K.up&&s.vy<-1.6)s.vy=-1.6;s.y+=s.vy;if(s.y>b.y+b.h-4){s.y=b.y+b.h-4;s.vy=0}}
 s.x=cl(s.x,b.x+5,b.x+b.w-5);s.y=cl(s.y,b.y+5,b.y+b.h-4);
 if(B.pat=='hands'||B.pat=='pend'){if(B.pt>40)checkRays()}
 for(const o of B.bl){
  if(o.k=='cell'){o.age++;continue}
  o.x+=o.vx;o.y+=o.vy;
  if(o.bn){if(o.x<b.x+o.r||o.x>b.x+b.w-o.r)o.vx*=-1;if(o.y<b.y+o.r||o.y>b.y+b.h-o.r)o.vy*=-1}
  if(hitSoul(o))hurtSoul()}
 for(const o of B.bl)if(o.k=='cell'&&hitSoul(o))hurtSoul();
 B.bl=B.bl.filter(o=>o.k=='cell'?o.age<56:(o.x>b.x-30&&o.x<b.x+b.w+30&&o.y>b.y-30&&o.y<b.y+b.h+30));
 if(B.inv>0)B.inv--;if(B.sh>0)B.sh--;
 if(B.ph=='dodge'&&B.pt>=B.len+12)endDodge()}
function rays(){const b=bx(),cx=b.x+b.w/2,cy=B.pat=='pend'?b.y-6:b.y+b.h/2;
 if(B.pat=='hands')return [[cx,cy,B.ang,46],[cx,cy,B.ang+Math.PI,46]];
 return [[cx,cy,Math.PI/2+B.ang,64]]}
function checkRays(){const s=B.soul;for(const [x,y,a,L] of rays()){for(let r=8;r<=L;r+=3){const px_=x+Math.cos(a)*r,py_=y+Math.sin(a)*r;if(Math.hypot(px_-s.x,py_-s.y)<4.2){hurtSoul();return}}}}
// ---- batalha: update ----
function updBt(){const d=B.d;B.t++;if(B.sh>0&&B.ph!='dodge')B.sh--;
 const typing=()=>{const n=(B.txt||'').length;if(B.tt<n){B.tt+=1.2;if(OK()||NO())B.tt=n;return true}return false};
 switch(B.ph){
 case 'in':if(B.t>34){B.ph='menu';B.t=0}break;
 case 'menu':{if(B.tt<(B.txt||'').length)B.tt+=1.2;
  if(nav('left'))B.i=(B.i+3)%4,sfx(300,.03);if(nav('right'))B.i=(B.i+1)%4,sfx(300,.03);
  if(OK()){sfx(600,.05);const i=B.i;
   if(i==0){B.ph='bar';B.bar={x:0,v:3.2,done:0,t:0};B.t=0}
   else if(i==1){B.ph='act';B.si=0}
   else if(i==2){if(!F.items.length){B.txt='* Sua mochila está vazia. Que gestão é essa?';B.tt=0}else{B.ph='item';B.si=0}}
   else mercyDo()}
  break}
 case 'act':{const L=actList();if(nav('up'))B.si=(B.si+L.length-1)%L.length;if(nav('down'))B.si=(B.si+1)%L.length;if(NO()){B.ph='menu';break}if(OK())doAct(B.si);break}
 case 'item':{const L=F.items;if(nav('up'))B.si=(B.si+L.length-1)%L.length;if(nav('down'))B.si=(B.si+1)%L.length;if(NO()){B.ph='menu';break}if(OK()){const n=L.splice(B.si,1)[0],it=IT[n];F.hp=Math.min(maxHp(),F.hp+it.h);sfx(900,.1,'triangle',.06);bq([it.t+'|* Recuperou '+it.h+' HP.'].map(x=>spl(x)).flat(),enemyTurn)}break}
 case 'txt':{if(typing())break;if(OK()){if(B.q.length){B.txt=B.q.shift();B.tt=0}else{const a=B.after;B.after=null;a&&a()}}break}
 case 'bar':{const bar=B.bar;if(!bar.done){bar.x+=bar.v;if(bar.x>=340)bar.x=0,bar.miss=(bar.miss||0)+1;if(OK()||bar.miss>=1){bar.done=1;bar.t=0;const dist=Math.abs(bar.x-170)/170,miss=bar.miss>=1;
    let dm=0;if(d.eterno&&!B.sleep){dm=-1}else if(d.eterno&&B.sleep){dm=9999}else if(miss){dm=0}else dm=Math.max(1,Math.round((atkP()-d.def+ri(0,2))*Math.max(.25,(1-dist))*2.1));
    bar.dm=dm;sfx(dm>0?200:120,.15,'sawtooth',.07)}}
   else{bar.t++;if(bar.t==14){if(bar.dm>0){B.hp=Math.max(0,B.hp-bar.dm);B.sh=8;B.dmgT=60;B.dmg=bar.dm;sfx(110,.2,'square',.08)}else{B.dmgT=40;B.dmg=-1}}
    if(bar.t>=80){B.ph='';if(B.hp<=0&&!d.eterno){killEnemy()}else if(d.eterno&&B.sleep&&bar.dm>0){killEnemy()}else{B.bar=null;bq(d.eterno?['* Ele desviou sem nem acordar direito.','* ('+['Cada ataque seu é só barulho para ele.','Aguente. Ele está cansado.'][B.turn%2]+')']:bar.dm>0?['* Você atacou '+d.name+'.']:['* Você errou o ataque.'],enemyTurn)}}}
   break}
 case 'etalk':{if(B.t>(B.sleep?40:70)){startDodge()}break}
 case 'dodge':stepDodge();break;
 case 'lose':if(B.t>70){gameOver()}break;
 case 'win':{if(typing())break;if(OK()){if(B.q.length){B.txt=B.q.shift();B.tt=0}else endBattle(B.res)}break}
 }}
function actList(){const L=B.d.acts.map(a=>a[0]);if(!B.d.eterno)L.push('Consultar o Mentor IA');return L}
function mercyDo(){const d=B.d;if(B.mercy>=100){B.ph='';B.mt=0;
  F.spared++;F.dead[B.id]=2;F.G+=d.g;
  const pg=[d.spare,'* VOCÊ GANHOU 0 EXP e '+d.g+' G.'];if(d.boss){F.fl.bossSpared=1}
  B.res='spare';B.ph='win';B.q=pg.slice(1);B.txt=pg[0];B.tt=0;sfx(1000,.2,'triangle',.06);try{if(B.k=='cafe')unl('f5_cafe');if(B.k=='chat')unl('f5_chat')}catch(e){}}
 else{bq(['* Você tenta poupar '+d.name+', mas ele ainda não está calmo.','* (Use AGIR para acalmá-lo. Sem feedback, sem trégua.)'],enemyTurn)}}
function doAct(i){const d=B.d;
 if(i>=d.acts.length){ // mentor
  openMentor('Monstro: '+d.name+'. Conceito: '+d.concept+'.',()=>{const ok=F.asked>0;const pages=[];if(!ok)pages.push('* Você abre o Mentor IA, mas não pergunta nada.|* O Mentor suspira em binário.');else{pages.push('* Você consulta o Mentor IA.');if(!B.ment){B.ment=1;B.mercy=Math.min(100,B.mercy+15);pages.push('* O Mentor ajuda você a enxergar melhor '+d.name+'.')}else pages.push('* O Mentor repete o que já disse, com paciência artificial.')}bq(pages,enemyTurn)},d.hints[0]);return}
 const a=d.acts[i];F.seen['c_'+B.k]=1;const bad=a[3],fx=a[4]||{};let pages=spl(a[2]);
 if(i==0){pages.push('* Conceito: '+d.concept+'.')}
 if(a[1]>0)B.mercy=Math.min(100,B.mercy+a[1]);else if(a[1]<0){B.mercy=Math.max(0,B.mercy+a[1]);B.rage=Math.min(3,B.rage+1)}
 if(fx.hp){F.hp=Math.max(1,F.hp+fx.hp)}
 if(i>0&&a[1]>0&&B.mercy>=100)pages.push('* '+d.name+' está disposto a ser poupado.');
 if(B.d.boss&&a[0].startsWith('Pedir ajuda')){openMentor('Chefe: Sr. Prazo, prazos e cronogramas.',()=>{const ok=F.asked>0;bq(ok?pages:['* Você liga para o Mentor IA, mas não faz pergunta.'],enemyTurn);if(!ok)B.mercy=Math.max(0,B.mercy-25)},'Como renegociar um prazo e montar um cronograma realista?');return}
 bq(pages,i==0?enemyTurn:enemyTurn)}
function killEnemy(){const d=B.d;F.kills++;F.dead[B.id]=1;const ex=d.exp,g=d.g;F.exp+=ex;F.G+=g;let pg=[d.kill];
 pg.push('* VOCÊ GANHOU '+ex+' EXP e '+g+' G.');
 while(F.lv<8&&F.exp>=EXPT[F.lv]){F.lv++;F.hp=Math.min(maxHp(),F.hp+4);pg.push('* SEU LV AUMENTOU.');sfx(1200,.2,'triangle',.06)}
 if(d.eterno)pg=['* Ele dorme. Para sempre.','* Isso foi... um jeito de resolver.'];
 B.res=d.boss?(d.eterno?'eterno':'prazoK'):'kill';B.ph='win';B.q=pg.slice(1);B.txt=pg[0];B.tt=0;B.flash=20;sfx(90,.4,'sawtooth',.08)}
function endBattle(res){const id=B.id,keep=B;B=null;F.B=null;F.m='ow';mus('ow');
 if(res=='spare'||res=='kill'){F.ents=F.ents.filter(e=>e.id!=id);saveAuto();if(F.kills>=TOTAL&&res=='kill'&&!F.fl.silent){F.fl.silent=1;say(['* ...','* O andar ficou em silêncio.'])}}
 else if(res=='prazoK'){F.fl.bossDone=1;F.fl.bossK=1;startEnding()}
 else if(res=='eterno'){F.fl.bossDone=1;startEnding()}
 if(res=='spare'&&keep.d.boss){F.fl.bossDone=1;startEnding()}
 }
function saveAuto(){}
// ---- game over ----
function gameOver(){F.deaths=(F.deaths||0)+1;F.m='over';F.over={t:0,i:0};try{unl('f5_die')}catch(e){};mus('')}
const OVQ=['Você morreu. O RH está registrando como "desligamento voluntário".','Burnout. Aquele que o RH chama de "férias forçadas".','Fim de expediente. Sem hora extra paga.','Você caiu. O Sr. Prazo marca a falha no cronograma.'];
function updOver(){const o=F.over;o.t++;if(o.t<60)return;if(nav('up')||nav('down'))o.i^=1;if(OK()){if(o.i==0){// tentar de novo
   const key=B?B.k:F.lastB.k,id=B?B.id:F.lastB.id;F.hp=maxHp();F.items=(F.lastB&&F.lastB.items?F.lastB.items:F.items).slice();if(F.items.length==0)F.items=['Cafezinho'];F.m='bt';F.over=null;mus(EN[key].boss?'boss':'bt');startBattle(key,id)}
  else{F.over=null;F.on=0;F.m='';B=null;npS=null;document.body.classList.remove('f5','f5np');mus('');S('END');mainMenu()}}}
function drawOver(){const o=F.over,d=B?B.d:null;px(0,0,CW,CH,'#000');const a=Math.min(1,o.t/40);g.globalAlpha=a;
 T('GAME OVER',CW/2,24,{sz:16,al:'center',c:'#fff'});g.globalAlpha=1;
 if(o.t>30){heart(CW/2,70,'#555');}
 if(o.t>50){const q=OVQ[(F.deaths||0)%OVQ.length];wrap(q,340,8).forEach((l,i)=>T(l,CW/2,90+i*12,{al:'center'}));
  const dn=d||EN[(F.lastB||{k:'est'}).k],hs=dn.hints[0];T('Dica do Mentor IA:',CW/2,126,{al:'center',c:'#3ef0ff',sz:7});wrap(hs,340,7).forEach((l,i)=>T(l,CW/2,138+i*10,{al:'center',sz:7,c:'#9ff'}))}
 if(o.t>=60){F.hot=[];[['Tentar de novo (esta batalha)'],['Voltar ao menu']].forEach((t,i)=>{T(t[0],CW/2,172+i*16,{al:'center',c:o.i==i?'#ffd23a':'#fff'});if(o.i==i)heart(CW/2-t[0].length*3-14,176+i*16);F.hot.push({x:80,y:168+i*16,w:240,h:14,i:i,o:1})})}}

// ---------- desenho da batalha ----------
function btn(i,x,y,w,h,lab,sel,ic){const c=sel?'#ffd23a':'#ff8a1f';box(x,y,w,h,c,'#000');T(lab,x+24,y+h/2-4,{c:sel?'#ffd23a':'#ff8a1f',sz:8});if(sel)heart(x+12,y+h/2,'#ff2a2a');F.hot.push({x,y,w,h,f:()=>{B.i=i;P.act=1}})}
function drawBt(){const d=B.d;px(0,0,CW,CH,'#000');
 const sc=d.boss?(d.eterno?1.6:1.6):2,sw=d.sw*sc,sh=spr(d.sp).height*sc;
 let mx=CW/2-sw/2,my=Math.min(14,96-sh)+(d.boss?0:0);
 if(B.sh>0&&B.ph!='dodge')mx+=Math.sin(B.t*2)*B.sh*.6;
 const bob=Math.sin(F.t*(B.sleep?.03:.07))*2;
 if(B.ph!='win'||B.res=='spare'||B.res=='kill'||B.res=='prazoK'||B.res=='eterno'){
  const gone=B.ph=='win'&&(B.res=='kill'||B.res=='prazoK'||B.res=='eterno');
  if(!gone){g.save();if(B.ph=='in')g.globalAlpha=Math.min(1,B.t/30);if(B.ph=='win'&&B.res=='spare')g.globalAlpha=.55;g.imageSmoothingEnabled=false;g.drawImage(spr(d.sp),Math.round(mx),Math.round(my+bob),Math.round(sw),Math.round(sh));g.restore()}}
 // hp do monstro / dano
 if(B.dmgT>0){B.dmgT--;const w=100;px(CW/2-w/2,4,w,6,'#555');px(CW/2-w/2,4,Math.round(w*Math.max(0,B.hp)/B.mx),6,'#2f2');
  T(B.dmg>0?String(B.dmg):'MISS',CW/2,14,{al:'center',c:B.dmg>0?'#f33':'#aaa',sz:B.dmg>0?12:9})}
 // balão de fala
 if(B.ph=='etalk'){const w=140,x=Math.min(CW-w-6,CW/2+sw/2+4),y=12;px(x,y,w,38,'#fff');px(x-4,y+14,4,6,'#fff');g.fillStyle='#000';const ls=wrap(B.talk,w-10,7);ls.slice(0,3).forEach((l,i)=>{g.font='7px '+FONT;g.textAlign='left';g.textBaseline='top';g.fillStyle='#000';g.fillText(l,x+5,y+5+i*10)})}
 // caixa
 const b=B.box;box(b.x,b.y,b.w,b.h,'#fff','#000');
 const hot=F.hot;
 if(B.ph=='menu'||B.ph=='txt'||B.ph=='win'||B.ph=='in'){if(B.ph!='in'||B.t>20){const n=Math.floor(B.tt);let yy=b.y+8;wrap(B.txt||'',b.w-24,8).forEach(l=>{if(n>0){}});let rem=n;wrap(B.txt||'',b.w-24,8).forEach(l=>{if(rem>0)T(l.slice(0,rem),b.x+12,yy);rem-=l.length+1;yy+=12});if((B.ph=='txt'||B.ph=='win')&&B.tt>=(B.txt||'').length&&(F.t>>4)%2)T('▼',b.x+b.w-16,b.y+b.h-14,{sz:7})}}
 if(B.ph=='act'){const L=actList();L.forEach((a,i)=>{const col=i%2,row=Math.floor(i/2),x=b.x+22+col*170,y=b.y+8+row*14;const bad=i<d.acts.length&&d.acts[i][3];T(a,x,y,{c:i==B.si?'#ffd23a':(i==L.length-1&&!d.eterno?'#7df':'#fff'),sz:7});if(i==B.si)heart(x-10,y+4);hot.push({x:x-12,y:y-2,w:160,h:13,f:()=>{if(B.si==i)P.act=1;else{B.si=i}}})})}
 if(B.ph=='item'){F.items.forEach((a,i)=>{const col=i%2,row=Math.floor(i/2),x=b.x+22+col*170,y=b.y+8+row*14;T(a,x,y,{c:i==B.si?'#ffd23a':'#fff',sz:7});if(i==B.si)heart(x-10,y+4);hot.push({x:x-12,y:y-2,w:160,h:13,f:()=>{if(B.si==i)P.act=1;else B.si=i}})})}
 if(B.ph=='bar'){const bar=B.bar,x0=b.x+10,y0=b.y+10;px(x0,y0,340,46,'#222');px(x0+1,y0+1,338,44,'#000');for(let i=0;i<340;i+=4){const dd=Math.abs(i-170)/170,c=dd<.12?'#2f2':dd<.4?'#cc2':dd<.7?'#c60':'#822';px(x0+i,y0+4,3,38,c)}px(x0+170,y0,1,46,'rgba(255,255,255,.4)');
  if(bar.done&&bar.t<14){}const fl=bar.done?((bar.t>>1)&1):1;px(x0+bar.x-2,y0-2,5,50,fl?'#fff':'#999');if(bar.done&&bar.t>=14&&bar.t<40&&bar.dm!=0){const sx=CW/2-10,sy=40;g.fillStyle='#ff0';for(let i=0;i<3;i++)g.fillRect(sx-12+(bar.t-14)*1.6+i*4,sy+(bar.t-14)*1.2,3,3)}}
 // balas
 if(B.ph=='dodge'||B.ph=='lose'){g.save();g.beginPath();g.rect(b.x+2,b.y+2,b.w-4,b.h-4);g.clip();
  for(const o of B.bl){if(o.k=='c'){g.globalAlpha=o.fake?.28:1;g.fillStyle=o.fake?'#9cf':'#fff';g.beginPath();g.arc(o.x,o.y,o.r,0,7);g.fill();g.globalAlpha=1}
   else if(o.k=='r'){g.fillStyle='#fff';g.fillRect(o.x,o.y,o.w,o.h);if(o.bone){g.fillStyle='#ccc';g.fillRect(o.x-1,o.y,7,2);g.fillRect(o.x-1,o.y+o.h-2,7,2)}}
   else{const arm=o.age<40;g.fillStyle=arm?(o.age<0?'rgba(255,255,255,.0)':'rgba(255,60,60,'+(.15+.2*((o.age>>2)&1))+')'):'#fff';g.fillRect(o.x,o.y,o.w,o.h);if(arm&&o.age>=0){g.strokeStyle='#f55';g.lineWidth=1;g.strokeRect(o.x+.5,o.y+.5,o.w-1,o.h-1)}}}
  if(B.pat=='hands'||B.pat=='pend'){for(const [x,y,a,L] of rays()){const live=B.pt>40;g.strokeStyle=live?'#fff':'rgba(255,255,255,.3)';g.lineWidth=live?3:1;g.beginPath();g.moveTo(x+Math.cos(a)*8,y+Math.sin(a)*8);g.lineTo(x+Math.cos(a)*L,y+Math.sin(a)*L);g.stroke();if(B.pat=='pend'){g.fillStyle='#fff';g.beginPath();g.arc(x+Math.cos(a)*L,y+Math.sin(a)*L,6,0,7);g.fill()}}}
  g.restore()}
 if(B.ph=='dodge'||B.ph=='lose'){if(B.ph=='lose'&&B.t>20){}else if(!(B.inv>0&&(B.inv>>2)&1)){heart(B.soul.x,B.soul.y,B.soul.mode=='b'?'#3a6aff':'#ff2a2a')}
  if(B.ph=='lose'&&B.t>10&&B.t<40&&(B.t>>2)%2)heart(B.soul.x,B.soul.y,'#fff')}
 // stats
 const y=172;T('GERENTE',14,y,{sz:7});T('LV '+F.lv,70,y,{sz:7});T('HP',120,y,{sz:6,c:'#fff'});const hw=Math.round(maxHp()*1.4)+10;px(136,y,hw,8,'#c00');px(136,y,Math.round(hw*F.hp/maxHp()),8,'#ff0');T(F.hp+' / '+maxHp(),136+hw+6,y,{sz:7,c:(B.inv>0?'#ff6':'#fff')});
 if(d.boss||B.mercy>=100){}
 if(B.mercy>=100)T('♥ POUPAR disponível',CW-8,y,{sz:6,al:'right',c:'#ffd23a'});
 // botões
 const L=['LUTAR','AGIR','ITEM','POUPAR'];
 const act=B.ph=='menu',lock=!act;
 L.forEach((l,i)=>{const sel=act&&B.i==i||(!act&&B.ph!='dodge'&&B.ph!='lose'&&B.ph!='etalk'&&B.i==i&&(B.ph=='act'&&i==1||B.ph=='item'&&i==2||B.ph=='bar'&&i==0));const c=(i==3&&B.mercy>=100)?'#ffd23a':'#ff8a1f';
  const x=12+i*97;box(x,192,88,26,sel?'#ffd23a':c,'#000');T(l,x+26,201,{c:sel?'#ffd23a':c,sz:8});if(sel)heart(x+13,205,'#ff2a2a');
  if(act)hot.push({x,y:192,w:88,h:26,f:()=>{B.i=i;P.act=1}})});
 if(B.flash>0){B.flash--;px(0,0,CW,CH,'rgba(255,255,255,'+B.flash/30+')')}}
// ---------- menus e diário ----------
const rota=()=>F.kills==0?'Pacifista (por enquanto)':F.kills>=TOTAL?'Genocida':'Neutra';
function itemMenu(){if(!F.items.length){say(['* Sua mochila está vazia.'],pauseMenu);return}
 openMenu({title:'ITENS',opts:F.items.map((n,i)=>({t:n+' (+'+IT[n].h+')',f:()=>{F.items.splice(i,1);F.hp=Math.min(maxHp(),F.hp+IT[n].h);sfx(900,.1,'triangle',.06);say([IT[n].t,'* HP: '+F.hp+'/'+maxHp()],pauseMenu)}})).concat([{t:'Voltar',f:pauseMenu}]),cancel:pauseMenu,x:240})}
function statusSay(){const nx=F.lv<8?EXPT[F.lv]:'--';say(['* "Gerente" LV '+F.lv+'|* HP '+F.hp+'/'+maxHp()+'  ATQ '+atkP()+'|* EXP '+F.exp+' (próximo LV: '+nx+')  G '+F.G,'* Baixas: '+F.kills+'  Poupados: '+F.spared+'|* Rota atual: '+rota()+'.'].map(s=>s.replace(/\|/g,' ')),pauseMenu)}
function diary(){const ks=Object.keys(EN).filter(k=>F.seen['c_'+k]);if(!ks.length){say(['* Seu diário de gestão está em branco. Use AGIR > Checar para anotar conceitos.'],pauseMenu);return}
 say(ks.map(k=>'* '+EN[k].name+': '+EN[k].concept+'.'),pauseMenu)}
function pauseMenu(){openMenu({title:'GERENTE  LV '+F.lv,foot:'HP '+F.hp+'/'+maxHp()+'   EXP '+F.exp+'   '+F.G+'G',opts:[{t:'ITEM',f:itemMenu},{t:'STATUS',f:statusSay},{t:'DIÁRIO DE GESTÃO',f:diary},{t:'MENTOR IA',f:()=>openMentor('',null)},{t:'SALVAR',f:()=>{saveG();toast5('Arquivo salvo.')}},{t:'SAIR PARA O MENU',f:quitF5},{t:'Voltar',f:()=>{}}],cancel:()=>{},x:200})}
function quitF5(){saveG();F.on=0;npS=null;document.body.classList.remove('f5np');F.m='';mus('');document.body.classList.remove('f5');uiShow(0);B=null;S('END');mainMenu()}
// ---------- salvar/carregar ----------
const SK='gerente_f5';
function saveG(){try{localStorage.setItem(SK,JSON.stringify({room:F.room,lv:F.lv,exp:F.exp,hp:F.hp,G:F.G,items:F.items,kills:F.kills,spared:F.spared,dead:F.dead,fl:F.fl,deaths:F.deaths||0,seen:F.seen}))}catch(e){}}
function loadG(){try{return JSON.parse(localStorage.getItem(SK)||'null')}catch(e){return null}}
// ---------- Mentor IA (chat) ----------
const STATIC=[[/feedback|sbi/i,'Feedback SBI: descreva a Situação, o Comportamento observado e o Impacto, sem julgar a pessoa. Ex.: "Ontem, na entrega do relatório (S), você conferiu os dados duas vezes (B) e evitou um erro (I)."'],[/eisenhower|priori/i,'Matriz de Eisenhower: separe tarefas em urgente+importante (faça já), importante (agende), urgente (delegue) e nenhum dos dois (elimine).'],[/reuni/i,'Reunião boa tem pauta, objetivo, tempo definido e ata com responsáveis. Se dá para resolver por e-mail, nem marque.'],[/prazo|cronograma|delegar/i,'Prazo realista: quebre em marcos, renegocie cedo com dados, priorize o que importa e delegue para quem tem capacidade.'],[/planilha|dado|f[oó]rmula/i,'Qualidade de dados: confira a fonte, revise fórmulas, trave células críticas e evite "colar só valores" para esconder erro.'],[/ia\b|fonte|alucin|chatbot/i,'Use IA como apoio: peça fontes, confira com outra referência e decida você. A IA erra com confiança.'],[/compliance|[eé]tic|conduta/i,'Compliance: documente, siga o código de conduta, admita erros com transparência e nunca ofereça agrados.']];
const MQ=['Como funciona este jogo?','O que é feedback SBI?','Explique a Matriz de Eisenhower','Como conduzir uma boa reunião?'];
let MH=[],MC='',mcb=null;
async function getSm(){try{return window.claude?await claude.use('sample'):null}catch(e){return null}}
function staticAns(q){for(const [r,t] of STATIC)if(r.test(q))return t;
 if(B&&B.d&&B.d.hints)return B.d.hints[0]+' Conceito: '+B.d.concept+'.';return 'Pense como gerente: entenda a causa, escute, use método e decida com dados. No jogo, poupar exige a ação certa em AGIR, e o terminal salva seu progresso.'}
async function aiAsk(q){const s=await getSm();if(!s)return {t:staticAns(q),s:1};
 const sys='Você é o Mentor IA dentro de um jogo educativo de Administração em estilo Undertale ("Andar Zero – O Banco de Horas"). Responda em português do Brasil, com humor leve, em no máximo 4 frases curtas. Explique o conceito de gestão e sugira uma abordagem prática; não incentive violência. Contexto do jogo: '+(MC||'o jogador está explorando o andar.');
 const msgs=MH.concat([{role:'user',content:(MH.length?'':sys+'\n\nPergunta: ')+q}]);
 try{const r=await Promise.race([s(msgs,{cache:false}),new Promise((_,rj)=>setTimeout(()=>rj(1),25000))]);const t=(r&&r.text)||staticAns(q);MH.push({role:'user',content:msgs[msgs.length-1].content},{role:'assistant',content:t});return {t,s:0}}catch(e){return {t:staticAns(q),s:1}}}
let mEl=null;
function mkMentor(){if(mEl)return;const st=document.createElement('style');st.textContent='#f5m{display:none;position:absolute;inset:0;z-index:9;background:#070a12f2;color:#e6faff;font-family:system-ui,sans-serif;flex-direction:column;padding:10px;gap:8px}#f5m .h{display:flex;justify-content:space-between;align-items:center;font-weight:700;color:#3ef0ff}#f5m .h button{width:auto;margin:0;padding:6px 12px;background:#222;color:#fff;border:1px solid #3ef0ff;border-radius:8px}#f5l{flex:1;overflow:auto;display:flex;flex-direction:column;gap:6px;font-size:clamp(12px,2.6vw,14px);line-height:1.45}#f5l .u{align-self:flex-end;background:#1d3b66;padding:6px 10px;border-radius:10px 10px 2px 10px;max-width:85%}#f5l .a{align-self:flex-start;background:#13303a;border-left:3px solid #3ef0ff;padding:6px 10px;border-radius:10px 10px 10px 2px;max-width:92%;white-space:pre-wrap}#f5l .n{font-size:11px;opacity:.65}#f5q{display:flex;flex-wrap:wrap;gap:6px}#f5q button{width:auto;margin:0;padding:5px 9px;font-size:12px;background:#0f2a33;color:#bff;border:1px solid #3ef0ff55;border-radius:14px;text-align:left}#f5m .i{display:flex;gap:6px}#f5m input{flex:1;font-size:16px;padding:8px;border-radius:8px;border:1px solid #3ef0ff88;background:#0b1620;color:#fff;min-width:0}#f5m .i button{width:auto;margin:0;padding:8px 14px;background:#3ef0ff;color:#012;border:0;border-radius:8px;font-weight:700}#f5ui{display:none;position:absolute;left:6px;top:6px;z-index:6;gap:6px}body.f5 #f5ui{display:flex}#f5ui button{width:38px;height:34px;margin:0;padding:0;text-align:center;background:#000a;color:#fff;border:1px solid #fff8;border-radius:8px;font-size:15px}';st.textContent+='body.f5np #og-interact{display:none!important}body.f5np #pad{visibility:hidden!important;pointer-events:none!important}body.f5 #hk,body.f5 #hq,body.f5 #hc,body.f5 #ht{display:none!important}';document.head.appendChild(st);
 mEl=document.createElement('div');mEl.id='f5m';mEl.innerHTML='<div class="h"><span>🤖 Mentor IA</span><button id="f5x">Fechar ✕</button></div><div id="f5l"></div><div id="f5q"></div><div class="i"><input id="f5i" maxlength="300" placeholder="Pergunte ao Mentor..." autocomplete="off"><button id="f5s">Enviar</button></div>';$('w').appendChild(mEl);
 const ui=document.createElement('div');ui.id='f5ui';ui.innerHTML='<button id="f5b" aria-label="Voltar">✖</button><button id="f5p" aria-label="Menu">☰</button>';$('w').appendChild(ui);
 const dn=(id,f)=>$(id).addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();f()});dn('f5b',()=>{P.atk=1});dn('f5p',()=>{P.inv=1;P.atk=0});
 $('f5x').onclick=closeMentor;$('f5s').onclick=()=>sendM();$('f5i').addEventListener('keydown',e=>{if(e.key=='Enter'){e.preventDefault();sendM()}if(e.key=='Escape')closeMentor();e.stopPropagation()});['keyup','keypress'].forEach(v=>$('f5i').addEventListener(v,e=>e.stopPropagation()))}
function uiShow(v){mkMentor();}
function addM(c,t){const d=document.createElement('div');d.className=c;d.textContent=t;$('f5l').appendChild(d);d.scrollIntoView({block:'nearest'});return d}
let mBusy=0;
async function sendM(t){if(mBusy)return;t=(t||$('f5i').value).trim();if(!t)return;$('f5i').value='';mBusy=1;F.asked=(F.asked||0)+1;F.aiN++;addM('u',t);const o=addM('a','🤖 Pensando…');try{unl('a_ia')}catch(e){}
 const r=await aiAsk(t);o.textContent=r.t;if(r.s)addM('n','(Modo offline: respostas prontas do Mentor. Abra o jogo no claude.ai para a IA de verdade.)');if(F.aiN>=3)try{unl('f5_ia')}catch(e){}mBusy=0}
function openMentor(ctx,cb,first){mkMentor();MC=ctx||'';MH=[];mcb=cb;F.asked=0;F.ovl=1;$('f5l').innerHTML='';addM('a','Oi, gerente! Sou o Mentor IA. Pergunte sobre gestão, ou use um atalho abaixo.'+(ctx?'\n('+ctx+')':''));
 const qs=(first?[first]:[]).concat(B&&B.d?['Qual conceito de gestão está por trás de '+B.d.name+'?','Que ação de AGIR eu devo escolher?']:MQ);$('f5q').innerHTML='';qs.slice(0,4).forEach(q=>{const b=document.createElement('button');b.textContent=q;b.onclick=()=>sendM(q);$('f5q').appendChild(b)});
 mEl.style.display='flex';setTimeout(()=>{try{$('f5i').focus({preventScroll:true})}catch(e){}},50)}
function closeMentor(){if(!F.ovl)return;F.ovl=0;mEl.style.display='none';const c=mcb;mcb=null;P.act=P.atk=0;c&&c()}
// ---------- finais ----------
function endType(){if(F.kills>=TOTAL&&!F.fl.bossSpared&&!F.fl.bossK)return 'geno';if(F.fl.bossK)return 'neuK';if(F.kills==0)return 'pac';return 'neu'}
const ENDS={
 pac:{t:'FIM · GESTÃO HUMANIZADA',c:'#8fffa8',d:[['Novo funcionário','Bom dia! Eu sou o novo funcionário.'],['Você','Seja bem-vindo. Aqui, ninguém paga hora extra de graça.'],['Novo funcionário','Que bom! Posso começar agora?'],['Você','Claro. Primeiro um café. Depois, feedback.']],
  l:['Ninguém foi demitido. Ninguém foi "desligado".','Pela primeira vez, o Banco de Horas fechou no zero.','O Estagiário Zumbi abriu uma startup.','A Reunião virou e-mail. A Planilha foi auditada.','O Sr. Prazo agora usa Kanban e chora menos.','O Mentor IA foi promovido a consultor. Continua sem receber.','','Resultado: ROTA PACIFISTA']},
 neu:{t:'FIM · GESTÃO MEDIANA',c:'#ffd23a',d:[['Novo funcionário','Bom dia! Eu sou o novo funcionário.'],['Você','Bem-vindo. Cuidado com reuniões e com o Sr. Prazo.'],['Novo funcionário','Ele é perigoso?'],['Você','Só se você não tiver pauta.']],
  l:['Alguns foram poupados. Outros... "realocados".','O RH chama isso de reestruturação.','O Banco de Horas fechou com saldo discutível.','O prédio funciona. Mais ou menos. Como todo prédio.','','Resultado: ROTA NEUTRA']},
 neuK:{t:'FIM · PRAZO CUMPRIDO',c:'#ff9a5a',d:[['Novo funcionário','Bom dia! Eu sou o novo funcionário.'],['Você','Bem-vindo. O relógio da sala do fundo está quebrado. Não pergunte.'],['Novo funcionário','Quebrado como?'],['Você','Eficientemente.']],
  l:['O Sr. Prazo parou de contar.','Todo mundo acha que foi eficiência.','O cronograma foi entregue. As pessoas, nem tanto.','O Mentor IA preferiu não comentar.','','Resultado: ROTA NEUTRA (violenta)']},
 geno:{t:'FIM · DEMISSÃO EM MASSA',c:'#ff4a4a',d:[['Novo funcionário','Bom dia! Eu sou o novo... cadê todo mundo?'],['Você','Foram promovidos.'],['Novo funcionário','Todos? Até o estagiário?'],['Você','Principalmente ele. Posso começar o seu treinamento?'],['Novo funcionário','...Posso voltar amanhã?']],
  l:['O Banco de Horas está quitado.','Zero funcionários. Zero horas devidas.','O prédio nunca esteve tão organizado.','O Mentor IA: "Eu avisei." (Não avisou.)','','Resultado: ROTA GENOCIDA','Gestão é pessoas. Sem pessoas, é só prédio.']}};
function empSpr(){return SPC.emp||(SPC.emp=mk(22,38,r=>{const sk='#6b4226';r(6,0,10,2,'#0f0f0f');r(5,2,12,4,'#0f0f0f');r(4,4,14,2,'#0f0f0f');r(3,6,16,2,'#f5c518');r(6,8,10,8,sk);r(8,10,2,2,'#fff');r(12,10,2,2,'#fff');r(9,11,1,1,'#111');r(13,11,1,1,'#111');r(9,14,4,1,'#3a1e0f');r(7,9,3,1,'#2a170b');r(12,9,3,1,'#2a170b');r(8,16,6,2,sk);r(3,17,16,13,'#f5c518');r(8,17,6,2,'#111');r(0,19,3,9,'#f5c518');r(19,19,3,9,'#f5c518');r(0,24,3,4,'#111');r(19,24,3,4,'#111');r(0,28,3,3,sk);r(19,28,3,3,sk);r(5,30,12,6,'#0a1128');r(10,32,2,4,'#050a1c');r(4,36,6,2,'#0d0d0d');r(12,36,6,2,'#0d0d0d')}))}
function startEnding(){const t=endType();F.end=t;F.m='ending';try{unl('f5_'+t);unl('f5_fim')}catch(e){}
 try{const a=JSON.parse(localStorage.getItem('gerente_f5_end')||'[]');if(!a.includes(t))a.push(t);localStorage.setItem('gerente_f5_end',JSON.stringify(a))}catch(e){}
 mus('end');fadeTo(()=>{F.m='emp';F.ents=[];F.emp={t:0};say(ENDS[t].d.map(x=>[x[0],x[1]]),()=>{fadeTo(()=>{F.m='crawl';F.crawl={y:CH,t:0,e:ENDS[t]}})},{top:1})})}
function drawEmp(){px(0,0,CW,CH,F.end=='geno'?'#120808':'#0e1020');for(let y=0;y<CH;y+=16)px(0,y+((y>>4)&1),CW,1,'rgba(255,255,255,.04)');px(0,150,CW,74,F.end=='geno'?'#1a0c0c':'#1a1d33');
 const s=empSpr(),w=s.width*3,x=CW/2-w/2,y=Math.round(80+Math.sin(F.t*.06)*1);g.imageSmoothingEnabled=false;g.drawImage(s,Math.round(x),y,w,s.height*3);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x+6,y+s.height*3,w-12,4)}
function updCrawl(){const c=F.crawl;c.t++;c.y-=.32;if(c.y<-(c.e.l.length*16)+CH*.55)c.y=-(c.e.l.length*16)+CH*.55;if(c.t>200&&OK()){F.crawl=null;F.on=0;F.m='';mus('');document.body.classList.remove('f5','f5np');saveG();credits()}}
function drawCrawl(){const c=F.crawl,e=c.e;px(0,0,CW,CH,'#000');T(e.t,CW/2,Math.max(10,c.y-40),{al:'center',c:e.c,sz:10});e.l.forEach((l,i)=>T(l,CW/2,c.y+i*16,{al:'center',sz:8,c:i==e.l.length-1&&!l?'#fff':(l.startsWith('Resultado')?e.c:'#ddd')}));if(c.t>200&&(F.t>>4)%2)T('[ ✓ continuar ]',CW/2,CH-14,{al:'center',sz:7,c:'#888'})}
// ---------- título e início ----------
function drawTitle(){px(0,0,CW,CH,'#05040a');for(let i=0;i<40;i++){const x=(i*97+F.t*.3*(1+i%3))%CW,y=(i*53)%CH;px(x,y,1,1,'rgba(160,100,255,'+(.3+.4*((i+F.t>>3)&1))+')')}
 const a=Math.min(1,F.t/50);g.globalAlpha=a;T('ANDAR ZERO',CW/2,62,{al:'center',sz:20,c:'#a45cff'});T('O BANCO DE HORAS',CW/2,92,{al:'center',sz:10,c:'#fff'});g.globalAlpha=1;
 if(F.t>60){T('Fase 5 · O Gerente · Grupo 2',CW/2,120,{al:'center',sz:7,c:'#888'});if((F.t>>5)%2)T('[ ✓ para começar ]',CW/2,160,{al:'center',sz:8,c:'#ffd23a'})}
 const ph=Math.min(1,F.t/50);heart(CW/2,140+Math.sin(F.t*.1)*3,'#ff2a2a')}
function updTitle(){F.t++;if(F.t>60&&OK()){sfx(700,.1);F.fd=null;fadeTo(()=>{F.m='ow';enterRoom(F.room||0,F.room?'l':'',()=>{if(!F.room){F.px=104;F.py=112}});if(F.room==6)setTimeout(bossIntro,0);if(!F.fl.intro){F.fl.intro=1;say([['Sr. Silva','(mensagem de voz) Gerente. Depois do Conselho, o prédio ganhou um andar que ninguém construiu.'],['Sr. Silva','Dizem que as horas extras não pagas viram monstros. Eu não acredito. Mas desce lá e dá uma olhada.'],'* Ding. Andar Zero. Banco de Horas.','* Há um terminal brilhando ao centro. O elevador não tem botão de subir.'])}})}}
// ---------- loop principal ----------
function upd5(){F.t++;if(updFade())return;
 if(F.ovl)return;
 if(F.toast){F.toast.n--;if(F.toast.n<=0)F.toast=null}
 if(F.dlg){updDlg();return}
 if(F.menu){updMenu();return}
 switch(F.m){case 'title':updTitle();break;case 'ow':updOW();break;case 'enc':updEnc();break;case 'bt':updBt();break;case 'over':updOver();break;case 'crawl':updCrawl();break;case 'emp':case 'ending':break}}
let npS=null;
function draw5(){F.hot=[];const need=(F.m=='ow'&&!F.dlg&&!F.menu&&!F.fd)||(F.m=='bt'&&B&&B.ph=='dodge');if(npS!==!need){npS=!need;document.body.classList.toggle('f5np',npS)}g.globalAlpha=1;
 switch(F.m){case 'title':drawTitle();break;case 'ow':drawOW();break;case 'enc':drawEnc();break;case 'bt':drawBt();break;case 'over':drawOver();break;case 'crawl':drawCrawl();break;case 'emp':drawEmp();break;default:px(0,0,CW,CH,'#000')}
 drawDlg();drawMenu();
 if(F.toast){const w=F.toast.t.length*5+16;box(CW/2-w/2,26,w,16,'#fff','#000');T(F.toast.t,CW/2,31,{al:'center',sz:7})}
 try{if(aq.length){const a=aq[0];a.t--;g.globalAlpha=Math.max(0,Math.min(1,a.t/20,(240-a.t)/20));px(CW/2-96,22,192,22,'#0a0d16');g.strokeStyle='#f1c40f';g.strokeRect(CW/2-95.5,22.5,191,21);g.font='13px sans-serif';g.textAlign='left';g.fillStyle='#fff';g.fillText(a.i,CW/2-88,26);T('CONQUISTA',CW/2-66,26,{sz:6,c:'#f1c40f'});T(a.n,CW/2-66,35,{sz:7});g.globalAlpha=1;if(a.t<=0)aq.shift()}}catch(e){}
 if(F.fd){g.globalAlpha=Math.min(1,F.fd.v);px(0,0,CW,CH,'#000');g.globalAlpha=1}}
// ---------- conquistas ----------
try{[['f5_ini','🏢','Andar Zero','Entre no Banco de Horas.'],['f5_pac','🕊️','Gestão Humanizada','Final pacifista da Fase 5.'],['f5_neu','⚖️','Gestão Mediana','Final neutro da Fase 5.'],['f5_neuK','⏰','Prazo Cumprido','Derrote o Sr. Prazo.'],['f5_geno','💀','Demissão em Massa','Final genocida da Fase 5.'],['f5_die','🔥','Burnout','Perca uma batalha na Fase 5.'],['f5_cafe','☕','Café Quente','Poupe o Café Frio.'],['f5_chat','🤖','Confie, mas confira','Poupe o Chatbot Alucinado.'],['f5_ia','💬','Mentor de Verdade','Faça 3 perguntas ao Mentor IA na Fase 5.'],['f5_fim','🏁','Fim do Andar','Termine a Fase 5.']].forEach(a=>{if(!ACH.some(x=>x[0]==a[0]))ACH.push(a)})}catch(e){}
// ---------- entrada pelo menu ----------
function f5reset(){Object.assign(F,{m:'title',t:0,room:0,px:104,py:112,pd:'r',stp:0,lv:1,exp:0,hp:20,G:0,items:['Cafezinho','Cafezinho','Bolo do RH'],kills:0,spared:0,dead:{},fl:{},dlg:null,menu:null,fd:null,toast:null,ovl:0,crawl:null,aiN:0,enc:null,end:null,deaths:0,seen:{},ents:[]})}
function f5start(){F.on=1;try{run.on=0}catch(e){}M.style.display='none';M.className='';S('F5');document.body.classList.add('f5');document.body.classList.remove('sr');mkMentor();F.t=0;mus('');try{unl('f5_ini')}catch(e){}}
window.f5new=function(){f5reset();f5start()};
window.f5cont=function(){const s=loadG();if(!s)return f5new();f5reset();Object.assign(F,s);F.m='title';F.fl.intro=1;f5start();
 // reentra na sala salva ao confirmar
 const r=F.room;F.room=r};
window.f5menu=function(){const s=loadG();if(!s)return f5new();full('<div class="tag">FASE 5</div><h3>🏢 Andar Zero · O Banco de Horas</h3><p>Exploração top-down, combate clássico, três rotas e finais múltiplos.</p><button onclick="f5cont()">▶ Continuar<small>LV '+s.lv+' · '+(ROOMS[s.room]||{n:''}).n+' · baixas '+s.kills+' · poupados '+s.spared+'</small></button><button onclick="f5new()">🆕 Novo jogo</button><button onclick="mainMenu()">← Voltar</button>')};
const _up5=update;update=function(){if(!F.on)return _up5();poll();upd5();for(const k in P)P[k]=0};
const _dw6=draw;draw=function(){if(!F.on)return _dw6();const k=Math.max(2,RS);g.setTransform(RS,0,0,RS,0,0);g2.setTransform(k/2,0,0,k/2,0,0);g2.clearRect(0,0,800,448);g.imageSmoothingEnabled=false;draw5();try{fpsG()}catch(e){}};
const _mm5=mainMenu;mainMenu=function(){_mm5();try{const p=M.querySelector('p.tag:last-of-type');const h='<button style="border-color:#a45cff" onclick="f5menu()">🏢 Fase 5 · Andar Zero<small>NOVA: aventura top-down estilo Undertale. Combate clássico, poupar ou lutar, rotas pacifista, neutra e genocida.</small></button>';if(p)p.insertAdjacentHTML('beforebegin',h);else M.insertAdjacentHTML('beforeend',h)}catch(e){}};
try{if(M.querySelector('.mm'))mainMenu()}catch(e){}
// ---------- ponteiro/teclado ----------
$('c').addEventListener('pointerdown',e=>{if(!F.on||F.ovl)return;const r=$('c').getBoundingClientRect(),x=(e.clientX-r.left)/r.width*CW,y=(e.clientY-r.top)/r.height*CH;e.preventDefault();
 const h=(F.hot||[]).slice().reverse().find(o=>x>=o.x&&x<=o.x+o.w&&y>=o.y&&y<=o.y+o.h);
 if(h){if(h.m){if(F.menu)F.menu.i=h.i;P.act=1}else if(h.o){if(F.over)F.over.i=h.i;P.act=1}else if(h.f)h.f();else P.act=1}else P.act=1});
addEventListener('keydown',e=>{if(!F.on)return;if(e.key=='Escape'){if(F.ovl){closeMentor();return}P.pause=1;P.atk=1}},true);
// ---------- ganchos de teste ----------
window.__f5={F,get B(){return B},EN,ROOMS,startBattle:(k,id)=>{F.m='bt';startBattle(k,id||k)},enterRoom,endType,startEnding,PAT,rays,bq,mercyDo,gameOver};
})();


