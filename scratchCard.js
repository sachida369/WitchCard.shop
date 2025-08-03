const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;
let lastX = 0;
let lastY = 0;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Fill silver foil
  const pattern = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  pattern.addColorStop(0, "#C0C0C0");
  pattern.addColorStop(1, "#D0D0D0");
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getFilledPercentage() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let cleared = 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i + 3] === 0) cleared++;
  }
  return (cleared / (canvas.width * canvas.height)) * 100;
}

function handleCompleteReveal() {
  canvas.style.transition = "opacity 0.8s ease";
  canvas.style.opacity = 0;

  // Move reveal text on top of the globe
  const revealText = document.getElementById("reveal-text");
  revealText.style.position = "absolute";
  revealText.style.top = "45%";
  revealText.style.left = "50%";
  revealText.style.transform = "translate(-50%, -50%)";
  revealText.style.pointerEvents = "none";
}

canvas.addEventListener("mousedown", e => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener("mousemove", e => {
  if (!isDrawing) return;
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = 25;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];

  if (getFilledPercentage() > 60) {
    handleCompleteReveal();
  }
});
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mouseleave", () => isDrawing = false);

// For touch support
canvas.addEventListener("touchstart", e => {
  e.preventDefault();
  isDrawing = true;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
});
canvas.addEventListener("touchmove", e => {
  e.preventDefault();
  if (!isDrawing) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = 25;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  [lastX, lastY] = [x, y];

  if (getFilledPercentage() > 60) {
    handleCompleteReveal();
  }
});
canvas.addEventListener("touchend", () => isDrawing = false);
canvas.addEventListener("touchcancel", () => isDrawing = false);

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
