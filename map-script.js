document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // INIT MAP
  // -----------------------------
  const mapEl = document.getElementById("mapid");
  if (!mapEl) return console.error("Map container #mapid not found!");

  const map = L.map("mapid").setView([27.33, 88.61], 9);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  let tourSpots = [];
  let markers = [];
  let routingControl = null;
  let pathHistory = 0;
  let narratorEnabled = true; // default ON

  // -----------------------------
  // NARRATOR FUNCTION
  // -----------------------------
  function narrator(text) {
    if (!narratorEnabled || !text) return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-IN";
    speech.pitch = 1;
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  }

  // -----------------------------
  // TOUR FUNCTIONS
  // -----------------------------
  function addToTour(name, lat, lng) {
    tourSpots.push([lat, lng]);
    const marker = L.marker([lat, lng]).addTo(map).bindPopup(name);
    markers.push(marker);

    narrator(`Added ${name} to your tour.`);
    showMessage(`Added ${name}`);
    refreshRoute();
  }

  function removeLastStop() {
    if (tourSpots.length > 0) {
      tourSpots.pop();
      const marker = markers.pop();
      if (marker) map.removeLayer(marker);
      showMessage("Removed last stop.");
      refreshRoute();
    } else {
      showMessage("No stops to remove.");
    }
  }

  function resetTour() {
    tourSpots = [];
    markers.forEach((m) => map.removeLayer(m));
    markers = [];
    if (routingControl) map.removeControl(routingControl);
    document.getElementById("transport").innerHTML = "No route planned yet.";
    showMessage("Tour reset.");
  }

  function showRoute() {
    if (tourSpots.length < 2) {
      showMessage("Add at least 2 stops to calculate a route.");
      return;
    }

    if (routingControl) map.removeControl(routingControl);

    routingControl = L.Routing.control({
      waypoints: tourSpots.map(([lat, lng]) => L.latLng(lat, lng)),
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      createMarker: () => null,
      lineOptions: { styles: [{ color: "#77DD77", weight: 5 }] },
    })
      .on("routesfound", function (e) {
        const route = e.routes[0];
        const distanceKm = (route.summary.totalDistance / 1000).toFixed(2);
        pathHistory++;
        const historyEl = document.getElementById("history");
        if (historyEl)
          historyEl.innerText = `History: ${pathHistory} routes planned`;

        narrator(`Route calculated. Total distance is ${distanceKm} kilometers.`);
        recommendTransport(distanceKm);
      })
      .addTo(map);
  }

  function refreshRoute() {
    if (routingControl) map.removeControl(routingControl);
    if (tourSpots.length >= 2) showRoute();
  }

  function recommendTransport(km) {
    let transport =
      km < 2
        ? "🚶 Walk (short route)"
        : km < 15
        ? "🚕 Local Taxi Recommended"
        : "🚌 Use Cab / Private Vehicle";

    const transportEl = document.getElementById("transport");
    if (transportEl)
      transportEl.innerHTML = `Distance: ${km} km<br>${transport}`;

    narrator(`Suggested transport: ${transport}`);
  }

  function showMessage(msg) {
    const transportBox = document.getElementById("transport");
    if (transportBox) transportBox.innerHTML = `<b>${msg}</b>`;
    setTimeout(() => {
      if (transportBox) transportBox.innerHTML = "";
    }, 3000);
  }

  // -----------------------------
  // NARRATOR TOGGLE BUTTON
  // -----------------------------
  const narratorBtn = document.getElementById("narrator-btn");
  if (narratorBtn) {
    narratorBtn.addEventListener("click", () => {
      narratorEnabled = !narratorEnabled;
      window.speechSynthesis.cancel();
      narratorBtn.textContent = narratorEnabled
        ? "🔊 Narrator: On"
        : "🔇 Narrator: Off";
      if (narratorEnabled) narrator("Narrator enabled.");
    });
  }

  /
