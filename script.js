document.getElementById('payment-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const privacyCheckbox = document.querySelector('input[type="checkbox"]');
  if (!privacyCheckbox.checked) {
    alert('Please agree to the Privacy Policy.');
    return;
  }

  const name = document.getElementById('name').value;
  const dob = document.getElementById('dob').value;
  const place = document.getElementById('place').value;
  const time = document.getElementById('time').value;

  const options = {
    key: 'rzp_live_Hd6RirzluzFacK',
    amount: 1000,
    currency: 'INR',
    name: 'Destiny Scratch Cards',
    description: 'Reveal your destiny',
    handler: function () {
      localStorage.setItem('formData', JSON.stringify({ name, dob, place, time }));
      window.location.href = 'scratch.html';
    },
    theme: {
      color: '#00f0ff'
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
});
