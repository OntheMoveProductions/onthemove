# On the Move Productions — website

A static, no-build website (plain HTML/CSS/JS) built from the studio's brief:
the burning-match loop hero, the turquoise/cream/wine/black colour system,
bilingual Czech/English copy, the SERRA reel, and Erik & Mariam's bios.

## Running it locally

No build step or dependencies. Just serve the `site/` folder over HTTP (the
`file://` protocol blocks the hero video's autoplay in some browsers), e.g.:

```
cd site
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Structure

```
site/
  index.html        Home — hero, intro, team teaser, featured work, contact CTA
  about.html         Bios for Erik & Mariam + studio values
  portfolio.html      Films from assets/data/portfolio.json
  contact.html        Contact form + direct email
  assets/
    css/style.css     Design tokens + all styles
    js/i18n.js         CZ/EN dictionary + language switching
    js/main.js         Nav, hero video sync, scroll reveals, contact form
    js/portfolio-render.js  Renders portfolio.json on the Work page + homepage teaser
    data/portfolio.json     Films and categories (edited with the editor)
    video/             Compressed hero loop + portfolio reel
    img/               Logo variants, favicons, photos, poster frames
```

## Language switching

Czech is the default/primary language per the brief; English is secondary.
All translatable text lives in `assets/js/i18n.js` as a single dictionary
(`STRINGS.cs` / `STRINGS.en`, plain JSON between the `STRINGS:BEGIN`/`STRINGS:END` markers the editor relies on) — there's only one HTML file per page, and
elements are tagged with `data-i18n="key"` (text), `data-i18n-placeholder`,
or `data-i18n-aria-label`. Copy is normally edited in the editor (`../editor`); to add a third
language (the brief mentions Armenian down the line), add an `hy` block and
a matching toggle button.

The visitor's choice is remembered in `localStorage`; first-time visitors
get Czech unless their browser is set to English.

**Note:** the Czech copy beyond the bios and slogan (which came from the
client's own files) was written by the assistant that built this site — a
native-speaker proofread before launch is recommended.

## The hero video

`assets/video/match-hero.mp4` was cut down from the studio's source file: it
already contained the same ~60s match-lighting cycle rendered twice back to
back, so it's trimmed to one exact loop (59.84s) and re-encoded at 1080p/H.264
with no audio track — 4.2MB instead of the original 577MB. The slogan's
fade in/out is a CSS animation timed against that same 59.84s cycle (see
`--hero-cycle` in `style.css` and `.hero-slogan`'s keyframes), started via JS
when the `<video>` actually starts playing so it can't drift out of sync from
a slow page load.

A pause button is included over the hero (top-right of the video) since an
auto-playing, looping video longer than a few seconds needs a way to stop it
for accessibility (WCAG 2.2.2). If a browser blocks autoplay entirely (some
mobile browsers, `prefers-reduced-motion`), the page falls back to a static
frame with the slogan simply shown.

## Contact form

With a form address set in the editor (Publish → Site settings, e.g. a free
Formspree form), the form sends in place and shows a "sent" message; a hidden
`_gotcha` field catches most spam bots. Without one, it opens the visitor's
email app with the message filled in, addressed to info@onthemove.cz.

## Generated files

The editor writes these; don't edit them by hand, they're rebuilt on every
save:

- `work/<film>.html`: one page per published film, built from
  `portfolio.html`'s header and footer, with that film's poster as the link
  preview.
- `404.html`: shown by GitHub Pages for any missing address.
- The `<!-- SEO:BEGIN -->` block in each page's `<head>` (title,
  description, link-preview tags) and the film grid on the Work page.
- `sitemap.xml` and `robots.txt`, once the site's address is known.

## Phone number

The brief left the studio's phone number as a "maybe" — the footer and
contact page have HTML comments marking exactly where to drop one in
(search for `phone number` in `contact.html` / `index.html`) if the studio
decides to publish one.

## Adding more portfolio work

Use the editor (`../editor`, or double-click **Start Editor** in the parent
folder): Films → New film. It converts the video, makes the poster, and writes
`assets/data/portfolio.json`. Draft films are skipped by the site. The "more
on the way" block shows automatically only when no films are published.
