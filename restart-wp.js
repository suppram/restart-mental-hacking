/* RESTART — 1:1 behavior bundle for the Elementor page (post 352420).
   Served from Vercel; frames + posters also load from Vercel (temporary, swap VBASE later).
   No-ops unless the page contains .elementor-352420. */
(function(){
'use strict';
/* Runs on the original RESTART page AND any 1:1 duplicate (same element IDs, different post id).
   Guard on a shared element (hero 266cae3); ensure the `.elementor-352420` CSS scope is present so
   all the scoped CSS applies on the duplicate too. */
if(!document.querySelector('.elementor-element-266cae3')) return;
var rstRoot=document.querySelector('.elementor[data-elementor-id]');
if(rstRoot) rstRoot.classList.add('elementor-352420');
/* load the paired stylesheet (Elementor strips @import from custom CSS) */
var lnk=document.createElement('link');
lnk.rel='stylesheet';
lnk.href='https://cdn.jsdelivr.net/gh/suppram/restart-mental-hacking@v4/restart-wp.css';
document.head.appendChild(lnk);
var VBASE='https://cdn.jsdelivr.net/gh/suppram/restart-mental-hacking@v1/media/';
var reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
var mobile=matchMedia('(max-width:700px)').matches;

/* ==================== scroll-driven image sequence (verbatim port) ==================== */
function initSeq(section, dir, frameCount, zoom){
  zoom=zoom||0;
  var canvas=section.querySelector('.seq-canvas'), poster=section.querySelector('.seq-poster');
  if(reducedMotion||mobile||!canvas){ if(canvas) canvas.remove(); return; }
  var ctx=canvas.getContext('2d');
  var frames=new Array(frameCount), loaded=0, ready=false, visible=false, cur=0, raf=null;
  var src=function(i){return VBASE+dir+'/frame_'+String(i).padStart(3,'0')+'.webp'};
  var cw=0, ch=0;
  function size(){
    cw=canvas.clientWidth*devicePixelRatio; ch=canvas.clientHeight*devicePixelRatio;
    canvas.width=cw; canvas.height=ch;
  }
  function drawImg(img, alpha, z){
    var s=Math.max(cw/img.naturalWidth, ch/img.naturalHeight)*(z||1);
    var w=img.naturalWidth*s, h=img.naturalHeight*s;
    ctx.globalAlpha=alpha;
    ctx.drawImage(img,(cw-w)/2,(ch-h)/2,w,h);
  }
  function render(f){
    var i=Math.floor(f), frac=f-i;
    var a=frames[Math.min(i,frameCount-1)], b=frames[Math.min(i+1,frameCount-1)];
    if(!a||!a.naturalWidth) return;
    var z=1+zoom*(f/(frameCount-1));
    drawImg(a,1,z);
    if(frac>0.02 && b && b.naturalWidth && b!==a) drawImg(b,frac,z);
    ctx.globalAlpha=1;
  }
  var pinned=section.classList.contains('rst-hero-pin');
  var s1=pinned?section.querySelector('.hero-inner'):null;
  var s2=pinned?section.querySelector('.hero-slide2'):null;
  var cue=pinned?section.querySelector('.scroll-cue'):null;
  function progress(){
    var r=section.getBoundingClientRect();
    if(pinned) return Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));
    return Math.min(1,Math.max(0,(innerHeight-r.top)/(r.height+innerHeight)));
  }
  function choreo(p){
    if(!pinned) return;
    var k1=Math.min(1,Math.max(0,(p-.15)/.17));
    s1.style.opacity=(1-k1).toFixed(3);
    s1.style.transform='translateY('+(-k1*90).toFixed(1)+'px)';
    s1.style.pointerEvents=k1>.85?'none':'';
    var k2=Math.min(1,Math.max(0,(p-.40)/.12));
    s2.style.opacity=k2.toFixed(3);
    s2.style.transform='translateY('+((1-k2)*40).toFixed(1)+'px)';
    if(cue) cue.style.opacity=p>.06?'0':'';
  }
  function loop(){
    if(!visible||!ready){ raf=null; return; }
    var p=progress();
    var target=p*(frameCount-1);
    cur+=(target-cur)*0.16;
    if(Math.abs(target-cur)<0.01) cur=target;
    render(cur);
    choreo(p);
    raf=requestAnimationFrame(loop);
  }
  function start(){ if(!raf && visible && ready) raf=requestAnimationFrame(loop); }
  new IntersectionObserver(function(es){ visible=es[0].isIntersecting; start(); },{rootMargin:'10% 0px'}).observe(section);
  addEventListener('resize',function(){ size(); if(ready) render(cur); },{passive:true});
  var lo=new IntersectionObserver(function(es){
    if(!es[0].isIntersecting) return; lo.disconnect();
    size();
    for(var i=0;i<frameCount;i++){
      (function(i){
        var img=new Image();
        img.onload=function(){
          if(++loaded===frameCount){
            ready=true; cur=progress()*(frameCount-1); render(cur);
            if(poster){poster.style.transition='opacity .6s'; poster.style.opacity=0;}
            start();
          }
        };
        img.onerror=function(){ loaded++; };
        img.src=src(i); frames[i]=img;
      })(i);
    }
  },{rootMargin:'60% 0px'});
  lo.observe(section);
}

