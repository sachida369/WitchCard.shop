function setupScratch(predictionText) {
  const canvas = document.getElementById('scratchCard');
  const ctx = canvas.getContext('2d');
  const textDiv = document.getElementById('scratchText');

  // Put the prediction text
  textDiv.innerHTML = "✨ " + predictionText + " ✨";

  // Fill with silver foil
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'silver';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'destination-out';

  let isDrawing = false;

  function scratch(e) {
    const rect = canvas.getBoundingClientRect();
    let x = (e.clientX || e.touches[0].clientX) - rect.left;
    let y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2, false);
    ctx.fill();
    checkReveal();
  }

  canvas.onmousedown = () => isDrawing = true;
  canvas.onmouseup = () => isDrawing = false;
  canvas.onmousemove = (e) => { if (isDrawing) scratch(e); };

  canvas.ontouchstart = (e) => { isDrawing = true; scratch(e); e.preventDefault(); };
  canvas.ontouchend = () => isDrawing = false;
  canvas.ontouchmove = (e) => { if (isDrawing) scratch(e); e.preventDefault(); };

  function checkReveal() {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }
    if (transparent / (canvas.width * canvas.height) > 0.5) {
      canvas.style.display = 'none'; // hide foil after 50% scratch
    }
  }
}

// Example: call setupScratch after payment success
setupScratch("Priya will be your destiny!");
