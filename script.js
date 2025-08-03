document.addEventListener("DOMContentLoaded", function () {
  const dobInput = document.getElementById("dob");
  const payBtn = document.getElementById("payBtn");
  const form = document.getElementById("destinyForm");

  function isValidDOB(dob) {
    const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dobRegex.test(dob);
  }

  dobInput.addEventListener("input", function () {
    payBtn.disabled = !isValidDOB(dobInput.value);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!isValidDOB(dobInput.value)) {
      alert("Please enter a valid DOB in dd/mm/yyyy format.");
      return;
    }

    if (!document.getElementById("policyAgree").checked) {
      alert("You must agree to the Privacy Policy.");
      return;
    }

    // Simulate payment (You can replace this with Razorpay or actual logic)
    alert("Redirecting to payment gateway...");
    window.location.href = "scratch.html";
  });
});
