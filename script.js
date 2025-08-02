document.getElementById('pay-button').onclick = function (e) {
  var options = {
    "key": "rzp_live_Hd6RirzluzFacK", // 🔑 Your Razorpay Key ID
    "amount": 1000, // Amount is in paise = ₹10
    "currency": "INR",
    "name": "Destiny Scratch Cards",
    "description": "Unlock your destiny",
    "image": "https://cdn-icons-png.flaticon.com/512/2910/2910768.png",
    "handler": function (response) {
      alert("Payment Successful! ID: " + response.razorpay_payment_id);
      
      // ✅ Show Scratch Card After Payment
      document.getElementById('scratch-card-container').style.display = "block";
      initScratchCard();
    },
    "theme": {
      "color": "#3399cc"
    }
  };
  
  var rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
};

// 🎯 Scratch Card Functionality
function initScratchCard() {
  const canvas = document.getElementById('scratchCard');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Hidden message
  ctx.fillStyle = "gold";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText("✨ You will be a CEO! ✨", width / 2, height / 2);

  // Overlay
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, width, height);

  let isDrawing = false;

  canvas.addEventListener("mousedown", () => { isDrawing = true; });
  canvas.addEventListener("mouseup", () => { isDrawing = false; });
  canvas.addEventListener("mousemove", draw);

  function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.clearRect(x - 15, y - 15, 30, 30);
  }
}
