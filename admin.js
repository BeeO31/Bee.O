document.addEventListener("DOMContentLoaded", function() {
  const ADMIN_PASS = "beeopass";
  
  // Vérifie si l'utilisateur est déjà connecté dans la session
  if (!sessionStorage.getItem("isAdmin")) {
      let pass = prompt("Veuillez entrer le mot de passe administrateur :");
      // Boucle pour continuer à demander le mot de passe tant qu'il est incorrect
      while (pass !== ADMIN_PASS) {
          alert("Mot de passe incorrect. Accès refusé.");
          pass = prompt("Veuillez entrer le mot de passe administrateur :");
      }
      alert("Accès autorisé !");
      sessionStorage.setItem("isAdmin", "true");
  }

  // Initialiser les listes au chargement
  renderActusList();
  renderLiensList();
  renderGalleryList();
  renderPartnersList();
});

function logout() {
  sessionStorage.removeItem("isAdmin");
  window.location.href = "index.html";
}

let editingActuIndex = null;
let editingLienIndex = null;
let editingGalleryIndex = null;
let editingPartnerIndex = null;

// Actualités
function addActu() {
    const titre = document.getElementById("actu-title").value;
    const texte = document.getElementById("actu-text").value;
    const img = document.getElementById("actu-img").value;
    const pos = document.getElementById("actu-pos").value;

    const actus = JSON.parse(localStorage.getItem("actus") || "[]");
    if (editingActuIndex !== null) {
        actus[editingActuIndex] = { titre, texte, img, pos };
    } else {
        actus.unshift({ titre, texte, img, pos });
    }

    localStorage.setItem("actus", JSON.stringify(actus));
    document.getElementById("actu-title").value = "";
    document.getElementById("actu-text").value = "";
    document.getElementById("actu-img").value = "";
    editingActuIndex = null;
    document.getElementById("addActuBtn").innerHTML = `<i class="fa-solid fa-plus"></i> Ajouter`;
    renderActusList();
    localStorage.setItem("site:update", Date.now());
}

function editActu(index) {
    const actus = JSON.parse(localStorage.getItem("actus") || "[]");
    const actu = actus[index];
    document.getElementById("actu-title").value = actu.titre;
    document.getElementById("actu-text").value = actu.texte;
    document.getElementById("actu-img").value = actu.img;
    document.getElementById("actu-pos").value = actu.pos;
    editingActuIndex = index;
    document.getElementById("addActuBtn").innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Mettre à jour`;
    previewActu();
}

function renderActusList() {
    const container = document.getElementById("actus-list");
    const actus = JSON.parse(localStorage.getItem("actus") || "[]");
    container.innerHTML = "";
    actus.forEach((a, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p><strong>${a.titre}</strong></p>
            <div>
                <button onclick="editActu(${i})"><i class="fa-solid fa-pen-to-square"></i> Modifier</button>
                <button onclick="delActu(${i})" class="delete-btn"><i class="fa-solid fa-trash"></i> Supprimer</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function delActu(index) {
    const actus = JSON.parse(localStorage.getItem("actus") || "[]");
    actus.splice(index, 1);
    localStorage.setItem("actus", JSON.stringify(actus));
    renderActusList();
    localStorage.setItem("site:update", Date.now());
}

// Liens
function addLien() {
    const titre = document.getElementById("lien-title").value;
    const url = document.getElementById("lien-url").value;
    const liens = JSON.parse(localStorage.getItem("liens") || "[]");
    if (editingLienIndex !== null) {
        liens[editingLienIndex] = { titre, url };
    } else {
        liens.push({ titre, url });
    }
    localStorage.setItem("liens", JSON.stringify(liens));
    document.getElementById("lien-title").value = "";
    document.getElementById("lien-url").value = "";
    editingLienIndex = null;
    document.getElementById("addLienBtn").innerHTML = `<i class="fa-solid fa-plus"></i> Ajouter`;
    renderLiensList();
    localStorage.setItem("site:update", Date.now());
}

function editLien(index) {
    const liens = JSON.parse(localStorage.getItem("liens") || "[]");
    const lien = liens[index];
    document.getElementById("lien-title").value = lien.titre;
    document.getElementById("lien-url").value = lien.url;
    editingLienIndex = index;
    document.getElementById("addLienBtn").innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Mettre à jour`;
}

