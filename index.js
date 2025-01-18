document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('header nav ul');

    // Ouvrir ou fermer le menu
    menuToggle.addEventListener('click', () => {
        if (navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            navMenu.classList.add('hide');
        } else {
            navMenu.classList.remove('hide');
            navMenu.classList.add('show');
        }
    });

    // Fermer le menu après avoir cliqué sur un lien
    navMenu.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            navMenu.classList.remove('show');
            navMenu.classList.add('hide');
        }
    });
});