/* ==================== desktop: inject the pinned hero, hide Elementor hero+intro ==================== */
if(!mobile && !reducedMotion){
  var elHero=document.querySelector('.elementor-element-266cae3');
  if(elHero){
    document.body.classList.add('rst-scrub');
    var pin=document.createElement('section');
    pin.className='rst-hero-pin';
    pin.id='rst-hero';
    pin.innerHTML=
      '<div class="hero">'+
        '<img class="seq-poster" data-par="-16" src="'+VBASE+'hero-key2.webp" alt="" aria-hidden="true">'+
        '<canvas class="seq-canvas" data-par="-16" aria-hidden="true"></canvas>'+
        '<div class="hero-inner">'+
          '<div class="hero-word rv d1">RESTART</div>'+
          '<p class="hero-tag rv d1">להבין. לשנות. לצמוח. בכל תחום בחיים.</p>'+
          '<h1 class="rv d2">כדי לעשות שינוי (שמתמיד) בחיים —<br>צריך שיטה שעובדת. <span class="amber">נקודה.</span></h1>'+
          '<p class="hero-sub rv d3">הקושי לשנות הרגלים ולהתמיד הוא לא חולשה, לא חוסר מוטיבציה וגם לא עניין של אופי. <b>זה מנגנון. ויש לו פתרון.</b></p>'+
          '<div class="hero-ctas rv d4">'+
            '<a class="rbtn rbtn-gold" href="#enroll">אני רוצה להצטרף לקורס הבא ←</a>'+
            '<a class="rbtn rbtn-ghost" href="#fre">להכיר את השיטה</a>'+
          '</div>'+
        '</div>'+
        '<div class="hero-slide2">'+
          '<p class="pitch">RESTART הוא קורס עומק בן 12 מפגשים בשיטת F.R.E, שמלמד אותך להבין את המנגנון הפנימי שמחזיר אותך שוב ושוב לאותם דפוסים — ולשלוט בו בצורה מודעת.</p>'+
          '<p class="pitch2">לא עוד מלחמה עצמית. לא עוד ״ממחר״.<br>הפעם עובדים על השורש.</p>'+
        '</div>'+
        '<div class="scroll-cue"><span>גלול</span><span>↓</span></div>'+
      '</div>';
    elHero.parentNode.insertBefore(pin,elHero);
    requestAnimationFrame(function(){
      pin.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')});
    });
    initSeq(pin,'hero-frames-key',152);
  }
}

/* mobile: flowing 45deg gradient layer inside the Elementor hero */
if(mobile && !reducedMotion){
  var mh=document.querySelector('.elementor-element-266cae3');
  if(mh){
    var fl=document.createElement('i');
    fl.className='rst-flow';
    fl.setAttribute('aria-hidden','true');
    mh.prepend(fl);
  }
}

/* ==================== FRE background sequence ==================== */
(function(){
  var fre=document.querySelector('.elementor-element-457933d');
  if(!fre||mobile||reducedMotion) return;
  var poster=document.createElement('img');
  poster.className='seq-poster'; poster.alt=''; poster.setAttribute('aria-hidden','true');
  poster.src=VBASE+'fre-poster.webp';
  var canvas=document.createElement('canvas');
  canvas.className='seq-canvas'; canvas.setAttribute('aria-hidden','true');
  fre.prepend(canvas); fre.prepend(poster);
  initSeq(fre,'fre-frames',72);
})();

/* ==================== magic-text word reveal (Yigal quote) ==================== */
(function(){
  var mq=document.querySelector('.elementor-element-a2f0d0a .elementor-heading-title');
  if(!mq||reducedMotion) return;
  mq.classList.add('rst-mq');
  var words=mq.textContent.trim().split(/\s+/);
  mq.setAttribute('aria-label',mq.textContent.trim());
  mq.innerHTML=words.map(function(w){return '<span class="mw" aria-hidden="true"><span class="g">'+w+'</span><span class="w">'+w+'</span></span>'}).join('');
  var ws=[].slice.call(mq.querySelectorAll('.mw .w'));
  var upd=function(){
    var r=mq.getBoundingClientRect();
    var p=Math.min(1,Math.max(0,(innerHeight*0.9-r.top)/(innerHeight*0.65)));
    var n=ws.length;
    for(var i=0;i<n;i++) ws[i].style.opacity=Math.min(1,Math.max(0,(p-i/n)*n)).toFixed(2);
  };
  addEventListener('scroll',upd,{passive:true});
  addEventListener('resize',upd,{passive:true});
  upd();
})();

/* ==================== pointer-tracked glow ring ==================== */
if(!reducedMotion && matchMedia('(pointer:fine)').matches){
  var glowSel=['af15ad2','74c1a27','8b9d8ea','95b7db9','538b346','a0b7816','b90a7f5','9bd8338','91c40bd','84b830a','5a54be8','b5f8da1','c7eb102','72adbec']
    .map(function(id){return '.elementor-element-'+id}).join(',');
  var gcards=[].slice.call(document.querySelectorAll(glowSel));
  gcards.forEach(function(c){c.classList.add('rst-glow')});
  if(gcards.length){
    var gst=gcards.map(function(){return {cur:0,tgt:0,act:0}});
    addEventListener('pointermove',function(e){
      gcards.forEach(function(c,i){
        var r=c.getBoundingClientRect();
        var cx=r.left+r.width/2, cy=r.top+r.height/2;
        var inact=.5*Math.min(r.width,r.height)*.5, prox=72;
        var d=Math.hypot(e.clientX-cx,e.clientY-cy);
        var active=e.clientX>r.left-prox&&e.clientX<r.right+prox&&e.clientY>r.top-prox&&e.clientY<r.bottom+prox&&d>inact;
        gst[i].act=active?1:0;
        if(active){
          var t=180*Math.atan2(e.clientY-cy,e.clientX-cx)/Math.PI+90;
          var diff=((t-gst[i].cur+180)%360)-180;
          gst[i].tgt=gst[i].cur+diff;
        }
      });
    },{passive:true});
    (function gLoop(){
      gcards.forEach(function(c,i){var s0=gst[i];s0.cur+=(s0.tgt-s0.cur)*.09;c.style.setProperty('--start',s0.cur.toFixed(1));c.style.setProperty('--active',s0.act)});
      requestAnimationFrame(gLoop);
    })();
  }
}

