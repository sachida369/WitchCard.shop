const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

ctx.fillStyle = 'silver';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let isDrawing = false;
canvas.addEventListener('touchstart', () => isDrawing = true);
canvas.addEventListener('touchend', () => isDrawing = false);
canvas.addEventListener('touchmove', (e) => {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
});

document.getElementById("download-btn").addEventListener("click", () => {
  html2canvas(document.querySelector(".card-wrapper")).then(canvas => {
    const link = document.createElement("a");
    link.download = "your_prediction.png";
    link.href = canvas.toDataURL();
    link.click();
  });
});

document.getElementById("whatsapp-share").href =
  `https://wa.me/?text=Check%20out%20my%20fortune%20card!%20https://sachida369.github.io/destiny-scratch/`;
