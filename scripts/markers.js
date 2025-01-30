function drawMarkers() {
    clearMarkers();

    const mode = document.getElementById("colorModeSelect").value;
    const selectedLinker = document.getElementById("linkerSelect").value;

    // Filtrer les données correspondant au Linker sélectionné
    let filteredData = dataPoints.filter(item => selectedLinker === "all" || item.linker === selectedLinker);

    // Trier par ordre croissant (ordre de la tournée)
    filteredData.sort((a, b) => (a.ordre || 0) - (b.ordre || 0));

    filteredData.forEach((item) => {
        let backgroundColor = "808080"; // Gris par défaut

        // Déterminer la couleur de fond selon le mode sélectionné
        if (mode === "type") {
            backgroundColor = getColorForType(item.type);
        } else if (mode === "statut") {
            backgroundColor = getColorForStatut(item.statut);
        } else {
            backgroundColor = getColorForCollect(item.collected);
        }

        if (selectedLinker !== "all" && item.ordre) {
            // Utiliser une icône numérotée stylisée en CSS pour un Linker spécifique
            createNumberedMarker({ lat: item.lat, lng: item.lng }, item.ordre, backgroundColor, map);
        } else {
            // Créer un marqueur standard si aucun Linker spécifique n'est sélectionné
            const marker = new google.maps.Marker({
                position: { lat: item.lat, lng: item.lng },
                map,
                title: item.name || "Sans nom",
                icon: {
                    url: ICONS_BY_TYPE[item.type] || DEFAULT_TYPE_ICON,
                    scaledSize: new google.maps.Size(30, 30),
                },
            });

            marker.addListener("click", () => {
                const contentString = `
                    <strong>${item.ordre ? item.ordre + ". " : ""}${item.name}</strong><br>
                    Tournée : ${item.linker || "Non spécifié"}<br>
                    Ordre : ${item.ordre || "Non défini"}<br>
                    Type : ${item.type}<br>
                    Statut : ${item.statut}<br>
                    Asso partenaire : ${item.partenaire}<br>
                `;
                infoWindow.setContent(contentString);
                infoWindow.open(map, marker);
            });

            markers.push(marker);
        }
    });
}

/**
 * Crée un marqueur personnalisé avec un numéro affiché en CSS
 */
function createNumberedMarker(position, number, color, map) {
    const div = document.createElement("div");
    div.className = "marker-label";
    div.style.backgroundColor = `#${color}`;
    div.textContent = number;

    const overlay = new google.maps.OverlayView();
    overlay.onAdd = function () {
        const layer = this.getPanes().overlayMouseTarget;
        layer.appendChild(div);
    };

    overlay.draw = function () {
        const projection = this.getProjection();
        const positionPixel = projection.fromLatLngToDivPixel(new google.maps.LatLng(position.lat, position.lng));
        div.style.left = `${positionPixel.x}px`;
        div.style.top = `${positionPixel.y}px`;
    };

    overlay.setMap(map);

    markers.push(overlay);
}
