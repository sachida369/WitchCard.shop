const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

ctx.fillStyle = 'silver';
ctx.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener('mousedown', function (e) {
  canvas.isDrawing = true;
});
canvas.addEventListener('mouseup', function () {
  canvas.isDrawing = false;
});
canvas.addEventListener('mousemove', function (e) {
  if (!canvas.isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fill();
});
