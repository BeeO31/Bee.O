document.addEventListener("DOMContentLoaded", () => {
    // Rend toutes les sections, sans condition
    renderActus();
    renderLiens();
    renderFaqs();
    renderPartners();
    renderInfosPratiques();
    renderGallery();

    handleScrollTopButton();
    handlePartnerCarousel();
    handleForms();
    
    // Écoute les changements dans le stockage local
    window.addEventListener('storage', (e) => {
      if (e.key === 'site:update') {
        location.reload();
      }
    });
  
    // Gérer l'ouverture des liens partenaires dans un nouvel onglet
    document.querySelectorAll('#partnersCarousel a').forEach(link => {
      link.setAttribute('target', '_blank');
    });
});


function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function renderAllContent() {
    renderActus();
    renderFaqs();
    renderLiens();
    renderGallery();
    renderPartners();
	renderInfosPratiques();
}

function renderActus() {
    const actus = JSON.parse(localStorage.getItem("actus") || "[]");
    const container = document.getElementById("actus-container");
    if (!container) return;

    if (actus.length === 0) {
        container.innerHTML = "<p>Aucune actualité pour le moment.</p>";
        return;
    }

    const actuItems = actus.map((a, index) => {
        let classes = 'actu-item';
        
        if (a.pos === 'right') {
            classes += ' img-right';
        } else if (a.pos === 'centered') {
            classes += ' img-centered';
        } else {
            classes += ' img-left';
        }
        
        if (index === 0) {
            classes += ' first-actu';
        } else if (index % 2 === 0) {
            classes += ' even-actu';
        } else {
            classes += ' odd-actu';
        }

        const imageHtml = a.img ? `<img src="${a.img}" alt="Image de l'actualité" />` : '';
        const isCentered = a.pos === 'centered';

        return `
            <div class="${classes}">
                ${!isCentered && a.pos === 'left' ? imageHtml : ''}
                <div class="actu-content">
                    <h3>${a.titre}</h3>
                    <p>${a.texte}</p>
                </div>
                ${!isCentered && a.pos === 'right' ? imageHtml : ''}
                ${isCentered ? imageHtml : ''}
            </div>
        `;
    }).join('');

    container.innerHTML = actuItems;
}
function renderLiens() {
    const liens = JSON.parse(localStorage.getItem("liens") || "[]");
    const container = document.getElementById("liens-container");
    if (!container) return;

    // Ajoute une vérification pour s'assurer que 'liens' est un tableau
    if (Array.isArray(liens) && liens.length > 0) {
        const publicLiens = liens.filter(l => l.isPublic !== false);
        container.innerHTML = publicLiens.map(lien => `
            <div class="liens-card">
                <a href="${lien.url}" target="_blank" class="liens-link">
                    <i class="fa-solid fa-link"></i> ${lien.label}
                </a>
            </div>
        `).join('');
    } else {
        container.innerHTML = "<p>Aucun lien utile pour le moment.</p>";
    }
}

function renderGallery() {
    const container = document.getElementById("galerie-container");
    const images = JSON.parse(localStorage.getItem("gallery") || "[]");
    container.innerHTML = "";
    images.forEach(img => {
        const galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";
        galleryItem.innerHTML = `<img src="${img}" alt="Image de la galerie">`;
        container.appendChild(galleryItem);
    });
}

function renderPartners() {
    const container = document.getElementById("partnersCarousel");
    const partners = JSON.parse(localStorage.getItem("partners") || "[]");
    container.innerHTML = "";
    partners.forEach(p => {
        const partnerDiv = document.createElement("a");
        partnerDiv.href = p.link || "#";
        // Ajout de target="_blank" et rel="noopener noreferrer"
        partnerDiv.target = "_blank";
        partnerDiv.rel = "noopener noreferrer";
        partnerDiv.className = "partner";
        partnerDiv.innerHTML = `<img src="assets/logos/${p.logo}" alt="${p.name}" title="${p.name}">`;
        container.appendChild(partnerDiv);
    });
}

