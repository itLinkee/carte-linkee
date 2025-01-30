function clearMarkers() {
    markers.forEach(m => m.setMap(null));
    markers = [];
}

function getNumberedIcon(number, color) {
    return `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=${number}|${color}|FFFFFF`;
    console.log("URL de l'icône :", url);
}