/* ==================== original icon swap (domains / growth / fair) ==================== */
(function(){
  var IC={
    dumbbell:'<path d="M6.5 6.5 17.5 17.5M21 21l-1.5-1.5M3 3l1.5 1.5M18 22l4-4M2 6l4-4M3.5 12.5 12 21l-1 1-8.5-8.5zM12 3l8.5 8.5 1-1L13 2z"/>',
    apple:'<path d="M12 6c1-3 4-4 6-3-0 2-1 4-3 5m-3-2c-4-2-9 1-9 6 0 5 4 10 7 10 1.5 0 2-1 3-1s1.5 1 3 1c3 0 6-5 6-10 0-4-4-7-7-6-1 .4-2 1-3 1z"/>',
    briefcase:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/>',
    heart:'<path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7z"/>',
    wallet:'<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>',
    book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    seedling:'<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
    leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    tree:'<path d="M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z"/><path d="M12 19v3"/>',
    calcheck:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>',
    receipt:'<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8M12 6v12"/>',
    chainbroken:'<rect x="3" y="5" width="10.5" height="6.5" rx="3.25" transform="rotate(45 8 8)"/><rect x="10.5" y="12.5" width="10.5" height="6.5" rx="3.25" transform="rotate(45 16 16)"/>'
  };
  var MAP=[
    ['7836c17','dumbbell','#D8B87E'],['78055e6','apple','#D8B87E'],['d214b26','briefcase','#D8B87E'],
    ['9bdf9ad','heart','#D8B87E'],['baee09a','wallet','#D8B87E'],['d458ebb','book','#D8B87E'],['cb6494f','chainbroken','#D8B87E'],
    ['b5f8da1','seedling','#2FA46E'],['c7eb102','leaf','#2FA46E'],['72adbec','tree','#2FA46E'],
    ['909e057','calcheck','#6C4FA1'],['67c62a4','shield','#6C4FA1'],['f0bc437','receipt','#6C4FA1']
  ];
  MAP.forEach(function(m){
    var host=document.querySelector('.elementor-element-'+m[0]+' .elementor-icon');
    if(!host) return;
    host.classList.add('rst-ic');
    host.style.color=m[2];
    host.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+IC[m[1]]+'</svg>';
  });
})();

