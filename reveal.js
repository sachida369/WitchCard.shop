window.onload = async function() {
  const formData = JSON.parse(localStorage.getItem("formData"));
  if (!formData) {
    document.getElementById("reveal-text").innerText = "No Data Found";
    return;
  }

  const res = await fetch("girls.json");
  const data = await res.json();
  const randomName = data.names[Math.floor(Math.random() * data.names.length)];

  document.getElementById("reveal-text").innerText = `💖 ${randomName} 💖`;

  // Download Button
  document.getElementById("downloadBtn").addEventListener("click", () => {
    html2canvas(document.getElementById("globe-container")).then(canvas => {
      const link = document.createElement("a");
      link.download = "destiny-card.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });

  // WhatsApp Share
  document.getElementById("shareBtn").addEventListener("click", () => {
    const text = `I just revealed my future partner's name: ${randomName}! 🌌 Try yours 👉 ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  });
};
