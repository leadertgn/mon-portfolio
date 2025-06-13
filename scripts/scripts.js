// Défilement fluide pour les ancres internes
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
        // Ferme le menu burger après le clic sur un lien, si le menu est ouvert
        if (document.body.classList.contains('nav-open')) {
            document.body.classList.remove('nav-open');
        }
    });
});

// Sélectionne les éléments du DOM nécessaires pour le menu burger
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const body = document.body; // Nous allons ajouter/supprimer une classe sur le <body>

// Gère l'ouverture/fermeture du menu au clic sur le bouton burger
if (menuToggle) { // Vérifie si le bouton burger existe dans le HTML
    menuToggle.addEventListener('click', () => {
        body.classList.toggle('nav-open'); // Bascule la classe 'nav-open' sur le body
    });
}

// Gère la fermeture du menu si l'utilisateur clique en dehors du menu ou du bouton burger
document.addEventListener('click', (event) => {
    // Vérifie si le clic est à l'intérieur du menu de navigation
    const isClickInsideNav = mainNav && mainNav.contains(event.target);
    // Vérifie si le clic est sur le bouton burger (menuToggle)
    const isClickOnToggle = menuToggle && menuToggle.contains(event.target);
    
    // Si le menu est actuellement ouvert (body a la classe 'nav-open')
    // ET que le clic n'est pas à l'intérieur du menu
    // ET que le clic n'est pas sur le bouton burger
    if (body.classList.contains('nav-open') && !isClickInsideNav && !isClickOnToggle) {
        body.classList.remove('nav-open'); // Alors, ferme le menu
    }
});