/* ==================== press laurels ==================== */
(function(){
  var W1='M892.6,358.7c-2.45,21.69-26.03,75.09-50.59,78.41-2.61.35-8.8-.53-10.21.3-.39.23-4.32,6.79-4.75,7.74-6.88,15.27-11.04,42.49-17.43,60.57-2.66,7.51-9.87,21.35-11.03,27.98-.1.58-.26,1.65.51,1.5,6.6-6.88,8.6-17.3,13.33-25.67,13.94-24.66,43.3-43.5,72.17-42.32-2.33,14.6-10.5,29.43-19.18,41.31-12.47,17.06-30.45,32.62-53.23,29.6-7.56-1-6.85-5.3-14.59,1.58-6.35,5.64-9.71,15.53-14.19,22.81-9.91,16.12-20.19,32.01-32.8,46.2,4.66.89,8.76-7.66,11.97-11.03,11.14-11.72,21.81-19.57,38.02-22.98,15.67-3.3,37.45-3.14,52.02,4.03-12.24,25.25-57.46,51.32-84.7,41.67-7.61-2.7-12.94-10.13-22.06-6.43-18.34,18.87-38.7,35.14-61.25,48.75,4.97,1.57,9.28-3.53,13.32-5.68,20.73-11.01,32.74-14.63,56.5-9.15,13.85,3.19,26.55,9.91,38.17,17.82-19.09,21.89-75.53,31.43-97.49,11.5-3.79-3.44-5.4-10.28-10.95-11.04-9.07-1.24-22.07,6.8-31.04,10.07-3.69,1.34-27.01,9.51-28.52,7.99.06-2.6-.8-5.29,1.57-6.93,1.5-1.04,17.65-4.87,21.68-6.32,8.48-3.06,22.88-8.38,30.46-12.54,9.12-5.01,2.78-21.66,2.3-29.72-1.18-19.76,7.83-43.47,20.48-58.5,1.79-2.13,19.39-19.37,21.51-16.98-2.82,28.58.11,60.88-19.03,84.46-2.69,3.03-6.49,6.06-10.06,7.94-4.12,2.16-9.31.65-8.9,7.59,1.27,1.23,11.02-5.38,12.91-6.58,10.31-6.56,22.01-15.72,31.1-23.9,2.59-2.34,19.93-19.11,20.44-20.46.23-.63-.39-11.92-.68-13.33-1.18-5.83-6.95-13.96-8.5-21.5-3.96-19.28-2.28-43.2,4.96-61.49,3.45-8.71,9.01-17.74,15.27-24.73,2.9,17.5,8.39,36.08,10.37,53.62,1.87,16.52.69,35.79-10.9,48.86-4.62,5.21-9.96,5.2-7.97,14.52,13.17-15.31,24.53-32.58,34.16-50.33,1.99-3.66,9.61-17.17,9.7-20.13.33-10.18-12.65-21.57-17.05-30.87-11.72-24.78-14.73-58.69-5.28-84.63.71-1.96,1.42-5.12,3.44-6.04,12.22,32.23,38.76,63.84,24.79,100.27-2.31,6.03-7.68,8.74-4.76,15.73,1.54-.25,1.89-1.87,2.47-3.02,7.87-15.49,14.88-42.87,18.84-60.16,1.87-8.16,6.12-21.11,2.85-28.5-4.29-9.69-11.33-11.15-18.64-17.35-24.62-20.88-33.84-58.75-31.52-89.97,1.97-.51,1.93.81,2.81,1.68,20.75,20.47,53.85,55.45,49.12,86.75-.44,2.9-3.52,7.02-3.71,9.23s2.82,4.83,2.79,7.33c1.42,1.39,1.82-.07,1.99-1.48.8-6.86,1.5-14.15,1.99-21.03,1.05-14.96,1.76-33.12,1.05-48.03-.45-9.51-.5-18.45-7.5-25.5-4.23-4.26-9.74-3.95-14.91-6.09-28.89-12.01-48.06-49.12-49.88-79.13-.07-1.11-2.03-1.97.73-1.73,23.64,16.34,59.89,35.61,63.41,67.59.81,7.39-3.03,17.42,5.1,20.39-.84-15.5-4.12-31.76-7.48-47.01-1.91-8.66-8.25-37.76-12.65-43.35-6.39-8.12-14.14-3.87-22.25-4.75-21.82-2.37-43.12-23.21-53.78-41.22-3.02-5.1-7.72-13-7.34-18.66,29.71,10.05,66.39,12.92,75.07,48.93,1.39,5.76-1.51,11.75,7.44,11.05-9.45-25.34-21.53-49.48-34.15-73.34-9.49-11.1-18.29-1.46-29.31-.62-24.24,1.85-49.97-15.79-62.53-35.54,12.16-1.78,27.18-2.45,39.53-1.53,14.47,1.07,29.13,6.2,36.65,19.35,3.12,5.45,2.93,14.34,10.8,11.68-7.94-13.11-17.24-26.37-27.04-38.45-2.54-3.14-13.54-16.92-15.98-18.02-7.78-3.53-11.89,2.2-17.3,4.66-22.22,10.12-48.27,3.4-65.69-12.67-1.12-1.03-7.02-6.35-5.98-7.51,17.62-2.11,36.48-11.68,54.24-7.75,8.57,1.89,16.8,6.91,22.19,13.81,2.88,3.69.83,6.42,7.06,6.94,1.49.12,2.92.63,2.49-1.49-8.92-8.7-17.38-18.05-26.98-26.03-3.66-3.04-13.47-11.25-17.29-12.71-4.55-1.73-10.25-.33-15.11-.89-27.28-3.12-48.71-29.1-57.58-53.4,1.55-2.18,1.45-.91,2.6-.65,29.66,6.66,68.48,16.71,70.87,53.16,21.14,14.84,39.62,33.01,57,52,.62-8.81-9.38-14.38-14.48-20.52-19.56-23.59-25.5-58.58-24.02-88.47.68-.79,10.44,7.02,11.52,7.97,20.16,17.57,37.02,49.29,34.52,76.57-1,10.9-9.52,15.89-4.29,28.21,1.81,4.26,14.83,18.08,18.66,23.34,9.6,13.17,19.55,27.31,26.6,41.91,1.62.09,2.24.49,1.98-1.47-.48-3.57-9.92-18.62-12.17-23.85-11.51-26.81-14.45-60.89-2.88-88.23.37-.88.81-2.87,2.06-1.96,9.94,12.98,16.87,28.86,21.49,44.52,5.8,19.65,9.83,40.98.04,60.03-1.45,2.82-4.93,5.59-5.48,8.51-2.09,11.08,6.07,21.31,10.12,30.78,7.21,16.81,14.1,33.95,18.83,51.67,1.58-.05,1.97-4.44,1.92-5.42-.27-5.28-7.25-19.63-8.64-27.37-4.67-26.05-2.53-50.65,10.53-73.88,1.45-2.57,4.8-8.51,6.73-10.28,1.69-1.54,1.69-.41,2.66,1.23,12.28,20.79,17.41,81.23,2.78,101.21-2.35,3.21-9.25,7.51-10.45,9.55-.39.66-3.05,12.36-3.11,13.43-.35,5.98,7.73,33.4,9.25,42.34,2.02,11.93,3.48,24.11,4.32,36.18,2.19-.58,1.95-2.71,2.05-4.46.4-6.52-1.93-15.33-2.11-22-.88-33.13,13.53-64.28,38.54-85.52,1.65-.03,3.41,14.23,3.55,16.43,1.54,24.35-4.14,74.1-26.52,88.57-6.99,4.52-12.38,3.46-14.29,13.71-2.29,12.31,3.05,32.46.81,45.81l-4.03,40.46c4.58-3.93,3.21-12.03,4.24-17.25,6.58-33.49,28.21-64.47,60.75-76.75-.37,4.65.51,9.94,0,14.5Z';
  var W2='M122.6,347.7c-1.7,17.7-14.14,47.55-26.48,60.52-5.79,6.09-14.83,9.27-20.05,15.95-7.2,9.23-5.11,14.49-3.18,25.23,4.49,25.1,12.63,50.47,22.72,73.79,1.68-.31,2.16-5.36,2.02-6.44-.24-1.76-4.97-6.9-6.22-9.86-8.94-21.17-.97-44.77,8.01-64.37l18.18-35.83c12.17,28.27,10.36,66.34-4.83,93.18-4.82,8.52-16.69,18.39-14.52,29.1.83,4.09,6.01,13.72,8.18,17.9,9.33,17.95,21.89,36.15,35.16,51.33,1.78-8.72-2.17-7.86-6.5-12.99-25.68-30.41-7.81-69.51-2-104.01,20.14,23.8,27.35,62.58,18.27,92.26-3.14,10.27-9.76,17.88-6.25,29.71,18.74,19.75,39.22,38.23,63.47,51.02.89-8.43-5.47-6.33-10.34-9.15-4.61-2.67-12.11-11.32-15.06-15.94-13.97-21.88-9.34-50.93-13.57-75.43,4.11-.29,10.26,4.82,13.45,7.55,18.34,15.69,31.07,45.29,29.51,69.46-.49,7.59-5.43,18.51-.47,25.5,1.35,1.9,21.37,10.31,25.22,11.78,9.94,3.8,20.08,6.73,30.28,9.72l.98,7.51c-7.54-2.18-15.1-4.36-22.51-6.98-7.88-2.79-24.11-11.27-30.95-12.04-11.89-1.35-11.52,5.99-19.05,12-20.85,16.65-61.75,9.86-83.5-2.46-2.07-1.18-13.19-7.73-11.54-10.53,21.13-14.47,48.69-24.76,74.34-17.26,10.95,3.2,20.18,11.91,29.19,14.81,1.02.33,5.04,1.53,5.02-.51-11.82-6.39-24.42-14.2-34.91-22.59-6.02-4.82-23.27-23.82-27.5-25.5-9.8-3.9-9.91.63-16.9,4.26-26.89,13.94-71.69-11.42-87.08-34.28-1.05-1.55-3.6-3.96-2.17-5.96,3.81-5.34,36.79-5.58,43.94-4.81,18.64,1.99,33.72,11.44,46.14,24.86,3.15,3.4,6.26,11.64,11.48,10.52-10.1-11.12-19.65-23.71-27.41-36.58-5-8.3-11.58-25.16-17.59-31.41-7.79-8.1-10.21-3.34-18.5-2.52-24.7,2.44-44.75-17.93-56.91-37.07-6.3-9.93-12.8-22.08-13.59-33.92,33.98-.41,60.36,19.86,75.52,48.98,3.34,6.42,4.42,14.83,10.47,19.02-6.28-16.37-13.32-32.34-18.26-49.23s-6.28-33.8-14.89-48.61c-33.08,1.59-49.47-37.67-57.35-64.16-2.91-9.81-5.26-18.73-3.5-28.99,26.83,9.2,52.19,40.65,58.53,67.96,1.93,8.33.98,19.55,6.46,26.03-5.71-27.36-4-55.47-3.25-83.24-.33-2.46-2.64-10.16-4.27-11.73-1.84-1.78-8.46-3.44-11.41-5.59-21.82-15.94-28.32-68.11-24.94-92.82.26-1.88,2.02-11.61,3.38-11.6,24.77,21.31,40.05,54.58,38.49,87.47-.37,7.9-3.74,17.25-1.49,24.51,1.87-1.18,1.21-2.88,1.51-4.49,2.56-13.9,3.69-28.54,6.31-42.69,1.26-6.78,7.5-26.71,7.24-31.33-.05-.87-2.77-11.88-3.12-12.42-.93-1.43-6.38-5.09-8.41-7.59-17.02-20.94-12.69-82.05.77-104.18.86-1.41,1.09-3.01,2.65-1.25,3.37,3.78,8.96,15.02,11.03,19.97,8.44,20.2,10.18,39.73,6.24,61.21-1.57,8.58-8.23,23.74-8.7,30.39-.09,1.31.19,5.98,1.96,6.38,2.2-9.93,5.59-20.68,9.26-30.24,4.82-12.57,15.43-28.92,18.49-40.51.76-2.89,1.78-9.95,1.23-12.72-.47-2.38-6.17-8.59-7.75-12.24-9.36-21.65.56-56.02,9.6-76.95.98-2.26,12.81-26.07,15.16-24.32,12.15,28.6,10.64,62.39-1.81,90.67-2.46,5.58-10.57,17.48-11.2,21.81-.14.96-.63,3.81,1.01,3.51,4.3-10.16,10.59-19.63,16.79-28.71,6.7-9.82,24.02-28.29,27.92-37.08,5.11-11.53.33-12.38-2.74-21.66-7.05-21.37,8.26-54.53,22.07-71.01,3.38-4.04,17.33-17.9,21.49-19.52,1.73-.68,1.35.43,1.49,1.47,3.89,29.17-8.37,67.53-27.03,89.99-4.6,5.54-11.32,8.61-11.97,16.52,1.97.46,2.37-1.01,3.41-2.08,16.97-17.57,33.36-36.17,54.38-49.11-.07-35.38,43.89-46.99,71.78-53.74,1.38-.33,1.84.04,1.42,1.42-5.53,18.05-25.93,42.44-43.72,49.28-12.29,4.72-24.31,2.03-34.57,8.43-14.24,8.89-27.32,24.04-38.69,36.31,6.82,2.69,8.09-6.05,11.95-10.05,18.99-19.63,50.96-6.74,73.53-2.45,1.16.29.47,1.31.03,2.01-2.75,4.35-16.7,13.95-21.64,16.36-13.41,6.54-31.14,9.11-45.24,3.5-7.37-2.94-11.36-9.47-20.93-6.66-4.55,1.34-25.58,28.93-29.52,34.48-3.29,4.64-12.58,17.34-14.17,21.83-1,2.82,5.58-.56,6-1,.9-.94,3.53-9.1,5.75-12.25,5.76-8.16,20.75-17.27,30.73-17.27h43l1.06,2.03c-13.36,19.94-41.02,38.11-65.81,34.71-10.24-1.41-16.8-10.17-26.17,1.35-8.68,10.66-28.7,55.97-32.13,69.87-.26,1.06-1.13,3.41.04,4.04,6.8-3.28,4.54-9.25,5.94-15.06,7.5-31,50.07-37.7,75.55-45.94-6.63,24.9-36.5,58.71-63.45,60.04-7.64.37-14.17-2.72-20.55,4.45-2.66,2.99-6.55,17.32-7.91,22.09-3.07,10.75-5.58,22.38-7.6,33.4-2.1,11.43-4.64,23.48-3.98,35.02,6.42-4.26,3.24-5.92,3.5-10.5,2.2-39.31,32.77-57.91,63.47-76.54.76-.46,1.75-1.99,2.53-.47-3.3,29.92-22.05,68.78-51.31,80.69-4.12,1.68-8.25,1.66-12.01,3.99-1.75,1.09-6.98,6.87-7.46,8.54-1.18,4.12-2.01,16.84-2.25,21.75-1.13,22.55,1.18,45.14,3.05,67.54,1.37,1.8,4.44-5.33,4.55-5.94.14-.79-4.39-11.57-4.45-15.45-.46-30.71,29.69-61.31,49.92-82.09.96-.98,1.3-1.88,2.98-1.52-.55,7.91.75,16.71,0,24.5Z';
  ['fc3f770','c9e8db3'].forEach(function(id){
    var card=document.querySelector('.elementor-element-'+id);
    if(!card) return;
    var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 892.77 688.08');
    svg.setAttribute('class','rst-wreath');
    svg.setAttribute('aria-hidden','true');
    svg.innerHTML='<path d="'+W1+'"/><path d="'+W2+'"/>';
    card.prepend(svg);
  });
})();

