document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem('formData')) || {};
  const revealedEl = document.getElementById('revealedName');

  // Gender heuristic (can be improved later)
  const isLikelyFemale = userData.name?.trim().toLowerCase().endsWith('a');
  const gender = isLikelyFemale ? 'girls' : 'boys';

  fetch(`${gender}.json`)
    .then(res => res.json())
    .then(data => {
      const name = data[Math.floor(Math.random() * data.length)] || 'Mystery Soul';
      revealedEl.textContent = `Her Name Is: ${name}`;

      // WhatsApp share (after name is loaded)
      document.getElementById('whatsappShare').href =
        `https://wa.me/?text=I%20just%20scratched%20my%20destiny!%20Her%20name%20is%20${encodeURIComponent(name)}.%20Try%20it%20yourself:%20https://sachida369.github.io/destiny-scratch/`;
    })
    .catch(err => {
      revealedEl.textContent = "Could not load your destiny.";
      console.error("Error fetching name list:", err);
    });

  // Download image
  document.getElementById('downloadBtn').addEventListener('click', () => {
    html2canvas(document.querySelector(".scratch-container")).then(canvas => {
      const link = document.createElement('a');
      link.download = 'your-destiny.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  });
});
