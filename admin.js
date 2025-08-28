document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    const loginForm = document.getElementById("login-form");
    const adminContent = document.getElementById("admin-content");

    if (isLoggedIn) {
        loginForm.style.display = "none";
        adminContent.style.display = "block";
        renderAllAdminContent();
    } else {
        loginForm.style.display = "flex";
        adminContent.style.display = "none";
    }
});

function login() {
    const password = document.getElementById("admin-password").value;
    // Remplacez 'beeopass' par le mot de passe de votre choix pour le test local
    if (password === "beeopass") {
        localStorage.setItem("adminLoggedIn", "true");
        window.location.reload();
    } else {
        alert("Mot de passe incorrect !");
    }
}

function logout() {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "index.html";
}

function renderAllAdminContent() {
    renderActusList();
    renderLiensList();
    renderGalleryList();
    renderPartnersList();
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
    const actu = { titre, texte, img, pos };
    const actus = JSON.parse(localStorage.getItem("actus") || "[]");
    
    if (editingActuIndex !== null) {
        actus[editingActuIndex] = actu;
        editingActuIndex = null;
    } else {
        actus.push(actu);
    }

    localStorage.setItem("actus", JSON.stringify(actus));
    renderActusList();
    localStorage.setItem("site:update", Date.now());
    clearActuForm();
}