/* ==================== growth cards: corner numbers + in-view icon animation ==================== */
(function(){
  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('rst-gin');io.unobserve(e.target)}})},{threshold:.4}):null;
  ['b5f8da1','c7eb102','72adbec'].forEach(function(id){
    var w=document.querySelector('.elementor-element-'+id);
    if(!w) return;
    var t=w.querySelector('.elementor-icon-box-title');
    if(t){
      var m=t.textContent.trim().match(/^(\d{2})\s*\S\s*(.+)$/);
      if(m){
        t.textContent=m[2];
        var n=document.createElement('span');
        n.className='rst-gnum';n.textContent=m[1];
        w.appendChild(n);
      }
    }
    if(io&&!reducedMotion) io.observe(w);else w.classList.add('rst-gin');
  });
})();

/* ==================== pain marquee (3 scrolling columns, desktop) ==================== */
(function(){
  if(mobile||reducedMotion) return;
  var row=document.querySelector('.elementor-element-3d55e59');
  if(!row) return;
  var Q={
    r:['ר','״אני נחשבת מצליחנית שמזיזה הרים — אבל כשזה מגיע לאכילה, אני הופכת למישהי שלא עומדת במילה שלה.״'],
    m:['מ','״הפעם החלטתי שאני חייבת לחסוך בהוצאות ולנהל את הכספים שלי — ושוב מצאתי את עצמי קונה דברים שאני לא צריכה בכלל... איך זה קורה לי שוב ושוב?״'],
    d:['ד','״אני מתחיל בהתלהבות, עושה מנוי, מתחיל לעשות ספורט — ובתוך שבועיים שוב לא מצליח להתמיד.״'],
    y:['י','״אולי זה מי שאני, ואי אפשר לשנות את זה...״'],
    a:['א','״הפעם החלטתי! אני נוכח ומקשיב לבת הזוג שלי — ושוב איבדתי סבלנות והייתי מתוסכל בשיחה שלנו.״']
  };
  function card(k){var q=Q[k];return '<li class="tcard"><p>'+q[1]+'</p><footer><span class="tdeco" aria-hidden="true">״</span></footer></li>'}
  function col(keys,dur){
    var items=keys.map(card).join('');
    return '<div class="tcol" style="--dur:'+dur+'s"><ul>'+items+items+'</ul></div>';
  }
  var wrap=document.createElement('div');
  wrap.className='rst-tcolumns';
  wrap.setAttribute('aria-label','ציטוטים של משתתפים');
  wrap.innerHTML=col(['r','m'],34)+col(['d','y'],26)+col(['a','r'],30);
  row.parentNode.insertBefore(wrap,row);
  document.body.classList.add('rst-marquee');
})();

