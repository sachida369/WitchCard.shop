<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dob = $_POST['dateOfBirth'];
    $tob = $_POST['timeOfBirth'] ?: '12:00';
    $lat = $_POST['lat'] ?? 26.8467; // default Lucknow
    $lng = $_POST['lng'] ?? 80.9462; // default Lucknow

    list($year, $month, $day) = explode('-', $dob);
    list($hour, $minute) = explode(':', $tob);

    // Prokerala API credentials
    $clientId = "553d987e-16d1-4805-9541-51fa833ad3a3";
    $clientSecret = "6d6cptckAuk4Bj5RbkxXATc8VFnsqwvb4ypoxAo5";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.prokerala.com/v2/astrology/kundli");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Basic " . base64_encode("$clientId:$clientSecret"),
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "day" => (int)$day,
        "month" => (int)$month,
        "year" => (int)$year,
        "hour" => (int)$hour,
        "minute" => (int)$minute,
        "latitude" => (float)$lat,
        "longitude" => (float)$lng,
        "timezone" => 5.5
    ]));

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    header('Content-Type: application/json');
    if ($httpCode === 200) {
        echo $response;
    } else {
        echo json_encode([
            "error" => "Failed to fetch kundali",
            "status" => $httpCode,
            "response" => $response
        ]);
    }
}
?>
