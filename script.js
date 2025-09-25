// script.js
// Minimal avatar builder logic — updates inline SVG parts and supports randomize + download

// Utility
const $$ = sel => document.querySelector(sel);
const $all = sel => Array.from(document.querySelectorAll(sel));

/* --- DOM elements --- */
const skinColor = $$('#skinColor');
const faceShape = $$('#faceShape');
const hairStyle = $$('#hairStyle');
const hairColor = $$('#hairColor');
const eyeStyle = $$('#eyeStyle');
const mouthStyle = $$('#mouthStyle');
const eyeColor = $$('#eyeColor');
const shirtColor = $$('#shirtColor');
const bgStyle = $$('#bgStyle');
const bgColor = $$('#bgColor');
const glassesToggle = $$('#glassesToggle');
const beardToggle = $$('#beardToggle');

const randomBtn = $$('#randomBtn');
const downloadBtn = $$('#downloadBtn');
const smallDownload = $$('#smallDownload');
const resetBtn = $$('#resetBtn');

const avatarSvg = $$('#avatarSvg');
const bgRect = $$('#bgRect');
const bgDecor = $$('#bgDecor');
const faceCircle = $$('#faceCircle');
const faceClipCircle = $$('#faceClipCircle');
const hairGroup = $$('#hairGroup');
const eyesGroup = $$('#eyesGroup');
const mouthGroup = $$('#mouthGroup');
const beardGroup = $$('#beardGroup');
const glassesGroup = $$('#glassesGroup');
const neck = $$('#neck');
const shirt = $$('#shirt');

/* --- Render functions --- */
function renderBackground() {
  bgRect.setAttribute('fill', bgColor.value);
  bgDecor.innerHTML = '';
  if (bgStyle.value === 'circle') {
    const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('cx',200); c.setAttribute('cy',120); c.setAttribute('r',90);
    c.setAttribute('fill', lightenColor(bgColor.value, 0.9));
    bgDecor.appendChild(c);
  } else if (bgStyle.value === 'stripes') {
    for(let i=0;i<6;i++){
      const r = document.createElementNS('http://www.w3.org/2000/svg','rect');
      r.setAttribute('x', i*80 - 40);
      r.setAttribute('y', 0);
      r.setAttribute('width',40);
      r.setAttribute('height',400);
      r.setAttribute('fill', lightenColor(bgColor.value, 0.97));
      r.setAttribute('transform', `rotate(15 ${200} ${200})`);
      bgDecor.appendChild(r);
    }
  }
}

function renderFace() {
  faceCircle.setAttribute('fill', skinColor.value);

  // face clip (shape)
  if(faceShape.value === 'round'){
    faceClipCircle.setAttribute('cx',200); faceClipCircle.setAttribute('cy',160); faceClipCircle.setAttribute('r',110);
  } else if(faceShape.value === 'oval'){
    faceClipCircle.setAttribute('cx',200); faceClipCircle.setAttribute('cy',150); faceClipCircle.setAttribute('r',100);
  } else {
    // square-ish: use rounded rect path via polygon approximation by putting a big circle + mask
    faceClipCircle.setAttribute('cx',200); faceClipCircle.setAttribute('cy',160); faceClipCircle.setAttribute('r',105);
  }
}

function renderHair(){
  hairGroup.innerHTML = '';
  const color = hairColor.value;
  if(hairStyle.value === 'bald'){
    return;
  }
  if(hairStyle.value === 'short'){
    const p = document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d','M95 120 q105 -90 210 0 q-10 -40 -105 -40 q-85 5 -105 40 z');
    p.setAttribute('fill',color);
    hairGroup.appendChild(p);
  } else if(hairStyle.value === 'long'){
    const p = document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d','M90 110 q40 -80 220 -2 q-8 120 -110 140 q-115 -10 -120 -138 z');
    p.setAttribute('fill',color);
    hairGroup.appendChild(p);
  } else if(hairStyle.value === 'bun'){
    const back = document.createElementNS('http://www.w3.org/2000/svg','path');
    back.setAttribute('d','M95 120 q105 -70 210 0 q-5 40 -105 40 q-95 -8 -100 -40 z');
    back.setAttribute('fill',color);
    hairGroup.appendChild(back);
    const bun = document.createElementNS('http://www.w3.org/2000/svg','circle');
    bun.setAttribute('cx',290); bun.setAttribute('cy',70); bun.setAttribute('r',30); bun.setAttribute('fill',color);
    hairGroup.appendChild(bun);
  }
}