function renderActusList() {
    const actus = JSON.parse(localStorage.getItem("actus") || "[]");
    const container = document.getElementById("actus-list");
    container.innerHTML = "";
    actus.forEach((a, i) => {
        const item = document.createElement("div");
        item.innerHTML = `
            ${a.img ? `<img src="${a.img}" alt="${a.titre}">` : ''}
            <span><strong>${a.titre}</strong></span>
            <div class="admin-actions">
                <button onclick="editActu(${i})">Modifier</button>
                <button onclick="delActu(${i})" class="delete-btn">Supprimer</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function editActu(index) {
    const actus = JSON.parse(localStorage.getItem("actus") || "[]");
    const a = actus[index];
    document.getElementById("actu-title").value = a.titre;
    document.getElementById("actu-text").value = a.texte;
    document.getElementById("actu-img").value = a.img;
    document.getElementById("actu-pos").value = a.pos;
    document.getElementById("addActuBtn").textContent = "Modifier";
    editingActuIndex = index;
}

function delActu(index) {
    const actus = JSON.parse(localStorage.getItem("actus") || "[]");
    actus.splice(index, 1);
    localStorage.setItem("actus", JSON.stringify(actus));
    renderActusList();
    localStorage.setItem("site:update", Date.now());
}

function clearActuForm() {
    document.getElementById("actu-title").value = "";
    document.getElementById("actu-text").value = "";
    document.getElementById("actu-img").value = "";
    document.getElementById("actu-pos").value = "left";
    document.getElementById("addActuBtn").textContent = "Ajouter";
    editingActuIndex = null;
    previewActu();
}

// Liens utiles
function addLien() {
    const titre = document.getElementById("lien-title").value;
    const url = document.getElementById("lien-url").value;
    const icon = document.getElementById("lien-icon").value;
    const lien = { titre, url, icon };
    const liens = JSON.parse(localStorage.getItem("liens") || "[]");

    if (editingLienIndex !== null) {
        liens[editingLienIndex] = lien;
        editingLienIndex = null;
    } else {
        liens.push(lien);
    }
    
    localStorage.setItem("liens", JSON.stringify(liens));
    renderLiensList();
    localStorage.setItem("site:update", Date.now());
    clearLienForm();
}

function renderLiensList() {
    const liens = JSON.parse(localStorage.getItem("liens") || "[]");
    const container = document.getElementById("liens-list");
    container.innerHTML = "";
    liens.forEach((l, i) => {
        const item = document.createElement("div");
        item.innerHTML = `
            <img src="assets/icons/${l.icon}" alt="${l.titre}">
            <span>${l.titre}</span>
            <div class="admin-actions">
                <button onclick="editLien(${i})">Modifier</button>
                <button onclick="delLien(${i})" class="delete-btn">Supprimer</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function editLien(index) {
    const liens = JSON.parse(localStorage.getItem("liens") || "[]");
    const l = liens[index];
    document.getElementById("lien-title").value = l.titre;
    document.getElementById("lien-url").value = l.url;
    document.getElementById("lien-icon").value = l.icon;
    document.getElementById("addLienBtn").textContent = "Modifier";
    editingLienIndex = index;
}

function delLien(index) {
    const liens = JSON.parse(localStorage.getItem("liens") || "[]");
    liens.splice(index, 1);
    localStorage.setItem("liens", JSON.stringify(liens));
    renderLiensList();
    localStorage.setItem("site:update", Date.now());
}

function clearLienForm() {
    document.getElementById("lien-title").value = "";
    document.getElementById("lien-url").value = "";
    document.getElementById("lien-icon").value = "globe.png";
    document.getElementById("addLienBtn").textContent = "Ajouter";
    editingLienIndex = null;
}

// Galerie
function addImage() {
    const imgUrl = document.getElementById("gallery-img").value;
    const gallery = JSON.parse(localStorage.getItem("gallery") || "[]");
    
    if (editingGalleryIndex !== null) {
        gallery[editingGalleryIndex] = imgUrl;
        editingGalleryIndex = null;
    } else {
        gallery.push(imgUrl);
    }

    localStorage.setItem("gallery", JSON.stringify(gallery));
    renderGalleryList();
    localStorage.setItem("site:update", Date.now());
    clearGalleryForm();
}

function renderGalleryList() {
    const gallery = JSON.parse(localStorage.getItem("gallery") || "[]");
    const container = document.getElementById("gallery-list");
    container.innerHTML = "";
    gallery.forEach((img, i) => {
        const item = document.createElement("div");
        item.innerHTML = `
            <img src="${img}" alt="Image de la galerie">
            <div class="admin-actions">
                <button onclick="editImage(${i})">Modifier</button>
                <button onclick="delImage(${i})" class="delete-btn">Supprimer</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function editImage(index) {
    const gallery = JSON.parse(localStorage.getItem("gallery") || "[]");
    const imgUrl = gallery[index];
    document.getElementById("gallery-img").value = imgUrl;
    document.getElementById("addImageBtn").textContent = "Modifier";
    editingGalleryIndex = index;
}

function delImage(index) {
    const gallery = JSON.parse(localStorage.getItem("gallery") || "[]");
    gallery.splice(index, 1);
    localStorage.setItem("gallery", JSON.stringify(gallery));
    renderGalleryList();
    localStorage.setItem("site:update", Date.now());
}

function clearGalleryForm() {
    document.getElementById("gallery-img").value = "";
    document.getElementById("addImageBtn").textContent = "Ajouter";
    editingGalleryIndex = null;
}

// Partenaires
function addPartner() {
    const name = document.getElementById("partner-name").value;
    const logo = document.getElementById("partner-logo").value;
    const link = document.getElementById("partner-link").value;
    const partner = { name, logo, link };
    const partners = JSON.parse(localStorage.getItem("partners") || "[]");

    if (editingPartnerIndex !== null) {
        partners[editingPartnerIndex] = partner;
        editingPartnerIndex = null;
    } else {
        partners.push(partner);
    }
    
    localStorage.setItem("partners", JSON.stringify(partners));
    renderPartnersList();
    localStorage.setItem("site:update", Date.now());
    clearPartnerForm();
}

function renderPartnersList() {
    const partners = JSON.parse(localStorage.getItem("partners") || "[]");
    const container = document.getElementById("partners-list");
    container.innerHTML = "";
    partners.forEach((p, i) => {
        const item = document.createElement("div");
        item.innerHTML = `
            <img src="assets/logos/${p.logo}" alt="${p.name} logo">
            <span>${p.name}</span>
            <div class="admin-actions">
                <button onclick="editPartner(${i})">Modifier</button>
                <button onclick="delPartner(${i})" class="delete-btn">Supprimer</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function editPartner(index) {
    const partners = JSON.parse(localStorage.getItem("partners") || "[]");
    const p = partners[index];
    document.getElementById("partner-name").value = p.name;
    document.getElementById("partner-logo").value = p.logo;
    document.getElementById("partner-link").value = p.link;
    document.getElementById("addPartnerBtn").textContent = "Modifier";
    editingPartnerIndex = index;
}

function delPartner(index) {
    const partners = JSON.parse(localStorage.getItem("partners") || "[]");
    partners.splice(index, 1);
    localStorage.setItem("partners", JSON.stringify(partners));
    renderPartnersList();
    localStorage.setItem("site:update", Date.now());
}

function clearPartnerForm() {
    document.getElementById("partner-name").value = "";
    document.getElementById("partner-logo").value = "";
    document.getElementById("partner-link").value = "";
    document.getElementById("addPartnerBtn").textContent = "Ajouter";
    editingPartnerIndex = null;
}

function previewActu() {
    const titre = document.getElementById("actu-title").value;
    const texte = document.getElementById("actu-text").value;
    const img = document.getElementById("actu-img").value;
    const pos = document.getElementById("actu-pos").value;
    const prev = document.getElementById("actu-preview");
    prev.innerHTML = `
        <div style="display:flex;gap:10px;align-items:flex-start;border: 1px dashed #ccc;padding: 15px;">
            ${pos === "left" ? `<img src="${img}" style="width:80px;height:auto;">` : ""}
            <div>
                <h4 style="color:var(--green);margin-top:0;">${titre}</h4>
                <p style="font-size:0.9rem;margin:0;">${texte}</p>
            </div>
            ${pos === "right" ? `<img src="${img}" style="width:80px;height:auto;">` : ""}
        </div>
    `;
}