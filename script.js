let destinyResult = "";

document.getElementById("privacy").addEventListener("change", function() {
  document.getElementById("payButton").disabled = !this.checked;
});

document.getElementById("payButton").onclick = function () {
  var options = {
    "key": "rzp_live_Hd6RirzluzFacK",
    "amount": 1000,
    "currency": "INR",
    "name": "Destiny Scratch",
    "handler": function (response){
      showScratchCard();
    }
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
};

function showScratchCard() {
  destinyResult = generatePrediction();
  document.getElementById("scratchText").innerText = `✨ ${destinyResult} ✨`;
  document.getElementById("scratch-card-container").style.display = "block";
  setupScratch();
}

function setupScratch() {
  const canvas = document.getElementById('scratchCard');
  const ctx = canvas.getContext('2d');
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
  }

  canvas.onmousedown = () => isDrawing = true;
  canvas.onmouseup = () => isDrawing = false;
  canvas.onmousemove = e => isDrawing && scratch(e);

  canvas.ontouchstart = e => { isDrawing = true; scratch(e); };
  canvas.ontouchend = () => isDrawing = false;
  canvas.ontouchmove = e => { if (isDrawing) scratch(e); };
}

function generatePrediction() {
  const name = document.getElementById("name").value;
  const dob = document.getElementById("dob").value;
  const gender = (name.endsWith("a") || name.endsWith("i")) ? "girl" : "boy";
  
  const list = gender === "girl" ? girlNames : boyNames;
  const seed = name.length + new Date(dob).getDate();
  return list[seed % list.length];
}

// Download card
document.getElementById("downloadBtn").onclick = function() {
  html2canvas(document.querySelector(".scratch-wrapper")).then(canvas => {
    let link = document.createElement('a');
    link.download = 'destiny-card.png';
    link.href = canvas.toDataURL();
    link.click();
  });
};

// Share on WhatsApp
document.getElementById("whatsappBtn").onclick = function() {
  let msg = `I scratched my destiny card & found: ${destinyResult}! 🔮 Check yours: https://sachida369.github.io/destiny-scratch`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
};
