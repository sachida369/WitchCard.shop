document.getElementById("destinyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const dob = document.getElementById("dob").value.trim();
  const birthplace = document.getElementById("birthplace").value.trim();
  const time = document.getElementById("time").value.trim();
  const agree = document.getElementById("agree").checked;

  const dobPattern = /^\d{2}\/\d{2}\/\d{4}$/;
  const timePattern = /^\d{2}:\d{2}$/;

  if (!dobPattern.test(dob)) {
    alert("Please enter DOB in dd/mm/yyyy format.");
    return;
  }

  if (!timePattern.test(time)) {
    alert("Please enter Time in hh:mm format.");
    return;
  }

  if (!agree) {
    alert("Please agree to the privacy policy to continue.");
    return;
  }

  // Simulate payment success
  alert("Payment Successful ✅");
  window.location.href = "scratch.html";
});
