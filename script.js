document.getElementById("payBtn").addEventListener("click", function () {
  const name = document.getElementById("name").value.trim();
  const dob = document.getElementById("dob").value.trim();
  const place = document.getElementById("place").value.trim();
  const time = document.getElementById("time").value.trim();
  const agree = document.getElementById("agree").checked;

  if (!name || !dob || !place || !time) {
    alert("Please fill in all fields.");
    return;
  }

  const dobPattern = /^\d{2}\/\d{2}\/\d{4}$/;
  const timePattern = /^\d{2}:\d{2}$/;

  if (!dobPattern.test(dob)) {
    alert("Enter DOB in dd/mm/yyyy format.");
    return;
  }

  if (!timePattern.test(time)) {
    alert("Enter time in hh:mm format.");
    return;
  }

  if (!agree) {
    alert("Please accept the Privacy Policy.");
    return;
  }

  // After payment success (mock)
  window.location.href = "scratch.html";
});
