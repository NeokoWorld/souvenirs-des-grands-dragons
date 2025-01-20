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
    let currentScale = 1; // Échelle initiale de la carte
    const scaleStep = 0.1; // Pas d'incrément pour le zoom
    const minScale = 0.5; // Zoom minimum (50%)
    const maxScale = 3; // Zoom maximum (300%)

    // Fonction pour appliquer le zoom
    function applyZoom(scale) {
        const svgDoc = mapIframe.contentDocument || mapIframe.contentWindow.document;
        const svgElement = svgDoc.querySelector("svg");
        if (svgElement) {
            svgElement.style.transform = `scale(${scale})`;
            svgElement.style.transformOrigin = "center center"; // Origine du zoom
        }
    }

    // Gestion de la molette pour zoomer/dézoomer
    mapIframe.addEventListener("load", () => {
        const svgDoc = mapIframe.contentDocument || mapIframe.contentWindow.document;

        svgDoc.addEventListener("wheel", (event) => {
            event.preventDefault();
            if (event.deltaY < 0) {
                // Zoom avant
                currentScale = Math.min(currentScale + scaleStep, maxScale);
            } else {
                // Zoom arrière
                currentScale = Math.max(currentScale - scaleStep, minScale);
            }
            applyZoom(currentScale);
        });
    });

    // Optionnel : Gestion des touches "+" et "-" du clavier
    document.addEventListener("keydown", (event) => {
        if (event.key === "+") {
            currentScale = Math.min(currentScale + scaleStep, maxScale);
            applyZoom(currentScale);
        } else if (event.key === "-") {
            currentScale = Math.max(currentScale - scaleStep, minScale);
            applyZoom(currentScale);
        }
    });
});
