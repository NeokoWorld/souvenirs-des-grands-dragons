document.addEventListener("DOMContentLoaded", () => {
    // Sélectionne l'iframe contenant la carte
    const mapIframe = document.querySelector(".map-container iframe");

    // Sélectionne tous les boutons dans la barre latérale
    const buttons = document.querySelectorAll(".sidebar button");

    // Ajoute un écouteur de clic à chaque bouton
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            // Récupère la source SVG à partir de l'attribut `data-src`
            const newSrc = button.getAttribute("data-src");
            if (newSrc) {
                mapIframe.src = newSrc; // Met à jour la source de l'iframe
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const iframe = document.querySelector(".draggable-map");
    
    // Charger et ajouter des événements au contenu de l'iframe
    iframe.addEventListener("load", () => {
        const svgDoc = iframe.contentDocument || iframe.contentWindow.document;
        const labels = svgDoc.querySelectorAll("#labels text");

        labels.forEach(label => {
            label.addEventListener("click", (event) => {
                const labelId = label.getAttribute("id");
                const labelName = label.textContent.trim();
                console.log(`Label cliqué : ID=${labelId}, Nom=${labelName}`);
                
                // Exemple : mise à jour d'un panneau d'information
                const infoBox = document.querySelector(".info-box");
                if (infoBox) {
                    infoBox.textContent = `Vous avez cliqué sur : ${labelName}`;
                }
            });
        });
    });
});
document.querySelectorAll(".sidebar button").forEach(button => {
    button.addEventListener("click", () => {
        const src = button.getAttribute("data-src");
        iframe.src = src;

        iframe.addEventListener("load", () => {
            const svgDoc = iframe.contentDocument || iframe.contentWindow.document;
            const labels = svgDoc.querySelectorAll("#labels text");

            labels.forEach(label => {
                label.addEventListener("click", (event) => {
                    const labelName = label.textContent.trim();
                    console.log(`Nouveau label cliqué : ${labelName}`);
                });
            });
        });
    });
});
