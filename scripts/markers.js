function drawMarkers() {
    clearMarkers();

    const mode = document.getElementById("colorModeSelect").value;
    const selectedLinker = document.getElementById("linkerSelect").value;

    // Filtrer les données correspondant au Linker sélectionné
    let filteredData = dataPoints.filter(item => selectedLinker === "all" || item.linker === selectedLinker);

    // Trier par ordre croissant (ordre de la tournée)
    filteredData.sort((a, b) => (a.ordre || 0) - (b.ordre || 0));

    filteredData.forEach((item) => {
        let iconUrl;
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
            // Utiliser une icône numérotée si un Linker spécifique est sélectionné et un ordre existe
            iconUrl = getNumberedIcon(item.ordre, backgroundColor);
        } else {
            // Sinon, utiliser les icônes standardisées selon le mode sélectionné
            iconUrl = ICONS_BY_TYPE[item.type] || ICONS_BY_STATUT[item.statut] || ICONS_BY_COLLECT[item.collected] || DEFAULT_TYPE_ICON;
        }

        // Création du marqueur
        const marker = new google.maps.Marker({
            position: { lat: item.lat, lng: item.lng },
            map,
            title: `${item.ordre ? item.ordre + ". " : ""}${item.name || "Sans nom"}`,
            icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(30, 30),
            },
            label: selectedLinker !== "all" && item.ordre ? {
                text: item.ordre.toString(),
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
            } : null
        });

        // Ajout de l'événement d'affichage d'infobulle
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
    });
}

/**
 * Génère une icône numérotée avec une couleur de fond spécifique
 */
function getNumberedIcon(number, color) {
    return `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=${number}|${color}|FFFFFF`;
}
