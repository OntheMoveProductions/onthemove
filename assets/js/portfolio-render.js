/* Films, from assets/data/portfolio.json (written by the editor).
   The editor also pre-renders the same markup into the pages in Czech, so
   this script only has to redraw for the visitor's language and add the
   category filter. Keep reelCard() in step with reelCard() in
   editor/server/lib/site-gen.ts. */
(function () {
  "use strict";

  const root = document.documentElement;
  // Film pages live one folder down (work/…) and set <base href="../">,
  // so every path here stays relative to the site root either way.
  const DATA_URL = "assets/data/portfolio.json";

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const lang = () => window.__otmLang || (window.otmI18n && window.otmI18n.detectLang()) || "cs";
  const t = (key) => (window.otmI18n ? window.otmI18n.t(key, lang()) : key);
  const local = (field, l) => (field ? field[l] || field.cs || field.en || "" : "");

  let data = null;
  const load = () =>
    data
      ? Promise.resolve(data)
      : fetch(DATA_URL)
          .then((r) => (r.ok ? r.json() : { categories: [], projects: [] }))
          .catch(() => ({ categories: [], projects: [] }))
          .then((d) => {
            data = {
              categories: d.categories || [],
              films: (d.projects || []).filter((p) => p.status !== "draft"),
            };
            return data;
          });

  const catName = (id, l) => {
    const c = data.categories.find((x) => x.id === id);
    return c ? local(c.name, l) : "";
  };
  const tag = (f, l) => [catName(f.categoryId, l), f.year].filter(Boolean).join(" · ");
  const href = (f) => "work/" + encodeURIComponent(f.id) + ".html";

  const PLAY = '<span class="play-badge" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>';

  function reelCard(f, lead, l) {
    const img = f.poster
      ? `<img src="${esc(f.poster)}" alt="" width="1920" height="1080" decoding="async"${lead ? "" : ' loading="lazy"'}>`
      : "";
    return `<a class="reel-card${lead ? " is-lead" : ""}" href="${esc(href(f))}" data-film-id="${esc(f.id)}"><span class="reel-media">${img}${PLAY}</span><span class="reel-info"><span class="project-tag">${esc(tag(f, l))}</span><span class="reel-title">${esc(local(f.title, l))}</span></span></a>`;
  }

  // ---------------------------------------------------------------- Work page

  let activeCategory = "all";

  function renderReel() {
    const mount = document.getElementById("portfolio-projects");
    if (!mount) return;
    const l = lang();
    const films = data.films.filter((f) => activeCategory === "all" || f.categoryId === activeCategory);
    mount.innerHTML = films.map((f, i) => reelCard(f, i === 0, l)).join("");
    mount.hidden = films.length === 0;

    const more = document.querySelector(".more-soon");
    if (more) more.hidden = data.films.length >= 3;

    renderFilters(l);
  }

  function renderFilters(l) {
    const bar = document.querySelector(".reel-filters");
    if (!bar) return;
    const used = data.categories.filter((c) => data.films.some((f) => f.categoryId === c.id));
    if (used.length < 2) {
      bar.hidden = true;
      return;
    }
    const button = (id, label) =>
      `<button type="button" data-category="${esc(id)}" aria-pressed="${activeCategory === id}">${esc(label)}</button>`;
    bar.innerHTML = button("all", t("work.filter.all")) + used.map((c) => button(c.id, local(c.name, l))).join("");
    bar.hidden = false;
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest && e.target.closest(".reel-filters button");
    if (!btn || !data) return;
    activeCategory = btn.getAttribute("data-category");
    renderReel();
  });

  // ---------------------------------------------------------------- home teaser

  function renderTeaser() {
    const teaser = document.querySelector(".work-feature");
    if (!teaser) return;
    const section = teaser.closest("section");
    const f = data.films.find((x) => x.featured) || data.films[0];
    if (section) section.hidden = !f;
    if (!f) return;
    const l = lang();
    teaser.href = href(f);
    const img = teaser.querySelector("img");
    if (img && f.poster) {
      img.src = f.poster;
      img.alt = local(f.title, l);
    }
    const tagEl = teaser.querySelector(".work-feature-tag");
    if (tagEl) tagEl.textContent = tag(f, l);
    const titleEl = teaser.querySelector(".work-feature-title");
    if (titleEl) titleEl.textContent = local(f.title, l);
  }

  // ---------------------------------------------------------------- film page

  function renderFilmPage() {
    const id = root.getAttribute("data-film");
    if (!id) return;
    const f = data.films.find((x) => x.id === id);
    if (!f) return;
    const l = lang();
    const fields = {
      title: local(f.title, l),
      tag: tag(f, l),
      description: local(f.description, l),
      year: f.year ? String(f.year) : "",
      client: f.client || "",
    };
    document.querySelectorAll("[data-film-field]").forEach((el) => {
      el.textContent = fields[el.getAttribute("data-film-field")] || "";
    });
    const next = document.querySelector(".film-next-title");
    if (next) {
      const i = data.films.indexOf(f);
      const n = data.films[(i + 1) % data.films.length];
      if (n && n !== f) next.textContent = local(n.title, l);
    }
    document.title = `${fields.title} | On the Move Productions`;
  }

  function renderAll() {
    load().then(() => {
      renderReel();
      renderTeaser();
      renderFilmPage();
    });
  }

  // i18n.js announces every language switch (and the initial one).
  document.addEventListener("otm:langchange", renderAll);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderAll);
  else renderAll();
})();
