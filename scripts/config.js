const dataUrls = {
    set1: "https://raw.githubusercontent.com/itLinkee/carte-linkee/refs/heads/main/dataLinks.json",
    set2: "https://raw.githubusercontent.com/itLinkee/carte-linkee/refs/heads/main/dataCRM.json"
};

const scriptSets = {
    set1: {
        markersScript: "markers.js",
        utilsScript: "utils.js"
    },
    set2: {
        markersScript: "markersCRM.js",
        utilsScript: "utils.js"
    }
};

let currentSet = "set1";
let dataUrl = dataUrls[currentSet];
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

function getColorForType(type) {
    const colors = {
        "Pris": "00FF00",     // Vert
        "Pas pris": "FF0000"  // Rouge
    };
    return colors[type] || "FFFF00"; // Gris par défaut
}

function getColorForStatut(statut) {
    const colors = {
        "À notifier": "FFFF00",      // Jaune
        "Collecte déclarée ok": "0000FF",  // Bleu
        "Collecte déclarée ko": "808080",  // Gris
        "Panier déclaré": "008000"   // Vert foncé
    };
    return colors[statut] || "FFFF00"; // Gris par défaut
}

function getColorForCollect(collected) {
    const colors = {
        "Collecté": "0000FF", // Bleu
        "Livré": "008000",    // Vert
        "Annulé": "FF0000"    // Rouge
    };
    return colors[collected] || "FFFF00"; // Gris par défaut
}

function convertHexToColorName(hex) {
    const colorMap = {
        "00FF00": "green",
        "FF0000": "red",
        "FFFF00": "yellow",
        "0000FF": "blue",
        "808080": "grey"
    };
    return colorMap[hex] || "grey"; // Par défaut, gris si la couleur n'existe pas
}
