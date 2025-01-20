document.addEventListener("DOMContentLoaded", () => {
    const mapIframe = document.querySelector(".map-container iframe");
    const infoBox = document.querySelector(".info-box"); // Infobulle

    // Charger les données du JSON
    fetch('data/labels.json')
        .then(response => response.json())
        .then(data => {
            // Ajoute un événement de changement de vue
            const buttons = document.querySelectorAll(".sidebar button");

            buttons.forEach(button => {
                button.addEventListener("click", () => {
                    const newSrc = button.getAttribute("data-src");
                    if (newSrc) {
                        mapIframe.src = newSrc; // Met à jour la source de l'iframe
                    }
                });
            });

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
            let additionalInfo = '';
    
            // Si le label est un état (type "state"), on ajoute un lien "Plus d'info"
            if (labelData.type === 'state') {
                additionalInfo = `
                    <p><a href="pays.html?country=${encodeURIComponent(labelData.name)}" class="more-info">Plus d'info</a></p>
                `;
            }
    
            // Met à jour l'infobulle
            infoBox.innerHTML = `
                <h3>${labelData.name}</h3>
                <p>${labelData.description}</p>
                ${labelData.province ? `<p><strong>Province :</strong> ${labelData.province}</p>` : ''}
                ${labelData.government ? `<p><strong>Gouvernement :</strong> ${labelData.government}</p>` : ''}
                ${labelData.ruler ? `<p><strong>Dirigeant :</strong> ${labelData.ruler}</p>` : ''}
                ${additionalInfo} <!-- Ajout du lien "Plus d'info" si c'est un état -->
            `;
            infoBox.style.display = 'block'; // Afficher l'info-bulle
        } else {
            infoBox.textContent = "Aucune information disponible pour ce label.";
            infoBox.style.display = 'block';
        }
    }
    
});


document.addEventListener("DOMContentLoaded", () => {
    const mapIframe = document.querySelector(".map-container iframe");
    let currentScale = 1; // Échelle initiale
    const scaleStep = 0.1; // Pas d'augmentation/diminution du zoom
    const minScale = 0.5; // Échelle minimale
    const maxScale = 3; // Échelle maximale

    mapIframe.addEventListener("load", () => {
        const svgDoc = mapIframe.contentDocument || mapIframe.contentWindow.document;
        const svgElement = svgDoc.querySelector("svg");

        if (!svgElement) {
            console.error("Aucun élément SVG trouvé dans l'iframe.");
            return;
        }

        svgElement.style.transformOrigin = "center center"; // Définit l'origine du zoom

        // Ajoute un gestionnaire d'événement pour la molette
        svgDoc.addEventListener(
            "wheel",
            (event) => {
                event.preventDefault(); // Désactive le comportement par défaut

                if (event.deltaY < 0) {
                    // Zoom avant
                    currentScale = Math.min(currentScale + scaleStep, maxScale);
                } else {
                    // Zoom arrière
                    currentScale = Math.max(currentScale - scaleStep, minScale);
                }

                // Applique l'échelle
                svgElement.style.transform = `scale(${currentScale})`;

                // Aligne le SVG aux bords de l'iframe après chaque zoom
                svgElement.style.width = `${100 * currentScale}%`;
                svgElement.style.height = `${100 * currentScale}%`;
                svgElement.style.marginLeft = `${(1 - currentScale) * 50}%`;  // Centrer horizontalement
                svgElement.style.marginTop = `${(1 - currentScale) * 50}%`;    // Centrer verticalement
            },
            { passive: false } // Définit explicitement le gestionnaire comme non-passive
        );
    });

    console.log("Gestionnaire de zoom/dézoom activé.");
});