/* ==================== syllabus accordion: split leading numbers ==================== */
(function(){
  var titles=document.querySelectorAll('.elementor-element-b12c31f .elementor-tab-title a, .elementor-element-b12c31f .elementor-tab-title');
  var seen=[];
  titles.forEach(function(t){
    if(t.querySelector('.rst-acc-num')) return;
    if(t.children.length && !t.matches('a')) return; /* outer div when inner a exists */
    var m=t.textContent.match(/^\s*(\d{2})\s*·\s*(.+)$/);
    if(!m) return;
    t.innerHTML='<span class="rst-acc-num">'+m[1]+'</span>'+m[2];
  });
})();

/* ==================== roadmap "you are here" pill ==================== */
(function(){
  var card=document.querySelector('.elementor-element-9a2c36e');
  if(!card) return;
  var b=document.createElement('span');
  b.className='rst-here-badge';
  b.textContent='אתה כאן';
  card.appendChild(b);
})();

/* ==================== academy subsite: emulate the top-bar sticky ====================
   The copied pages live on the /academy/ subsite where Elementor Pro's sticky handler does
   not engage for the top bar (02e7bd7, sticky:top in data). Replicate it: CSS position:sticky
   (html.rst-academy scope) + toggle the same .elementor-sticky--effects class the root uses. */
(function(){
  if(location.pathname.indexOf('/academy/')<0) return;
  document.documentElement.classList.add('rst-academy');
  /* if the academy theme header is fixed/sticky, our top bar must stick BELOW it */
  function hdr(){
    var h=document.querySelector('.elementor-location-header');
    var off=0;
    if(h){
      var cs=getComputedStyle(h);
      var inner=h.querySelector('.elementor-sticky--active');
      if(cs.position==='fixed'||cs.position==='sticky') off=Math.round(h.getBoundingClientRect().height);
      else if(inner) off=Math.round(inner.getBoundingClientRect().height);
      else if(h.getBoundingClientRect().top>=-2 && scrollY>50) off=Math.round(h.getBoundingClientRect().height);
    }
    document.documentElement.style.setProperty('--rst-hdr',off+'px');
  }
  function fx(){
    var b=document.querySelector('.elementor-element-02e7bd7');
    if(b) b.classList.toggle('elementor-sticky--effects', scrollY>40);
    hdr();
  }
  addEventListener('scroll',fx,{passive:true});
  addEventListener('resize',fx,{passive:true});
  addEventListener('load',fx); fx();
})();

