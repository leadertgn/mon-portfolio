// Défilement fluide pour les ancres internes
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
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
if (contactForm) {
  const formMessage = document.createElement('p'); // Crée un élément p pour le message de succès/erreur
  formMessage.style.textAlign = 'center';
  formMessage.style.marginTop = '1rem';
  formMessage.style.fontWeight = 'bold';

  // Insère le paragraphe du message juste avant le bouton d'envoi
  contactForm.insertBefore(formMessage, contactForm.querySelector('.btn'));

  contactForm.addEventListener('submit', async event => {
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
          Accept: 'application/json', // Demande une réponse JSON de Formspree
        },
      });

      if (response.ok) {
        // Si la réponse est OK (statut 200)
        formMessage.textContent = "Message envoyé avec succès ! Merci de m'avoir contacté.";
        formMessage.style.color = 'green';
        form.reset(); // Réinitialise tous les champs du formulaire
      } else {
        const data = await response.json(); // Tente de lire l'erreur de Formspree
        if (data.errors) {
          formMessage.textContent = `Erreur : ${data.errors.map(err => err.message).join(', ')}`;
        } else {
          formMessage.textContent = "Une erreur est survenue lors de l'envoi du message.";
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

// Variables globales
let tousLesProjets = [];

// Fonction pour afficher un indicateur de chargement
function afficherChargement() {
  const container = document.getElementById('projets');
  if (container) {
    container.innerHTML = `
            <div class="chargement" style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
                <p>Chargement des projets...</p>
            </div>
        `;
  }
}

// Fonction pour gérer les erreurs d'images
function gererErreursImages() {
  document.querySelectorAll('.projet-image').forEach(img => {
    img.addEventListener('error', function () {
      this.src = 'assets/images/placeholder.jpg';
      this.alt = 'Image non disponible';
    });
  });
}

// Fonction pour charger et afficher les projets
async function chargerProjets() {
  afficherChargement();

  try {
    const response = await fetch('data/projets.json');
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    tousLesProjets = data.projets;
    afficherProjets(tousLesProjets);
    initialiserFiltres();
    gererErreursImages();
  } catch (error) {
    console.error('Erreur lors du chargement des projets:', error);
    const container = document.getElementById('projets');
    if (container) {
      container.innerHTML = `
                <p class="error-message">Impossible de charger les projets. Veuillez réessayer plus tard.</p>
                <p style="text-align: center;">
                    <button onclick="chargerProjets()" class="btn">Réessayer</button>
                </p>
            `;
    }
  }
}

// Fonction pour afficher les projets
function afficherProjets(projets) {
  const container = document.getElementById('projets');

  if (!container) {
    console.error('Conteneur de projets non trouvé');
    return;
  }

  if (projets.length === 0) {
    container.innerHTML = `
            <div class="aucun-projet">
                <p>Aucun projet trouvé dans cette catégorie.</p>
            </div>
        `;
    mettreAJourCompteur(0);
    return;
  }

  let html = '';

  projets.forEach((projet, index) => {
    html += `
            <article class="projet" data-category="${projet.categorie}" data-id="${projet.id}" style="animation-delay: ${index * 0.1}s">
                <p class="projet-image-conteneur">
                    <img src="${projet.image}" alt="${projet.alt}" class="projet-image" loading="lazy">
                </p>
                <div class="projet-description">
                    <h3>${projet.titre}</h3>
                    <h4>Technologies : ${projet.technologies.join(', ')}</h4>
                    <p>${projet.description}</p>
                    <p class="github-projet">
                        <a href="${projet.lien}" target="_blank" rel="noopener noreferrer" class="btn">Visiter le projet</a>
                    </p>
                </div>
            </article>
        `;
  });

  container.innerHTML = html;
  mettreAJourCompteur(projets.length);
}

// Fonction pour extraire les catégories uniques
function getCategoriesUniques() {
  const categories = [...new Set(tousLesProjets.map(projet => projet.categorie))];
  return categories;
}

// Fonction pour initialiser les filtres
function initialiserFiltres() {
  const categories = getCategoriesUniques();
  const filtresContainer = document.querySelector('.filtres-projets');

  if (!filtresContainer) {
    console.error('Conteneur de filtres non trouvé');
    return;
  }

  // Garder le bouton "Tous"
  let filtresHTML = '<button class="filtre-btn active" data-categorie="tous">Tous</button>';

  // Ajouter les boutons pour chaque catégorie
  categories.forEach(categorie => {
    // Capitaliser la première lettre
    const nomAffichage = categorie.charAt(0).toUpperCase() + categorie.slice(1);
    filtresHTML += `<button class="filtre-btn" data-categorie="${categorie}">${nomAffichage}</button>`;
  });

  filtresContainer.innerHTML = filtresHTML;

  // Ajouter les écouteurs d'événements
  document.querySelectorAll('.filtre-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const categorie = btn.dataset.categorie;
      filtrerProjets(categorie);

      document.querySelectorAll('.filtre-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// Fonction pour filtrer les projets
function filtrerProjets(categorie) {
  let projetsFiltres;

  if (categorie === 'tous') {
    projetsFiltres = tousLesProjets;
  } else {
    projetsFiltres = tousLesProjets.filter(projet => projet.categorie === categorie);
  }

  // Animation de disparition
  const container = document.getElementById('projets');
  if (container) {
    container.style.opacity = '0';

    setTimeout(() => {
      afficherProjets(projetsFiltres);
      container.style.opacity = '1';
    }, 300);
  }
}

// Fonction pour mettre à jour le compteur
function mettreAJourCompteur(nombre) {
  const compteur = document.getElementById('compteur');
  if (compteur) {
    compteur.textContent = `${nombre} projet${nombre !== 1 ? 's' : ''}`;
  }
}

// --- Changement de thème --- //
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Définir les icônes SVG pour le mode clair et sombre
  const currentIconPath = `M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z`;
  const moonIconPath = `M10 2c-1.82 0-3.53.5-5 1.35C7.99 5.09 11 8.81 11 13c0 4.19-3.02 7.91-7 9.65 1.47.85 3.18 1.35 5 1.35 6.07 0 11-4.93 11-11S16.07 2 10 2z`;

  // Fonction pour appliquer le thème
  const applyTheme = theme => {
    const svgPath = themeToggle.querySelector('svg path');

    if (theme === 'dark') {
      body.classList.add('dark-mode');
      if (svgPath) {
        svgPath.setAttribute('d', moonIconPath);
      }
      themeToggle.setAttribute('aria-label', 'Basculer en mode clair');
    } else {
      body.classList.remove('dark-mode');
      if (svgPath) {
        svgPath.setAttribute('d', currentIconPath);
      }
      themeToggle.setAttribute('aria-label', 'Basculer en mode sombre');
    }
  };

  // 1. Détecter la préférence utilisateur du système (Dark Mode)
  const prefersDarkMode =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('theme');

  if (storedTheme) {
    applyTheme(storedTheme);
  } else if (prefersDarkMode) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  // 2. Écouter le clic sur le bouton de bascule
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (body.classList.contains('dark-mode')) {
        applyTheme('light');
        localStorage.setItem('theme', 'light');
      } else {
        applyTheme('dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // --- Votre code JavaScript existant pour le menu mobile ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
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
  }

  // Charger les projets
  chargerProjets();

  // Réessayer le chargement si échec
  document.addEventListener('click', function (e) {
    if (e.target && e.target.matches('.btn[onclick="chargerProjets()"]')) {
      chargerProjets();
    }
  });
});

// Ajouter les styles CSS dynamiquement
const style = document.createElement('style');
style.textContent = `
    .aucun-projet {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
        font-style: italic;
        grid-column: 1 / -1;
    }
    
    .error-message {
        text-align: center;
        color: #e74c3c;
        padding: 2rem;
        background: #fee;
        border-radius: 8px;
        border: 1px solid #fcc;
        grid-column: 1 / -1;
    }
    
    .chargement {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
        grid-column: 1 / -1;
    }
`;
document.head.appendChild(style);
