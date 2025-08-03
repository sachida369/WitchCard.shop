document.getElementById('user-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const privacy = document.getElementById('privacy');
  if (!privacy.checked) {
    alert('Please agree to the Privacy Policy.');
    return;
  }

  const options = {
    key: 'rzp_live_Hd6RirzluzFacK',
    amount: 1000,
    currency: 'INR',
    name: 'Destiny Scratch Cards',
    description: 'Reveal your destiny',
    handler: function () {
      localStorage.setItem('formData', JSON.stringify({
        name: document.querySelector('input[name=name]').value,
        dob: document.querySelector('input[name=dob]').value,
        place: document.querySelector('input[name=place]').value,
        time: document.querySelector('input[name=time]').value
      }));
      window.location.href = 'scratch.html';
    },
    theme: { color: '#00f0ff' },
  };

  const rzp = new Razorpay(options);
  rzp.open();
});