/* frontal track banner pill — now a NATIVE Elementor heading widget (css class rst-track-badge)
   on both pages (352420 → 6f1b2e0, 357955 → 9fca426). JS injection removed.
   The track section (2f061c4) must stay out of Elementor's lazy-bg zeroing
   (`.e-parent:nth-of-type(n+4) *{background:none!important}`) or the badge gradient +
   card backgrounds would vanish until scroll — mark it e-lazyloaded/e-no-lazyload like the video section. */
(function(){
  function noLazyTrack(){var s=document.querySelector('.elementor-element-2f061c4');if(s){s.classList.add('e-lazyloaded');s.classList.add('e-no-lazyload');}}
  noLazyTrack(); addEventListener('load',noLazyTrack); setTimeout(noLazyTrack,300); setTimeout(noLazyTrack,1000);
})();

/* ==================== roadmap flow arrows (RTL: right to left) ==================== */
(function(){
  if(mobile) return;
  function addArrows(rowSel){
    var row=document.querySelector(rowSel);
    if(!row) return;
    var cards=[].slice.call(row.querySelectorAll(':scope>.e-con,:scope>.elementor-element')).filter(function(c){return c.getBoundingClientRect().width>100});
    if(cards.length<2) return;
    row.querySelectorAll('.rst-arrow').forEach(function(a){a.remove()});
    function place(){
      row.querySelectorAll('.rst-arrow').forEach(function(a){a.remove()});
      var sorted=cards.slice().sort(function(a,b){return b.offsetLeft-a.offsetLeft});
      for(var i=0;i<sorted.length-1;i++){
        var r=sorted[i], l=sorted[i+1];
        var mid=(r.offsetLeft + (l.offsetLeft+l.offsetWidth))/2;
        var a=document.createElement('span');
        a.className='rst-arrow';
        a.innerHTML='&#8592;';
        a.style.left=(mid-17)+'px';
        row.appendChild(a);
      }
    }
    setTimeout(place,900);
    addEventListener('load',function(){setTimeout(place,300)});
    addEventListener('resize',function(){setTimeout(place,150)},{passive:true});
  }
  addArrows('.elementor-element-32787f3');
  addArrows('.elementor-element-3d0587d');
})();

/* ==================== roadmap flow arrows — MOBILE (downward, between stacked cards) ==================== */
(function(){
  if(!mobile) return;
  function addDownArrows(rowSel){
    var row=document.querySelector(rowSel);
    if(!row) return;
    row.style.position='relative';
    function cardsOf(){return [].slice.call(row.querySelectorAll(':scope>.e-con,:scope>.elementor-element')).filter(function(c){return c.getBoundingClientRect().height>60});}
    function place(){
      row.querySelectorAll('.rst-arrow-dn').forEach(function(a){a.remove()});
      var cards=cardsOf().sort(function(a,b){return a.offsetTop-b.offsetTop});
      if(cards.length<2) return;
      for(var i=0;i<cards.length-1;i++){
        var t=cards[i], n=cards[i+1];
        var mid=(t.offsetTop+t.offsetHeight + n.offsetTop)/2;
        var a=document.createElement('span');
        a.className='rst-arrow rst-arrow-dn';
        a.innerHTML='&#8595;';
        a.style.top=(mid-23)+'px';
        row.appendChild(a);
      }
    }
    setTimeout(place,900);
    addEventListener('load',function(){setTimeout(place,400)});
    addEventListener('resize',function(){setTimeout(place,180)},{passive:true});
  }
  addDownArrows('.elementor-element-32787f3');
  addDownArrows('.elementor-element-3d0587d');
})();

/* sticky bottom CTA — removed per request */

/* ==================== mouse parallax ==================== */
if(!reducedMotion && matchMedia('(pointer:fine)').matches){
  var fl2=document.querySelector('.elementor-element-77bffd4 .elementor-heading-title');
  if(fl2) fl2.setAttribute('data-par','9');
  var pEls=[].slice.call(document.querySelectorAll('[data-par]'));
  var mx=0,my=0,cx=0,cy=0;
  addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
  (function pLoop(){
    cx+=(mx-cx)*.055;cy+=(my-cy)*.055;
    pEls.forEach(function(el){
      var d=+el.dataset.par, isBg=el.classList.contains('seq-canvas')||el.classList.contains('seq-poster');
      var zs=isBg&&el.closest('.rst-hero-pin')?(1.04+0.12*Math.min(1,scrollY/innerHeight)):1.05;
      var sc=isBg?('scale('+zs.toFixed(4)+') '):'';
      el.style.transform=sc+'translate3d('+(cx*d).toFixed(2)+'px,'+(cy*d).toFixed(2)+'px,0)';
    });
    requestAnimationFrame(pLoop);
  })();
}

/* ==================== accordions: closed by default (no tab #1 auto-open) ==================== */
(function(){
  var ids=['b12c31f','890f0be'];
  function shut(){
    ids.forEach(function(id){
      var acc=document.querySelector('.elementor-element-'+id);
      if(!acc) return;
      acc.querySelectorAll('.elementor-tab-title').forEach(function(t){
        t.classList.remove('elementor-active');
        t.setAttribute('aria-expanded','false');
        if(t.hasAttribute('aria-selected')) t.setAttribute('aria-selected','false');
      });
      acc.querySelectorAll('.elementor-tab-content').forEach(function(c){
        c.classList.remove('elementor-active');
        c.style.display='none';
      });
    });
  }
  /* Elementor opens tab #1 on init — collapse once it has settled */
  addEventListener('load',function(){ shut(); setTimeout(shut,450); });
  setTimeout(shut,1300);
})();

