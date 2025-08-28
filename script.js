document.addEventListener("DOMContentLoaded", function() {
    const adhesionDateInput = document.getElementById("adhesion-date");
    if (adhesionDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        adhesionDateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    if (document.getElementById("actus-container")) {
        renderAllContent();
    }

    window.addEventListener('storage', (event) => {
        if (event.key === "site:update") {
            if (document.getElementById("actus-container")) {
                renderAllContent();
            }
        }
    });

    const scrollUpButton = document.getElementById('scrollTopBtn');
    if (scrollUpButton) {
        window.onscroll = function() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                scrollUpButton.style.display = "block";
            } else {
                scrollUpButton.style.display = "none";
            }
        };
    }
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
}

function renderActus() {
    const container = document.getElementById("actus-container");
    const actus = JSON.parse(localStorage.getItem("actus") || "[]");
    container.innerHTML = "";
    const colors = ['var(--green)', 'var(--yellow)'];
    if (actus.length > 0) {
        actus.forEach((actu, index) => {
            const actuItem = document.createElement("div");
            actuItem.className = `actu-item img-${actu.pos}`;
            let titleColor;
            if (index === 0) {
                titleColor = 'var(--pink)';
            } else {
                titleColor = colors[(index - 1) % 2];
            }
            actuItem.innerHTML = `
                ${actu.img ? `<img src="${actu.img}" alt="${actu.titre}">` : ""}
                <div class="actu-content">
                    <h3 style="color:${titleColor};">${actu.titre}</h3>
                    <p>${actu.texte}</p>
                </div>
            `;
            container.appendChild(actuItem);
        });
    } else {
        container.innerHTML = "<p>Aucune actualité pour le moment.</p>";
    }
}

function renderLiens() {
    const container = document.getElementById("liens-container");
    const liens = JSON.parse(localStorage.getItem("liens") || "[]");
    container.innerHTML = "";
    liens.forEach(lien => {
        const linkCard = document.createElement("a");
        linkCard.href = lien.url;
        linkCard.target = "_blank";
        linkCard.className = "link-card";
        linkCard.innerHTML = `
            <i class="fa-solid fa-link"></i>
            <span>${lien.title}</span>
        `;
        container.appendChild(linkCard);
    });
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
    const container = document.getElementById("faq-container");
    const faqs = JSON.parse(localStorage.getItem("faqs") || "[]");
    container.innerHTML = "";
    if (faqs.length > 0) {
        faqs.forEach((faq, index) => {
            const faqItem = document.createElement("div");
            faqItem.className = "faq-card";
            const linksHtml = faq.links.filter(link => link).map(link => `
                <a href="${link}" target="_blank" class="faq-link">
                    <i class="fa-solid fa-link"></i> Lien Utile
                </a>
            `).join('');
            faqItem.innerHTML = `
                <div class="faq-header">
                    <h3>${faq.question}</h3>
                    <span class="faq-id">${faq.id}</span>
                </div>
                <p>${faq.answer}</p>
                ${linksHtml ? `<div class="faq-links">${linksHtml}</div>` : ''}
                <div class="vote-container">
                    <span>Cette réponse vous a-t-elle été utile ?</span>
                    <button onclick="voteFaq(${index}, 'up')" class="vote-btn upvote">
                        <i class="fa-solid fa-thumbs-up"></i> ${faq.votes.up}
                    </button>
                    <button onclick="voteFaq(${index}, 'down')" class="vote-btn downvote">
                        <i class="fa-solid fa-thumbs-down"></i> ${faq.votes.down}
                    </button>
                </div>
            `;
            container.appendChild(faqItem);
        });
    } else {
        container.innerHTML = "<p>Aucune question/réponse pour le moment.</p>";
    }
}

function voteFaq(index, type) {
    const faqs = JSON.parse(localStorage.getItem("faqs") || "[]");
    if (faqs[index]) {
        if (type === 'up') {
            faqs[index].votes.up += 1;
        } else if (type === 'down') {
            faqs[index].votes.down += 1;
        }
        localStorage.setItem("faqs", JSON.stringify(faqs));
        renderFaqs();
    }
}