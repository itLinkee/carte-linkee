function clearMarkers() {
    markers.forEach(m => m.setMap(null));
    markers = [];
}

function getNumberedIcon(number, color) {
    return `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=${number}|${color}|FFFFFF`;
    console.log("URL de l'icône :", url);
}

window.getNumberedIcon = getNumberedIcon;

function generateCustomMarker(color, number) {
    const canvas = document.createElement("canvas");
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext("2d");

    // Dessiner le fond du marqueur
    ctx.fillStyle = `#${color}`;
    ctx.beginPath();
    ctx.arc(20, 20, 18, 0, 2 * Math.PI);
    ctx.fill();

    // Ajouter le numéro
    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(number, 20, 20);

    return canvas.toDataURL("image/png");
}

window.generateCustomMarker = generateCustomMarker;
