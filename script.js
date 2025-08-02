const payBtn = document.getElementById('payBtn');

payBtn.addEventListener('click', function(e){
  e.preventDefault();
  
  var options = {
    "key": "rzp_live_Hd6RirzluzFacK",
    "amount": 1000, // = ₹10 (paise me)
    "currency": "INR",
    "name": "Destiny Scratch Cards",
    "description": "Unlock your prediction",
    "handler": function (response){
      document.getElementById('scratch-card-container').style.display = 'block';
      startScratch();
    },
    "theme": {
      "color": "#ffba08"
    }
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
});

function startScratch() {
  const canvas = document.getElementById('scratchCard');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Gray foil
  ctx.fillStyle = '#C0C0C0';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'destination-out';

  let isDrawing = false;

  canvas.addEventListener('mousedown', () => isDrawing = true);
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mousemove', draw);

  function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  // Prediction
  ctx.globalCompositeOperation = 'source-over';
  ctx.font = "20px Poppins";
  ctx.fillStyle = "gold";
  ctx.textAlign = "center";
  ctx.fillText("✨ Your GF's Name: Priya ✨", width / 2, height / 2);
  ctx.globalCompositeOperation = 'destination-out';
}
