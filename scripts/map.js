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

function updateSelectors() {
    const linkerSelect = document.getElementById("linkerSelect");
    const colorModeSelect = document.getElementById("colorModeSelect");

    // Effacer les anciennes options
    linkerSelect.innerHTML = "";
    colorModeSelect.innerHTML = "";

    // Ajout des nouvelles options pour le linker
    const linkers = new Set(); // Pour éviter les doublons
    dataPoints.forEach(point => {
        if (point.linker) { 
            linkers.add(point.linker);
        }
    });

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "Tous les linkers";
    linkerSelect.appendChild(allOption);

    linkers.forEach(linker => {
        let option = document.createElement("option");
        option.value = linker;
        option.textContent = linker;
        linkerSelect.appendChild(option);
    });

    // Ajout des nouvelles options pour le mode de couleur
    const modes = ["type", "statut", "Collected"];
    modes.forEach(mode => {
        let option = document.createElement("option");
        option.value = mode;
        option.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
        colorModeSelect.appendChild(option);
    });

    // Déclencher le premier affichage en sélectionnant la première valeur
    linkerSelect.dispatchEvent(new Event("change"));
    colorModeSelect.dispatchEvent(new Event("change"));
}

function switchMap() {
    currentSet = currentSet === "set1" ? "set2" : "set1";
    dataUrl = dataUrls[currentSet];

    // Charger les nouveaux scripts
    loadScript(scriptSets[currentSet].markersScript, () => {
        loadScript(scriptSets[currentSet].utilsScript, () => {
            console.log("Scripts chargés, rechargement des données...");
            loadDataAndDraw();

            // Mettre à jour les sélecteurs après le chargement des données
            setTimeout(updateSelectors, 500); // Petit délai pour s'assurer que les données sont chargées
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

document.addEventListener("DOMContentLoaded", () => {
    window.initMap = initMap;
    setTimeout(updateSelectors, 1000); // Assurez-vous que les sélecteurs sont initialisés après le premier chargement
});