/* ==================== video testimonials (Vimeo whitelist embeds → branded slider) ==================== */
(function(){
  /* Slider + prev/next arrows over the NATIVE Elementor video widgets inside c024b98.
     No card injection — the video elements are built natively in Elementor. */
  /* Elementor lazy-loads background images (a rule zeroes bg-image on section descendants until the
     section gets .e-lazyloaded on scroll). The native video COVERS are overlay background-images →
     force the video section loaded so the covers always show, immediately and reliably. */
  /* brand duotone filter for the covers (shadows→deep purple #241A52, highlights→gold #EBD3A0) */
  function duo(){
    if(document.getElementById('rst-duo-svg')) return;
    var s=document.createElementNS('http://www.w3.org/2000/svg','svg');
    s.id='rst-duo-svg'; s.setAttribute('width','0'); s.setAttribute('height','0'); s.style.cssText='position:absolute;width:0;height:0;overflow:hidden';
    s.innerHTML='<filter id="rst-duo" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues="0.141 0.922"/><feFuncG type="table" tableValues="0.102 0.827"/><feFuncB type="table" tableValues="0.322 0.627"/></feComponentTransfer></filter>';
    document.body.appendChild(s);
  }
  duo();
  /* name footer under each native video card (widget id → speaker name) */
  var VNAMES={ca5be38:'אביטל',Tcf:'מור','2c97784':'מור','5ebfc0a':'עדות סיום',f98086f:'טקס סיום',bae3629:'מריה',db3d856:'טקס סיום · ב׳','14178ca':'מירב','7efd720':'טלי',dc30bfb:'הדס',fe8909e:'גינת'};
  function addNames(){
    [].slice.call(document.querySelectorAll('.elementor-element-c024b98 .elementor-widget-video')).forEach(function(v){
      var wc=v.querySelector(':scope>.elementor-widget-container')||v;
      if(wc.querySelector('.rst-vname')) return;
      var id=(v.className.match(/elementor-element-([0-9a-f]{7})/)||[])[1];
      var name=VNAMES[id]; if(!name) return;
      var f=document.createElement('div'); f.className='rst-vname'; f.textContent=name; wc.appendChild(f);
    });
  }
  function unlazy(){
    duo(); addNames();
    var vs=document.querySelector('.elementor-element-9656376'); if(vs){vs.classList.add('e-lazyloaded'); vs.classList.add('e-no-lazyload');}
    /* Elementor defers the overlay cover bg (lazy) → force each overlay's own inline url with !important
       so covers show immediately on every device, regardless of scroll/observer. */
    [].slice.call(document.querySelectorAll('.elementor-element-c024b98 .elementor-custom-embed-image-overlay')).forEach(function(ov){
      var m=(ov.getAttribute('style')||'').match(/url\(([^)]+)\)/);
      if(m) ov.style.setProperty('background-image','url('+m[1].replace(/["']/g,'')+')','important');
    });
  }
  unlazy(); addEventListener('load',unlazy); setTimeout(unlazy,400); setTimeout(unlazy,1200);
  function build(){
    var box=document.querySelector('.elementor-element-c024b98');
    if(!box) return;
    if(box.parentNode && box.parentNode.classList.contains('rst-vwrap')) return; /* already wrapped */
    if(!box.firstElementChild) return; /* native widgets not rendered yet */
    var wrap=document.createElement('div'); wrap.className='rst-vwrap';
    box.parentNode.insertBefore(wrap,box); wrap.appendChild(box);
    /* RTL scrollLeft model varies per engine; detect lazily on first click. */
    var toContent=0;
    function sign(){ if(toContent) return toContent; var cur=box.scrollLeft; box.scrollLeft=-99999; toContent=(box.scrollLeft<0)?-1:1; box.scrollLeft=cur; return toContent; }
    /* behavior:'smooth' is canceled by scroll-snap:mandatory; scroll instantly and let snap align. */
    function slideBy(delta){ box.scrollBy({left:delta,behavior:'auto'}); }
    var navRow=document.createElement('div'); navRow.className='rst-vnav-row';
    function mkNav(dir){
      var b=document.createElement('button'); b.type='button'; b.className='rst-vnav rst-vnav-'+dir;
      b.setAttribute('aria-label',dir==='next'?'עדויות נוספות':'הקודם');
      b.innerHTML='<svg viewBox="0 0 24 24" fill="none"><path d="'+(dir==='next'?'M15 6l-6 6 6 6':'M9 6l6 6-6 6')+'"/></svg>';
      b.addEventListener('click',function(){var card=box.firstElementChild; var step=(card?card.getBoundingClientRect().width:280)+18; slideBy((dir==='next'?sign():-sign())*step);});
      navRow.appendChild(b); return b;
    }
    var prevB=mkNav('prev'), nextB=mkNav('next');
    wrap.appendChild(navRow);
    function upd(){var max=box.scrollWidth-box.clientWidth, sl=Math.abs(box.scrollLeft); prevB.classList.toggle('off',sl<3); nextB.classList.toggle('off',Math.abs(sl-max)<3);}
    box.addEventListener('scroll',upd,{passive:true}); addEventListener('resize',upd,{passive:true}); setTimeout(upd,200);
  }
  build();
  addEventListener('load',build);
})();

/* ==================== student-page benefit badge: inject gift icon (Elementor strips inline <svg> from heading titles) ==================== */
(function(){
  function badgeIcon(){
    var s=document.querySelector('.elementor-element-88c0be4 .elementor-heading-title>span'); if(!s||s.querySelector('svg')) return;
    s.style.display='inline-flex'; s.style.alignItems='center'; s.style.gap='9px'; s.style.textAlign='right';
    s.insertAdjacentHTML('afterbegin','<svg viewBox="0 0 24 24" fill="none" stroke="#9B7FD4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;flex:none"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>');
  }
  badgeIcon(); addEventListener('load',badgeIcon); setTimeout(badgeIcon,600);
})();
})();
