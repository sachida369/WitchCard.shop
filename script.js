document.getElementById("payButton").addEventListener("click", function() {
  const name = document.getElementById("name").value.trim();
  const dob = document.getElementById("dob").value;
  const place = document.getElementById("place").value.trim();
  const time = document.getElementById("time").value;
  const privacy = document.getElementById("privacyCheck").checked;

  if (!name || !dob || !place || !time || !privacy) {
    alert("Please fill all fields and accept the Privacy Policy.");
    return;
  }

  const options = {
    key: "rzp_test_123456789", // replace with live key
    amount: 1000,
    currency: "INR",
    name: "Destiny Scratch Cards",
    description: "Reveal your future partner",
    handler: function () {
      localStorage.setItem("formData", JSON.stringify({ name, dob, place, time }));
      window.location.href = "scratch.html";
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
});
