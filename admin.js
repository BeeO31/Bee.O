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
    document.getElementById("addActuBtn").textContent = "Ajouter";
    editingActuIndex = null;
    renderActusList();
    localStorage.setItem("site:update", Date.now());
}

function renderActusList() {
    const container = document.getElementById("actus-list");
    const actus = JSON.parse(localStorage.getItem("actus") || "[]");
    container.innerHTML = "";
    actus.forEach((a, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <div style="display:flex;align-items:center;">
                ${a.img ? `<img src="${a.img}" alt="Image">` : ""}
                <p><strong>${a.titre}</strong><br>${a.texte.slice(0, 100)}...</p>
            </div>
            <div>
                <button onclick="editActu(${i})"><i class="fa-solid fa-pen-to-square"></i> Modifier</button>
                <button onclick="delActu(${i})" class="delete-btn"><i class="fa-solid fa-trash"></i> Supprimer</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function editActu(index) {
    const actus = JSON.parse(localStorage.getItem("actus") || "[]");
    const actu = actus[index];
    document.getElementById("actu-title").value = actu.titre;
    document.getElementById("actu-text").value = actu.texte;
    document.getElementById("actu-img").value = actu.img;
    document.getElementById("actu-pos").value = actu.pos;
    document.getElementById("addActuBtn").textContent = "Modifier";
    editingActuIndex = index;
    previewActu();
}

function delActu(index) {
    const actus = JSON.parse(localStorage.getItem("actus") || "[]");
    actus.splice(index, 1);
    localStorage.setItem("actus", JSON.stringify(actus));
    renderActusList();
    localStorage.setItem("site:update", Date.now());
}

function addLien() {
    const title = document.getElementById("lien-title").value;
    const url = document.getElementById("lien-url").value;
    const liens = JSON.parse(localStorage.getItem("liens") || "[]");
    if (editingLienIndex !== null) {
        liens[editingLienIndex] = { title, url };
    } else {
        liens.unshift({ title, url });
    }
    localStorage.setItem("liens", JSON.stringify(liens));
    document.getElementById("lien-title").value = "";
    document.getElementById("lien-url").value = "";
    document.getElementById("addLienBtn").textContent = "Ajouter";
    editingLienIndex = null;
    renderLiensList();
    localStorage.setItem("site:update", Date.now());
}

function renderLiensList() {
    const container = document.getElementById("liens-list");
    const liens = JSON.parse(localStorage.getItem("liens") || "[]");
    container.innerHTML = "";
    liens.forEach((l, i) => {
        const div = document.createElement("div");
        div.className = "admin-link-card";
        div.innerHTML = `
            <a href="${l.url}" target="_blank" class="link-card-content">
                <i class="fa-solid fa-link"></i>
                <span>${l.title}</span>
            </a>
            <div class="link-card-actions">
                <button onclick="editLien(${i})"><i class="fa-solid fa-pen-to-square"></i> Modifier</button>
                <button onclick="delLien(${i})" class="delete-btn"><i class="fa-solid fa-trash"></i> Supprimer</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function editLien(index) {
    const liens = JSON.parse(localStorage.getItem("liens") || "[]");
    const lien = liens[index];
    document.getElementById("lien-title").value = lien.title;
    document.getElementById("lien-url").value = lien.url;
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

function addImage() {
    const img = document.getElementById("gallery-img").value;
    const images = JSON.parse(localStorage.getItem("gallery") || "[]");
    if (editingGalleryIndex !== null) {
        images[editingGalleryIndex] = img;
    } else {
        images.unshift(img);
    }
    localStorage.setItem("gallery", JSON.stringify(images));
    document.getElementById("gallery-img").value = "";
    document.getElementById("addImageBtn").textContent = "Ajouter";
    editingGalleryIndex = null;
    renderGalleryList();
    localStorage.setItem("site:update", Date.now());
}

function renderGalleryList() {
    const container = document.getElementById("gallery-list");
    const images = JSON.parse(localStorage.getItem("gallery") || "[]");
    container.innerHTML = "";
    images.forEach((img, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <img src="${img}" alt="Image Galerie">
            <div>
                <button onclick="editImage(${i})"><i class="fa-solid fa-pen-to-square"></i> Modifier</button>
                <button onclick="delImage(${i})" class="delete-btn"><i class="fa-solid fa-trash"></i> Supprimer</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function editImage(index) {
    const images = JSON.parse(localStorage.getItem("gallery") || "[]");
    document.getElementById("gallery-img").value = images[index];
    document.getElementById("addImageBtn").textContent = "Modifier";
    editingGalleryIndex = index;
}

function delImage(index) {
    const images = JSON.parse(localStorage.getItem("gallery") || "[]");
    images.splice(index, 1);
    localStorage.setItem("gallery", JSON.stringify(images));
    renderGalleryList();
    localStorage.setItem("site:update", Date.now());
}

function addPartner() {
    const name = document.getElementById("partner-name").value;
    const logo = document.getElementById("partner-logo").value;
    let link = document.getElementById("partner-link").value;
    
    // Ajout du protocole si manquant
    if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
        link = 'https://' + link;
    }
    
    const partners = JSON.parse(localStorage.getItem("partners") || "[]");
    if (editingPartnerIndex !== null) {
        partners[editingPartnerIndex] = { name, logo, link };
    } else {
        partners.unshift({ name, logo, link });
    }
    localStorage.setItem("partners", JSON.stringify(partners));
    document.getElementById("partner-name").value = "";
    document.getElementById("partner-logo").value = "";
    document.getElementById("partner-link").value = "";
    document.getElementById("addPartnerBtn").textContent = "Ajouter";
    editingPartnerIndex = null;
    renderPartnersList();
    localStorage.setItem("site:update", Date.now());
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
                <h4 style="color:var(--pink);">${titre}</h4>
                <p>${texte}</p>
            </div>
            ${pos === "right" ? `<img src="${img}" style="width:80px;height:auto;">` : ""}
        </div>
    `;
}