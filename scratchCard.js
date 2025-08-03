const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const image = document.querySelector('.scratch-image');

function resizeCanvas() {
  canvas.width = image.offsetWidth;
  canvas.height = image.offsetHeight;

  ctx.fillStyle = 'silver';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

resizeCanvas();

let drawing = false;
canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);

canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2);
  ctx.fill();
});
