const viewEl = document.getElementById("view");
const statusEl = document.getElementById("status");

function setStatus(text){ statusEl.textContent = text; }

/**
 * Medien-Liste:
 * - Lege Dateien in /assets/img und /assets/video ab
 * - Trage sie hier ein
 */
const media = {
  fotos: [
    // Beispiele (ersetzen oder löschen)
    { src: "assets/img/demo1.jpg", caption: "Demo-Foto 1 (ersetzen)" },
    { src: "assets/img/demo2.jpg", caption: "Demo-Foto 2 (ersetzen)" },
  ],
  videos: [
    { src: "assets/video/demo1.mp4", caption: "Demo-Video 1 (ersetzen)" },
  ],
};

function renderStart(){
  viewEl.innerHTML = `
    <div class="splash">
      <h2>Willkommen.</h2>
      <p>Encarta-95-Style Homepage – Fotos, Videos, optional Soundtrack.</p>
      <div class="card">
        <p><strong>So fügst du eigene Medien hinzu</strong></p>
        <ol>
          <li>Dateien hochladen nach <code>/assets/img</code> und <code>/assets/video</code>.</li>
          <li>Oben in <code>app.js</code> unter <code>media</code> eintragen.</li>
          <li>Commit – GitHub Pages aktualisiert automatisch.</li>
        </ol>
      </div>
    </div>
  `;
  setStatus("Startbildschirm geladen.");
}

function renderFotos(){
  if(!media.fotos.length){
    viewEl.innerHTML = `<h2>Fotos</h2><p>Noch keine Fotos eingetragen.</p>`;
    setStatus("Fotos: 0 Einträge.");
    return;
  }

  const items = media.fotos.map(x => `
    <div class="card">
      <img src="${x.src}" alt="${escapeHtml(x.caption)}">
      <div class="caption">${escapeHtml(x.caption)}</div>
    </div>
  `).join("");

  viewEl.innerHTML = `
    <h2>Fotos</h2>
    <div class="gallery">${items}</div>
  `;
  setStatus(`Fotos: ${media.fotos.length} Einträge.`);
}

function renderVideos(){
  if(!media.videos.length){
    viewEl.innerHTML = `<h2>Videos</h2><p>Noch keine Videos eingetragen.</p>`;
    setStatus("Videos: 0 Einträge.");
    return;
  }

  const items = media.videos.map(x => `
    <div class="card">
      <video src="${x.src}" controls preload="metadata"></video>
      <div class="caption">${escapeHtml(x.caption)}</div>
    </div>
  `).join("");

  viewEl.innerHTML = `
    <h2>Videos</h2>
    <div class="gallery">${items}</div>
  `;
  setStatus(`Videos: ${media.videos.length} Einträge.`);
}

function renderAbout(){
  viewEl.innerHTML = `
    <h2>Über das Projekt</h2>
    <p>
      Statische GitHub-Pages-Seite (HTML/CSS/JS), gestaltet im Stil der Encarta-Ära.
      Kein Framework, kein Build – schnelle Wartung.
    </p>
    <div class="card">
      <p><strong>Performance-Hinweis</strong></p>
      <p>
        Große Videos besser komprimieren oder später extern hosten, wenn GitHub Pages zu langsam wird.
      </p>
    </div>
  `;
  setStatus("Über-Seite geladen.");
}

function navigate(view){
  if(view === "start") return renderStart();
  if(view === "fotos") return renderFotos();
  if(view === "videos") return renderVideos();
  if(view === "about") return renderAbout();
  renderStart();
}

/** Minimaler HTML-Escape (Sicherheit, falls Captions Sonderzeichen enthalten) */
function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// Navigation buttons
document.querySelectorAll(".nav").forEach(btn => {
  btn.addEventListener("click", () => navigate(btn.dataset.view));
});

// Soundtrack Button (optional)
const audio = document.getElementById("bg-audio");
const btnSound = document.getElementById("btn-sound");

btnSound?.addEventListener("click", async () => {
  if(!audio || !audio.getAttribute("src")){
    setStatus("Kein Audio hinterlegt (assets/audio/encarta-theme.mp3).");
    return;
  }

  try{
    if(audio.paused){
      await audio.play(); // Browser erlaubt Audio oft erst nach Klick
      btnSound.textContent = "Soundtrack: An";
      setStatus("Soundtrack läuft.");
    } else {
      audio.pause();
      btnSound.textContent = "Soundtrack: Aus";
      setStatus("Soundtrack pausiert.");
    }
  } catch {
    setStatus("Audio-Start blockiert. Klicke nochmals oder prüfe Dateipfad.");
  }
});

// Start
navigate("start");
