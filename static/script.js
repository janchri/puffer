console.log("script.js loaded!");

function updateTemperature(id, temp) {
    const bar = document.getElementById(id);
    if (!bar) return;

    bar.style.width = Math.max(5, Math.min(temp, 100)) + "%";
    bar.textContent = temp + "°C";
    bar.style.backgroundColor = temperatureToColor(temp);
}

function temperatureToColor(temp) {
    const t = Math.max(10, Math.min(temp, 70));
    const hue = 240 - ((t - 10) / (70 - 10)) * 240; // blue -> red
    return `hsl(${hue}, 100%, 50%)`;
}

// Fetch temperatures from API
fetch("/api/temperatures/last")
    .then(r => r.json())
    .then(data => {
        data.forEach(t => updateTemperature(t.id, t.value));
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
    });
