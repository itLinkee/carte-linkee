function clearMarkers() {
    markers.forEach(m => m.setMap(null));
    markers = [];
}
