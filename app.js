// app.js — Encarta 95 UI Mock (GitHub Pages, static)
// Works with index.html containing:
//   <div class="panel" id="view"></div>
//   <div class="status-item" id="status"></div>
//   <audio id="bg-audio" src="assets/audio/encarta-theme.mp3"></audio>  (optional)

(() => {
  const viewEl = document.getElementById("view");
  const statusEl = document.getElementById("status");

  const audio = document.getElementById("bg-audio");
  const btnSound = document.getElementById("btn-sound");

  const setStatus = (text) => {
    if (statusEl) statusEl.textContent = text;
  };

  const escapeHtml = (str) =>
    String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  // ======= MEDIA CONFIG (deine Dateien) =======
  // Liegen laut Screenshot in: assets/img/
  const media = {
    fotos: [
      { src: "assets/img/encarta_startbildschirm.png", caption: "Encarta 95 – Startbildschirm" },
      { src: "assets/img/encarta_katalog.png", caption: "Katalog" },
      { src: "assets/img/encarta_suchfunktion.png", caption: "Suchfunktion" },
      { src: "assets/img/encarta_feature_mediengalerie.png", caption: "Feature – Mediengalerie" },
      { src: "assets/img/encarta_mindmaze.png", caption: "MindMaze" },
      { src: "assets/img/encarta_information_science.png", caption: "Information Science" },
      { src: "assets/img/encarta_timeline.png", caption: "Timeline" },
    ],
    videos: [
      // Beispiel:
      // { src: "assets/video/demo1.mp4", caption: "Demo-Video" },
    ],
  };

  // ======= VIEWS =======
  function renderStart() {
    viewEl.innerHTML = `
      <div class="splash">
        <h2>Willkommen.</h2>
        <p>Encarta-95-Style Galerie für Screenshots, Fotos und Videos.</p>

        <div class="card">
          <p><strong>Navigation</strong></p>
          <ul>
            <li><strong>Fotos</strong>: Screenshot-Galerie</li>
            <li><strong>Videos</strong>: Video-Sammlung</li>
            <li><strong>Über das Projekt</strong>: Kontext & Hinweise</li>
          </ul>
        </div>

        <div class="card">
          <p><strong>Hinweis</strong></p>
          <p>Wenn Bilder nicht laden, prüfe die Pfade in <code>app.js</code> und ob die Dateien in <code>assets/img/</code> liegen.</p>
        </div>
      </div>
    `;
    setStatus("Startbildschirm geladen.");
  }

  function renderFotos() {
    if (!media.fotos.length) {
      viewEl.innerHTML = `<h2>Fotos</h2><p>Noch keine Fotos eingetragen.</p>`;
      setStatus("Fotos: 0 Einträge.");
      return;
    }

    const cards = media.fotos
      .map(
        (x, idx) => `
      <div class="card">
        <img
          data-idx="${idx}"
          src="${x.src}"
          alt="${escapeHtml(x.caption)}"
          loading="lazy"
          onerror="this.dataset.broken='1'; this.style.display='none'; this.parentElement.querySelector('.img-fallback').style.display='block';"
        >
        <div class="img-fallback" style="display:none; border:1px solid #808080; background:#000; color:#fff; padding:10px; font-size:12px;">
          Bild nicht gefunden<br>
          <code style="color:#fff;">${escapeHtml(x.src)}</code>
        </div>
        <div class="caption">${escapeHtml(x.caption)}</div>
      </div>
    `
      )
      .join("");

    viewEl.innerHTML = `
      <h2>Fotos</h2>
      <div class="gallery">${cards}</div>
      <div style="margin-top:10px; font-size:12px;">
        Tipp: Wenn du nur leere Kacheln siehst, stimmt meist ein Dateiname/Pfad nicht exakt.
      </div>
    `;
    setStatus(`Fotos: ${media.fotos.length} Einträge.`);
  }

  function renderVideos() {
    if (!media.videos.length) {
      viewEl.innerHTML = `<h2>Videos</h2><p>Noch keine Videos eingetragen.</p>`;
      setStatus("Videos: 0 Einträge.");
      return;
    }

    const cards = media.videos
      .map(
        (x) => `
      <div class="card">
        <video src="${x.src}" controls preload="metadata"></video>
        <div class="caption">${escapeHtml(x.caption)}</div>
      </div>
    `
      )
      .join("");

    viewEl.innerHTML = `
      <h2>Videos</h2>
      <div class="gallery">${cards}</div>
    `;
    setStatus(`Videos: ${media.videos.length} Einträge.`);
  }

  function renderAbout() {
    viewEl.innerHTML = `
      <h2>Über das Projekt</h2>
      <p>
        Statische GitHub-Pages-Seite (HTML/CSS/JS) im Stil der Encarta-Ära.
        Ziel: Screenshots/Fotos/Videos zugänglich machen – ohne Frameworks.
      </p>

      <div class="card">
        <p><strong>Dateipfade</strong></p>
        <p>Fotos liegen in <code>assets/img/</code> und werden in <code>app.js</code> unter <code>media.fotos</code> eingetragen.</p>
      </div>

      <div class="card">
        <p><strong>Performance</strong></p>
        <p>Große Videos ggf. komprimieren oder extern hosten, wenn GitHub Pages zu langsam wird.</p>
      </div>
    `;
    setStatus("Über-Seite geladen.");
  }

  // ======= NAVIGATION =======
  const routes = {
    start: renderStart,
    fotos: renderFotos,
    videos: renderVideos,
    about: renderAbout,
  };

  function navigate(view) {
    try {
      if (!viewEl) throw new Error("Element #view nicht gefunden (index.html prüfen).");
      const fn = routes[view] || renderStart;
      fn();
    } catch (err) {
      console.error(err);
      setStatus("Fehler beim Rendern. Console prüfen.");
      if (viewEl) viewEl.innerHTML = `<h2>Fehler</h2><p>${escapeHtml(err.message)}</p>`;
    }
  }

  // Buttons links (data-view) + optional Menübuttons (Datei/Bearbeiten/etc. ignorieren wir)
  document.querySelectorAll("[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => navigate(btn.dataset.view));
  });

  // ======= SOUNDTRACK TOGGLE (optional) =======
  if (btnSound) {
    btnSound.addEventListener("click", async () => {
      if (!audio) {
        setStatus("Audio-Element fehlt (index.html prüfen).");
        return;
      }

      const src = audio.getAttribute("src") || "";
      if (!src) {
        setStatus("Kein Audio hinterlegt (assets/audio/encarta-theme.mp3).");
        return;
      }

      try {
        if (audio.paused) {
          await audio.play(); // Browser erlaubt Audio meist erst nach Klick
          btnSound.textContent = "Soundtrack: An";
          setStatus("Soundtrack läuft.");
        } else {
          audio.pause();
          btnSound.textContent = "Soundtrack: Aus";
          setStatus("Soundtrack pausiert.");
        }
      } catch (e) {
        console.error(e);
        setStatus("Audio-Start blockiert. Erneut klicken oder Pfad prüfen.");
      }
    });
  }

  // ======= STARTUP =======
  // Startzustand: Startbildschirm (nie leer)
  // Wenn du lieber direkt die Galerie willst: navigate("fotos");
  navigate("start");
})();
