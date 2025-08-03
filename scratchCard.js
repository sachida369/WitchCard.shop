// scratchCard.js
const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");
const revealedName = document.getElementById("revealedName");
let isDrawing = false;
let name = localStorage.getItem("destinyName") || "Priya";

function resizeCanvas() {
  const bgImage = document.querySelector(".globe-bg");
  const rect = bgImage.getBoundingClientRect();
  canvas.width = rect.width * 0.55;
  canvas.height = rect.height * 0.32;
  canvas.style.top = `${rect.top + rect.height * 0.36}px`;
  canvas.style.left = `${rect.left + rect.width * 0.23}px`;
  canvas.style.position = "absolute";
  drawFoil();
}

function drawFoil() {
  ctx.fillStyle = ctx.createPattern(generateSilverPattern(), "repeat");
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function generateSilverPattern() {
  const foilCanvas = document.createElement("canvas");
  foilCanvas.width = 20;
  foilCanvas.height = 20;
  const foilCtx = foilCanvas.getContext("2d");
  foilCtx.fillStyle = "#C0C0C0";
  foilCtx.fillRect(0, 0, 20, 20);
  foilCtx.beginPath();
  foilCtx.moveTo(0, 0);
  foilCtx.lineTo(20, 20);
  foilCtx.strokeStyle = "#aaa";
  foilCtx.stroke();
  return foilCanvas;
}

canvas.addEventListener("mousedown", () => isDrawing = true);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousemove", scratch);
canvas.addEventListener("touchstart", e => { isDrawing = true; scratch(e); });
canvas.addEventListener("touchend", () => isDrawing = false);
canvas.addEventListener("touchmove", scratch);

function scratch(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
  revealName();
}

function revealName() {
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let cleared = 0;
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) cleared++;
  }
  if (cleared / (pixels.length / 4) > 0.5) {
    revealedName.innerText = name;
  }
}

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

// Download button
const downloadBtn = document.getElementById("downloadBtn");
downloadBtn.addEventListener("click", () => {
  html2canvas(document.querySelector(".scratch-container")).then(canvas => {
    const link = document.createElement("a");
    link.download = "destiny.png";
    link.href = canvas.toDataURL();
    link.click();
  });
});

// WhatsApp share
const shareBtn = document.getElementById("whatsappShare");
shareBtn.href = `https://wa.me/?text=I%20just%20revealed%20my%20Destiny%20Name%20-%20${encodeURIComponent(name)}%20%F0%9F%94%AE%20Try%20yours%20now:%20https://sachida369.github.io/destiny`;
