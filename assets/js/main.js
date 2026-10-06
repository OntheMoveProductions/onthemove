(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");

  /* ---------- Header scroll state ---------- */
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile nav toggle ---------- */
  if (navToggle && header) {
    // overflow:hidden alone doesn't stop iOS scrolling the page under a
    // fixed overlay; pinning the body at its scroll offset does.
    let lockedScrollY = 0;
    const lockScroll = () => {
      lockedScrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    };
    const unlockScroll = () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, lockedScrollY);
    };
    const links = () => [...header.querySelectorAll(".main-nav a")];
    const outside = () => [...document.querySelectorAll("body > main, body > footer, .skip-link")];
    const label = (key) => {
      navToggle.setAttribute("data-i18n-aria-label", key);
      if (window.otmI18n) navToggle.setAttribute("aria-label", window.otmI18n.t(key, window.__otmLang || "cs"));
    };
    const isOpen = () => header.classList.contains("menu-open");

    const setMenu = (open, { restoreFocus = true } = {}) => {
      if (open === isOpen()) return;
      header.classList.toggle("menu-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      label(open ? "nav.close" : "nav.toggle");
      outside().forEach((el) => (el.inert = open));
      if (open) {
        lockScroll();
        const current = header.querySelector('.main-nav a[aria-current="page"]') || links()[0];
        if (current) current.focus({ preventScroll: true });
      } else {
        unlockScroll();
        if (restoreFocus) navToggle.focus({ preventScroll: true });
      }
    };

    navToggle.addEventListener("click", () => setMenu(!isOpen()));
    links().forEach((link) => link.addEventListener("click", () => setMenu(false, { restoreFocus: false })));

    document.addEventListener("keydown", (e) => {
      if (!isOpen()) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setMenu(false);
      } else if (e.key === "Tab") {
        // Keep focus inside the open menu: the links, the language switch
        // and the close button.
        const items = [...links(), ...header.querySelectorAll(".lang-toggle button"), navToggle];
        const i = items.indexOf(document.activeElement);
        const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : i === items.length - 1 ? 0 : i + 1;
        e.preventDefault();
        items[next].focus();
      }
    });

    // Rotating a phone to landscape (or widening a window) past the
    // breakpoint hides the menu button; don't leave the page locked.
    window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => {
      if (e.matches) setMenu(false, { restoreFocus: false });
    });
  }

  /* ---------- Hero video: slogan sync + controls ---------- */
  const hero = document.querySelector(".hero");
  const heroVideo = document.querySelector(".hero-video");

  const heroSlogan = document.querySelector(".hero-slogan");

  if (hero && heroVideo && heroSlogan) {
    // Leaving this page via a link hands the browser a live, autoplaying
    // <video> to fold into the outgoing view-transition snapshot — video
    // (and canvas) content is a known trouble spot for that capture, and
    // this hero is the one place on the site with a large sticky,
    // full-viewport video as the dominant element, which lines up with
    // this page specifically (not the shorter, video-free interior pages)
    // being the one where a briefly wrong-sized snapshot shows up.
    // "pageswap" fires synchronously right before that snapshot is taken,
    // precisely so a page can make a last-second visual change that gets
    // captured instead of the live state — hiding the video here trades
    // its last real frame for a flat black rect (matching the hero's own
    // background) in that one fleeting snapshot, which should be
    // unnoticeable under the dissolve that follows. Unsupported browsers
    // just never fire this event, so it's a no-op there.
    window.addEventListener("pageswap", (e) => {
      if (e.viewTransition) heroVideo.style.visibility = "hidden";
    });

    // The slogan's opacity crossfade tracks the match burning down — it's a
    // slow, gentle fade with no parallax/zoom/spin, so it stays on even
    // under prefers-reduced-motion (the background video autoplays and
    // loops regardless of that setting too, so gating just the text would
    // be inconsistent).

    // Drive the slogan's opacity directly from the video's actual playback
    // position every frame, instead of starting a separate CSS animation
    // clock on the "playing" event. A separate clock has to guess *when*
    // the video really started (slow network/disk, buffering, tab
    // throttling) and can never re-sync once it's wrong; reading
    // currentTime directly can't drift or get stuck.
    const CYCLE = 59.84; // seconds — exact length of the match-burn loop
    const lerp = (a, b, t) => a + (b - a) * t;

    // The flame's position AND shape are sampled directly from the actual
    // video frame, every tick, via a tiny offscreen canvas — rather than a
    // hand-measured track of keyframes. That also means the glow picks up
    // the flame growing from a single spark into a tall column as the
    // match catches, which no fixed set of keyframes could know about
    // ahead of time.
    const SAMPLE_W = 48;
    const SAMPLE_H = 27; // cheap resolution at the source's ~16:9 aspect
    const sampleCanvas = document.createElement("canvas");
    sampleCanvas.width = SAMPLE_W;
    sampleCanvas.height = SAMPLE_H;
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
    const BRIGHT_THRESHOLD = 130; // 0-255 luminance cutoff separating the flame from the dark scene around it
    // How much of each new reading to blend in, per frame (0-1). A single
    // frame's bounding box is noisy — video compression artifacts or even
    // one stray bright pixel can shift it enough to be visible — and that
    // noise used to go straight to the CSS variables, showing up as a
    // flicker. Blending only a small fraction of each new reading in damps
    // that out while still tracking real, sustained movement (the flame
    // actually drifting or growing) within a few frames.
    const SMOOTHING = 0.12;

    // Fractions (x, y, w, h) within the *source video frame*, 0–1 — this is
    // the running smoothed value, held across frames both to smooth against
    // and as the fallback for a momentarily-too-dark read (e.g. right as
    // the match is struck, or the instant the loop restarts).
    const START_FLAME = { x: 0.27, y: 0.34, w: 0.02, h: 0.02 };
    let smoothedFlame = { ...START_FLAME };
    // drawImage + getImageData is a real, continuous per-frame cost (a video
    // decode/readback, not just arithmetic) — expensive enough at 60fps to
    // compete with the browser's own scroll compositing, which is exactly
    // what makes the hero's position:sticky pin feel janky/broken while the
    // next section scrolls over it. Only actually sampling every few frames
    // cuts that cost proportionally; the smoothing above already assumes a
    // slowly-changing signal, so sampling at ~20fps instead of ~60fps is
    // imperceptible for a flame that drifts/grows over tens of seconds.
    const SAMPLE_EVERY_N_FRAMES = 3;
    let frameCounter = 0;
    const sampleFlame = () => {
      frameCounter++;
      if (frameCounter % SAMPLE_EVERY_N_FRAMES !== 0) return smoothedFlame;
      try {
        sampleCtx.drawImage(heroVideo, 0, 0, SAMPLE_W, SAMPLE_H);
      } catch (e) {
        return smoothedFlame; // frame not decodable yet
      }
      let data;
      try {
        data = sampleCtx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
      } catch (e) {
        return smoothedFlame; // canvas read blocked (e.g. file:// origin)
      }
      let sumX = 0, sumY = 0, sumW = 0;
      let minX = SAMPLE_W, maxX = -1, minY = SAMPLE_H, maxY = -1;
      for (let py = 0; py < SAMPLE_H; py++) {
        for (let px = 0; px < SAMPLE_W; px++) {
          const i = (py * SAMPLE_W + px) * 4;
          const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          if (lum <= BRIGHT_THRESHOLD) continue;
          const w = lum - BRIGHT_THRESHOLD;
          sumX += px * w;
          sumY += py * w;
          sumW += w;
          if (px < minX) minX = px;
          if (px > maxX) maxX = px;
          if (py < minY) minY = py;
          if (py > maxY) maxY = py;
        }
      }
      if (sumW < 1 || maxX < 0) return smoothedFlame; // nothing bright enough this frame — hold
      const raw = {
        x: sumX / sumW / SAMPLE_W,
        y: sumY / sumW / SAMPLE_H,
        w: (maxX - minX + 1) / SAMPLE_W,
        h: (maxY - minY + 1) / SAMPLE_H,
      };
      smoothedFlame = {
        x: lerp(smoothedFlame.x, raw.x, SMOOTHING),
        y: lerp(smoothedFlame.y, raw.y, SMOOTHING),
        w: lerp(smoothedFlame.w, raw.w, SMOOTHING),
        h: lerp(smoothedFlame.h, raw.h, SMOOTHING),
      };
      return smoothedFlame;
    };

    // Cached, layout-derived values — refreshed on resize/orientation/
    // metadata-load rather than every frame, so the per-frame tick below
    // only does arithmetic, never a forced-reflow DOM read.
    let objPos = { x: 50, y: 50 };
    let videoNatural = { w: 1920, h: 1080 };
    const measureVideoFit = () => {
      const cs = getComputedStyle(heroVideo).objectPosition.split(" ").map(parseFloat);
      if (!Number.isNaN(cs[0]) && !Number.isNaN(cs[1])) objPos = { x: cs[0], y: cs[1] };
      if (heroVideo.videoWidth && heroVideo.videoHeight) {
        videoNatural = { w: heroVideo.videoWidth, h: heroVideo.videoHeight };
      }
    };
    measureVideoFit();
    heroVideo.addEventListener("loadedmetadata", measureVideoFit);
    window.addEventListener("resize", measureVideoFit, { passive: true });
    window.addEventListener("orientationchange", measureVideoFit);

    // Camera-follow crop: object-fit: cover has to crop the video's width
    // down on a narrow/tall viewport, and a fixed crop position can leave
    // the flame outside that visible slice entirely (the "giant flame" /
    // "flame cut off" problem). Pan object-position's X the way a 2D
    // platformer camera works instead of tracking the flame 1:1 — hold
    // still while it sits within a safe zone in the middle of the visible
    // window, and only shift the window when it pushes past that zone's
    // right edge. The window only ever pans right, never back left (the
    // flame's own drift is rightward over the burn, so a leftward pan
    // would only ever be reacting to noise, not real motion) — enforced
    // both by only checking the right edge below and by the floor on
    // desiredPercent right before the lerp, in case a wide-viewport reset
    // or noisy reading would otherwise pull it backward. Reuses the same
    // tracked flame position already driving the text glow — no extra
    // sampling needed. On a wide viewport where cover barely crops
    // anything, this naturally settles back to center since there's no
    // room to pan.
    const PAN_MARGIN_RATIO = 0.18; // how far in from the visible right edge the "safe zone" starts
    const PAN_OVERSHOOT_RATIO = 0.05; // extra clearance folded into that same margin, so once the camera reacts it doesn't just barely stop at the safe-zone line — it settles with a bit of room past the flame
    const PAN_SMOOTHING = 0.05; // slower than the glow's smoothing — a camera pan should read as deliberate, not jittery
    const PAN_HOME_PERCENT = objPos.x; // where the crop starts each burn, and where it snaps back to on loop
    let panObjPosPercent = PAN_HOME_PERCENT;
    // Never-pan-left means the camera stays wherever the previous burn
    // left it once the video loops back to the start — the flame resets
    // to its small/left starting position but the crop doesn't, so it'd
    // sit outside the visible window until it drifts back into the safe
    // zone. Snapping the pan back to its home position in the same frame
    // the loop restarts keeps the crop in sync with the flame that's
    // actually on screen, instead of a stale crop from the previous burn.
    // The remembered flame position resets too: the first seconds of each
    // burn are dark, so the tracker would otherwise keep the burnt-out
    // flame from the end of the last loop (far right) and pan straight back
    // to it.
    const resetVideoPan = () => {
      smoothedFlame = { ...START_FLAME };
      frameCounter = 0;
      panObjPosPercent = PAN_HOME_PERCENT;
      heroVideo.style.objectPosition = `${panObjPosPercent.toFixed(1)}% center`;
      objPos.x = panObjPosPercent;
    };
    const updateVideoPan = (frac) => {
      const heroBox = hero.getBoundingClientRect();
      if (!heroBox.width || !heroBox.height) return;
      const scale = Math.max(heroBox.width / videoNatural.w, heroBox.height / videoNatural.h);
      const visibleWidthFrac = heroBox.width / (videoNatural.w * scale);
      let desiredPercent = 50;
      if (visibleWidthFrac < 0.999) {
        const panRange = 1 - visibleWidthFrac;
        const windowStart = panRange * (panObjPosPercent / 100);
        // Both the "should we react" check and "where do we settle" target
        // use this same margin — using a smaller margin just to trigger
        // earlier wouldn't work, since the pan stops the instant the
        // trigger condition goes false, before ever reaching a separately
        // larger target.
        const margin = visibleWidthFrac * (PAN_MARGIN_RATIO + PAN_OVERSHOOT_RATIO);
        let desiredStart = windowStart;
        if (frac.x > windowStart + visibleWidthFrac - margin) {
          desiredStart = frac.x - (visibleWidthFrac - margin);
        }
        desiredStart = Math.max(0, Math.min(panRange, desiredStart));
        desiredPercent = (desiredStart / panRange) * 100;
      }
      desiredPercent = Math.max(desiredPercent, panObjPosPercent); // never pan left
      panObjPosPercent = lerp(panObjPosPercent, desiredPercent, PAN_SMOOTHING);
      heroVideo.style.objectPosition = `${panObjPosPercent.toFixed(1)}% center`;
      // Keep the cached objPos in sync so flameScreenPercent's own
      // reprojection (which reads objPos, refreshed only on resize) uses
      // where the crop actually is *this frame*, not a stale value.
      objPos.x = panObjPosPercent;
    };

    // Re-project the flame's source-frame position AND size onto real
    // screen pixels (replicating object-fit: cover's own math) then express
    // both as a percentage of the slogan's own box, since that's the
    // coordinate space a CSS background on the slogan element actually
    // uses. The size percentages feed the gradient's two ellipse radii —
    // a small measured flame keeps the glow tight around a point; a tall
    // one opens it into a column — driven by what's actually on screen
    // rather than a guessed constant.
    const GLOW_SPREAD = 12; // how far past the flame's bare silhouette the falloff gets room to spread
    const flameScreenPercent = (frac) => {
      const heroBox = hero.getBoundingClientRect();
      const sloganBox = heroSlogan.getBoundingClientRect();
      if (!sloganBox.width || !sloganBox.height) return null;
      const scale = Math.max(heroBox.width / videoNatural.w, heroBox.height / videoNatural.h);
      const scaledW = videoNatural.w * scale;
      const scaledH = videoNatural.h * scale;
      const offsetX = (heroBox.width - scaledW) * (objPos.x / 100);
      const offsetY = (heroBox.height - scaledH) * (objPos.y / 100);
      const viewportX = heroBox.left + offsetX + frac.x * videoNatural.w * scale;
      const viewportY = heroBox.top + offsetY + frac.y * videoNatural.h * scale;
      const x = ((viewportX - sloganBox.left) / sloganBox.width) * 100;
      const y = ((viewportY - sloganBox.top) / sloganBox.height) * 100;
      const hsize = ((frac.w * videoNatural.w * scale) / sloganBox.width) * 100 * GLOW_SPREAD;
      const vsize = ((frac.h * videoNatural.h * scale) / sloganBox.height) * 100 * GLOW_SPREAD;
      return {
        x: Math.max(-30, Math.min(130, x)).toFixed(1) + "%",
        y: Math.max(-30, Math.min(130, y)).toFixed(1) + "%",
        hsize: Math.max(60, Math.min(3000, hsize)).toFixed(0) + "%",
        vsize: Math.max(60, Math.min(3000, vsize)).toFixed(0) + "%",
      };
    };

    const opacityFor = (frac) => {
      if (frac < 0.011) return 0;
      if (frac < 0.033) return lerp(0, 1, (frac - 0.011) / (0.033 - 0.011));
      if (frac < 0.84) return 1;
      if (frac < 0.982) return lerp(1, 0, (frac - 0.84) / (0.982 - 0.84));
      return 0;
    };
    // How far the mask has spread from the flame point, as a % of the
    // distance to the box's farthest corner (100% = fully revealed). Starts
    // with the opacity fade-in but finishes well before it (light spreads
    // fast; the text then settles up to full brightness at the slower,
    // existing fade pace) instead of appearing everywhere at once.
    const revealFor = (frac) => {
      if (frac < 0.011) return 0;
      if (frac < 0.017) return lerp(0, 100, (frac - 0.011) / (0.017 - 0.011));
      return 100;
    };
    let prevCycleFrac = 0;
    let resumed = true;
    // The loop reads video pixels and layout every frame, so it only runs
    // while the hero is on screen and the video is actually playing.
    let heroVisible = true;
    let running = false;
    const start = () => {
      if (running || !heroVisible || heroVideo.paused || document.hidden) return;
      running = true;
      resumed = true;
      requestAnimationFrame(tick);
    };
    // The hero is sticky: it never leaves the viewport, it gets covered by
    // the sections that scroll over it. Once scrolled a full hero-height
    // down, it's completely hidden.
    const checkHeroVisible = () => {
      heroVisible = window.scrollY < hero.offsetHeight;
      start();
    };
    window.addEventListener("scroll", checkHeroVisible, { passive: true });
    checkHeroVisible();
    heroVideo.addEventListener("play", start);
    document.addEventListener("visibilitychange", start);

    // A function declaration, so start() can call it before this line runs.
    function tick() {
      if (!heroVisible || heroVideo.paused || document.hidden) {
        running = false;
        return;
      }
      if (heroVideo.duration) {
        const cycleTime = heroVideo.currentTime % CYCLE;
        const frac = cycleTime / CYCLE;
        // A big backward jump in the burn's own progress (from ~1 back to
        // ~0) means the video just looped, not that time ran backward —
        // reset the pan right before this frame's update uses it.
        // While scrolled away the loop is paused, so a wrap can go unseen:
        // on the first frame back, any step backwards counts as a loop.
        if (frac < prevCycleFrac - (resumed ? 0 : 0.5)) resetVideoPan();
        resumed = false;
        prevCycleFrac = frac;
        // Sample the flame once per tick and feed that single reading to
        // both the video pan and the glow reprojection — updateVideoPan
        // must run first so it can move objPos before flameScreenPercent
        // reads it, keeping the glow aligned with where the crop actually
        // is this frame.
        const flameFrac = sampleFlame();
        updateVideoPan(flameFrac);
        const flame = flameScreenPercent(flameFrac);
        heroSlogan.style.opacity = opacityFor(frac);
        heroSlogan.style.setProperty("--reveal", revealFor(frac) + "%");
        if (flame) {
          heroSlogan.style.setProperty("--flame-x", flame.x);
          heroSlogan.style.setProperty("--flame-y", flame.y);
          heroSlogan.style.setProperty("--flame-hsize", flame.hsize);
          heroSlogan.style.setProperty("--flame-vsize", flame.vsize);
        }
      }
      requestAnimationFrame(tick);
    }
    start();

    // The <video> already has the `autoplay` attribute — it starts itself.
    // Calling .play() again here too (as a previous version of this file
    // did) can race the browser's own autoplay/load sequence and abort it
    // ("AbortError: The play() request was interrupted by a new load
    // request"), leaving the video paused with nothing left to resume it.
    // So: never call .play() on load. Only react to the video actually
    // pausing, and only *react* — never lock the fallback in permanently —
    // so it clears itself the instant real playback begins, however late.
    heroVideo.addEventListener("playing", () => hero.classList.remove("no-anim"));

    const attemptResume = () => {
      if (heroVideo.paused) heroVideo.play().catch(() => {});
    };
    // A tab switched back into view is the most common real reason a
    // playing video ends up paused (browsers pause background-tab video).
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) attemptResume();
    });
    // Any autoplay restriction still standing is lifted by a user gesture.
    ["pointerdown", "keydown"].forEach((ev) =>
      window.addEventListener(ev, attemptResume, { once: true, passive: true })
    );

    // Give autoplay a generous window before showing the static fallback —
    // long enough that a normal network/disk load never trips it, but if
    // the video truly never starts, the slogan should still be visible.
    window.setTimeout(() => {
      if (heroVideo.paused) hero.classList.add("no-anim");
    }, 4000);

    const pauseBtn = document.querySelector(".hero-pause");
    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        const t = window.otmI18n ? window.otmI18n.t : (k) => k;
        const lang = window.__otmLang || "cs";
        const wasPaused = heroVideo.paused;
        // The label must name the action this click performs *next*, not
        // stay fixed as "Pause video" — a screen reader announcing "Pause
        // video, pressed" while the video is actually paused reads
        // backwards. Updating data-i18n-aria-label (not just aria-label)
        // keeps this correct across a later language switch too, since
        // applyLang() re-derives every aria-label from that attribute.
        const nextKey = wasPaused ? "hero.pause" : "hero.play";
        if (wasPaused) {
          heroVideo.play();
          pauseBtn.setAttribute("aria-pressed", "false");
        } else {
          heroVideo.pause();
          pauseBtn.setAttribute("aria-pressed", "true");
        }
        pauseBtn.setAttribute("data-i18n-aria-label", nextKey);
        pauseBtn.setAttribute("aria-label", t(nextKey, lang));
      });
    }
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Contact form ---------- */
  const form = document.querySelector(".contact-form");
  if (form) {
    const status = form.querySelector(".form-status");
    const submitBtn = form.querySelector('[type="submit"]');
    const CONTACT_EMAIL = "info@onthemove.cz";
    // Set by the editor (Settings → contact form). Without it the form
    // falls back to opening the visitor's email app.
    const endpoint = form.getAttribute("data-endpoint");

    // Restarts the entrance animation even when the same message repeats.
    const announceStatus = (text, state) => {
      status.textContent = text;
      status.setAttribute("data-state", state);
      status.classList.remove("is-announcing");
      void status.offsetWidth;
      status.classList.add("is-announcing");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const lang = window.__otmLang || "cs";
      const t = window.otmI18n ? window.otmI18n.t : (k) => k;

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      // Clear any invalid state left over from a previous attempt before
      // re-checking, so a field the visitor just fixed loses its error.
      [form.name, form.email, form.message].forEach((input) => {
        const wrap = input.closest(".field");
        if (wrap) wrap.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
      });

      // Order matches document order (name, email, message) so the first
      // entry is always the first invalid field on the page.
      const invalidFields = [];
      if (!name) invalidFields.push({ input: form.name, labelKey: "form.error.name" });
      if (!email || !emailOk) invalidFields.push({ input: form.email, labelKey: "form.error.email" });
      if (!message) invalidFields.push({ input: form.message, labelKey: "form.error.message" });

      if (invalidFields.length) {
        invalidFields.forEach(({ input }) => {
          const wrap = input.closest(".field");
          if (wrap) wrap.classList.add("is-invalid");
          input.setAttribute("aria-invalid", "true");
        });

        // Names exactly which field(s) still need attention instead of
        // always listing all three — filling in name and message correctly
        // but leaving email invalid shouldn't tell the visitor their name
        // and message are wrong too.
        const items = invalidFields.map(({ labelKey }) => t(labelKey, lang));
        const and = t("form.error.and", lang);
        let list;
        if (items.length === 1) {
          list = items[0];
        } else if (items.length === 2) {
          list = `${items[0]} ${and} ${items[1]}`;
        } else {
          const head = items.slice(0, -1).join(", ");
          // English keeps the comma before "and" (matches the original
          // three-field message); Czech never puts a comma before "a".
          list = lang === "en" ? `${head}, ${and} ${items[items.length - 1]}` : `${head} ${and} ${items[items.length - 1]}`;
        }
        announceStatus(`${t("form.error.prefix", lang)} ${list}.`, "error");
        invalidFields[0].input.focus();
        return;
      }

      if (endpoint) {
        const data = new FormData(form);
        data.append("_subject", `${name}: On the Move Productions`);
        submitBtn.disabled = true;
        form.setAttribute("aria-busy", "true");
        announceStatus(t("form.status.sending", lang), "busy");
        fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then((res) => {
            if (!res.ok) throw new Error(String(res.status));
            announceStatus(t("form.status.sent", lang), "ok");
            form.reset();
          })
          .catch(() => announceStatus(t("form.status.failed", lang), "error"))
          .finally(() => {
            submitBtn.disabled = false;
            form.removeAttribute("aria-busy");
          });
        return;
      }

      const subject = encodeURIComponent(`${name}: On the Move Productions`);
      const body = encodeURIComponent(`${message}\n\n--\n${name}\n${email}`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

      announceStatus(t("form.status.ok", lang), "ok");
      form.reset();
    });
  }
})();
