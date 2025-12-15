document.addEventListener("DOMContentLoaded", () => {
  const viewEl = document.getElementById("view");
  const statusEl = document.getElementById("status");

  const setStatus = (t) => {
    if (statusEl) statusEl.textContent = t;
    console.log("[STATUS]", t);
  };

  const esc = (s) =>
    String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

 
  if (!viewEl) {
    setStatus("FEHLER: #view nicht gefunden. Prüfe index.html: <div id='view'> … </div>");
    console.error("Missing #view element. In index.html muss stehen: <div class='panel' id='view'></div>");
    return;
  }


  const photos = [
    { src: "assets/img/encarta_startbildschirm.png", caption: "Encarta 95 – Startbildschirm" },
    { src: "assets/img/encarta_katalog.png", caption: "Katalog" },
    { src: "assets/img/encarta_suchfunktion.png", caption: "Suchfunktion" },
    { src: "assets/img/encarta_feature_mediengalerie.png", caption: "Feature – Mediengalerie" },
    { src: "assets/img/encarta_mindmaze.png", caption: "MindMaze" },
    { src: "assets/img/encarta_information_science.png", caption: "Information Science" },
    { src: "assets/img/encarta_timeline.png", caption: "Timeline" },
  ];

  const videos = [
  { src: "assets/video/encarta_atlas.mp4", caption: "Atlas" },
  { src: "assets/video/encarta_mindmaze.mp4", caption: "MindMaze" },
  { src: "assets/video/encarta_navigation.mp4", caption: "Navigation" },
];


  function render(html) {
    viewEl.innerHTML = html;
  }

  function renderStart() {
    render(`
      <div class="splash">
        <h2>Willkommen.</h2>
        <p>Encarta-95-Style Galerie. Nutze links die Navigation.</p>
        <div class="card">
          <p><strong>Debug</strong></p>
          <p>Wenn du das hier siehst, läuft <code>app.js</code>.</p>
        </div>
      </div>
    `);
    setStatus("Startbildschirm geladen.");
  }

  function renderFotos() {
    const cards = photos.map(p => `
      <div class="card">
<img src="${p.src}"
     data-full="${p.src}"
     alt="${esc(p.caption)}"
     loading="lazy"
     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">

        <div style="display:none; border:1px solid #808080; background:#000; color:#fff; padding:10px; font-size:12px;">
          Bild nicht gefunden<br><code style="color:#fff;">${esc(p.src)}</code>
        </div>
        <div class="caption">${esc(p.caption)}</div>
      </div>
    `).join("");

    render(`
      <h2>Fotos</h2>
      <div class="gallery">${cards}</div>
    `);
    setStatus(`Fotos geladen: ${photos.length} Einträge.`);
  }

function renderVideos() {
  if (!videos.length) {
    render(`<h2>Videos</h2><p>Noch keine Videos eingetragen.</p>`);
    setStatus("Videos geladen: 0 Einträge.");
    return;
  }

  const cards = videos.map(v => `
    <div class="card">
      <video controls preload="metadata" playsinline>
        <source src="${v.src}" type="video/mp4">
        Dein Browser unterstützt dieses Videoformat nicht.
      </video>
      <div class="caption">${esc(v.caption)}</div>
      <div style="margin-top:6px; font-size:12px;">
        <a href="${v.src}" target="_blank" rel="noopener">Video in neuem Tab öffnen</a>
      </div>
    </div>
  `).join("");

  render(`
    <h2>Videos</h2>
    <div class="gallery">${cards}</div>
  `);

  setStatus(`Videos geladen: ${videos.length} Einträge.`);
}


  function renderAbout() {
    render(`
      <h2>Über das Projekt</h2>
      <p>Statische GitHub-Pages-Seite (HTML/CSS/JS) im Encarta-95-Stil.</p>
    `);
    setStatus("Über-Seite geladen.");
  }

  const routes = {
    start: renderStart,
    fotos: renderFotos,
    videos: renderVideos,
    about: renderAbout,
  };

  function navigate(view) {
    (routes[view] || renderStart)();
  }


  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-view]");
    if (!btn) return;
    const view = btn.dataset.view;
    setStatus(`Navigation: ${view}`);
    navigate(view);
  });


  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `
    <div class="win">
      <div class="titlebar">
        <div class="title-left">
          <span class="win-icon"></span>
          <span id="lb-title">Bild</span>
        </div>
        <div class="title-buttons">
          <button class="tb close" id="lb-close">✕</button>
        </div>
      </div>
      <div class="body">
        <img id="lb-img" alt="">
      </div>
    </div>
  `;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector("#lb-img");
  const lbTitle = lb.querySelector("#lb-title");

  lb.querySelector("#lb-close").addEventListener("click", () => {
    lb.classList.remove("open");
  });

  lb.addEventListener("click", (e) => {
    if (e.target === lb) lb.classList.remove("open");
  });


  document.addEventListener("click", (e) => {
    const img = e.target.closest("img[data-full]");
    if (!img) return;

    lbImg.src = img.dataset.full;
    lbTitle.textContent = img.alt || "Bild";
    lb.classList.add("open");
  });

  setStatus("app.js geladen. Rendering Fotos zum Test …");
  navigate("fotos");
});

