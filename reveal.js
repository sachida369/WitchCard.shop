const formData = JSON.parse(localStorage.getItem('formData')) || {};
const gender = formData.name?.trim().toLowerCase().endsWith('a') ? 'girls' : 'boys';

fetch(`${gender}.json`)
  .then(res => res.json())
  .then(data => {
    const name = data[Math.floor(Math.random() * data.length)];
    document.getElementById('revealedName').textContent = `Her Name Is: ${name}`;
  });

document.getElementById('downloadBtn').addEventListener('click', () => {
  html2canvas(document.querySelector('.card-wrapper')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'your-destiny.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

document.getElementById('whatsappShare').href =
  `https://wa.me/?text=I%20just%20scratched%20my%20destiny!%20Try%20it%20here:%20https://sachida369.github.io/destiny-scratch/`;
