const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const revealText = document.getElementById('reveal-text');

let isDrawing = false;
let lastPoint = null;

// Set canvas size to match CSS box
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Fill with silver foil
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#c0c0c0");
  gradient.addColorStop(1, "#a9a9a9");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function getPointerPosition(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  return { x, y };
}

function scratch(x, y) {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, 2 * Math.PI);
  ctx.fill();
}

function getScratchedPercentage() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let transparentPixels = 0;
  for (let i = 3; i < imageData.data.length; i += 4) {
    if (imageData.data[i] < 128) transparentPixels++;
  }
  const totalPixels = canvas.width * canvas.height;
  return transparentPixels / totalPixels;
}

function revealName() {
  const gender = localStorage.getItem('gender') || 'girl';
  const nameList = gender === 'boy' ? 'boys.json' : 'girls.json';

  fetch(nameList)
    .then(res => res.json())
    .then(names => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      revealText.innerText = randomName;
    });
}

// Mouse events
canvas.addEventListener('mousedown', e => {
  isDrawing = true;
  lastPoint = getPointerPosition(e);
  scratch(lastPoint.x, lastPoint.y);
});
canvas.addEventListener('mousemove', e => {
  if (!isDrawing) return;
  const point = getPointerPosition(e);
  scratch(point.x, point.y);
  if (getScratchedPercentage() > 0.6) {
    canvas.style.pointerEvents = 'none';
    revealName();
  }
});
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseleave', () => isDrawing = false);

// Touch events
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  isDrawing = true;
  const point = getPointerPosition(e);
  scratch(point.x, point.y);
});
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (!isDrawing) return;
  const point = getPointerPosition(e);
  scratch(point.x, point.y);
  if (getScratchedPercentage() > 0.6) {
    canvas.style.pointerEvents = 'none';
    revealName();
  }
});
canvas.addEventListener('touchend', () => isDrawing = false);
