function drawMarkers() {
    console.log("drawMarkers() exécuté !");
    clearMarkers();

    const mode = document.getElementById("colorModeSelect").value;
    const selectedLinker = document.getElementById("linkerSelect").value;

    let filteredData = dataPoints.filter(item => selectedLinker === "all" || item.linker === selectedLinker);
    filteredData.sort((a, b) => (a.ordre || 0) - (b.ordre || 0));

    filteredData.forEach((item) => {
        let color = "808080"; // Gris par défaut

        if (mode === "type") {
            color = getColorForType(item.type) || "808080";
        } else if (mode === "statut") {
            color = getColorForStatut(item.statut) || "808080";
        } else {
            color = getColorForCollect(item.collected) || "808080";
        }

        if (selectedLinker !== "all" && item.ordre) {
            markers.push(createNumberedMarker(
                { lat: item.lat, lng: item.lng },
                item.ordre,
                color,
                map
            ));
        } else {
            const marker = new google.maps.Marker({
                position: { lat: item.lat, lng: item.lng },
                map,
                title: item.name || "Sans nom",
                icon: {
                    url: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
                    scaledSize: new google.maps.Size(30, 30),
                },
            });
            
            // Ajouter l'infobulle
            marker.addListener("click", () => {
                const contentString = `
                    <strong>${item.ordre ? item.ordre + ". " : ""}${item.name}</strong><br>
                    Tournée : ${item.linker || "Non spécifié"}<br>
                    Ordre : ${item.ordre !== undefined ? item.ordre : "Non défini"}<br>
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
    const overlay = new google.maps.OverlayView();

    overlay.onAdd = function () {
        const div = document.createElement("div");
        div.className = "marker-label";
        div.style.backgroundColor = `#${color}`;
        div.style.position = "absolute";
        div.style.width = "24px";
        div.style.height = "24px";
        div.style.borderRadius = "50%";
        div.style.textAlign = "center";
        div.style.lineHeight = "24px";
        div.style.fontSize = "14px";
        div.style.fontWeight = "bold";
        div.style.color = "white";
        div.style.boxShadow = "0px 0px 4px rgba(0,0,0,0.5)";
        div.textContent = number;

        this.div = div;
        const panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(div);
    };

    overlay.draw = function () {
        const projection = this.getProjection();
        if (!projection) return;

        const positionPixel = projection.fromLatLngToDivPixel(new google.maps.LatLng(position.lat, position.lng));
        if (this.div) {
            this.div.style.left = `${positionPixel.x - 12}px`; // Centrer l'icône
            this.div.style.top = `${positionPixel.y - 12}px`;
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
