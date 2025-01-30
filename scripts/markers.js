function drawMarkers() {
    clearMarkers();

    const mode = document.getElementById("colorModeSelect").value;

    dataPoints.forEach(item => {
        let iconUrl;
        if (mode === "type") {
            iconUrl = ICONS_BY_TYPE[item.type] || DEFAULT_TYPE_ICON;
        } else if (mode === "statut") {
            iconUrl = ICONS_BY_STATUT[item.statut] || DEFAULT_STATUT_ICON;
        } else {
            iconUrl = ICONS_BY_COLLECT[item.collected] || DEFAULT_COLLECT_ICON;
        }

        const marker = new google.maps.Marker({
            position: { lat: item.lat, lng: item.lng },
            map,
            title: item.name || "Sans nom",
            icon: iconUrl
        });

        marker.addListener("click", () => {
            const contentString = `
                <strong>${item.name}</strong><br>
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
