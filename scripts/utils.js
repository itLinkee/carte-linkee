function clearMarkers() {
    markers.forEach(m => m.setMap(null));
    markers = [];
}

function getNumberedIcon(number) {
    return `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=${number}|FF0000|FFFFFF`;
}
