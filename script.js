document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("user-form");
  const dobInput = form.querySelector('input[name="dob"]');
  const payBtn = document.getElementById("pay-btn");

  form.addEventListener("input", () => {
    const isValidDOB = /^\d{2}\/\d{2}\/\d{4}$/.test(dobInput.value);
    const allFilled = [...form.elements].every(el => el.value.trim() !== "" && (!el.type === "checkbox" || el.checked));
    payBtn.disabled = !(isValidDOB && allFilled);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.href = "scratch.html";
  });

  const modal = document.getElementById("privacy-modal");
  const link = document.getElementById("privacy-link");
  const close = document.querySelector(".close");
  link.onclick = () => { modal.style.display = "block"; };
  close.onclick = () => { modal.style.display = "none"; };
});
