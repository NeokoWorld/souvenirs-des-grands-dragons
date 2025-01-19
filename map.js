document.addEventListener("DOMContentLoaded", () => {
    const mapIframe = document.querySelector(".map-container iframe");
    const infoBox = document.querySelector(".info-box");

    // Fonction pour changer de vue dans l'iframe
    function changeView(src) {
        mapIframe.src = src;
    }

    // Ajoute un écouteur pour chaque bouton dans la barre latérale
    document.querySelectorAll(".sidebar button").forEach(button => {
        button.addEventListener("click", () => {
            const newSrc = button.getAttribute("data-src");
            if (newSrc) {
                changeView(newSrc); // Change la source de l'iframe
            }
        });
    });

    // Fonction pour gérer le clic sur les labels
    function handleLabelClick(label) {
        const labelId = label.getAttribute("id");
        const labelName = label.textContent.trim();

        console.log(`Label cliqué : ID=${labelId}, Nom=${labelName}`);
        
        // Chercher et mettre à jour l'info-bulle
        const labelData = findLabelData(labelId);
        updateInfoBox(labelData, infoBox);
    }

    // Charge le contenu de l'iframe et ajoute des événements aux labels
    mapIframe.addEventListener("load", () => {
        const svgDoc = mapIframe.contentDocument || mapIframe.contentWindow.document;
        const labels = svgDoc.querySelectorAll("#labels text");

        // Ajoute l'événement de clic à chaque label
        labels.forEach(label => {
            label.addEventListener("click", () => handleLabelClick(label));
        });
    });

    // Fonction pour charger les données JSON depuis le fichier labels.json
    async function loadLabelData() {
        try {
            const response = await fetch('data/labels.json');
            const data = await response.json();
            return data.labels; // Retourne les données des labels
        } catch (error) {
            console.error("Erreur lors du chargement du fichier JSON : ", error);
            return {};
        }
    }

    // Recherche des données dans le fichier JSON des labels
    async function findLabelData(labelId) {
        const labelsData = await loadLabelData(); // Charge les données dynamiquement

        // Recherche dans toutes les catégories de labels
        for (const category in labelsData) {
            const found = labelsData[category].find(item => item.id === labelId);
            if (found) {
                return found;
            }
        }
        return null; // Retourne null si aucune correspondance n'est trouvée
    }

    // Met à jour l'info-bulle avec les données du label
    function updateInfoBox(labelData, infoBox) {
        if (labelData) {
            infoBox.innerHTML = `
                <h3>${labelData.name}</h3>
                <p>${labelData.description}</p>
                ${labelData.province ? `<p><strong>Province :</strong> ${labelData.province}</p>` : ''}
                ${labelData.government ? `<p><strong>Gouvernement :</strong> ${labelData.government}</p>` : ''}
                ${labelData.ruler ? `<p><strong>Dirigeant :</strong> ${labelData.ruler}</p>` : ''}
            `;
            infoBox.style.display = 'block'; // Afficher l'info-bulle
        } else {
            infoBox.textContent = "Aucune information disponible pour ce label.";
            infoBox.style.display = 'block';
        }
    }
});
