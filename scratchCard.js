const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = document.querySelector(".globe").offsetWidth;
  canvas.height = document.querySelector(".globe").offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const foil = new Image();
foil.src = "https://i.ibb.co/ZH6xR5J/foil-texture.jpg"; // silver foil texture
foil.onload = () => ctx.drawImage(foil, 0, 0, canvas.width, canvas.height);

let isDrawing = false;

function scratch(e) {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX || e.touches[0].clientX) - rect.left;
  const y = (e.clientY || e.touches[0].clientY) - rect.top;

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2);
  ctx.fill();
}

canvas.addEventListener("mousedown", () => isDrawing = true);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousemove", scratch);

canvas.addEventListener("touchstart", () => isDrawing = true);
canvas.addEventListener("touchend", () => isDrawing = false);
canvas.addEventListener("touchmove", scratch);