function renderLiensList() {
    const container = document.getElementById("liens-list");
    const liens = JSON.parse(localStorage.getItem("liens") || "[]");
    container.innerHTML = "";
    liens.forEach((l, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p>${l.titre}</p>
            <div>
                <button onclick="editLien(${i})"><i class="fa-solid fa-pen-to-square"></i> Modifier</button>
                <button onclick="delLien(${i})" class="delete-btn"><i class="fa-solid fa-trash"></i> Supprimer</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function delLien(index) {
    const liens = JSON.parse(localStorage.getItem("liens") || "[]");
    liens.splice(index, 1);
    localStorage.setItem("liens", JSON.stringify(liens));
    renderLiensList();
    localStorage.setItem("site:update", Date.now());
}

// Galerie
function addImage() {
    const img = document.getElementById("gallery-img").value;
    const gallery = JSON.parse(localStorage.getItem("gallery") || "[]");
    if (editingGalleryIndex !== null) {
        gallery[editingGalleryIndex] = img;
    } else {
        gallery.push(img);
    }
    localStorage.setItem("gallery", JSON.stringify(gallery));
    document.getElementById("gallery-img").value = "";
    editingGalleryIndex = null;
    document.getElementById("addImageBtn").innerHTML = `<i class="fa-solid fa-plus"></i> Ajouter`;
    renderGalleryList();
    localStorage.setItem("site:update", Date.now());
}

function editImage(index) {
    const gallery = JSON.parse(localStorage.getItem("gallery") || "[]");
    document.getElementById("gallery-img").value = gallery[index];
    editingGalleryIndex = index;
    document.getElementById("addImageBtn").innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Mettre à jour`;
}

function renderGalleryList() {
    const container = document.getElementById("gallery-list");
    const gallery = JSON.parse(localStorage.getItem("gallery") || "[]");
    container.innerHTML = "";
    gallery.forEach((g, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <img src="${g}" width="80">
            <div>
                <button onclick="editImage(${i})"><i class="fa-solid fa-pen-to-square"></i> Modifier</button>
                <button onclick="delImage(${i})" class="delete-btn"><i class="fa-solid fa-trash"></i> Supprimer</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function delImage(index) {
    const gallery = JSON.parse(localStorage.getItem("gallery") || "[]");
    gallery.splice(index, 1);
    localStorage.setItem("gallery", JSON.stringify(gallery));
    renderGalleryList();
    localStorage.setItem("site:update", Date.now());
}

// Partenaires
function addPartner() {
    const name = document.getElementById("partner-name").value;
    const logo = document.getElementById("partner-logo").value;
    const link = document.getElementById("partner-link").value;
    const partners = JSON.parse(localStorage.getItem("partners") || "[]");
    if (editingPartnerIndex !== null) {
        partners[editingPartnerIndex] = { name, logo, link };
    } else {
        partners.push({ name, logo, link });
    }
    localStorage.setItem("partners", JSON.stringify(partners));
    document.getElementById("partner-name").value = "";
    document.getElementById("partner-logo").value = "";
    document.getElementById("partner-link").value = "";
    editingPartnerIndex = null;
    document.getElementById("addPartnerBtn").innerHTML = `<i class="fa-solid fa-plus"></i> Ajouter`;
    renderPartnersList();
    localStorage.setItem("site:update", Date.now());
}

function editPartner(index) {
    const partners = JSON.parse(localStorage.getItem("partners") || "[]");
    const partner = partners[index];
    document.getElementById("partner-name").value = partner.name;
    document.getElementById("partner-logo").value = partner.logo;
    document.getElementById("partner-link").value = partner.link;
    editingPartnerIndex = index;
    document.getElementById("addPartnerBtn").innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Mettre à jour`;
}

function renderPartnersList() {
    const container = document.getElementById("partners-list");
    const partners = JSON.parse(localStorage.getItem("partners") || "[]");
    container.innerHTML = "";
    partners.forEach((p, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p>${p.name}</p>
            <div>
                <button onclick="editPartner(${i})"><i class="fa-solid fa-pen-to-square"></i> Modifier</button>
                <button onclick="delPartner(${i})" class="delete-btn"><i class="fa-solid fa-trash"></i> Supprimer</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function delPartner(index) {
    const partners = JSON.parse(localStorage.getItem("partners") || "[]");
    partners.splice(index, 1);
    localStorage.setItem("partners", JSON.stringify(partners));
    renderPartnersList();
    localStorage.setItem("site:update", Date.now());
}

function previewActu() {
    const titre = document.getElementById("actu-title").value;
    const texte = document.getElementById("actu-text").value;
    const img = document.getElementById("actu-img").value;
    const pos = document.getElementById("actu-pos").value;
    const prev = document.getElementById("actu-preview");
    prev.innerHTML = `
        <div style="display:flex;gap:10px;align-items:flex-start;">
            ${pos === "left" ? `<img src="${img}" style="width:80px;height:auto;">` : ""}
            <div>
                <h4 style="color:#4caf50">${titre}</h4>
                <p>${texte}</p>
            </div>
            ${pos === "right" ? `<img src="${img}" style="width:80px;height:auto;">` : ""}
        </div>`;
}
