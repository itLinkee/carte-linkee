const dataUrl = "https://raw.githubusercontent.com/itLinkee/carte-linkee/refs/heads/main/data.json";
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 min en millisecondes

const ICONS_BY_TYPE = {
    "Pris": "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    "Pas pris": "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
};
const DEFAULT_TYPE_ICON = "https://maps.google.com/mapfiles/ms/icons/grey-dot.png";

const ICONS_BY_STATUT = {
    "À notifier": "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    "Collecte déclarée ok": "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    "Collecte déclarée ko": "https://maps.google.com/mapfiles/ms/icons/grey-dot.png",
    "Panier déclaré": "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
};
const DEFAULT_STATUT_ICON = "https://maps.google.com/mapfiles/ms/icons/grey-dot.png";

const ICONS_BY_COLLECT = {
    "Collecté": "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    "Livré": "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    "Annulé": "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
};
const DEFAULT_COLLECT_ICON = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