function renderEyes(){
  eyesGroup.innerHTML = '';
  if(eyeStyle.value === 'sunglasses'){
    const left = document.createElementNS('http://www.w3.org/2000/svg','rect');
    left.setAttribute('x',120); left.setAttribute('y',140); left.setAttribute('width',68); left.setAttribute('height',34); left.setAttribute('rx',8);
    left.setAttribute('fill','#222');
    const right = left.cloneNode();
    right.setAttribute('x',212);
    const bridge = document.createElementNS('http://www.w3.org/2000/svg','rect');
    bridge.setAttribute('x',190); bridge.setAttribute('y',152); bridge.setAttribute('width',20); bridge.setAttribute('height',8); bridge.setAttribute('fill','#222');
    eyesGroup.appendChild(left); eyesGroup.appendChild(right); eyesGroup.appendChild(bridge);
  } else {
    const eyeColorVal = eyeColor.value;
    // left pupil
    const l = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
    l.setAttribute('cx',140); l.setAttribute('cy',150); l.setAttribute('rx',18); l.setAttribute('ry',12); l.setAttribute('fill',eyeColorVal);
    const r = l.cloneNode();
    r.setAttribute('cx',260);
    eyesGroup.appendChild(l); eyesGroup.appendChild(r);

    if(eyeStyle.value === 'happy'){
      // add small curved eyelids
      const lidL = document.createElementNS('http://www.w3.org/2000/svg','path');
      lidL.setAttribute('d','M120 147 q20 -18 40 0'); lidL.setAttribute('stroke','#000'); lidL.setAttribute('fill','none'); lidL.setAttribute('stroke-width',3);
      const lidR = document.createElementNS('http://www.w3.org/2000/svg','path');
      lidR.setAttribute('d','M240 147 q20 -18 40 0'); lidR.setAttribute('stroke','#000'); lidR.setAttribute('fill','none'); lidR.setAttribute('stroke-width',3);
      eyesGroup.appendChild(lidL); eyesGroup.appendChild(lidR);
    } else if(eyeStyle.value === 'sleepy'){
      const lineL = document.createElementNS('http://www.w3.org/2000/svg','rect');
      lineL.setAttribute('x',122); lineL.setAttribute('y',150); lineL.setAttribute('width',36); lineL.setAttribute('height',6); lineL.setAttribute('rx',3); lineL.setAttribute('fill','#333');
      const lineR = lineL.cloneNode();
      lineR.setAttribute('x',242);
      eyesGroup.appendChild(lineL); eyesGroup.appendChild(lineR);
    }
  }
}

function renderMouth(){
  mouthGroup.innerHTML = '';
  if(mouthStyle.value === 'smile'){
    const m = document.createElementNS('http://www.w3.org/2000/svg','path');
    m.setAttribute('d','M150 200 q50 40 100 0'); m.setAttribute('stroke','#8b3a3a'); m.setAttribute('fill','none'); m.setAttribute('stroke-width',4); m.setAttribute('stroke-linecap','round');
    mouthGroup.appendChild(m);
  } else if(mouthStyle.value === 'neutral'){
    const m = document.createElementNS('http://www.w3.org/2000/svg','rect');
    m.setAttribute('x',170); m.setAttribute('y',198); m.setAttribute('width',60); m.setAttribute('height',6); m.setAttribute('rx',3); m.setAttribute('fill','#8b3a3a');
    mouthGroup.appendChild(m);
  } else {
    const m = document.createElementNS('http://www.w3.org/2000/svg','path');
    m.setAttribute('d','M160 195 q40 26 80 0 q-40 30 -80 0z'); m.setAttribute('fill','#8b3a3a');
    mouthGroup.appendChild(m);
  }
}

function renderBeard(){
  beardGroup.innerHTML = '';
  if(beardToggle.checked){
    const b = document.createElementNS('http://www.w3.org/2000/svg','path');
    b.setAttribute('d','M135 205 q55 80 130 0 q-45 60 -130 0z');
    b.setAttribute('fill', darkenColor(hairColor.value, 0.85));
    beardGroup.appendChild(b);
  }
}

function renderGlasses(){
  glassesGroup.innerHTML = '';
  if(glassesToggle.checked && eyeStyle.value !== 'sunglasses'){
    const left = document.createElementNS('http://www.w3.org/2000/svg','rect');
    left.setAttribute('x',120); left.setAttribute('y',140); left.setAttribute('width',52); left.setAttribute('height',32); left.setAttribute('rx',8); left.setAttribute('fill','none'); left.setAttribute('stroke','#333'); left.setAttribute('stroke-width',4);
    const right = left.cloneNode(); right.setAttribute('x',228);
    const bridge = document.createElementNS('http://www.w3.org/2000/svg','rect'); bridge.setAttribute('x',190); bridge.setAttribute('y',152); bridge.setAttribute('width',20); bridge.setAttribute('height',8); bridge.setAttribute('rx',4); bridge.setAttribute('fill','#333');
    glassesGroup.appendChild(left); glassesGroup.appendChild(right); glassesGroup.appendChild(bridge);
  }
}

