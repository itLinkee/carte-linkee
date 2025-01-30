document.addEventListener("DOMContentLoaded", function() {
    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            const linkers = new Set(); // Utilisation d'un Set pour éviter les doublons
            data.forEach(point => {
                if (point.linker) { 
                    linkers.add(point.linker);
                }
            });

            const linkerSelect = document.getElementById("linkerSelect");
            linkers.forEach(linker => {
                let option = document.createElement("option");
                option.value = linker;
                option.textContent = linker;
                linkerSelect.appendChild(option);
            });

            // Mettre à jour les markers au changement de sélection
            linkerSelect.addEventListener("change", drawMarkers);
        })
        .catch(error => console.error("Erreur lors du chargement des linkers :", error));
});
