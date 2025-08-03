const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to match displayed size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Fill canvas with silver (scratch surface)
ctx.fillStyle = 'silver';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let isDrawing = false;

function scratch(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
  const y = (e.clientY || e.touches?.[0].clientY) - rect.top;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
}

canvas.addEventListener('pointerdown', (e) => {
  isDrawing = true;
  scratch(e);
});

canvas.addEventListener('pointermove', (e) => {
  if (!isDrawing) return;
  scratch(e);
});

canvas.addEventListener('pointerup', () => {
  isDrawing = false;
});

canvas.addEventListener('pointerleave', () => {
  isDrawing = false;
});
