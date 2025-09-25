const svg = document.querySelector("#avatarSvg");
const inputs = document.querySelectorAll("input, select");
const randomBtn = document.querySelector("#randomBtn");
const resetBtn = document.querySelector("#resetBtn");
const downloadBtn = document.querySelector("#downloadBtn");

function renderAvatar() {
  const skin = document.querySelector("#skinColor").value;
  const face = document.querySelector("#faceShape").value;
  const hairStyle = document.querySelector("#hairStyle").value;
  const hairColor = document.querySelector("#hairColor").value;
  const eyes = document.querySelector("#eyeStyle").value;
  const mouth = document.querySelector("#mouthStyle").value;
  const eyeColor = document.querySelector("#eyeColor").value;
  const bgStyle = document.querySelector("#bgStyle").value;
  const bgColor = document.querySelector("#bgColor").value;
  const glasses = document.querySelector("#glassesToggle").checked;
  const beard = document.querySelector("#beardToggle").checked;

  svg.innerHTML = `
    <!-- background -->
    <rect width="400" height="400" rx="40" fill="${bgColor}"/>
    ${bgStyle==="circle" ? `<circle cx="200" cy="200" r="160" fill="rgba(255,255,255,0.2)"/>` : ""}
    ${bgStyle==="stripes" ? [...Array(6)].map((_,i)=>`<rect x="${i*70}" y="0" width="40" height="400" fill="rgba(255,255,255,0.15)"/>`).join("") : ""}

    <!-- face -->
    <circle cx="200" cy="180" r="${face==="oval"?110:(face==="square"?105:100)}" fill="${skin}" stroke="#333" stroke-width="3"/>

    <!-- hair -->
    ${hairStyle!=="bald" ? `<path d="M100 120 q100 -70 200 0 q-10 60 -100 60 q-90 -5 -100 -60z" fill="${hairColor}" stroke="#333" stroke-width="3"/>` : ""}

    <!-- eyes -->
    <circle cx="150" cy="170" r="16" fill="${eyeColor}" stroke="#333" stroke-width="3"/>
    <circle cx="250" cy="170" r="16" fill="${eyeColor}" stroke="#333" stroke-width="3"/>
    ${eyes==="happy" ? `<path d="M130 165 q20 -15 40 0 M230 165 q20 -15 40 0" stroke="#000" stroke-width="3"/>` : ""}
    ${eyes==="sleepy" ? `<line x1="135" y1="170" x2="165" y2="170" stroke="#000" stroke-width="4"/> <line x1="235" y1="170" x2="265" y2="170" stroke="#000" stroke-width="4"/>` : ""}
    ${eyes==="sunglasses" ? `<rect x="120" y="160" width="60" height="25" rx="6" fill="#000"/> <rect x="220" y="160" width="60" height="25" rx="6" fill="#000"/>` : ""}

    <!-- mouth -->
    ${mouth==="smile" ? `<path d="M150 220 q50 40 100 0" stroke="#b33" stroke-width="5" fill="none"/>` : ""}
    ${mouth==="neutral" ? `<line x1="160" y1="220" x2="240" y2="220" stroke="#b33" stroke-width="5"/>` : ""}
    ${mouth==="open" ? `<ellipse cx="200" cy="220" rx="30" ry="15" fill="#b33"/>` : ""}

    <!-- extras -->
    ${glasses ? `<circle cx="150" cy="170" r="22" fill="none" stroke="#333" stroke-width="3"/><circle cx="250" cy="170" r="22" fill="none" stroke="#333" stroke-width="3"/>` : ""}
    ${beard ? `<path d="M120 220 q80 80 160 0 q-60 70 -160 0z" fill="${hairColor}" stroke="#333" stroke-width="3"/>` : ""}
  `;
}

function randomize() {
  const rand = arr => arr[Math.floor(Math.random()*arr.length)];
  document.querySelector("#skinColor").value = rand(["#f2d1b3","#ffd7b5","#c68655"]);
  document.querySelector("#faceShape").value = rand(["round","oval","square"]);
  document.querySelector("#hairStyle").value = rand(["short","long","bun","bald"]);
  document.querySelector("#hairColor").value = rand(["#2b2b2b","#6b3b2b","#ffd479","#9fc7ff"]);
  document.querySelector("#eyeStyle").value = rand(["normal","happy","sleepy","sunglasses"]);
  document.querySelector("#eyeColor").value = rand(["#2a4d9a","#3a2f1b","#5aa469"]);
  document.querySelector("#mouthStyle").value = rand(["smile","neutral","open"]);
  document.querySelector("#bgStyle").value = rand(["plain","circle","stripes"]);
  document.querySelector("#bgColor").value = rand(["#ffffff","#e0ffe0","#e0f7ff"]);
  document.querySelector("#glassesToggle").checked = Math.random()>0.5;
  document.querySelector("#beardToggle").checked = Math.random()>0.5;
  renderAvatar();
}

function resetAll() {
  document.querySelectorAll("input,select").forEach(el=>{
    if(el.type==="color") el.value = el.defaultValue;
    else if(el.type==="checkbox") el.checked=false;
    else el.value = el.options[0].value;
  });
  renderAvatar();
}

function downloadPNG() {
  const xml = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([xml], {type:"image/svg+xml"});
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400; canvas.height = 400;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle="#fff"; ctx.fillRect(0,0,400,400);
    ctx.drawImage(img,0,0);
    const a = document.createElement("a");
    a.download="avatar.png";
    a.href=canvas.toDataURL("image/png");
    a.click();
  };
  img.src = url;
}

// Hook up events
inputs.forEach(el => el.addEventListener("input", renderAvatar));
randomBtn.addEventListener("click", randomize);
resetBtn.addEventListener("click", resetAll);
downloadBtn.addEventListener("click", downloadPNG);

// ✅ Draw first avatar immediately
renderAvatar();
