// reveal.js

// Get formData and guess gender
const formData = JSON.parse(localStorage.getItem('formData')) || {};
const gender = formData.name?.trim().toLowerCase().endsWith('a') ? 'girls' : 'boys';

// Pick random name from correct gender list and store it for later
fetch(`${gender}.json`)
  .then(res => res.json())
  .then(data => {
    const name = data[Math.floor(Math.random() * data.length)];
    localStorage.setItem("destinyName", name);
  });
