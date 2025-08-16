const LS_NEWS = "beeO_news";
const LS_ARCHIVE = "beeO_archive";
const LS_LINKS = "beeO_links";

let news = JSON.parse(localStorage.getItem(LS_NEWS)) || [];
let archived = JSON.parse(localStorage.getItem(LS_ARCHIVE)) || [];
let links = JSON.parse(localStorage.getItem(LS_LINKS)) || [];

const actusContainer = document.getElementById("actus-container");
const archiveContainer = document.getElementById("archive-container");
const linksContainer = document.getElementById("links-container");

const colors = ["rgb(255,47,155)", "#ffc107", "#4caf50"];
let colorIndex = 0;

// INIT DEMO NEWS
if (news.length === 0 && !localStorage.getItem("beeO_demoNews")) {
  news = [
    {
      id: Date.now(),
      title: "Assemblée Générale",
      content: "Rendez-vous le 15 septembre pour notre AG annuelle.\nSalle polyvalente à 18h00.",
      image: "https://drive.google.com/uc?export=view&id=1K9lyMp_ieaoWIoTU31hbw_xhahPJR7pG",
      position: "left"
    },
    {
      id: Date.now() + 1,
      title: "Portes Ouvertes",
      content: "Le 25 septembre, venez découvrir nos ateliers et dégustations.\nEntrée libre !",
      image: "https://drive.google.com/uc?export=view&id=1Ad_8U5eBdq5ORnjCMhlDyCpfX9iCWeAH",
      position: "right"
    }
  ];
  localStorage.setItem("beeO_demoNews", "1");
  localStorage.setItem(LS_NEWS, JSON.stringify(news));
}

// RENDER ACTUS
function renderNews() {
  actusContainer.innerHTML = "";
  news.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("actu-item");
    div.innerHTML = `
      ${item.position === "left" && item.image ? `<img src="${item.image}" alt="">` : ""}
      <div class="actu-text">
        <h3 style="color:${colors[index % colors.length]}">${item.title}</h3>
        <p>${item.content.replace(/\n/g, "<br>")}</p>
        <div class="admin-actions">
          <button onclick="archiveNews(${item.id})">Archiver</button>
          <button onclick="deleteNews(${item.id})">Supprimer</button>
        </div>
      </div>
      ${item.position === "right" && item.image ? `<img src="${item.image}" alt="">` : ""}
    `;
    actusContainer.appendChild(div);
  });
}

// RENDER ARCHIVE
function renderArchived() {
  archiveContainer.innerHTML = "";
  archived.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("actu-item");
    div.innerHTML = `
      ${item.position === "left" && item.image ? `<img src="${item.image}" alt="">` : ""}
      <div class="actu-text">
        <h3>${item.title}</h3>
        <p>${item.content.replace(/\n/g, "<br>")}</p>
      </div>
      ${item.position === "right" && item.image ? `<img src="${item.image}" alt="">` : ""}
    `;
    archiveContainer.appendChild(div);
  });
}

// ARCHIVER
function archiveNews(id) {
  const index = news.findIndex(n => n.id === id);
  if (index > -1) {
    archived.push(news[index]);
    news.splice(index, 1);
    localStorage.setItem(LS_NEWS, JSON.stringify(news));
    localStorage.setItem(LS_ARCHIVE, JSON.stringify(archived));
    renderAll();
  }
}

// SUPPRIMER
function deleteNews(id) {
  news = news.filter(n => n.id !== id);
  localStorage.setItem(LS_NEWS, JSON.stringify(news));
  renderAll();
}

// AJOUTER NEWS
document.getElementById("add-news").addEventListener("click", () => {
  const title = document.getElementById("news-title").value;
  const content = document.getElementById("news-content").value;
  const image = document.getElementById("news-image").value;
  const position = document.getElementById("news-position").value;

  const newItem = { id: Date.now(), title, content, image, position };
  news.unshift(newItem);
  localStorage.setItem(LS_NEWS, JSON.stringify(news));
  renderAll();
});

// LIENS DÉMO
if (links.length === 0) {
  links = [
    { title: "Vidéo Google Drive", url: "https://drive.google.com/file/d/1K9lyMp_ieaoWIoTU31hbw_xhahPJR7pG/view", img: "https://drive.google.com/uc?export=view&id=1K9lyMp_ieaoWIoTU31hbw_xhahPJR7pG" },
    { title: "Google Slides", url: "https://drive.google.com/file/d/1Ad_8U5eBdq5ORnjCMhlDyCpfX9iCWeAH/view", img: "https://drive.google.com/uc?export=view&id=1Ad_8U5eBdq5ORnjCMhlDyCpfX9iCWeAH" }
  ];
  localStorage.setItem(LS_LINKS, JSON.stringify(links));
}

// RENDER LIENS
function renderLinks() {
  linksContainer.innerHTML = "";
  links.forEach(link => {
    const div = document.createElement("div");
    div.classList.add("link-item");
    div.innerHTML = `<a href="${link.url}" target="_blank"><img src="${link.img}" alt=""><p>${link.title}</p></a>`;
    linksContainer.appendChild(div);
  });
}

// AJOUT LIEN
document.getElementById("add-link").addEventListener("click", () => {
  const title = document.getElementById("link-title").value;
  const url = document.getElementById("link-url").value;
  let img = document.getElementById("link-image").value;
  if (!img) {
    if (url.includes("drive")) img = "assets/icon-doc.png";
    else if (url.includes("youtube")) img = "assets/icon-video.png";
    else img = "assets/icon-link.png";
  }
  links.push({ title, url, img });
  localStorage.setItem(LS_LINKS, JSON.stringify(links));
  renderAll();
});

// ADMIN LOGIN
const correctPass = "beeO2025";
document.getElementById("login-btn").addEventListener("click", () => {
  const input = document.getElementById("admin-pass").value;
  if (input === correctPass) {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("admin-content").style.display = "block";
  } else {
    document.getElementById("login-error").style.display = "block";
  }
});

// ACCORDIONS
document.querySelectorAll(".accordion-header").forEach(header => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
  });
});

// BOUTON RETOUR EN HAUT
const scrollBtn = document.getElementById("scrollTopBtn");
window.onscroll = function() {
  scrollBtn.style.display = (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) ? "block" : "none";
};
scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// LIGHTBOX
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
document.querySelectorAll(".lightbox-item").forEach(img => {
  img.addEventListener("click", () => {
    lightbox.style.display = "flex";
    lightboxImg.src = img.src;
  });
});
document.querySelector(".close-lightbox").addEventListener("click", () => {
  lightbox.style.display = "none";
});

// RENDER ALL
function renderAll() {
  renderNews();
  renderArchived();
  renderLinks();
}
renderAll();
