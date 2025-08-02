let selectedGender = 'girl'; // infer from name input later

document.getElementById('agree').addEventListener('change', function () {
  document.getElementById('payBtn').disabled = !this.checked;
});

document.getElementById('payBtn').addEventListener('click', function () {
  const name = document.getElementById('name').value.trim();
  const dob = document.getElementById('dob').value;

  if (!name || !dob) {
    alert("Fill all fields");
    return;
  }

  const options = {
    key: "rzp_live_Hd6RirzluzFacK",
    amount: 1000,
    currency: "INR",
    name: "Destiny Cards",
    description: "Reveal your destiny",
    handler: function () {
      document.getElementById('cardSection').classList.remove('hidden');
      loadPrediction(name, dob);
      initScratch();
    }
  };
  const rzp = new Razorpay(options);
  rzp.open();
});

function loadPrediction(name, dob) {
  const gender = name.endsWith('a') ? 'girl' : 'boy';
  const jsonFile = gender === 'girl' ? 'girls.json' : 'boys.json';
  fetch(jsonFile)
    .then(res => res.json())
    .then(data => {
      const randomName = data[Math.floor(Math.random() * data.length)];
      document.getElementById('predictionText').textContent = randomName;
    });
}

document.getElementById('downloadBtn').addEventListener('click', () => {
  html2canvas(document.querySelector("#resultCard")).then(canvas => {
    const link = document.createElement('a');
    link.download = 'destiny_card.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

document.getElementById('shareBtn').addEventListener('click', () => {
  const link = `https://wa.me/?text=Check%20your%20Destiny%20Card%20%F0%9F%94%AE%20https://yourdomain.com`;
  document.getElementById('shareBtn').href = link;
});
