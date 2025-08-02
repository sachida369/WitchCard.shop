// Enable Pay Button
document.getElementById('privacyCheck')?.addEventListener('change', function () {
  document.getElementById('payButton').disabled = !this.checked;
});

// Razorpay payment logic
function payNow() {
  const name = document.getElementById("name").value;
  const dob = document.getElementById("dob").value;
  const place = document.getElementById("place").value;
  const time = document.getElementById("time").value;
  const gender = document.getElementById("gender").value;

  if (!name || !dob || !place || !time || !gender) {
    alert("Please fill all fields.");
    return;
  }

  localStorage.setItem("destinyUser", JSON.stringify({ name, dob, place, time, gender }));

  const options = {
    key: "rzp_live_Hd6RirzluzFacK",
    amount: 1000,
    currency: "INR",
    name: "Destiny Scratch",
    description: "Unlock your destiny",
    handler: function (response) {
      window.location.href = "scratch.html";
    },
    theme: { color: "#ff4081" }
  };
  const rzp = new Razorpay(options);
  rzp.open();
}

// Scratch Page Logic
if (window.location.pathname.includes('scratch.html')) {
  const user = JSON.parse(localStorage.getItem("destinyUser")) || {};
  const boyNames = ["Aarav", "Vihaan", "Aditya", "Arjun", "Kabir", "Rohan", "Yash", "Dev"];
  const girlNames = ["Ananya", "Priya", "Simran", "Kavya", "Riya", "Aarohi", "Shruti", "Ishita"];
  const names = user.gender === "male" ? girlNames : boyNames;
  const chosenName = names[Math.floor(Math.random() * names.length)];
  document.getElementById("resultText").innerText = `✨ You will meet ${chosenName} ✨`;

  const canvas = document.getElementById("scratchCanvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#C0C0C0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "destination-out";

  let isDrawing = false;
  canvas.addEventListener("mousedown", () => isDrawing = true);
  canvas.addEventListener("mouseup", () => isDrawing = false);
  canvas.addEventListener("mousemove", e => { if (isDrawing) scratch(e); });

  canvas.addEventListener("touchstart", () => isDrawing = true);
  canvas.addEventListener("touchend", () => isDrawing = false);
  canvas.addEventListener("touchmove", e => { if (isDrawing) scratch(e); e.preventDefault(); });

  function scratch(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Download & Share
function downloadCard() {
  html2canvas(document.getElementById("result-card")).then(canvas => {
    const link = document.createElement("a");
    link.download = "destiny-card.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

function shareWhatsApp() {
  const user = JSON.parse(localStorage.getItem("destinyUser")) || {};
  const text = `I just scratched my destiny! 🔮 Find yours too: https://sachida369.github.io/destiny-scratch/?ref=${user.name || "friend"}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}