function renderFaqs() {
    const faqs = JSON.parse(localStorage.getItem("faqs") || "[]");
    const container = document.getElementById("faq-container");
    if (!container) return;

    if (faqs.length > 0) {
        container.innerHTML = faqs.map(faq => {
            const linksHtml = faq.links ? faq.links.split(',').map(link => `
                <a href="${link.trim()}" target="_blank" class="faq-link">
                    <i class="fa-solid fa-link"></i> Lien Utile
                </a>
            `).join('') : '';

            return `
                <div class="faq-card">
                    <div class="faq-header">
                        <h3>${faq.question}</h3>
                        <span class="faq-id">${faq.id}</span>
                    </div>
                    <p>${faq.reponse}</p>
                    ${linksHtml ? `<div class="faq-links">${linksHtml}</div>` : ''}
                    <div class="vote-container">
                        <span>Cette réponse vous a-t-elle été utile ?</span>
                        <button onclick="voteFaq('${faq.id}', 'up')" class="vote-btn upvote">
                            <i class="fa-solid fa-thumbs-up"></i> ${faq.votes.up}
                        </button>
                        <button onclick="voteFaq('${faq.id}', 'down')" class="vote-btn downvote">
                            <i class="fa-solid fa-thumbs-down"></i> ${faq.votes.down}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        container.innerHTML = "<p>Aucune question/réponse pour le moment.</p>";
    }
}

function voteFaq(faqId, type) {
    const faqs = JSON.parse(localStorage.getItem("faqs") || "[]");
    const userVotes = JSON.parse(localStorage.getItem("userVotes") || "{}");
    const faqIndex = faqs.findIndex(f => f.id === faqId);

    if (faqIndex === -1) return;

    const faq = faqs[faqIndex];
    const userCurrentVote = userVotes[faqId];

    if (userCurrentVote === type) {
        // L'utilisateur clique sur le même bouton : on "dé-like"
        faq.votes[type] -= 1;
        userVotes[faqId] = null; // On supprime le vote de l'utilisateur
    } else {
        // L'utilisateur clique sur un nouveau bouton
        if (userCurrentVote === 'up') {
            faq.votes.up -= 1;
        } else if (userCurrentVote === 'down') {
            faq.votes.down -= 1;
        }
        
        // On met à jour le nouveau vote
        faq.votes[type] += 1;
        userVotes[faqId] = type;
    }

    localStorage.setItem("faqs", JSON.stringify(faqs));
    localStorage.setItem("userVotes", JSON.stringify(userVotes));
    renderFaqs(); // On réaffiche la FAQ pour mettre à jour les compteurs
}


function renderInfosPratiques() {
    const address = localStorage.getItem("info:address");
    const hours = localStorage.getItem("info:hours");
    const contacts = JSON.parse(localStorage.getItem("infos:contacts") || "[]");

    const addressDisplay = document.getElementById("info-address-display");
    const hoursDisplay = document.getElementById("info-hours-display");
    const contactsDisplay = document.getElementById("contacts-display");

    if (addressDisplay) {
        addressDisplay.textContent = address ? `Adresse : ${address}` : "Adresse : non renseignée";
    }
    if (hoursDisplay) {
        hoursDisplay.textContent = hours ? `Horaires : ${hours}` : "Horaires : non renseignés";
    }

    if (contactsDisplay) {
        contactsDisplay.innerHTML = contacts.length > 0
            ? contacts.map(c => `
                <div class="contact-item">
				    <p>${c.name}: ${c.phone}</p>
                </div>
            `).join('')
            : "<p>Aucun contact n'a été ajouté pour le moment.</p>";
    }
}

// Fonction pour gérer l'affichage du bouton de retour en haut de page
function handleScrollTopButton() {
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.onscroll = function() {
      // Affiche le bouton si l'utilisateur a défilé de 200px ou plus
      if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollTopBtn.style.display = "block";
      } else {
        scrollTopBtn.style.display = "none";
      }
    };
  }
}

// Fonction pour gérer le carrousel des partenaires
function handlePartnerCarousel() {
  const carousel = document.getElementById('partnersCarousel');
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  if (carousel && carouselWrapper) {
    const clonedCarousel = carousel.cloneNode(true);
    carouselWrapper.appendChild(clonedCarousel);
  }
}

// Fonction pour gérer l'envoi des formulaires
function handleForms() {
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Empêche l'envoi par défaut du formulaire

      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      console.log('Formulaire de contact soumis :', data);
      
      // Ici, vous pouvez ajouter le code pour envoyer les données
      // à un service backend, à une feuille de calcul, etc.
      
      alert('Formulaire soumis avec succès ! (Simulé)');
      form.reset();
    });
  });
}

// Note: N'oubliez pas d'ajouter l'appel de ces fonctions
// dans l'écouteur d'événement 'DOMContentLoaded'.