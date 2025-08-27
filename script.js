document.addEventListener("DOMContentLoaded", function() {
    renderAllContent();

    window.addEventListener('storage', (event) => {
        if (event.key === "site:update") {
            renderAllContent();
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
        partnerDiv.className = "partner";
        // Ajout de l'attribut 'title' au survol de l'image
        partnerDiv.innerHTML = `<img src="assets/logos/${p.logo}" alt="${p.name}" title="${p.name}">`;
        container.appendChild(partnerDiv);
    });
}