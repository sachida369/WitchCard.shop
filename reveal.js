async function fetchName(gender = "girls") {
  const res = await fetch(`${gender}.json`);
  const data = await res.json();
  const name = data[Math.floor(Math.random() * data.length)];
  document.getElementById("reveal-text").textContent = name;
}
fetchName();
