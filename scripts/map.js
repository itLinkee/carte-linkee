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

function loadDataAndDraw() {
    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            dataPoints = data;
            drawMarkers();
        })
        .catch(err => console.error("Erreur lors du fetch du JSON:", err));
}
