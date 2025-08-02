let destinyOptions = [
  "Priya", "Neha", "Simran", "Shruti", "Riya", "Aarohi", "Kavya", "Ishita", "Sakshi",
  "You will be a CEO!", "You will travel to Paris!", "Your lucky number is 7!"
];
let destinyResult = "";

document.getElementById("payBtn").onclick = function(){
  var options = {
    "key": "YOUR_RAZORPAY_KEY", // replace with your Razorpay Key
    "amount": 1000, // 10 INR (in paise)
    "currency": "INR",
    "name": "Destiny Scratch Cards",
    "description": "Scratch to reveal your destiny",
    "handler": function (response){
      // Payment success
      alert("✅ Payment Successful! Now scratch your card.");
      showScratchCard();
    }
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
};

function showScratchCard() {
  destinyResult = destinyOptions[Math.floor(Math.random()*destinyOptions.length)];
  document.getElementById('scratchCard').style.display = 'block';
  document.getElementById('scratchText').innerHTML = "✨ " + destinyResult + " ✨";
  setupScratch();
}

function setupScratch() {
  const canvas = document.getElementById('scratchCanvas');
  const ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'silver';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'destination-out';
  let isDrawing = false;

  canvas.onmousedown = e => { isDrawing = true; scratch(e); };
  canvas.onmouseup = () => { isDrawing = false; };
  canvas.onmouseleave = () => { isDrawing = false; };
  canvas.onmousemove = e => { if (isDrawing) scratch(e); };

  canvas.ontouchstart = e => { isDrawing = true; scratch(e.touches[0]); e.preventDefault(); };
  canvas.ontouchend = () => { isDrawing = false; };
  canvas.ontouchcancel = () => { isDrawing = false; };
  canvas.ontouchmove = e => { if (isDrawing) scratch(e.touches[0]); e.preventDefault(); };

  function scratch(e) {
    const rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2, false);
    ctx.fill();
    revealIfScratchedEnough();
  }

  function revealIfScratchedEnough() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    let transparent = 0;
    for(let i=3; i<pixels.length; i+=4) if(pixels[i] < 128) transparent++;
    let percent = transparent / (canvas.width * canvas.height) * 100;
    if(percent > 50) {
      canvas.style.display = 'none';
    }
  }
}