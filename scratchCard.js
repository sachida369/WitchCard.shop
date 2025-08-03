const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

ctx.fillStyle = '#C0C0C0';
ctx.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  draw(e);
});

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
  checkReveal();
});

canvas.addEventListener('touchstart', (e) => {
  isDrawing = true;
  draw(e.touches[0]);
});

canvas.addEventListener('touchmove', (e) => {
  draw(e.touches[0]);
});

canvas.addEventListener('touchend', () => {
  isDrawing = false;
  checkReveal();
});

function draw(e) {
  if (!isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, 2 * Math.PI);
  ctx.fill();
}

function checkReveal() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let cleared = 0;

  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i + 3] < 128) {
      cleared++;
    }
  }

  const total = canvas.width * canvas.height;
  if (cleared > total * 0.5) {
    canvas.style.display = 'none';
  }
}