function renderShirt(){
  neck.setAttribute('fill', shirtColor.value);
  shirt.setAttribute('fill', shirtColor.value);
}

/* --- helpers --- */
function lightenColor(hex, amt){
  // amt: fraction 0..1 where 1 -> white-ish
  const {r,g,b} = hexToRgb(hex);
  const nr = Math.round(r + (255 - r) * (1-amt));
  const ng = Math.round(g + (255 - g) * (1-amt));
  const nb = Math.round(b + (255 - b) * (1-amt));
  return rgbToHex(nr,ng,nb);
}
function darkenColor(hex, amt){
  const {r,g,b} = hexToRgb(hex);
  const nr = Math.round(r * amt);
  const ng = Math.round(g * amt);
  const nb = Math.round(b * amt);
  return rgbToHex(nr,ng,nb);
}
function hexToRgb(hex){
  const c = hex.replace('#','');
  const bigint = parseInt(c,16);
  if(c.length===3){
    return {r:parseInt(c[0]+c[0],16),g:parseInt(c[1]+c[1],16),b:parseInt(c[2]+c[2],16)};
  }
  return {r:(bigint>>16)&255,g:(bigint>>8)&255,b:bigint&255};
}
function rgbToHex(r,g,b){
  return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}

/* --- randomizer --- */
function randChoice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function randomizeAll(){
  const skins = ['#f2d1b3','#f1c8a1','#e09a6a','#d9b38c','#c68655','#ffd7b5'];
  const hairs = ['#2b2b2b','#6b3b2b','#d79b5b','#f1e0b8','#ffffff','#2f5f9c'];
  const eyes = ['#2a4d9a','#3a2f1b','#5aa469','#6b3a8a','#2e2e2e'];
  skinColor.value = randChoice(skins);
  hairColor.value = randChoice(hairs);
  eyeColor.value = randChoice(eyes);
  shirtColor.value = randChoice(['#8fd19e','#ffd479','#9fc7ff','#f19ab0','#c6d5ff']);
  bgColor.value = randChoice(['#ffffff','#f4fff8','#fff9f6','#f0f7ff']);
  faceShape.value = randChoice(['round','oval','square']);
  hairStyle.value = randChoice(['short','long','bun','bald']);
  eyeStyle.value = randChoice(['normal','happy','sleepy','sunglasses']);
  mouthStyle.value = randChoice(['smile','neutral','open']);
  bgStyle.value = randChoice(['plain','circle','stripes']);
  glassesToggle.checked = Math.random() > 0.7;
  beardToggle.checked = Math.random() > 0.6;
  renderAll();
}

/* --- render everything --- */
function renderAll(){
  renderBackground();
  renderFace();
  renderHair();
  renderEyes();
  renderMouth();
  renderBeard();
  renderGlasses();
  renderShirt();
}

/* --- download (SVG -> PNG) --- */
function downloadAvatarPNG(filename='avatar.png', scale=2){
  // Serialize SVG
  const svg = avatarSvg.cloneNode(true);
  // inline computed styles (fallback) — simpler approach: set width/height attributes
  svg.setAttribute('width', 400);
  svg.setAttribute('height', 400);
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);
  const img = new Image();
  const svgBlob = new Blob([svgStr], {type:'image/svg+xml;charset=utf-8'});
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400 * scale;
    canvas.height = 400 * scale;
    const ctx = canvas.getContext('2d');
    // white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  };
  img.onerror = (e) => {
    alert('Failed to render avatar for download.');
    URL.revokeObjectURL(url);
  }
  img.src = url;
}

/* --- events --- */
const inputs = [skinColor,faceShape,hairStyle,hairColor,eyeStyle,mouthStyle,eyeColor,shirtColor,bgStyle,bgColor,glassesToggle,beardToggle];
inputs.forEach(i => i.addEventListener('input', renderAll));
inputs.forEach(i => i.addEventListener('change', renderAll));

randomBtn.addEventListener('click', randomizeAll);
resetBtn.addEventListener('click', ()=> {
  // reset to defaults
  skinColor.value = '#f2d1b3';
  faceShape.value='round';
  hairStyle.value='short';
  hairColor.value='#2b2b2b';
  eyeStyle.value='normal';
  mouthStyle.value='smile';
  eyeColor.value='#2a4d9a';
  shirtColor.value='#8fd19e';
  bgStyle.value='plain';
  bgColor.value='#ffffff';
  glassesToggle.checked=false;
  beardToggle.checked=false;
  renderAll();
});

downloadBtn.addEventListener('click', ()=> downloadAvatarPNG('makeavatar.png', 3));
smallDownload.addEventListener('click', ()=> downloadAvatarPNG('avatar.png', 2));

/* init */
renderAll();
