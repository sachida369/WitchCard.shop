let destinyOptions = [
  "Priya", "Neha", "Simran", "Shruti", 
  "Riya", "Aarohi", "Kavya", "Ishita", "Sakshi",
  "You will be a CEO!", "You will travel to Paris!", "Your lucky number is 7!"
];

let destinyResult = "";

// Razorpay Payment
function payNow(){
  var options = {
    "key": "rzp_live_Hd6RirzluzFacK", // ✅ your key
    "amount": 1000, // 10 INR
    "currency": "INR",
    "name": "Destiny Scratch Card",
    "handler": function (response){
      showScratchCard();
    }
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
}

// Show Scratch Card after Payment
function showScratchCard() {
  destinyResult = destinyOptions[Math.floor(Math.random()*destinyOptions.length)];
  document.getElementById('scratch-card-container').style.display = 'block';
  setupScratch(destinyResult);
}

// Scratch Setup
function setupScratch(predictionText) {
  const canvas = document.getElementById('scratchCard');
  const ctx = canvas.getContext('2d');
  const textDiv = document.getElementById('scratchText');

  // Hide prediction initially
  textDiv.innerHTML = "✨ " + predictionText + " ✨";
  textDiv.style.opacity = 0;

  // Silver foil
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
      canvas.style.display = 'none';
      textDiv.style.opacity = 1;
      document.getElementById('postActions').style.display = 'block';
    }
  }
}

// Download Badge
function downloadBadge() {
  const name = document.getElementById('name').value;
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  const bg = new Image();
  bg.src = "images/astrologer-globe.png";
  bg.onload = () => {
    ctx.drawImage(bg, 0, 0, 400, 400);
    ctx.fillStyle = "gold";
    ctx.font = "20px Poppins";
    ctx.fillText("✨ Destiny ✨", 130, 40);
    ctx.fillText("Name: " + name, 50, 300);
    ctx.fillText("Prediction: " + destinyResult, 50, 330);

    const link = document.createElement("a");
    link.download = "destiny-badge.png";
    link.href = canvas.toDataURL();
    link.click();
  };
}

// WhatsApp Share
function shareWhatsApp() {
  const text = "My destiny result: " + destinyResult + " 🔮 Try yours at: " + window.location.href;
  window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
}

// Referral Share
function shareReferral() {
  const refLink = window.location.origin + "/?ref=" + document.getElementById('name').value;
  const text = "Scratch your destiny card & earn rewards! " + refLink;
  window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
}
