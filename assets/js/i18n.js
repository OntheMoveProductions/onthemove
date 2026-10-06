/* On the Move Productions — translations & language switching
   Default language is Czech (the studio's primary market); English is the
   secondary language. Preference is remembered in localStorage. */

(function () {
  "use strict";

  const STRINGS = /* STRINGS:BEGIN */ {
    "cs": {
      "meta.title.home": "On the Move Productions | Pojďme rozpohybovat vaše nápady",
      "meta.title.about": "O nás | On the Move Productions",
      "meta.title.portfolio": "Tvorba | On the Move Productions",
      "meta.title.contact": "Kontakt | On the Move Productions",
      "meta.desc.home": "On the Move Productions: filmová produkce Erika Žily a Mariam Mansuryan. Reklamy, filmy a nápady uvedené do pohybu.",
      "nav.home": "Domů",
      "nav.about": "O nás",
      "nav.portfolio": "Tvorba",
      "nav.contact": "Kontakt",
      "nav.skip": "Přeskočit na obsah",
      "nav.aria": "Hlavní navigace",
      "nav.toggle": "Menu",
      "lang.aria": "Jazyk",
      "hero.slogan": "Pojďme rozpohybovat vaše nápady",
      "hero.scroll": "Posunout",
      "hero.pause": "Pozastavit video",
      "hero.play": "Přehrát video",
      "intro.heading": "Produkční duo \nV České republice",
      "intro.body": "Jsme Erik a Mariam, absolventi Filmové akademie Miroslava Ondříčka v Písku. Točíme reklamy, filmy a všechno mezi. Staráme se o kreativitu, řemeslo a logistiku, abychom mohli proměnit vaše nápady v realitu.",
      "intro.cta.work": "Naše práce",
      "team.heading": "Kdo jsme",
      "team.link": "Více o nás",
      "erik.name": "Erik Žila",
      "erik.role": "Kameraman",
      "mariam.name": "Mariam Mansuryan",
      "mariam.role": "Režisérka",
      "marquee.1": "Reklamy",
      "marquee.2": "Filmy",
      "marquee.3": "Kamera",
      "marquee.4": "Režie",
      "marquee.5": "Střih",
      "marquee.6": "Kreativa",
      "work.heading": "Vybíráme z portfolia",
      "cta.heading": "Máte nápad? Pojďme ho rozpohybovat.",
      "cta.body": "Řekněte nám, o čem sníte. Pomůžeme vám to uskutečnit.",
      "cta.button": "Kontaktujte nás",
      "about.heading": "Dva pohledy, jeden štáb",
      "about.intro": "On the Move Productions vznikla na Filmové akademii Miroslava Ondříčka v Písku, kde se Erik a Mariam potkali během studia kamery a režie. Jeden z nás je Čech, druhá Arménka. My spojujeme dva pohledy, tvoříme jeden štáb a máme společný instinkt pro to, jak dostat nápady do pohybu.",
      "about.cta.heading": "Erika a Mariam už znáte.",
      "about.cta.body": "Žádný skrytý tým, žádné přehazování mezi lidmi. Na vašem projektu budou dělat přesně ti dva, které jste právě poznali.",
      "erik.bio.p1": "Erik vystudoval magisterský obor kamery na Filmové akademii Miroslava Ondříčka v Písku. Jako kameraman se podílel na řadě krátkých filmů, reklam a hudebních videoklipů. Také má za sebou řadu projektů jako gaffer. Mezi jeho nejnovější projekty patří celovečerní film Chica Checa (2026) a televizní seriál Inspekce (2026).",
      "erik.bio.p2": "Erik není jenom kreativním členem naši produkce, on se také stará o technické a realizovatelksé aspekty skoro jakéhokoli On the Move natáčení. Často umí najít cestu, jak vyměnit šílený nápad v specifický, realizovatelný úkol. Také stojí za barvením finálního produktu, který vám prezentujeme.",
      "erik.bio.p3": "Erik má rád jízdu na motorce, věří, že je to jeden z nejvíce osvobozujících pocitů, které může člověk mít.",
      "mariam.bio.p1": "Mariam vystudovala magisterský obor režie na Filmové akademii Miroslava Ondříčka v Písku. Působí jako režisérka, scenáristka a střihačka a má za sebou řadu krátkých filmů, videoklipů a reklam. V České republice i Arménii pracovala také jako asistentka režie a skriptka: naposledy na celovečerním filmu \"A Winter's Song\" (2025).",
      "mariam.bio.p2": "Mariam ráda si hraje s nápady a rozvíjí je v každé fázi výroby filmu. Pro On the Move plánuje většinu projektů jak po kreativní, tak po praktické stránce, aby v den natáčení všechno proběhlo co nejplynuleji. Zároveň je střihačkou finální produktu, který vám odevzdáváme.",
      "mariam.bio.p3": "Kromě filmu se Mariam věnuje také překladatelství a v současnosti pracuje na překladu své třetí knihy z češtiny do arménštiny.",
      "values.heading": "Co nás žene dopředu",
      "value1.title": "Řemeslo i logistika",
      "value1.body": "Kreativní jiskru milujeme stejně jako harmonogram, díky kterému se dostane na plátno.",
      "value2.title": "Společný instinkt",
      "value2.body": "Dva pohledy, jeden štáb. Vždy hledáme příběh, který je přímo před námi.",
      "value3.title": "Stopa toho, kým jsme byli",
      "value3.body": "Každý dokončený film v sobě nese kousek lidí, kteří ho vytvořili. Chceme, aby to bylo vidět.",
      "portfolio.heading": "Vybraná tvorba",
      "portfolio.intro": "Rostoucí sbírka filmů, reklam a nápadů, které jsme jako produkční společnost rozpohybovali.",
      "more.heading": "Chystáme další",
      "more.body": "Naše portfolio právě roste. Nové projekty tu brzy přibudou. Mezitím se nám ozvěte a pojďme začít ten váš.",
      "contact.heading": "Zeptejte se nás na cokoliv!",
      "contact.sub": "Máte v hlavě projekt? Řekněte nám o něm. Rádi si poslechneme, co chystáte rozpohybovat.",
      "form.name": "Jméno",
      "form.email": "E-mail",
      "form.message": "Zpráva",
      "form.message.placeholder": "Řekněte nám o svém nápadu…",
      "form.submit": "Odeslat zprávu",
      "form.status.ok": "Otevíráme váš e-mailový klient. Brzy se ozveme!",
      "form.error.prefix": "Vyplňte prosím",
      "form.error.and": "a",
      "form.error.name": "vaše jméno",
      "form.error.email": "platný e-mail",
      "form.error.message": "zprávu",
      "contact.direct.heading": "Radši e-mailem?",
      "contact.location.label": "Kde nás najdete",
      "contact.location": "Sídlíme v České republice",
      "footer.tagline": "Pojďme rozpohybovat vaše nápady.",
      "footer.nav.heading": "Navigace",
      "footer.contact.heading": "Kontakt",
      "footer.email.label": "E-mail",
      "footer.rights": "Všechna práva vyhrazena.",
      "meta.desc.about": "Poznejte Erika Žilu a Mariam Mansuryan, kameramana a režisérku, kteří stojí za On the Move Productions.",
      "meta.desc.portfolio": "Reklamy a filmy od On the Move Productions, produkčního dua Erika Žily a Mariam Mansuryan.",
      "meta.desc.contact": "Máte nápad na reklamu nebo film? Napište On the Move Productions na info@onthemove.cz.",
      "work.filter.aria": "Filtrovat podle kategorie",
      "work.filter.all": "Vše",
      "film.back": "Zpět na tvorbu",
      "film.next": "Další film",
      "film.year": "Rok",
      "film.client": "Klient",
      "notfound.title": "Stránka nenalezena | On the Move Productions",
      "notfound.heading": "Tenhle záběr se do střihu nedostal.",
      "notfound.body": "Stránka, kterou hledáte, neexistuje nebo se přesunula.",
      "notfound.home": "Zpět na úvod",
      "notfound.work": "Naše tvorba",
      "form.status.sending": "Odesíláme…",
      "form.status.sent": "Díky! Zpráva je na cestě, brzy se ozveme.",
      "form.status.failed": "Zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo napište přímo na info@onthemove.cz.",
      "nav.close": "Zavřít menu"
    },
    "en": {
      "meta.title.home": "On the Move Productions | Let's put your ideas into motion",
      "meta.title.about": "About Us | On the Move Productions",
      "meta.title.portfolio": "Work | On the Move Productions",
      "meta.title.contact": "Contact | On the Move Productions",
      "meta.desc.home": "On the Move Productions is the film studio of Erik Žila and Mariam Mansuryan: commercials, films, and ideas put into motion.",
      "nav.home": "Home",
      "nav.about": "About",
      "nav.portfolio": "Work",
      "nav.contact": "Contact",
      "nav.skip": "Skip to content",
      "nav.aria": "Main navigation",
      "nav.toggle": "Menu",
      "lang.aria": "Language",
      "hero.slogan": "Let's put your ideas into motion",
      "hero.scroll": "Scroll",
      "hero.pause": "Pause video",
      "hero.play": "Play video",
      "intro.heading": "A production duo based in the Czech Republic",
      "intro.body": "We're Erik and Mariam, graduates of the Film Academy of Miroslav Ondříček in Písek. We make commercials, films, and everything in between, handling the craft, creativity and the logistics so your idea can travel from a spark to the screen.",
      "intro.cta.work": "See our work",
      "team.heading": "The people behind the camera",
      "team.link": "More about us",
      "erik.name": "Erik Žila",
      "erik.role": "Cinematographer",
      "mariam.name": "Mariam Mansuryan",
      "mariam.role": "Director",
      "marquee.1": "Commercials",
      "marquee.2": "Films",
      "marquee.3": "Cinematography",
      "marquee.4": "Directing",
      "marquee.5": "Editing",
      "marquee.6": "Creative",
      "work.heading": "From the portfolio",
      "cta.heading": "Have an idea? Let's put it into motion.",
      "cta.body": "Tell us what you're dreaming up. We'll help you get it on screen.",
      "cta.button": "Contact us",
      "about.heading": "Two perspectives, one crew",
      "about.intro": "On the Move Productions was born at the Film Academy of Miroslav Ondříček in Písek, where Erik and Mariam met while studying cinematography and directing. One of us is Czech, the other Armenian, and together we bring two perspectives, one crew, and a shared instinct for turning ideas into motion.",
      "about.cta.heading": "You already know Erik and Mariam.",
      "about.cta.body": "No hidden team, no hand-off to someone else. The two people you just met are the two who'll actually work on your project.",
      "erik.bio.p1": "Erik has a masters degree in Cinematography from the Film Academy of Miroslav Ondříček in Písek. He has been the cinematographer on various short films, commercials and music videos. He has extensive experience as a gaffer, with some of his most recent projects being the feature film \"Chica Checa\" (2026) and the television series \"Inspekce\" (2026).",
      "erik.bio.p2": "Erik isn't only a creative part of the production, he is also the one who handles most of the technical and realisational aspects of any On the Move shoot. He knows how to turn a crazy idea into a specific, doable task. He is also the one who does the color grading of the final product we deliver to you.",
      "erik.bio.p3": "Erik likes riding his motorcycle and believes it is one of the most liberating things a person can do.",
      "mariam.bio.p1": "Mariam has a masters degree in Film Directing from the Film Academy of Miroslav Ondříček in Písek. She is a director, writer and editor who has made short films, music videos and commercials. She has worked in both the Czech Republic and Armenia as an assistant director and script supervisor, most recently on the feature film \"A Winter's Song\" (2025).",
      "mariam.bio.p2": "Mariam loves playing around with ideas and engaging with them in every phase of the filmmaking process. She plans most of the On the Move shoots both creatively and practically, so that on the day of the filming everything runs as smoothly as possible. She is also the editor of the final product we deliver to you.",
      "mariam.bio.p3": "Besides being a filmmaker Mariam is also a translator who is currently in the process of translating her third book from Czech to Armenian.",
      "values.heading": "What keeps us moving",
      "value1.title": "Craft & logistics",
      "value1.body": "We love the creative spark just as much as the schedule that gets it on screen.",
      "value2.title": "A shared instinct",
      "value2.body": "Two perspectives, one crew, always looking for the story hiding in plain sight.",
      "value3.title": "A trace of who we were",
      "value3.body": "Every finished film carries something of the people who made it. We want that to show.",
      "portfolio.heading": "Selected Work",
      "portfolio.intro": "A growing collection of films, commercials, and ideas we've moved as a company.",
      "more.heading": "More on the way",
      "more.body": "We're building our reel. New projects will land here soon. In the meantime, get in touch and let's start yours.",
      "contact.heading": "Ask us anything!",
      "contact.sub": "Have a project in mind? Tell us about it. We'd love to hear what you're putting into motion.",
      "form.name": "Name",
      "form.email": "Email",
      "form.message": "Message",
      "form.message.placeholder": "Tell us about your idea…",
      "form.submit": "Send message",
      "form.status.ok": "Opening your email client. Talk soon!",
      "form.error.prefix": "Please fill in",
      "form.error.and": "and",
      "form.error.name": "your name",
      "form.error.email": "a valid email",
      "form.error.message": "a message",
      "contact.direct.heading": "Prefer email?",
      "contact.location.label": "Where to find us",
      "contact.location": "Based in the Czech Republic",
      "footer.tagline": "Let's put your ideas into motion.",
      "footer.nav.heading": "Navigate",
      "footer.contact.heading": "Contact",
      "footer.email.label": "Email",
      "footer.rights": "All rights reserved.",
      "meta.desc.about": "Meet Erik Žila and Mariam Mansuryan, the cinematographer and director behind On the Move Productions.",
      "meta.desc.portfolio": "Commercials and films by On the Move Productions, the production duo of Erik Žila and Mariam Mansuryan.",
      "meta.desc.contact": "Have an idea for a commercial or a film? Write to On the Move Productions at info@onthemove.cz.",
      "work.filter.aria": "Filter by category",
      "work.filter.all": "All",
      "film.back": "Back to all work",
      "film.next": "Next film",
      "film.year": "Year",
      "film.client": "Client",
      "notfound.title": "Page not found | On the Move Productions",
      "notfound.heading": "This shot didn't make the cut.",
      "notfound.body": "The page you're looking for doesn't exist or has moved.",
      "notfound.home": "Back to home",
      "notfound.work": "See our work",
      "form.status.sending": "Sending…",
      "form.status.sent": "Thanks! Your message is on its way. We'll be in touch soon.",
      "form.status.failed": "The message couldn't be sent. Please try again, or write to info@onthemove.cz directly.",
      "nav.close": "Close menu"
    }
  } /* STRINGS:END */;

  const STORAGE_KEY = "otm-lang";

  // Storage can be blocked (privacy settings, some in-app browsers); the
  // site must still work, it just won't remember the choice.
  const store = {
    get() {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        return null;
      }
    },
    set(v) {
      try {
        localStorage.setItem(STORAGE_KEY, v);
      } catch (e) {}
    },
  };

  function detectLang() {
    const saved = store.get();
    if (saved === "cs" || saved === "en") return saved;
    const nav = (navigator.language || "cs").toLowerCase();
    return nav.startsWith("en") ? "en" : "cs";
  }

  function t(key, lang) {
    return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.cs[key] || key;
  }

  function applyLang(lang) {
    const root = document.documentElement;
    root.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"), lang);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder"), lang));
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria-label"), lang));
    });

    const titleKey = root.getAttribute("data-title-key");
    if (titleKey) document.title = t(titleKey, lang);
    const descKey = root.getAttribute("data-desc-key");
    const metaDesc = document.querySelector('meta[name="description"]');
    if (descKey && metaDesc) metaDesc.setAttribute("content", t(descKey, lang));

    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });

    store.set(lang);
    window.__otmLang = lang;
    document.dispatchEvent(new CustomEvent("otm:langchange", { detail: { lang } }));
  }

  function initI18n() {
    applyLang(detectLang());

    // Reveal the page once the language is applied and the font has loaded
    // (capped, so a slow font never holds the page back for long). The inline
    // timeout in <head> is the fallback if this script never runs.
    Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 600)),
    ]).then(() => document.documentElement.classList.add("page-ready"));

    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.addEventListener("click", () => applyLang(btn.getAttribute("data-lang")));
    });
  }

  window.otmI18n = { t, applyLang, detectLang };

  // This script sits at the end of <body>, so the page is already parsed:
  // apply the language now instead of waiting for DOMContentLoaded.
  if (document.body) initI18n();
  else document.addEventListener("DOMContentLoaded", initI18n);
})();
