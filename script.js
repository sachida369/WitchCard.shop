document.getElementById('payBtn').onclick = function(e){
  let userData = {
    name: document.getElementById('name').value,
    dob: document.getElementById('dob').value,
    place: document.getElementById('birthPlace').value,
    time: document.getElementById('birthTime').value
  };

  var options = {
      "key": "rzp_live_Hd6RirzluzFacK",
      "amount": 1000,
      "currency": "INR",
      "name": "Destiny Scratch Cards",
      "description": "Unlock your destiny",
      "handler": function (response){
          localStorage.setItem('destinyUser', JSON.stringify(userData));
          window.location.href = "scratch.html";
      },
      "theme": { "color": "#6A0DAD" }
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
}
