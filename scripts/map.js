let map;
let markers = [];
let dataPoints = [];
let infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 12,
        mapId: "e7ce213688d1abda",
    });

    infoWindow = new google.maps.InfoWindow();

    // Premier chargement des données
    loadDataAndDraw();

    // Rafraîchir les données toutes les 5 minutes
    setInterval(loadDataAndDraw, REFRESH_INTERVAL);

    // Changement du mode de coloration
    document.getElementById("colorModeSelect").addEventListener("change", drawMarkers);

    map.addListener("click", () => {
        infoWindow.close();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    window.initMap = initMap;
});

function switchMap() {
    currentSet = currentSet === "set1" ? "set2" : "set1";
    dataUrl = dataUrls[currentSet];

    // Charger les nouveaux scripts
    loadScript(scriptSets[currentSet].markersScript, () => {
        loadScript(scriptSets[currentSet].utilsScript, () => {
            console.log("Scripts chargés, rechargement des données...");
            loadDataAndDraw();
        });
    });
}

function loadScript(scriptName, callback) {
    const existingScript = document.querySelector(`script[src="${scriptName}"]`);
    if (existingScript) {
        existingScript.remove();
    }
    const script = document.createElement("script");
    script.src = scriptName;
    script.onload = callback;
    document.body.appendChild(script);
}

document.getElementById("toggleMap").addEventListener("click", switchMap);

function loadDataAndDraw() {
    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Données chargées :", data);
            dataPoints = data;
            drawMarkers();
        })
        .catch(err => console.error("Erreur lors du fetch du JSON:", err));
}
