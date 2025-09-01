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
    renderFAQList();
    // Nouvelles fonctions pour les infos pratiques
    document.getElementById("info-address").value = localStorage.getItem("info:address") || "";
    document.getElementById("info-hours").value = localStorage.getItem("info:hours") || "";
    renderContactsList();
}

let editingActuIndex = null;
let editingLienIndex = null;
let editingGalleryIndex = null;
let editingPartnerIndex = null;
let editingContactIndex = null;
let editingFAQIndex = null;


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
        actus.unshift(actu);
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

//Infos Pratiques
// Gérer les informations pratiques (adresse et horaires)
function saveGeneralInfo() {
    const address = document.getElementById("info-address").value;
    const hours = document.getElementById("info-hours").value;
    localStorage.setItem("info:address", address);
    localStorage.setItem("info:hours", hours);
    alert("Informations générales enregistrées !");
    localStorage.setItem("site:update", Date.now());
}

// Gérer les contacts
function addContact() {
    const name = document.getElementById("contact-name").value;
    const phone = document.getElementById("contact-phone").value;
    if (!name || !phone) {
        alert("Veuillez remplir le prénom et le numéro de téléphone.");
        return;
    }

    const contacts = JSON.parse(localStorage.getItem("infos:contacts") || "[]");
    const contact = { name, phone };

    if (editingContactIndex !== null) {
        contacts[editingContactIndex] = contact;
        editingContactIndex = null;
    } else {
        contacts.push(contact);
    }

    localStorage.setItem("infos:contacts", JSON.stringify(contacts));
    renderContactsList();
    clearContactForm();
    localStorage.setItem("site:update", Date.now());
}

function renderContactsList() {
    const contacts = JSON.parse(localStorage.getItem("infos:contacts") || "[]");
    const container = document.getElementById("contacts-list");
    if (!container) return;
    container.innerHTML = "";
    contacts.forEach((c, i) => {
        const item = document.createElement("div");
        item.innerHTML = `
            <span>${c.name} : ${c.phone}</span>
            <div class="admin-actions">
                <button onclick="editContact(${i})">Modifier</button>
                <button onclick="delContact(${i})" class="delete-btn">Supprimer</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function editContact(index) {
    const contacts = JSON.parse(localStorage.getItem("infos:contacts") || "[]");
    const contact = contacts[index];
    document.getElementById("contact-name").value = contact.name;
    document.getElementById("contact-phone").value = contact.phone;
    document.getElementById("addContactBtn").textContent = "Modifier";
    editingContactIndex = index;
}

function delContact(index) {
    const contacts = JSON.parse(localStorage.getItem("infos:contacts") || "[]");
    contacts.splice(index, 1);
    localStorage.setItem("infos:contacts", JSON.stringify(contacts));
    renderContactsList();
    localStorage.setItem("site:update", Date.now());
}

function clearContactForm() {
    document.getElementById("contact-name").value = "";
    document.getElementById("contact-phone").value = "";
    document.getElementById("addContactBtn").textContent = "Ajouter un contact";
    editingContactIndex = null;
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

    let imgElement = img ? `<img src="${img}" alt="Image de l'actualité" style="max-width:100%; height:auto;">` : '';
    let previewContent = '';

    if (pos === "centered") {
        previewContent = `
            <div style="text-align:center; padding: 15px; border: 1px dashed #ccc;">
                <h4 style="margin:0;font-size:1.2em;">${titre}</h4>
                ${imgElement}
                <p style="margin-top:10px;">${texte}</p>
            </div>
        `;
    } else {
        previewContent = `
            <div style="display:flex;gap:10px;align-items:flex-start;border: 1px dashed #ccc;padding: 15px;">
                ${pos === "left" ? imgElement : ""}
                <div style="flex-grow:1;">
                    <h4 style="margin:0;font-size:1.2em;">${titre}</h4>
                    <p style="margin-top:5px;">${texte}</p>
                </div>
                ${pos === "right" ? imgElement : ""}
            </div>
        `;
    }

    prev.innerHTML = previewContent;
}

// FAQ
function addFaq() {
    const faqs = JSON.parse(localStorage.getItem("faqs") || "[]");
    const id = document.getElementById("faq-id").value;
    const question = document.getElementById("faq-question").value;
    const reponse = document.getElementById("faq-answer").value;
    
    if (editingFAQIndex !== null) {
        faqs[editingFAQIndex] = { id, question, reponse, votes: faqs[editingFAQIndex].votes };
        editingFAQIndex = null;
    } else {
        faqs.push({ id, question, reponse, votes: { up: 0, down: 0 } });
    }
    
    localStorage.setItem("faqs", JSON.stringify(faqs));
    renderFAQList();
    clearFAQForm();
    localStorage.setItem("site:update", Date.now());
}

function renderFAQList() {
    const faqs = JSON.parse(localStorage.getItem("faqs") || "[]");
    const container = document.getElementById("faq-list");
    if (!container) return;
    
    container.innerHTML = "";
    if (faqs.length === 0) {
        container.innerHTML = "<p>Aucune FAQ enregistrée.</p>";
        return;
    }

    faqs.forEach((f, index) => {
        const item = document.createElement("div");
        item.className = "admin-item";
        item.innerHTML = `
            <span>${f.id}</span>
            <div class="admin-actions">
                <button onclick="editFAQ(${index})">Modifier</button>
                <button onclick="delFAQ(${index})" class="delete-btn">Supprimer</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function editFAQ(index) {
    const faqs = JSON.parse(localStorage.getItem("faqs") || "[]");
    const f = faqs[index];
    document.getElementById("faq-id").value = f.id;
    document.getElementById("faq-question").value = f.question;
    document.getElementById("faq-answer").value = f.answer;
    document.getElementById("addFaqBtn").textContent = "Modifier";
    editingFAQIndex = index;
}

function delFAQ(index) {
    const faqs = JSON.parse(localStorage.getItem("faqs") || "[]");
    faqs.splice(index, 1);
    localStorage.setItem("faqs", JSON.stringify(faqs));
    renderFAQList();
    localStorage.setItem("site:update", Date.now());
}

function clearFAQForm() {
    document.getElementById("faq-id").value = "";
    document.getElementById("faq-question").value = "";
    document.getElementById("faq-answer").value = "";
    document.getElementById("addFaqBtn").textContent = "Ajouter";
    editingFAQIndex = null;
}