const userData = JSON.parse(localStorage.getItem('userData')) || {};
const gender = userData.name.endsWith('a') ? 'girls' : 'boys';

fetch(`${gender}.json`)
  .then(res => res.json())
  .then(data => {
    const name = data[Math.floor(Math.random() * data.length)];
    document.getElementById('revealedName').textContent = `Her Name Is: ${name}`;
  });

document.getElementById('downloadBtn').addEventListener('click', () => {
  html2canvas(document.querySelector(".scratch-container")).then(canvas => {
    const link = document.createElement('a');
    link.download = 'your-destiny.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

document.getElementById('whatsappShare').href = `https://wa.me/?text=I%20just%20scratched%20my%20destiny!%20Try%20it%20here:%20https://sachida369.github.io/destiny-scratch/`;
