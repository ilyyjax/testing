// script.js
// Builds a cartoon avatar dynamically with colorful styles + animations

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
    <rect width="400" height="400" rx="40" fill="${bgColor}"/>
    ${bgStyle==="circle" ? `<circle cx="200" cy="200" r="160" fill="rgba(255,255,255,0.2)"/>` : ""}
    ${bgStyle==="stripes" ? [...Array(6)].map((_,i)=>`<rect x="${i*70}" y="0" width="40" height="400" fill="rgba(255,255,255,0.15)"/>`).join("") : ""}
    <circle cx="200" cy="180" r="${face==="oval"?110:100}" fill="${skin}" stroke="#333" stroke-width="3"/>
    ${hairStyle!=="bald" ? `<path d="M100 120 q100 -70 200 0 q-10 60 -100 60 q-90 -5 -100 -60z" fill="${hairColor}" stroke="#333" stroke-width="3"/>` : ""}
    <circle cx="150" cy="170" r="16" fill="${eyeColor}" stroke="#333" stroke-width="3"/>
    <circle cx="250" cy="170" r="16" fill="${eyeColor}" stroke="#333" stroke-width="3"/>
    ${eyes==="happy" ? `<path d="M130 165 q20 -15 40 0 M230 165 q20 -15 40 0" stroke="#000" stroke-width="3"/>` : ""}
    ${eyes==="sleepy" ? `<line x1="135" y1="170" x2="165" y2="170" stroke="#000" stroke-width="4"/> <line x1="235" y1="170" x2="265" y2="170" stroke="#000" stroke-width="4"/>` : ""}
    ${eyes==="sunglasses" ? `<rect x="120" y="160" width="60" height="25" rx="6" fill="#000"/> <rect x="220" y="160" width="60" height="25" rx="6" fill="#000"/>` : ""}
    ${mouth==="smile" ? `<path d="M150 220 q50 40 100 0" stroke="#b33" stroke-width="5" fill="none"/>` : ""}
    ${mouth==="neutral" ? `<line x1="160" y1="220" x2="240" y2="220" stroke="#b33" stroke-width="5"/>` : ""}
    ${mouth==="open" ? `<ellipse cx="200" cy="220" rx="30" ry="15" fill="#b33"/>` : ""}
    ${glasses ? `<circle cx="150" cy="170" r="22" fill="none" stroke="#333" stroke-width="3"/><circle cx="250" cy="170" r="22" fill="none" stroke=
