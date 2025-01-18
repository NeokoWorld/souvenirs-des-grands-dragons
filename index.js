// Exemple de fonctionnalité pour l’accueil
document.addEventListener('DOMContentLoaded', () => {
    console.log("Page d'accueil chargée !");
});

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('header nav ul');

    menuToggle.addEventListener('click', () => {
        if (navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            navMenu.classList.add('hide');
        } else {
            navMenu.classList.remove('hide');
            navMenu.classList.add('show');
        }
    });

    // Optionnel : Fermer le menu si un lien est cliqué
    navMenu.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            navMenu.classList.remove('show');
            navMenu.classList.add('hide');
        }
    });
});
