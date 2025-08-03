document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("scratchCanvas");
  const ctx = canvas.getContext("2d");

  const width = 300;
  const height = 300;
  canvas.width = width;
  canvas.height = height;

  // Draw foil texture
  const foil = new Image();
  foil.src = "foil-texture.jpg";
  foil.onload = () => {
    ctx.drawImage(foil, 0, 0, width, height);
  };

  let isDrawing = false;

  function getPosition(e) {
    let rect = canvas.getBoundingClientRect();
    let x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    let y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x, y };
  }

  function scratch(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  function getScratchedPercent() {
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++;
    }

    const totalPixels = width * height;
    return (transparent / totalPixels) * 100;
  }

  function checkReveal() {
    if (getScratchedPercent() >= 60) {
      canvas.style.display = "none";
      document.getElementById("revealName").style.display = "block";
    }
  }

  canvas.addEventListener("mousedown", () => isDrawing = true);
  canvas.addEventListener("mouseup", () => isDrawing = false);
  canvas.addEventListener("mousemove", e => {
    if (!isDrawing) return;
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
    checkReveal();
  });

  canvas.addEventListener("touchstart", () => isDrawing = true);
  canvas.addEventListener("touchend", () => isDrawing = false);
  canvas.addEventListener("touchmove", e => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPosition(e);
    scratch(pos.x, pos.y);
    checkReveal();
  }, { passive: false });
});
