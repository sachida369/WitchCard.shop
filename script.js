document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("destinyForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get values
    const name = document.getElementById("name").value.trim();
    const dob = document.getElementById("dob").value;
    const place = document.getElementById("place").value.trim();
    const time = document.getElementById("time").value;
    const privacyChecked = document.getElementById("privacyCheck").checked;

    // Validate
    if (!name || !dob || !place || !time || !privacyChecked) {
      alert("Please fill all fields and agree to the Privacy Policy.");
      return;
    }

    // Store data in localStorage
    localStorage.setItem("destinyData", JSON.stringify({ name, dob, place, time }));

    // Trigger Razorpay Payment
    const options = {
      key: "rzp_live_Hd6RirzluzFacK", // Replace with your Razorpay live key
      amount: 1000, // 10 INR = 1000 paisa
      currency: "INR",
      name: "Destiny Scratch Cards",
      description: "Reveal your mystic destiny",
      image: "witch-globe.png",
      handler: function (response) {
        // On successful payment
        localStorage.setItem("razorpay_payment_id", response.razorpay_payment_id);
        window.location.href = "scratch.html";
      },
      prefill: {
        name: name,
      },
      theme: {
        color: "#663399"
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  });
});
