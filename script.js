const payBtn = document.getElementById("payBtn");
const overlay = document.getElementById("videoOverlay");
const witchVideo = document.getElementById("witchVideo");
const scratchSection = document.getElementById("scratch-section");

payBtn.addEventListener("click", () => {
  overlay.style.display = "flex";
  witchVideo.play();

  witchVideo.onended = () => {
    overlay.style.display = "none";

    var options = {
      "key": "rzp_live_Hd6RirzluzFacK", // ✅ Your Razorpay Live Key
      "amount": 1000, // 10 INR in paise
      "currency": "INR",
      "name": "Destiny Scratch Card",
      "description": "Unlock Your Destiny",
      "handler": function (response){
        scratchSection.style.display = "block";
        startScratch();
      },
      "theme": {
        "color": "#800080"
      }
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
  };
});

function startScratch() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const reward = document.getElementById('reward');
  let isDrawing = false;

  // Silver Foil
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  canvas.addEventListener('mousedown', () => isDrawing = true);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mousemove', scratch);
  canvas.addEventListener('touchstart', () => isDrawing = true);
  canvas.addEventListener('touchend', () => isDrawing = false);
  canvas.addEventListener('touchmove', scratch);

  function scratch(e) {
    if (!isDrawing && !e.touches) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clearPixels = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] === 0) clearPixels++;
    }
    const scratchedPercent = clearPixels / (canvas.width * canvas.height) * 100;

    if (scratchedPercent > 45) {
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.display = 'none';
        reward.classList.add('show-reward');
      }, 1000);
    }
  }
}
