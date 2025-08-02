document.getElementById('privacyCheck')?.addEventListener('change', function () {
  document.getElementById('payButton').disabled = !this.checked;
});

// Razorpay payment
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

// ✅ Modal Logic
function openPrivacyPolicy() {
  document.getElementById('privacyModal').style.display = 'flex';
}
function closePrivacyPolicy() {
  document.getElementById('privacyModal').style.display = 'none';
}
