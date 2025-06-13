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

// --- Changement de thème --- //
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Définir les icônes SVG pour le mode clair et sombre
    // C'est votre icône actuelle de soleil/lune (elle change de forme selon le thème)
    const currentIconPath = `M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z`;
    // Voici une icône de lune Material Design qui pourrait être une bonne alternative pour le mode sombre :
    const moonIconPath = `M10 2c-1.82 0-3.53.5-5 1.35C7.99 5.09 11 8.81 11 13c0 4.19-3.02 7.91-7 9.65 1.47.85 3.18 1.35 5 1.35 6.07 0 11-4.93 11-11S16.07 2 10 2z`;

    // Fonction pour appliquer le thème
    const applyTheme = (theme) => {
        const svgPath = themeToggle.querySelector('svg path'); // Sélectionne le chemin SVG à l'intérieur du bouton

        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (svgPath) {
                svgPath.setAttribute('d', moonIconPath); // Change le chemin pour l'icône de lune
            }
            themeToggle.setAttribute('aria-label', 'Basculer en mode clair');
        } else {
            body.classList.remove('dark-mode');
            if (svgPath) {
                svgPath.setAttribute('d', currentIconPath); // Change le chemin pour l'icône de soleil/mode clair
            }
            themeToggle.setAttribute('aria-label', 'Basculer en mode sombre');
        }
    };

    // 1. Détecter la préférence utilisateur du système (Dark Mode)
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme) {
        applyTheme(storedTheme);
    } else if (prefersDarkMode) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    // 2. Écouter le clic sur le bouton de bascule
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // --- Votre code JavaScript existant pour le menu mobile ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    menuToggle.addEventListener('click', () => {
        body.classList.toggle('nav-open');
    });

    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('nav-open')) {
                body.classList.remove('nav-open');
            }
        });
    });
});