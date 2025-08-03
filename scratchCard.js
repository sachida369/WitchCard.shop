// scratchCard.js
const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");
const revealedText = document.getElementById("reveal-text");
let isDrawing = false;

// Get name from localStorage or fallback
const name = localStorage.getItem("destinyName") || "Priya";

// Position canvas over the globe area
function resizeCanvas() {
  const img = document.querySelector(".scratch-image");
  const rect = img.getBoundingClientRect();
  const width = rect.width * 0.6;
  const height = rect.height * 0.22;

  canvas.width = width;
  canvas.height = height;

  canvas.style.position = "absolute";
  canvas.style.left = `${(img.offsetWidth - width) / 2}px`;
  canvas.style.top = `${img.offsetHeight * 0.435}px`;

  drawFoil();
}

// Draw silver foil pattern
function drawFoil() {
  const patternCanvas = document.createElement("canvas");
  patternCanvas.width = 40;
  patternCanvas.height = 40;
  const pctx = patternCanvas.getContext("2d");

  pctx.fillStyle = "#C0C0C0";
  pctx.fillRect(0, 0, 40, 40);
  pctx.strokeStyle = "#aaa";
  pctx.beginPath();
  pctx.moveTo(0, 0);
  pctx.lineTo(40, 40);
  pctx.stroke();

  const pattern = ctx.createPattern(patternCanvas, "repeat");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Scratch handler
function scratch(e) {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();

  revealName();
}

// Reveal prediction if more than 50% scratched
function revealName() {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let transparent = 0;

  for (let i = 3; i < imgData.length; i += 4) {
    if (imgData[i] === 0) transparent++;
  }

  const percent = transparent / (imgData.length / 4);
  if (percent > 0.5) {
    revealedText.innerText = name;
  }
}

// Add event listeners
canvas.addEventListener("mousedown", () => (isDrawing = true));
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mousemove", scratch);

canvas.addEventListener("touchstart", e => {
  isDrawing = true;
  scratch(e);
});
canvas.addEventListener("touchend", () => (isDrawing = false));
canvas.addEventListener("touchmove", scratch);

// Resize on load and resize
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

// Download button
document.getElementById("download-btn").addEventListener("click", () => {
  html2canvas(document.querySelector(".scratch-container")).then(canvas => {
    const link = document.createElement("a");
    link.download = "destiny.png";
    link.href = canvas.toDataURL();
    link.click();
  });
});

// WhatsApp Share
document.getElementById("whatsapp-share").href =
  `https://wa.me/?text=I%20just%20revealed%20my%20Destiny%20Name%20-%20${encodeURIComponent(name)}%20%F0%9F%94%AE%20Try%20yours%20now%3A%20https%3A%2F%2Fsachida369.github.io%2Fdestiny`;
