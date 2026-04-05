/* ── CURSOR ── */
const cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
(function animRing(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)})();

/* ── CANVAS PARTICLES ── */
const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');
let W,H,pts=[];
function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight}
resize();window.addEventListener('resize',resize);
for(let i=0;i<90;i++) pts.push({x:Math.random()*2000,y:Math.random()*1200,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.2+.3,a:Math.random()});
function drawParticles(){ctx.clearRect(0,0,W,H);pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(0,180,255,${p.a*.35})`;ctx.fill()});pts.forEach((p,i)=>{pts.slice(i+1).forEach(q=>{const dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);if(d<120){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(26,111,255,${(1-d/120)*.06})`;ctx.lineWidth=.5;ctx.stroke()}})});requestAnimationFrame(drawParticles)}
drawParticles();

/* ── NAV SCROLL ── */
window.addEventListener('scroll',()=>{document.getElementById('nav').classList.toggle('solid',scrollY>60)});

/* ── PAGE ROUTING ── */
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const target=document.getElementById('page-'+id);
  if(target){target.classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
  // Update nav active
  document.querySelectorAll('.nav-link').forEach(a=>{
    a.classList.toggle('active',a.dataset.page===id);
  });
  // Reinit reveal
  setTimeout(initReveal,100);
  // Close mobile nav
  document.getElementById('mobileNav').classList.remove('open');
}

// Delegate all data-page clicks
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-page]');
  if(el){e.preventDefault();showPage(el.dataset.page);}
});

/* ── CLIENT TABS ── */
document.addEventListener('click',e=>{
  const tab=e.target.closest('.clients-tab');
  if(!tab) return;
  const tabId=tab.dataset.tab;
  document.querySelectorAll('.clients-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.client-segment').forEach(s=>s.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById('tab-'+tabId).classList.add('active');
});

/* ── HOVER CURSOR ── */
function addHover(){
  document.querySelectorAll('a,button,.svc-item,.svc-card,.ind-cell,.testi-card,.f-soc,.proc-step,.team-card,.team-founder,.ind-row,.client-logo-cell,.priv-feat,.value-card,.case-study-card,.back-link').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
  });
}
addHover();

/* ── REVEAL ON SCROLL ── */
function initReveal(){
  const revEls=document.querySelectorAll('.page.active .r:not(.on)');
  const io=new IntersectionObserver(entries=>{entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('on')}})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
  revEls.forEach(el=>io.observe(el));
  // Immediately reveal top elements
  setTimeout(()=>{document.querySelectorAll('.page.active .r').forEach((el,i)=>{if(i<8){el.classList.add('on')}})},50);
}
initReveal();

/* ── MOBILE NAV ── */
document.getElementById('hamburger').addEventListener('click',()=>{document.getElementById('mobileNav').classList.add('open')});
document.getElementById('closeMobile').addEventListener('click',()=>{document.getElementById('mobileNav').classList.remove('open')});
