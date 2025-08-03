document.getElementById('payment-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const privacyCheckbox = document.querySelector('input[type="checkbox"]');
  if (!privacyCheckbox.checked) {
    alert('Please agree to the Privacy Policy.');
    return;
  }

  const name = document.getElementById('name').value.trim();
  const dob = document.getElementById('dob').value;
  const place = document.getElementById('place').value.trim();
  const time = document.getElementById('time').value;

  if (!name || !dob || !place || !time) {
    alert("Please fill in all fields.");
    return;
  }

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
    },
    modal: {
      ondismiss: function () {
        alert('Payment cancelled. Try again to reveal your destiny.');
      }
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
});
