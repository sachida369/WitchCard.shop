// File: api/kundli.js (Place this in /api folder of your Vercel project)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const {
    fullName,
    dateOfBirth,
    timeOfBirth,
    placeOfBirth,
    lat,
    lng,
    isTimeUnknown = false
  } = req.body;

  const date = dateOfBirth;
  const time = isTimeUnknown ? '12:00' : timeOfBirth;
  const timezone = 5.5; // Defaulting to IST, optionally use a timezone API

  const [hour, minute] = time.split(':');

  const payload = {
    datetime: `${date} ${time}`,
    coordinates: {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
    },
    timezone: timezone,
    ayanamsa: 1 // Lahiri
  };

  try {
    const apiResponse = await fetch('https://api.prokerala.com/v2/astrology/birth-chart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 6d6cptckAuk4Bj5RbkxXATc8VFnsqwvb4ypoxAo5',
        'X-Client-Id': '553d987e-16d1-4805-9541-51fa833ad3a3'
      },
      body: JSON.stringify(payload)
    });

    if (!apiResponse.ok) {
      const error = await apiResponse.json();
      return res.status(500).json({ error: error.message || 'API error' });
    }

    const result = await apiResponse.json();
    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
