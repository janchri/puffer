console.log("script.js loaded!");

function updateTemperature(id, temp) {
    const field = document.getElementById(id);
    if (!field) return;
    const rounded = Math.round(temp * 10) / 10;
    field.textContent = rounded + "°C";
}

function updateHueLinearGradient(temp) {
    const t = Math.max(10, Math.min(temp, 70));
    const hue = 240 - ((t - 10) / (70 - 10)) * 240; // blue -> red
    return `hsl(${hue}, 100%, 50%)`;
}

function temperatureToColor(temp) {
    // Mapping nach StackOverflow-Formel
    var maxHsl = 400;
    var minHsl = 250;
    var rngHsl = maxHsl - minHsl;
    var maxTemp = 95;
    var minTemp = 20;
    var rngTemp = maxTemp - minTemp;
    var degCnt = maxTemp - temp;
    var hslsDeg = rngHsl / rngTemp;
    var returnHue = (360 - ((degCnt * hslsDeg) - (maxHsl - 360)));
    return `hsl(${returnHue}, 100%, 50%)`;
}

function updateHueGradient(temps) {
    // Sortiere nach Wert, falls nötig
    const sorted = temps.slice().sort((a, b) => b.value - a.value);
    // Erzeuge Farb-Stopps
    const stops = sorted.map((t, i) => {
        const percent = Math.round((i/(temps.length-1))*100);
        return `${temperatureToColor(t.value)} ${percent}%`;
    });
    const gradient = `linear-gradient(to bottom, ${stops.join(', ')})`;
    const hueDiv = document.querySelector('.hue_linear_gradient');
    if (hueDiv) hueDiv.style.backgroundImage = gradient;
}

// Fetch temperatures from API
fetch("/api/temperatures/last")
    .then(r => r.json())
    .then(data => {
        data.forEach(t => updateTemperature(t.id, t.value));
        updateHueGradient(data);
    })
    .catch(() => {
        const fallback = [
            { id: "temp1", value: 70 },
            { id: "temp2", value: 65 },
            { id: "temp3", value: 60 },
            { id: "temp4", value: 55 },
            { id: "temp5", value: 50 },
            { id: "temp6", value: 45 },
            { id: "temp7", value: 40 },
            { id: "temp8", value: 30 },
            { id: "temp9", value: 20 },
            { id: "temp10", value: 10 }
        ];
        fallback.forEach(t => updateTemperature(t.id, t.value));
        updateHueGradient(fallback);
    });
