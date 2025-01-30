function drawMarkers() {
    clearMarkers();

    const mode = document.getElementById("colorModeSelect").value;
    const selectedLinker = document.getElementById("linkerSelect").value;

    let filteredData = dataPoints.filter(item => selectedLinker === "all" || item.linker === selectedLinker);
    filteredData.sort((a, b) => (a.ordre || 0) - (b.ordre || 0));

    filteredData.forEach((item) => {
        let backgroundColor = "808080";

        if (mode === "type") {
            backgroundColor = getColorForType(item.type);
        } else if (mode === "statut") {
            backgroundColor = getColorForStatut(item.statut);
        } else {
            backgroundColor = getColorForCollect(item.collected);
        }

        if (selectedLinker !== "all" && item.ordre) {
            markers.push(createNumberedMarker({ lat: item.lat, lng: item.lng }, item.ordre, backgroundColor, map));
        } else {
            const marker = new google.maps.Marker({
                position: { lat: item.lat, lng: item.lng },
                map,
                title: item.name || "Sans nom",
                icon: {
                    url: ICONS_BY_TYPE[item.type] || DEFAULT_TYPE_ICON,
                    scaledSize: new google.maps.Size(30, 30),
                },
            });

            markers.push(marker);
        }
    });
}


/**
 * Crée un marqueur personnalisé avec un numéro affiché en CSS
 */
function createNumberedMarker(position, number, color, map) {
    const overlay = new google.maps.OverlayView();

    overlay.onAdd = function () {
        const div = document.createElement("div");
        div.className = "marker-label";
        div.style.backgroundColor = `#${color}`;
        div.textContent = number;
        
        // Ajout à la couche d'affichage de la carte
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(div);

        this.div = div;
    };

    overlay.draw = function () {
        const projection = this.getProjection();
        if (!projection) return;

        const positionPixel = projection.fromLatLngToDivPixel(new google.maps.LatLng(position.lat, position.lng));
        
        if (this.div) {
            this.div.style.left = `${positionPixel.x}px`;
            this.div.style.top = `${positionPixel.y}px`;
        }
    };

    overlay.onRemove = function () {
        if (this.div) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
    };

    overlay.setMap(map);
    return overlay;
}
