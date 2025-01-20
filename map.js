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

        svgElement.style.transformOrigin = "center center"; // Définit l'origine du zoom par défaut

        // Ajoute un gestionnaire d'événement pour la molette
        svgDoc.addEventListener(
            "wheel",
            (event) => {
                event.preventDefault(); // Désactive le comportement par défaut

                // Calculer la position de la souris dans l'iframe
                const mouseX = event.clientX;
                const mouseY = event.clientY;

                // Convertir la position de la souris en coordonnées relatives au SVG
                const svgRect = svgElement.getBoundingClientRect();
                const mouseXInSvg = mouseX - svgRect.left;
                const mouseYInSvg = mouseY - svgRect.top;

                // Calcul du zoom avant ou arrière
                if (event.deltaY < 0) {
                    // Zoom avant
                    currentScale = Math.min(currentScale + scaleStep, maxScale);
                } else {
                    // Zoom arrière
                    currentScale = Math.max(currentScale - scaleStep, minScale);
                }

                // Appliquer l'échelle avec un ajustement basé sur la souris
                svgElement.style.transform = `scale(${currentScale})`;

                // Calculer le décalage nécessaire pour centrer le zoom sur la souris
                const offsetX = (mouseXInSvg * scaleStep) * currentScale;
                const offsetY = (mouseYInSvg * scaleStep) * currentScale;

                // Appliquer un décalage pour faire en sorte que le zoom soit centré sur la souris
                svgElement.style.transformOrigin = `${mouseXInSvg}px ${mouseYInSvg}px`;

                // Assurer que le SVG ne dépasse pas les bords de l'iframe
                const svgWidth = svgElement.getBoundingClientRect().width * currentScale;
                const svgHeight = svgElement.getBoundingClientRect().height * currentScale;

                // Ajuster la taille du SVG si nécessaire pour éviter le "vide" entre le SVG et l'iframe
                svgElement.style.width = `${svgWidth}px`;
                svgElement.style.height = `${svgHeight}px`;
            },
            { passive: false } // Définit explicitement le gestionnaire comme non-passive
        );
    });

    console.log("Gestionnaire de zoom/dézoom activé.");
});

