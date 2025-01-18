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
