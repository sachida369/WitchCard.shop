// Enable payment button only when privacy is checked
document.getElementById('privacyCheck').addEventListener('change', function() {
  document.getElementById('payButton').disabled = !this.checked;
});

// Razorpay payment
function payNow() {
  var options = {
    "key": "rzp_live_Hd6RirzluzFacK", 
    "amount": 1000, // 10 INR
    "currency": "INR",
    "name": "Destiny Scratch",
    "description": "Unlock your destiny",
    "handler": function (response){
      document.getElementById('form-section').style.display = 'none';
      document.getElementById('scratch-card-section').style.display = 'block';
      setupScratch();
    },
    "theme": { "color": "#ff9800" }
  };
  var rzp = new Razorpay(options);
  rzp.open();
}

// Scratch card setup
function setupScratch() {
  const canvas = document.getElementById('scratchCard');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const isGirl = confirm("Is the user Female? Click OK for Girl, Cancel for Boy.");
  const nameArray = isGirl ? girlNames : boyNames;

  const randomName = nameArray[Math.floor(Math.random() * nameArray.length)];
  document.getElementById('resultText').innerText = `Your Destiny Match: ${randomName}`;

  let isDrawing = false;
  function scratch(e) {
    if (!isDrawing) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    ctx.arc((e.clientX || e.touches[0].clientX) - rect.left, 
            (e.clientY || e.touches[0].clientY) - rect.top, 
            20, 0, Math.PI * 2);
    ctx.fill();
  }
  canvas.addEventListener('mousedown', () => isDrawing = true);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mousemove', scratch);
  canvas.addEventListener('touchstart', () => isDrawing = true);
  canvas.addEventListener('touchend', () => isDrawing = false);
  canvas.addEventListener('touchmove', scratch);
}

// Download card
function downloadCard() {
  html2canvas(document.querySelector('.scratch-wrapper')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'destiny-card.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

// Share on WhatsApp
function shareWhatsApp() {
  const link = `https://sachida369.github.io/destiny-scratch/?ref=${document.getElementById('name').value}`;
  const msg = `I just revealed my Destiny Match! 🔮 Check yours here: ${link}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}
