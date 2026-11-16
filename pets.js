/* shared pet engine: loaded by index.html and diary.html */
(function(){
const CSS="#petLayer{position:fixed;inset:0;pointer-events:none;z-index:40;overflow:hidden}\n.pet{position:absolute;left:0;top:0;pointer-events:auto;cursor:grab;touch-action:none;user-select:none;will-change:transform}\n.pet:active{cursor:grabbing}.pet img{width:100%;display:block;transform-origin:50% 100%;filter:drop-shadow(0 3px 4px rgba(0,0,0,.5));-webkit-user-drag:none}\n.pet .bub{position:absolute;left:50%;bottom:100%;transform:translate(-50%,-4px) scale(.7);background:#fff;color:#222;border-radius:12px;padding:3px 9px;font-size:12px;font-weight:600;white-space:nowrap;opacity:0;transition:.15s;pointer-events:none}.pet .bub.on{opacity:1;transform:translate(-50%,-4px) scale(1)}\n#petBtn{position:fixed;right:14px;bottom:14px;z-index:45;width:42px;height:42px;border-radius:50%;background:rgba(20,20,20,.9);border:1px solid #444;font-size:20px;backdrop-filter:blur(6px)}#petBtn:hover{background:#fff}\n#petPanel{position:fixed;right:14px;bottom:64px;z-index:46;width:300px;max-height:70vh;overflow:auto;background:#111;border:1px solid #333;border-radius:16px;padding:14px;box-shadow:0 10px 40px #000}#petPanel[hidden]{display:none}\n.pp-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.pp-row{display:flex;gap:8px;align-items:center;margin:6px 0;font-size:13px}.pp-row input[type=range]{flex:1}.pp-row.sm{font-size:12px;color:var(--mu)}\n.pp-list{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.pp-it{position:relative;background:var(--card2);border-radius:10px;padding:6px;display:flex;flex-direction:column;align-items:center;width:64px}.pp-it img{width:48px;height:48px;object-fit:contain}.pp-it span{font-size:9px;color:var(--mu)}.pp-it button{position:absolute;top:-6px;right:-6px;background:#333;border-radius:50%;width:18px;height:18px;font-size:10px}.pp-empty{color:var(--mu2);font-size:12px}\n.pp-btns{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}.pp-btns button{border:1px solid var(--line);border-radius:10px;padding:7px 6px;font-size:12px}.pp-btns button:hover{background:#fff;color:#000}\n.pp-note{margin-top:10px;font-size:11px;color:var(--mu2)}\n.pet .heart{position:absolute;bottom:78%;font-size:16px;pointer-events:none;animation:heartUp 1.1s ease-out forwards}@keyframes heartUp{0%{opacity:0;transform:translateY(0) scale(.6)}20%{opacity:1}100%{opacity:0;transform:translateY(-46px) scale(1.2)}}\n.bowl{position:absolute;bottom:0;width:60px;height:34px;pointer-events:none}.bowl b{position:absolute;left:0;right:0;bottom:0;height:20px;background:#e0a96d;border-radius:4px 4px 30px 30px;border:2px solid #c98b4d}.bowl .fill{position:absolute;left:6px;right:6px;bottom:18px;background:radial-gradient(circle at 30% 60%,#9a6a3c 0 3px,transparent 3.5px),radial-gradient(circle at 70% 40%,#b07a46 0 3px,transparent 3.5px),#a97444;border-radius:14px 14px 0 0;transition:height .3s}\n#petFeed{position:fixed;right:64px;bottom:14px;z-index:45;width:42px;height:42px;border-radius:50%;background:rgba(20,20,20,.9);border:1px solid #444;font-size:19px;backdrop-filter:blur(6px)}#petFeed:hover{background:#fff}#petFeed[hidden]{display:none}\n.pp-it{width:100%!important;flex-direction:row!important;gap:10px;align-items:center!important}.pp-it .th{width:46px;height:46px;display:grid;place-items:center;font-size:30px;flex:none}.pp-it .th img{width:44px;height:44px;object-fit:contain}\n.pp-it .in{flex:1;min-width:0}.pp-it .nm{padding:3px 7px;font-size:12px;border-radius:8px;margin-bottom:4px}\n.pp-it .bar{display:flex;gap:5px;align-items:center;font-size:10px;margin-top:2px}.pp-it .bar i{flex:1;height:5px;background:#262626;border-radius:9px;overflow:hidden}.pp-it .bar b{display:block;height:100%;background:linear-gradient(90deg,#efb0b0,#abdcc0);border-radius:9px;transition:width .6s}\n.pp-it .tg{font-size:10px;color:var(--mu)}.pp-it .x{position:static!important;background:#2a2a2a!important}\n.pp-list{display:grid!important;gap:8px}.lnk{color:var(--mu);text-decoration:underline;font-size:12px}";
const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
window.initPets=function(ctx){
const {S,save,tl,en,uid,toast,$,esc,L,getThemeId}=ctx;
const curEff={get id(){return getThemeId()}};
/* ---------- 펫: 걷고, 자고, 먹고, 쓰다듬으면 좋아하는 살아있는 펫 ---------- */
S.pets=S.pets||[];S.petStats=S.petStats||{};
const PNAMES={cat:['Nabi','Mochi','Coco','Tora','Nuri'],dog:['Bori','Kongi','Happy','Dubu','Choco'],pet:['Pip','Mimi','Bean','Lulu','Dot']};
const THEME_PETS={chii:['pets/trio-1.png','pets/trio-2.png','pets/trio-3.png'].map((s,i)=>({id:'t-chii'+i,src:s,name:'먼작귀 '+(i+1)})),
  cat:[{id:'t-cat',kind:'cat',color:'orange',name:'Nabi'}],dog:[{id:'t-dog',kind:'dog',color:'brown',name:'Bori'}]};
let petRT=[],petLast=0,petBowl=null,petSaveT=0;
const petLayer=document.createElement('div');petLayer.id='petLayer';document.body.appendChild(petLayer);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const SAY={
 cat:()=>en()?['Meow~','Mrrp?','Purr…','Nya!']:['야옹~','냐앙?','그르릉…','냥!'],
 dog:()=>en()?['Woof!','Arf arf!','Bork?','Woof woof!']:['멍!','왈왈!','멍?','멍멍!'],
 pet:()=>en()?['Hi!','♪','You\'re doing great','Keep going!']:['안녕!','♪','잘하고 있어요','힘내요!']};
const HUNGRY=()=>en()?['I\'m hungry… 🍖','Food? 🍖','Tummy rumbles…']:['배고파요… 🍖','밥 주세요 🍖','꼬르륵…'];
/* ----- 고양이·개를 SVG로 직접 그림 (관절 그룹을 움직여서 걷기·앉기·자기를 표현) ----- */
const PAL={cat:{orange:{b:'#f0b070',s:'#d99250',l:'#fdeacb',e:'#f6b4b4',f:'#d9a063'},gray:{b:'#b5bcc7',s:'#98a1ae',l:'#eceff3',e:'#f3b9c4',f:'#9aa3b0'},cream:{b:'#f1dfc0',s:'#dcc59c',l:'#fff6e4',e:'#f6b9b9',f:'#d9c49f'},dark:{b:'#7b8090',s:'#646979',l:'#c4c7d1',e:'#e7a9b3',f:'#636878'}},
 dog:{brown:{b:'#c99c6e',s:'#a97b4d',l:'#f2dfc4',e:'#93663a',f:'#b3865a'},yellow:{b:'#f0cf8c',s:'#dbb36a',l:'#fff1cf',e:'#d7a95f',f:'#d9b877'},white:{b:'#f6f2ea',s:'#d9ccb0',l:'#ffffff',e:'#cdb99a',f:'#e0d9c8'},gray:{b:'#b7b4ae',s:'#9a968f',l:'#ecebe7',e:'#8f8b84',f:'#a6a39d'}}};
function buildAnimal(kind,color){
  const c=(PAL[kind][color]||Object.values(PAL[kind])[0]),cat=kind==='cat',rx=cat?50:54,ry=cat?23:27;
  const leg=(fill,paw)=>`<rect x="-6" y="-4" width="12" height="42" rx="6" fill="${fill}"/><ellipse cx="2" cy="37.5" rx="10" ry="5.5" fill="${paw}"/>`;
  const tail=cat?`<path d="M0 0 C-20 -6 -28 -34 -12 -58" fill="none" stroke="${c.b}" stroke-width="9" stroke-linecap="round"/><path d="M-13 -52 L-12 -58" stroke="${c.s}" stroke-width="9" stroke-linecap="round"/>`:`<path d="M0 0 C-12 -4 -22 -20 -16 -36" fill="none" stroke="${c.b}" stroke-width="11" stroke-linecap="round"/>`;
  const ears=cat?`<path d="M2 -22 L5 -52 L25 -30 Z" fill="${c.b}"/><path d="M6 -28 L8 -44 L18 -32 Z" fill="${c.e}"/><path d="M22 -30 L38 -52 L42 -20 Z" fill="${c.b}"/><path d="M27 -31 L36 -44 L38 -27 Z" fill="${c.e}"/>`
   :`<ellipse cx="26" cy="-26" rx="8" ry="15" transform="rotate(26 26 -26)" fill="${c.f}"/><ellipse cx="4" cy="-14" rx="11" ry="20" transform="rotate(14 4 -14)" fill="${c.e}"/>`;
  const muzzle=cat?`<ellipse cx="38" cy="-2" rx="13" ry="9" fill="${c.l}"/><path d="M42 -7 L49 -7 L45.5 -3 Z" fill="#f08fa0"/>`:`<ellipse cx="38" cy="-3" rx="17" ry="12" fill="${c.l}"/><ellipse cx="51" cy="-9" rx="5.5" ry="4" fill="#2f2b2b"/>`;
  const whisk=cat?`<g stroke="#8a8a8a" stroke-width="1.1" opacity=".7"><path d="M44 -1 L64 -6"/><path d="M44 1 L65 2"/><path d="M43 3 L62 9"/></g>`:'';
  const stripes=cat?`<g stroke="${c.s}" stroke-width="5" stroke-linecap="round" fill="none" opacity=".8"><path d="M86 62 q4 6 2 12"/><path d="M100 60 q4 6 2 14"/><path d="M114 61 q4 6 2 12"/></g>`:`<ellipse cx="96" cy="76" rx="16" ry="11" fill="${c.s}" opacity=".7"/>`;
  return `<svg class="aml" viewBox="0 0 220 150" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;display:block;width:100%;height:auto">
  <ellipse cx="108" cy="142" rx="64" ry="5" fill="#000" opacity=".3"/>
  <g class="all">
   <g class="tl" transform="translate(58 90)">${tail}</g>
   <g class="hl2" transform="translate(82 96)">${leg(c.f,c.l)}</g><g class="fl2" transform="translate(136 96)">${leg(c.f,c.l)}</g>
   <ellipse cx="104" cy="84" rx="${rx}" ry="${ry}" fill="${c.b}"/><ellipse cx="108" cy="97" rx="${rx-14}" ry="${ry-10}" fill="${c.l}"/>${stripes}
   <g class="hl1" transform="translate(70 96)">${leg(c.b,c.l)}</g><g class="fl1" transform="translate(126 96)">${leg(c.b,c.l)}</g>
   <g class="hd" transform="translate(142 70)">
    ${ears}<ellipse cx="20" cy="-8" rx="${cat?27:25}" ry="${cat?23:21}" fill="${c.b}"/>${muzzle}${whisk}
    <path d="M-12 -2 Q-2 20 16 14" fill="none" stroke="#e8707c" stroke-width="5" stroke-linecap="round"/>
    <g class="eyO"><circle cx="30" cy="-15" r="3.8" fill="#2b2b2b"/><circle cx="31.3" cy="-16.3" r="1.3" fill="#fff"/></g>
    <path class="eyC" d="M25 -15 Q30 -10 35 -15" stroke="#2b2b2b" stroke-width="2.4" fill="none" stroke-linecap="round" style="display:none"/>
    <ellipse cx="25" cy="-4" rx="5" ry="3" fill="#f6a5b0" opacity=".55"/>
    <path d="${cat?'M40 -1 Q45 5 51 -1':'M44 1 Q50 6 57 1'}" stroke="#4a3b3b" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse class="mo" cx="49" cy="3" rx="5.5" ry="4" fill="#d9606e" style="display:none"/>
    <path class="tg" d="M45 3 q3 12 9 4 q-1 -5 -9 -4" fill="#f58a98" style="display:none"/>
   </g>
  </g></svg>`}
function rigOf(svg){const q=s=>svg.querySelector(s);return{all:q('.all'),tl:q('.tl'),hl1:q('.hl1'),hl2:q('.hl2'),fl1:q('.fl1'),fl2:q('.fl2'),hd:q('.hd'),eyO:q('.eyO'),eyC:q('.eyC'),mo:q('.mo'),tg:q('.tg')}}
function animalPose(p,time){
  const R=p.rig,dog=p.def.kind==='dog',sd=p.seed;let by=0,br=0,hl1=0,hl2=0,fl1=0,fl2=0,hr=0,hy=0,tr=0,closed=((time+sd)%4.3)<.13,mo=0,tg=false,hide=false,sy=1;
  switch(p.state){
   case 'idle':tr=Math.sin(time*1.4)*(dog?14:8);hr=Math.sin(time*.6+sd)*5;by=Math.sin(time*2.1)*.7;break;
   case 'sit':br=-22;by=7;fl1=fl2=22;hide=true;tr=Math.sin(time*1.2)*10;hr=Math.sin(time*.5+sd)*5+10;by+=Math.sin(time*2)*.5;break;
   case 'walk':{const ph=time*(5+(p.speed||40)/9),a=26;fl1=Math.sin(ph)*a;hl2=Math.sin(ph)*a;fl2=-Math.sin(ph)*a;hl1=-Math.sin(ph)*a;by=-Math.abs(Math.cos(ph))*2.4;hr=Math.sin(ph*2)*3;tr=Math.sin(time*3)*(dog?20:12);break}
   case 'run':{const ph=time*17,a=44;fl1=Math.sin(ph)*a;hl2=Math.sin(ph)*a;fl2=-Math.sin(ph)*a;hl1=-Math.sin(ph)*a;by=-Math.abs(Math.cos(ph))*5;br=-3;hr=-6;tr=Math.sin(time*9)*(dog?28:16);if(dog){mo=1;tg=true}break}
   case 'sleep':hide=true;by=15+Math.sin(time*1.6)*.9;hr=34;hy=9;closed=true;tr=-34;sy=1+Math.sin(time*1.6)*.015;break;
   case 'eat':hr=36;hy=9;by=3;fl1=-4;fl2=4;mo=Math.sin(time*14)>0?1:0;tr=Math.sin(time*3)*(dog?22:10);closed=false;break;
   case 'petted':closed=true;hr=-6+Math.sin(time*9)*2;by=dog?Math.sin(time*6)*1:Math.sin(time*36)*.7;tr=dog?Math.sin(time*22)*34:Math.sin(time*3)*16;tg=dog;mo=dog?1:0;break;
   case 'hop':fl1=-22;fl2=-14;hl1=26;hl2=18;tr=Math.sin(time*24)*32;hr=-8;mo=dog?1:0;tg=dog;break;
   case 'fall':case 'drag':fl1=Math.sin(time*7)*32;fl2=-Math.sin(time*7)*32;hl1=Math.sin(time*7+1)*26;hl2=-Math.sin(time*7+1)*26;br=Math.sin(time*5)*6;mo=.6;closed=false;tr=Math.sin(time*6)*24;break}
  R.all.setAttribute('transform',`translate(0 ${by.toFixed(1)}) translate(110 140) scale(1 ${sy.toFixed(3)}) translate(-110 -140) rotate(${br} 74 132)`);
  const L=(g,x,a,h)=>{g.setAttribute('transform',`translate(${x} 96) rotate(${a.toFixed(1)})`);g.style.display=h?'none':''};
  L(R.hl1,70,hl1,hide);L(R.hl2,82,hl2,hide);L(R.fl1,126,fl1,false);L(R.fl2,136,fl2,false);
  R.hd.setAttribute('transform',`translate(142 ${(70+hy).toFixed(1)}) rotate(${hr.toFixed(1)})`);
  R.tl.setAttribute('transform',`translate(58 90) rotate(${tr.toFixed(1)})`);
  R.eyO.style.display=closed?'none':'';R.eyC.style.display=closed?'':'none';R.mo.style.display=mo>0?'':'none';R.tg.style.display=tg?'':'none'}
/* ----- 펫 생성·상태 ----- */
function petSize(){return S.petSize||110}
function statsFor(def){const now=Date.now();let s=S.petStats[def.id];
  if(!s){s=S.petStats[def.id]={h:15+Math.random()*20,m:65,t:now}}
  const mins=Math.min(600,(now-(s.t||now))/60000);s.h=Math.min(100,s.h+mins*.5);s.m=Math.max(0,s.m-mins*.3);s.t=now;return s}
function spawnPet(def,theme){
  const el=document.createElement('div');el.className='pet';let vis;
  if(def.kind){const w=document.createElement('div');w.innerHTML=buildAnimal(def.kind,def.color);vis=w.firstElementChild}
  else{vis=document.createElement('img');vis.src=def.src;vis.draggable=false}
  el.appendChild(vis);const bub=document.createElement('span');bub.className='bub';el.appendChild(bub);petLayer.appendChild(el);
  const p={def,theme:!!theme,el,img:vis,bub,x:Math.random()*Math.max(100,innerWidth-250),y:0,vx:0,vy:0,state:'idle',t:Math.random()*1.5,dir:Math.random()<.5?-1:1,hopT:0,hopH:0,hopDur:.6,bubT:0,seed:Math.random()*10,w:petSize(),h:petSize(),speed:40,petAcc:0,petT:0,heartT:0,moodT:30+Math.random()*50,st:statsFor(def),animal:!!def.kind,rig:def.kind?rigOf(vis):null,kind:def.kind||'pet'};
  if(!def.kind)vis.onload=()=>petResize(p);
  el.addEventListener('pointerdown',e=>petDown(p,e));
  el.addEventListener('pointermove',e=>petHover(p,e));
  petRT.push(p);petResize(p);return p}
function petResize(p){p.w=petSize()*(p.animal?1.45:1);p.el.style.width=p.w+'px';
  p.h=p.animal?p.w*150/220:(p.img.naturalWidth?p.w*p.img.naturalHeight/p.img.naturalWidth:p.w)}
function petSpeak(p,txt,dur){p.bub.textContent=txt;p.bub.classList.add('on');p.bubT=dur||1.8}
function petHeart(p){const h=document.createElement('span');h.className='heart';h.textContent=pick(['💗','💕','💖']);h.style.left=(25+Math.random()*50)+'%';p.el.appendChild(h);setTimeout(()=>h.remove(),1200)}
function hour(){return new Date().getHours()}
function petNext(p){
  if(p.st.h>55&&petBowl&&petBowl.food>0&&Math.random()<.9)return goEat(p);
  const night=hour()>=22||hour()<6,r=Math.random(),sl=night?.4:.07;
  if(r<.34){p.state='walk';p.t=2+Math.random()*4;p.dir=Math.random()<.5?-1:1;p.speed=26+Math.random()*34}
  else if(r<.34+.22){p.state=p.animal?'sit':'idle';p.t=2+Math.random()*4}
  else if(r<.56+sl){p.state='sleep';p.t=5+Math.random()*7;petSpeak(p,'z z z',p.t)}
  else if(r<.56+sl+.07){p.state='hop';p.hopT=0;p.hopH=24+Math.random()*26;p.hopDur=.55;p.speed=p.dir*(20+Math.random()*30)}
  else{p.state='idle';p.t=1+Math.random()*2.5}}
function goEat(p){const c=petBowl.x,right=c>p.x+p.w/2;p.dir=right?1:-1;p.tx=right?c-p.w*(p.animal?.8:.55):c-p.w*(p.animal?.2:.45);p.state='run';p.speed=150;p.t=8}
function petHover(p,e){if(p.grab||['drag','fall'].includes(p.state))return;
  const dx=e.movementX||0;p.petAcc+=Math.abs(dx)+Math.abs(e.movementY||0)*.4;
  if(p.petAcc>110){p.petAcc=0;p.petT=1.3;if(p.state!=='petted'&&p.state!=='eat'){p.state='petted'}}}
function petDown(p,e){e.preventDefault();p.el.setPointerCapture(e.pointerId);
  const r=p.el.getBoundingClientRect();p.grab={dx:e.clientX-r.left,dy:e.clientY-r.top,sx:e.clientX,sy:e.clientY,moved:false,lx:e.clientX,ly:e.clientY,lt:performance.now(),vx:0,vy:0,touch:e.pointerType==='touch'};p.state='drag';
  const mv=ev=>{const g=p.grab;if(!g)return;if(Math.abs(ev.clientX-g.sx)+Math.abs(ev.clientY-g.sy)>6)g.moved=true;
    p.x=ev.clientX-g.dx;p.y=innerHeight-(ev.clientY-g.dy)-p.h;const now=performance.now(),dt=Math.max(.001,(now-g.lt)/1000);
    g.vx=(ev.clientX-g.lx)/dt;g.vy=-(ev.clientY-g.ly)/dt;g.lx=ev.clientX;g.ly=ev.clientY;g.lt=now};
  const up=()=>{p.el.removeEventListener('pointermove',mv);p.el.removeEventListener('pointerup',up);p.el.removeEventListener('pointercancel',up);
    const g=p.grab;p.grab=null;
    if(!g.moved){ if(g.touch){p.petT=1.6;p.state='petted'} else{p.state='hop';p.hopT=0;p.hopH=38;p.hopDur=.5;p.speed=0;petSpeak(p,pick(SAY[p.kind]()))} }
    else{p.vx=Math.max(-900,Math.min(900,g.vx*.6));p.vy=Math.max(-600,Math.min(900,g.vy*.6));p.state='fall'}};
  p.el.addEventListener('pointermove',mv);p.el.addEventListener('pointerup',up);p.el.addEventListener('pointercancel',up)}
function petsCheer(){petRT.forEach((p,i)=>setTimeout(()=>{if(['drag','fall'].includes(p.state))return;p.state='hop';p.hopT=0;p.hopH=50;p.hopDur=.6;p.speed=0;petSpeak(p,'🎉',1.6);p.st.m=Math.min(100,p.st.m+8)},i*140))}
/* ----- 밥 주기 ----- */
function feedDrop(){const W=innerWidth;if(petBowl)petBowl.el.remove();
  const el=document.createElement('div');el.className='bowl';el.innerHTML='<i class="fill"></i><b></b>';petLayer.appendChild(el);
  petBowl={x:140+Math.random()*Math.max(60,W-380),food:1,el};bowlRender();
  petRT.forEach(p=>{if(p.st.h>25&&!['drag','fall','eat'].includes(p.state)){setTimeout(()=>{if(petBowl&&p.st.h>25&&!['drag','fall','eat'].includes(p.state)){goEat(p);petSpeak(p,'🍖',1.2)}},300+Math.random()*900)}})}
function bowlRender(){if(!petBowl)return;petBowl.el.style.left=(petBowl.x-30)+'px';petBowl.el.querySelector('.fill').style.height=(Math.max(0,petBowl.food)*13)+'px'}
function bowlRemove(){if(petBowl){petBowl.el.remove();petBowl=null}}
/* ----- 한 프레임 ----- */
function petStep(p,dt,time){
  const W=innerWidth,maxX=Math.max(0,W-p.w);
  p.st.h=Math.min(100,p.st.h+dt*.5/60);p.st.m=Math.max(0,p.st.m-dt*.3/60);
  if(p.bubT>0){p.bubT-=dt;if(p.bubT<=0)p.bub.classList.remove('on')}
  p.moodT-=dt;if(p.moodT<=0){p.moodT=45+Math.random()*60;if(!['sleep','drag','fall'].includes(p.state)){if(p.st.h>65)petSpeak(p,pick(HUNGRY()),2.4);else if(p.st.m<25)petSpeak(p,'💤 …',2)}}
  p.petAcc*=Math.pow(.15,dt);
  if(p.petT>0){p.petT-=dt;if(!['drag','fall','eat','hop'].includes(p.state)&&p.state!=='petted'){p.state='petted'}}
  let sy=1,sx=1,rot=0,lift=0;
  switch(p.state){
    case 'idle':p.t-=dt;sy=1+Math.sin(time*2.2+p.seed)*.018;if(p.t<=0)petNext(p);break;
    case 'sit':p.t-=dt;if(p.t<=0)petNext(p);break;
    case 'sleep':p.t-=dt;sy=.93+Math.sin(time*1.4+p.seed)*.015;rot=-5*p.dir;if(p.t<=0){p.bub.classList.remove('on');petNext(p)}break;
    case 'walk':p.x+=p.dir*p.speed*dt;if(p.x<0){p.x=0;p.dir=1}if(p.x>maxX){p.x=maxX;p.dir=-1}
      rot=Math.sin(time*11+p.seed)*5.5;lift=Math.abs(Math.sin(time*11+p.seed))*5;p.t-=dt;if(p.t<=0){p.state='idle';p.t=.6+Math.random()*1.5}break;
    case 'run':{p.t-=dt;if(!petBowl||petBowl.food<=0){p.state='idle';p.t=.5;break}
      const d=p.tx-p.x;p.dir=d>0?1:-1;const step=Math.min(Math.abs(d),p.speed*dt);p.x+=Math.sign(d)*step;rot=Math.sin(time*18+p.seed)*7;lift=Math.abs(Math.sin(time*18+p.seed))*7;
      if(Math.abs(d)<3){p.state='eat';p.t=4+Math.random()*2}else if(p.t<=0){p.state='idle';p.t=.5}break}
    case 'eat':{p.t-=dt;if(petBowl){petBowl.food=Math.max(0,petBowl.food-dt*.11);bowlRender()}p.st.h=Math.max(0,p.st.h-dt*9);
      sy=1+Math.sin(time*14)*.035;sx=1/sy;rot=4;
      if(p.t<=0||!petBowl||petBowl.food<=0){p.st.m=Math.min(100,p.st.m+6);if(petBowl&&petBowl.food<=0)bowlRemove();p.state='hop';p.hopT=0;p.hopH=22;p.hopDur=.5;p.speed=0;petSpeak(p,en()?'Yum! 😋':'맛있다! 😋',1.6);petHeart(p)}break}
    case 'petted':{p.heartT-=dt;if(p.heartT<=0){p.heartT=.35;petHeart(p)}p.st.m=Math.min(100,p.st.m+dt*12);
      sy=.96+Math.sin(time*13)*.02;rot=Math.sin(time*9)*5;if(p.petT<=0){p.state='idle';p.t=1.2;p.petAcc=0}break}
    case 'hop':{p.hopT+=dt;const u=Math.min(1,p.hopT/p.hopDur);p.y=p.hopH*4*u*(1-u);p.x=Math.max(0,Math.min(maxX,p.x+(p.speed||0)*dt));
      sy=1+(u<.5?.12:-.06)*Math.sin(u*Math.PI);sx=1/sy;if(u>=1){p.y=0;p.state='idle';p.t=.5+Math.random()}break}
    case 'fall':p.vy-=2300*dt;p.y+=p.vy*dt;p.x+=p.vx*dt;p.vx*=.99;rot=Math.max(-18,Math.min(18,p.vx/40));
      if(p.x<0){p.x=0;p.vx=Math.abs(p.vx)*.5}if(p.x>maxX){p.x=maxX;p.vx=-Math.abs(p.vx)*.5}
      if(p.y<=0){p.y=0;if(Math.abs(p.vy)>350){p.vy=-p.vy*.38;p.vx*=.6}else{p.vy=0;p.vx=0;p.state='idle';p.t=.8}}break;
    case 'drag':rot=Math.max(-20,Math.min(20,(p.grab?p.grab.vx:0)/60));break}
  const top=innerHeight-p.h-p.y-lift;
  p.el.style.transform=`translate(${p.x.toFixed(1)}px,${top.toFixed(1)}px)`;
  const flip=p.dir>0?1:-1;
  if(p.animal){p.img.style.transform=`scaleX(${flip})`;animalPose(p,time)}
  else p.img.style.transform=`scaleX(${flip}) rotate(${rot.toFixed(1)}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`}
function petLoop(ts){requestAnimationFrame(petLoop);if(document.hidden||!petRT.length){petLast=ts;return}
  const dt=Math.min(.05,(ts-petLast)/1000||.016);petLast=ts;petRT.forEach(p=>petStep(p,dt,ts/1000));
  petSaveT+=dt;if(petSaveT>15){petSaveT=0;petRT.forEach(p=>{p.st.t=Date.now()});save()}}
requestAnimationFrame(petLoop);
addEventListener('beforeunload',()=>{petRT.forEach(p=>{p.st.t=Date.now()});save()});
window.__pets={rt:()=>petRT,feed:feedDrop,bowl:()=>petBowl};
/* ----- 화면과 저장 목록 맞추기 ----- */
function petsSync(){
  const want=[];if(S.petOn!==false){(THEME_PETS[curEff.id]||[]).forEach(d=>want.push({d,theme:true}));S.pets.forEach(d=>want.push({d,theme:false}))}
  const keyOf=(d,th)=>(th?'T:':'U:')+d.id+'|'+(d.src||'').length+(d.color||'');
  const wantK=new Set(want.map(w=>keyOf(w.d,w.theme)));
  petRT=petRT.filter(p=>{if(wantK.has(keyOf(p.def,p.theme)))return true;p.el.remove();return false});
  const haveK=new Set(petRT.map(p=>keyOf(p.def,p.theme)));
  want.forEach(w=>{if(!haveK.has(keyOf(w.d,w.theme)))spawnPet(w.d,w.theme)});
  petRT.forEach(petResize);$('#petFeed').hidden=!petRT.length;renderPetPanel()}
/* ----- 이미지 → 흰 배경 제거 + 스티커 테두리 (GIF는 그대로 사용) ----- */
function cutoutCanvas(img,opt){
  const MAX=300,s=Math.min(1,MAX/Math.max(img.width,img.height)),W=Math.max(2,Math.round(img.width*s)),H=Math.max(2,Math.round(img.height*s));
  const cv=document.createElement('canvas');cv.width=W;cv.height=H;const ctx=cv.getContext('2d');ctx.drawImage(img,0,0,W,H);
  const im=ctx.getImageData(0,0,W,H),d=im.data;let hasA=false;for(let i=3;i<d.length;i+=4)if(d[i]<250){hasA=true;break}
  if(opt.bg&&!hasA){
    const N=W*H,dark=new Uint8Array(N),bar=new Uint8Array(N);
    for(let i=0;i<N;i++)dark[i]=(d[4*i]*.3+d[4*i+1]*.59+d[4*i+2]*.11)<125?1:0;
    for(let it=0;it<2;it++){const src=it?bar.slice():dark;for(let y=0;y<H;y++)for(let x=0;x<W;x++){let v=0;for(let dy=-1;dy<=1&&!v;dy++)for(let dx=-1;dx<=1;dx++){const yy=y+dy,xx=x+dx;if(yy>=0&&yy<H&&xx>=0&&xx<W&&src[yy*W+xx]){v=1;break}}bar[y*W+x]=v}}
    const bg=new Uint8Array(N),q=[],isW=i=>d[4*i]>232&&d[4*i+1]>232&&d[4*i+2]>232&&!bar[i];
    const push=i=>{if(!bg[i]&&isW(i)){bg[i]=1;q.push(i)}};
    for(let x=0;x<W;x++){push(x);push((H-1)*W+x)}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1)}
    while(q.length){const i=q.pop(),x=i%W,y=(i/W)|0;if(x>0)push(i-1);if(x<W-1)push(i+1);if(y>0)push(i-W);if(y<H-1)push(i+W)}
    for(let i=0;i<N;i++)if(bg[i])d[4*i+3]=0;
    ctx.putImageData(im,0,0)}
  const d2=ctx.getImageData(0,0,W,H).data;let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(d2[4*(y*W+x)+3]>40){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<x0){x0=0;y0=0;x1=W-1;y1=H-1}
  const cw=x1-x0+1,ch=y1-y0+1,pad=opt.outline?6:0,out=document.createElement('canvas');out.width=cw+pad*2;out.height=ch+pad*2;const o=out.getContext('2d');
  if(opt.outline){const sil=document.createElement('canvas');sil.width=out.width;sil.height=out.height;const sc=sil.getContext('2d');sc.drawImage(cv,x0,y0,cw,ch,pad,pad,cw,ch);
    const sd=sc.getImageData(0,0,sil.width,sil.height),a=sd.data,A=new Uint8Array(sil.width*sil.height);for(let i=0;i<A.length;i++)A[i]=a[4*i+3]>40?1:0;
    const R=3,OW=sil.width,OH=sil.height;for(let y=0;y<OH;y++)for(let x=0;x<OW;x++){let hit=A[y*OW+x];for(let dy=-R;dy<=R&&!hit;dy++)for(let dx=-R;dx<=R;dx++){const yy=y+dy,xx=x+dx;if(dx*dx+dy*dy<=R*R&&yy>=0&&yy<OH&&xx>=0&&xx<OW&&A[yy*OW+xx]){hit=1;break}}
      if(hit){const i=4*(y*OW+x);a[i]=255;a[i+1]=255;a[i+2]=255;a[i+3]=255}else a[4*(y*OW+x)+3]=0}
    o.putImageData(sd,0,0)}
  o.drawImage(cv,x0,y0,cw,ch,pad,pad,cw,ch);return out}
function petFromFile(f){return new Promise(res=>{const r=new FileReader();const nm=(f.name||'Pet').replace(/\.[^.]+$/,'').slice(0,12)||'Pet';
  r.onload=()=>{
    if(f.type==='image/gif'){if(r.result.length>1400000){toast(tl('GIF가 너무 커요 (약 1MB 이하로)','GIF is too large (keep it under ~1 MB)'));res(null);return}res({id:uid(),src:r.result,name:nm,gif:true});return}
    const img=new Image();img.onload=()=>{const cv=cutoutCanvas(img,{bg:$('#ppBg').checked,outline:$('#ppOut').checked});res({id:uid(),src:cv.toDataURL('image/png'),name:nm})};img.onerror=()=>res(null);img.src=r.result};
  r.onerror=()=>res(null);r.readAsDataURL(f)})}
/* ----- 펫 설정 패널 + 밥 주기 버튼 ----- */
const pb=document.createElement('button');pb.id='petBtn';pb.type='button';pb.title='Pets';pb.textContent='🐾';document.body.appendChild(pb);
const pf=document.createElement('button');pf.id='petFeed';pf.type='button';pf.hidden=true;pf.title='Feed';pf.textContent='🍖';document.body.appendChild(pf);
const pp=document.createElement('div');pp.id='petPanel';pp.hidden=true;document.body.appendChild(pp);
pf.onclick=feedDrop;
function barsHTML(p){return `<div class="bar"><span>🍖</span><i><b data-h="${p.def.id}" style="width:${Math.round(100-p.st.h)}%"></b></i></div><div class="bar"><span>💗</span><i><b data-m="${p.def.id}" style="width:${Math.round(p.st.m)}%"></b></i></div>`}
function renderPetPanel(){
  if(!pp.hidden&&pp.contains(document.activeElement)&&document.activeElement.tagName==='INPUT'&&document.activeElement.type==='text')return;
  pp.innerHTML=`<div class="pp-h"><b>🐾 ${tl('펫','Pets')}</b><button type="button" data-pp="close">✕</button></div>
  <label class="pp-row"><input type="checkbox" id="ppOn" ${S.petOn!==false?'checked':''}> ${tl('펫 보이기','Show pets')}</label>
  <label class="pp-row">${tl('크기','Size')}<input type="range" id="ppSize" min="60" max="240" value="${petSize()}"><span>${petSize()}px</span></label>
  <div class="pp-list">${petRT.map(p=>`<div class="pp-it"><div class="th">${p.animal?(p.kind==='cat'?'🐱':'🐶'):`<img src="${p.def.src}" alt="">`}</div><div class="in"><input type="text" class="nm" data-nm="${p.def.id}" value="${esc(S.petNames&&S.petNames[p.def.id]||p.def.name||'Pet')}" maxlength="14">${barsHTML(p)}</div>${p.theme?`<span class="tg">${tl('테마','theme')}</span>`:`<button type="button" class="x" data-pp="del" data-id="${p.def.id}">✕</button>`}</div>`).join('')||`<div class="pp-empty">${tl('아직 펫이 없어요. 아래에서 추가해 보세요.','No pets yet. Add one below.')}</div>`}</div>
  <div class="pp-btns"><button type="button" data-pp="feed">🍖 ${tl('밥 주기','Feed')}</button><button type="button" data-pp="call">${tl('모두 불러오기','Call back')}</button><button type="button" data-pp="cat">＋ 🐱 ${tl('고양이','Cat')}</button><button type="button" data-pp="dog">＋ 🐶 ${tl('개','Dog')}</button><button type="button" data-pp="add">＋ ${tl('이미지 · GIF 추가','Add image / GIF')}</button><button type="button" data-pp="trio">＋ ${tl('먼작귀 3마리','3 pets (먼작귀)')}</button></div>
  <label class="pp-row sm"><input type="checkbox" id="ppBg" checked> ${tl('흰 배경 제거 (이미지)','Remove white background (images)')}</label>
  <label class="pp-row sm"><input type="checkbox" id="ppOut" checked> ${tl('흰 스티커 테두리','White sticker outline')}</label>
  <div class="pp-row sm"><button type="button" class="lnk" data-pp="clear">${tl('내 펫 모두 삭제','Remove all mine')}</button></div>
  <input type="file" id="ppFile" accept="image/*" multiple hidden>
  <div class="pp-note">${tl('마우스를 펫 위에서 쓱쓱 움직이면 쓰다듬기, 클릭은 콕 찌르기, 끌어서 던질 수도 있어요. 밥을 주면 배고픈 펫이 달려와 먹어요. GIF를 올리면 그 캐릭터도 똑같이 쓰다듬고 밥을 줄 수 있어요.','Rub the mouse over a pet to pet it, click to poke, drag to throw. Hungry pets run to the bowl. Add a GIF and that character can be petted and fed too.')}</div>`;
  $('#ppOn').onchange=e=>{S.petOn=e.target.checked;save();petsSync()};
  $('#ppSize').oninput=e=>{S.petSize=+e.target.value;save();petRT.forEach(petResize);e.target.nextElementSibling.textContent=S.petSize+'px'};
  $('#ppFile').onchange=async e=>{for(const f of e.target.files){const d=await petFromFile(f);if(d)S.pets.push(d)}e.target.value='';save();petsSync()};
  pp.querySelectorAll('[data-nm]').forEach(i=>i.onchange=()=>{S.petNames=S.petNames||{};S.petNames[i.dataset.nm]=i.value.trim()||'Pet';save()})}
setInterval(()=>{if(pp.hidden)return;petRT.forEach(p=>{const h=pp.querySelector(`[data-h="${p.def.id}"]`),m=pp.querySelector(`[data-m="${p.def.id}"]`);if(h)h.style.width=Math.round(100-p.st.h)+'%';if(m)m.style.width=Math.round(p.st.m)+'%'})},1000);
pb.onclick=()=>{pp.hidden=!pp.hidden;if(!pp.hidden)renderPetPanel()};
const addAnimal=kind=>{const cols=Object.keys(PAL[kind]);S.pets.push({id:uid(),kind,color:pick(cols),name:pick(PNAMES[kind])});S.petOn=true;save();petsSync()};
pp.addEventListener('click',e=>{const b=e.target.closest('[data-pp]');if(!b)return;const k=b.dataset.pp;
  if(k==='close')pp.hidden=true;
  else if(k==='add')$('#ppFile').click();
  else if(k==='cat'||k==='dog')addAnimal(k);
  else if(k==='feed')feedDrop();
  else if(k==='trio'){THEME_PETS.chii.forEach(d=>{if(!S.pets.some(x=>x.src===d.src))S.pets.push({id:uid(),src:d.src,name:d.name})});S.petOn=true;save();petsSync()}
  else if(k==='call'){petRT.forEach(p=>{p.x=innerWidth/2-p.w/2+(Math.random()-.5)*240;p.y=0;p.state='hop';p.hopT=0;p.hopH=30;p.hopDur=.5;p.speed=0})}
  else if(k==='clear'){S.pets=[];save();petsSync()}
  else if(k==='del'){S.pets=S.pets.filter(d=>d.id!==b.dataset.id);save();petsSync()}});

function renderAll(){renderTasks();renderCal();renderGoals();renderRoutines();renderMonth();renderTT();renderProg();renderMemo()}

return {petsSync};
};
})();
