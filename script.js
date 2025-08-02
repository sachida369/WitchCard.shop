// ✅ Enable Pay Button only if Privacy Policy is checked
document.getElementById('privacyCheck')?.addEventListener('change', function () {
  const payBtn = document.getElementById('payButton');
  if (payBtn) {
    payBtn.disabled = !this.checked;
  }
});

// ✅ Razorpay payment
function payNow() {
  const name = document.getElementById("name").value.trim();
  const dob = document.getElementById("dob").value;
  const place = document.getElementById("place").value.trim();
  const time = document.getElementById("time").value;
  const gender = document.getElementById("gender").value;

  // 🔹 DOB Validation: 1920–2010
  const year = new Date(dob).getFullYear();
  if (year < 1920 || year > 2010) {
    alert("Please enter Date of Birth between 1920 and 2010.");
    return;
  }

  if (!name || !dob || !place || !time || !gender) {
    alert("⚠️ Please fill all fields.");
    return;
  }

  // ✅ Save user data for scratch page
  localStorage.setItem("destinyUser", JSON.stringify({ name, dob, place, time, gender }));

  const options = {
    key: "rzp_live_Hd6RirzluzFacK",  // ⚠️ Replace with your live/test Razorpay Key
    amount: 1000, // ₹10 (amount is in paise)
    currency: "INR",
    name: "Destiny Scratch",
    description: "Unlock your destiny",
    handler: function (response) {
      // ✅ Redirect after payment success
      window.location.href = "scratch.html";
    },
    prefill: {
      name: name,
      email: "user@example.com",
      contact: "9999999999"
    },
    theme: { color: "#ff4081" }
  };
  const rzp = new Razorpay(options);
  rzp.open();
}

// ✅ Modal Logic for Privacy Policy
function openPrivacyPolicy() {
  document.getElementById('privacyModal').style.display = 'flex';
}
function closePrivacyPolicy() {
  document.getElementById('privacyModal').style.display = 'none';
}
