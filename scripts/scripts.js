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

// --- NOUVEAU CODE POUR LE FORMULAIRE DE CONTACT ---
const contactForm = document.querySelector('.contact-form');
const formMessage = document.createElement('p'); // Crée un élément p pour le message de succès/erreur
formMessage.style.textAlign = 'center';
formMessage.style.marginTop = '1rem';
formMessage.style.fontWeight = 'bold';

if (contactForm) {
    // Insère le paragraphe du message juste avant le bouton d'envoi
    contactForm.insertBefore(formMessage, contactForm.querySelector('.btn'));

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Empêche la soumission par défaut (qui causerait la redirection)

        const form = event.target;
        const formData = new FormData(form); // Récupère toutes les données du formulaire
        const formAction = form.action; // L'URL de Formspree

        formMessage.textContent = 'Envoi en cours...';
        formMessage.style.color = '#007bff'; // Couleur d'information

        try {
            const response = await fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json' // Demande une réponse JSON de Formspree
                }
            });

            if (response.ok) { // Si la réponse est OK (statut 200)
                formMessage.textContent = 'Message envoyé avec succès ! Merci de m\'avoir contacté.';
                formMessage.style.color = 'green';
                form.reset(); // Réinitialise tous les champs du formulaire
            } else {
                const data = await response.json(); // Tente de lire l'erreur de Formspree
                if (data.errors) {
                    formMessage.textContent = `Erreur : ${data.errors.map(err => err.message).join(', ')}`;
                } else {
                    formMessage.textContent = 'Une erreur est survenue lors de l\'envoi du message.';
                }
                formMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Erreur réseau ou inattendue:', error);
            formMessage.textContent = 'Problème de connexion. Veuillez réessayer plus tard.';
            formMessage.style.color = 'red';
        }
    });
}