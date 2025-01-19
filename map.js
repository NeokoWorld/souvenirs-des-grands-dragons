document.addEventListener("DOMContentLoaded", () => {
    const mapIframe = document.querySelector(".map-container iframe");
    const infoBox = document.querySelector(".info-box"); // Infobulle

    // Charger les données du JSON
    fetch('data/labels.json')
        .then(response => response.json())
        .then(data => {
            // Ajouter les événements aux labels de la carte
            mapIframe.addEventListener("load", () => {
                const svgDoc = mapIframe.contentDocument || mapIframe.contentWindow.document;
                const labels = svgDoc.querySelectorAll("#labels text");

                labels.forEach(label => {
                    label.addEventListener("click", (event) => {
                        const labelId = label.getAttribute("id");
                        const labelName = label.textContent.trim();
                        console.log(`Label cliqué : ID=${labelId}, Nom=${labelName}`);
                        
                        // Chercher le label correspondant dans les données JSON
                        const labelData = findLabelData(labelId, data.labels);
                        
                        // Mettre à jour l'info-bulle avec les données du label
                        updateInfoBox(labelData, infoBox);
                    });
                });
            });
        })
        .catch(error => {
            console.error("Erreur lors du chargement du fichier JSON:", error);
        });

    // Fonction pour trouver les données associées à un label
    function findLabelData(labelId, labels) {
        // Recherche dans les villes, villages, états et lieux spéciaux
        for (const category of ['cities', 'towns', 'states', 'special']) {
            const labelData = labels[category].find(item => item.id === labelId);
            if (labelData) {
                return labelData;
            }
        }
        return null; // Si aucun label n'est trouvé
    }

    // Fonction pour mettre à jour l'infobulle avec les données du label
    function updateInfoBox(labelData, infoBox) {
        if (labelData) {
            infoBox.innerHTML = `
                <h3>${labelData.name}</h3>
                <p><strong>Type :</strong> ${labelData.type}</p>
                <p>${labelData.description}</p>
                ${labelData.province ? `<p><strong>Province :</strong> ${labelData.province}</p>` : ''}
                ${labelData.government ? `<p><strong>Gouvernement :</strong> ${labelData.government}</p>` : ''}
                ${labelData.ruler ? `<p><strong>Roi :</strong> ${labelData.ruler}</p>` : ''}
            `;
            infoBox.style.display = 'block'; // Afficher l'info-bulle
        } else {
            infoBox.textContent = "Aucune information disponible pour ce label.";
            infoBox.style.display = 'block';
        }
    }
});
