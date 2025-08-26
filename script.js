document.addEventListener("DOMContentLoaded", () => {
  renderAll();

  // Scroll-top button
  const scrollBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    scrollBtn.style.display = (window.scrollY > 200) ? "block" : "none";
  });
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Init carrousel
  initPartnersCarousel();
});

function renderAll() {
  renderActus();
  renderLiens();
  renderGalerie();
  renderPartners();
}

function renderActus() {
  const container = document.getElementById("actus-container");
  container.innerHTML = "";

  const actus = JSON.parse(localStorage.getItem("actus") || "[]");

  actus.forEach((a, i) => {
    const div = document.createElement("div");
    div.className = `actu-item ${a.pos === "right" ? "img-right" : "img-left"}`;
    div.innerHTML = `
      ${a.img ? `<img src="${a.img}" class="actu-img" alt="">` : ""}
      <div class="actu-content">
        <h3 class="actu-title" style="color:${i===0?'rgb(255,47,155)':(i%2?'#FFD700':'#4caf50')}">${a.titre}</h3>
        <p>${a.texte}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderLiens() {
  const container = document.getElementById("liens-container");
  container.innerHTML = "";
  const liens = JSON.parse(localStorage.getItem("liens") || "[]");

  liens.forEach(l => {
    const a = document.createElement("a");
    a.href = l.url;
    a.className = "link-card";
    a.target = "_blank";
    a.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(l.url)}" alt="Icone ${l.titre}"><p>${l.titre}</p>`;
    container.appendChild(a);
  });
}

function renderGalerie() {
  const container = document.getElementById("galerie-container");
  container.innerHTML = "";
  const images = JSON.parse(localStorage.getItem("gallery") || "[]");

  images.forEach(img => {
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.innerHTML = `<img src="${img}" alt="Photo Galerie">`;
    container.appendChild(div);
  });
}

async function renderPartners() {
  const wrap = document.getElementById("partnersCarousel");
  if (!wrap) return;
  wrap.innerHTML = "";

  let base = [];
  try {
    const res = await fetch("partners.json");
    base = await res.json();
  } catch(e){ base = []; }

  const extras = JSON.parse(localStorage.getItem("partners") || "[]");
  const partners = [...base, ...extras];

  partners.forEach(p => {
    const div = document.createElement("div");
    div.className = "partner";
    const img = `<img src="assets/logos/${p.logo}" alt="${p.name}">`;
    div.innerHTML = p.link ? `<a href="${p.link}" target="_blank">${img}</a>` : img;
    wrap.appendChild(div);
  });
}

function initPartnersCarousel() {
  const carousel = document.getElementById("partnersCarousel");
  if (!carousel) return;

  const animationDuration = 15000;
  const clone = carousel.cloneNode(true);
  carousel.parentNode.appendChild(clone);

  const style = document.createElement('style');
  style.innerHTML = `
    .carousel-wrapper > div {
      animation: scroll ${animationDuration / 1000}s linear infinite;
    }
    .carousel-wrapper > div:nth-child(2) {
      animation-delay: -${animationDuration / 2000}s;
    }
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-100%); }
    }
  `;
  document.head.appendChild(style);
}

// Rafraîchir la page si des changements sont faits via l'admin
window.addEventListener("storage", (event) => {
  if (event.key === "site:update") {
    renderAll();
  }
});
