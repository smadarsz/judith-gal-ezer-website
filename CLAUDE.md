# CLAUDE.md — Judith Gal-Ezer Academic Website

This file provides a comprehensive guide to the codebase for AI assistants (Claude and others) working on this project.

---

## Project Overview

This is the personal academic website of **Prof. Judith Gal-Ezer**, Professor Emerita of Computer Science at the Open University of Israel. It functions as an interactive CV/portfolio showcasing her publications, career, awards, teaching, and service.

The site is a **plain static website** — no framework, no build step, no package manager. It runs directly in any browser without compilation.

---

## Repository Structure

```
judith-gal-ezer-website/
├── index.html          # Single-page application (all content, ~800 lines)
├── script.js           # All JavaScript logic (~210 lines)
├── styles.css          # All styling (~938 lines)
├── profile-picture.jpg # Prof. Gal-Ezer's portrait photo
└── CLAUDE.md           # This file
```

There are no subdirectories, no `package.json`, no `node_modules`, no build output, and no configuration files. Everything is self-contained in three source files.

---

## Technology Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Markup     | HTML5 (semantic elements)         |
| Styling    | Pure CSS3 (no framework)          |
| Scripting  | Vanilla JavaScript (ES6+)         |
| Fonts      | Google Fonts (CDN, no local copy) |
| Images     | JPEG (profile picture only)       |
| Build      | None — open `index.html` directly |
| Tests      | None                              |
| CI/CD      | None                              |

**External dependencies (CDN only):**
- `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;600&display=swap`

---

## Architecture: Single-Page Tab System

The site uses a **client-side tab navigation** pattern. All content sections are present in the DOM simultaneously; only the active tab is shown.

### Tab IDs (match `id` attributes in `index.html` and `data-tab` attributes on nav links)

| Tab ID             | Nav Label      | Content                              |
|--------------------|----------------|--------------------------------------|
| `about`            | About          | Biographical summary (default)       |
| `education`        | Education      | Degrees and academic background      |
| `positions`        | Appointments   | Academic and administrative roles    |
| `awards`           | Awards         | Honors and recognition               |
| `publications`     | Publications   | Selected/recent publications         |
| `teaching`         | Teaching       | Courses taught, students supervised  |
| `service`          | Service        | Professional and academic service    |
| `contact`          | Contact        | Email and affiliation details        |

> **Note:** There is also a hidden tab with `id="full-publications"` reachable from within the Publications tab. It is not in the main nav but uses the same tab switching mechanism.

### Tab Switching Logic (`script.js`)

- `showTab(tabId)` — hides all `.tab-content` elements, removes `.active` from all `.tab-link` elements, then adds `.active` to the target tab and its nav link.
- URL hash is kept in sync: navigating to `index.html#awards` will open the Awards tab on load.
- Browser back/forward buttons work via a `popstate` event listener.
- Default tab (when no hash is present): `about`.

---

## HTML Conventions (`index.html`)

### Overall Structure

```html
<header class="header">       <!-- Profile banner with photo and title -->
<nav class="navigation">      <!-- Sticky tab navigation bar -->
<main class="main-content">   <!-- All tab panels -->
    <div class="container">
        <div id="TAB_ID" class="tab-content [active]">
            <h2 class="section-title">...</h2>
            <!-- Tab-specific content -->
        </div>
    </div>
</main>
```

### Content Item Classes

Each section uses a consistent card/list pattern:

| Section      | Item class          | Inner element classes                              |
|--------------|---------------------|----------------------------------------------------|
| Education    | `.education-item`   | `.degree`, `.institution`, `.year`, `.thesis`      |
| Positions    | `.position-item`    | `.job-title`, `.organization`, `.period`           |
| Awards       | `.award-item`       | `.award-name`, `.award-org`, `.award-year`         |
| Publications | `.publication-item` | `.pub-title`, `.pub-journal`, `.pub-year`          |
| Full Pubs    | `.pub-item`         | Plain text list items                              |
| Teaching     | `.course-item`      | Inside `.course-category` groupings               |
| Service      | `.service-category` | Subsection headings and list items                 |

### Adding New Content

To add a new entry to any section, copy an existing item of the same type and update the inner text. For example, a new award:

```html
<div class="award-item">
    <div class="award-name">Award Title</div>
    <div class="award-org">Awarding Organization</div>
    <div class="award-year">YYYY</div>
</div>
```

### Adding a New Tab

1. Add a `<li><a href="#" class="tab-link" data-tab="NEW_ID">Label</a></li>` to the `<ul class="nav-menu">` in `<nav>`.
2. Add `<div id="NEW_ID" class="tab-content">...</div>` inside `<main class="main-content"><div class="container">`.
3. No changes to `script.js` or `styles.css` are needed — the existing tab logic handles any tab ID automatically.

---

## CSS Conventions (`styles.css`)

### Design Tokens (implicit — not CSS variables)

| Role             | Value(s)                              |
|------------------|---------------------------------------|
| Primary blue     | `#1e3a8a` (dark), `#3b82f6` (light)  |
| Background       | `#fafafa`, `#f8fafc`, `#f1f5f9`      |
| Text colors      | `#333`, `#4b5563`, `#64748b`          |
| Accent green     | `#059669` (used for years/dates)      |
| Heading font     | `'Playfair Display', serif`           |
| Body font        | `'Source Sans Pro', sans-serif`       |
| Container width  | `max-width: 1200px`                   |

### Responsive Breakpoints

| Breakpoint           | Media Query                  | Changes                                      |
|----------------------|------------------------------|----------------------------------------------|
| Tablet / Mobile      | `@media (max-width: 768px)`  | Hamburger menu, stacked layouts              |
| Small mobile         | `@media (max-width: 480px)`  | Smaller fonts, reduced padding               |
| Print                | `@media print`               | Hides nav, shows all content, adjusts colors |

### Key CSS Patterns

- **Tab visibility:** `.tab-content` defaults to `display: none`; `.tab-content.active` sets `display: block` with a fade-in animation.
- **Hover lift:** Interactive cards (`.publication-item`, `.award-item`, etc.) use `transform: translateY(-3px)` via JavaScript `mouseenter`/`mouseleave` (not pure CSS hover) — see `script.js:124-136`.
- **Section titles:** `.section-title` uses a decorative bottom border created with `::after` pseudo-element.
- **Header gradient:** `linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)` with an inline SVG grid overlay at 30% opacity.

---

## JavaScript Conventions (`script.js`)

All code runs inside a single `DOMContentLoaded` listener. There are no modules, imports, or external libraries.

### Functions

| Function / Block          | Lines     | Purpose                                               |
|---------------------------|-----------|-------------------------------------------------------|
| `showTab(tabId)`          | 8–36      | Core tab switching logic                              |
| Tab click/touch listeners | 38–61     | Attach events to all `.tab-link` elements             |
| `popstate` listener       | 63–71     | Handle browser back/forward navigation                |
| Hash initialization       | 73–79     | Show correct tab on page load from URL hash           |
| Hamburger menu            | 81–112    | Toggle `.mobile-open` on `.nav-menu`                  |
| Loading fade-in           | 116–121   | Fade body from opacity 0 → 1 on `window load`         |
| `addHoverEffects()`       | 123–138   | JS-driven card hover lift animation                   |
| `addPublicationSearch()`  | 140–154   | Adds search boxes to Publications sections            |
| `addSearchToSection()`    | 156–207   | Dynamically creates and wires up a search input       |

### Publication Search

- Search boxes are injected dynamically into `#publications` and `#full-publications` at the beginning of `.publication-categories` or `.full-publications-content` containers.
- `.publication-item` elements are filtered by the `#publications` search; `.pub-item` elements are filtered by the `#full-publications` search.
- Filtering is case-insensitive full-text match on the entire element's `textContent`.

---

## Development Workflow

### Running Locally

No build step required. Open `index.html` directly in a browser:

```bash
# Option 1: file:// protocol (simplest)
open index.html

# Option 2: local server (avoids some browser restrictions)
python3 -m http.server 8000
# then visit http://localhost:8000
```

### Making Changes

1. Edit `index.html` for content changes (new publications, awards, positions, etc.).
2. Edit `styles.css` for visual/layout changes.
3. Edit `script.js` for behavioral changes.
4. Reload the browser — no compilation or hot-reload needed.

### Git Workflow

The repository is hosted at `http://local_proxy@127.0.0.1:56356/git/smadarsz/judith-gal-ezer-website`.

Standard commit pattern used in this repo:
```bash
git add index.html   # or whichever files changed
git commit -m "brief description of what changed"
git push -u origin <branch-name>
```

Commit messages in this project tend to be short and descriptive of the specific content change (e.g., `"added bashaar sub section to services"`).

---

## Content Editing Guide

### Updating Publications

Publications live in two places in `index.html`:

1. **`#publications` tab** — Selected/recent publications using `.publication-item` cards with structured sub-elements (`.pub-title`, `.pub-journal`, `.pub-year`).
2. **`#full-publications` tab** — Complete list using `.pub-item` elements (simpler, plain-text list style).

Both sections have dynamically injected search boxes — no manual HTML needed for search functionality.

### Updating Service Section

The `#service` tab uses `.service-category` divs, each with a heading and a list. Sub-sections (e.g., Ministry of Education, Bashaar, Conference Committees) are nested within categories. Follow the existing pattern when adding new subsections.

### Profile Information

The header content (name, title, affiliation) is in the `<header class="header">` at the top of `index.html`. The profile picture is `profile-picture.jpg` — replace this file to update the photo (keep the same filename, or update the `src` in `index.html`).

---

## Key Constraints and Conventions

- **No build tools:** Do not introduce npm, webpack, Vite, or any bundler. This is intentionally build-tool-free.
- **No CSS frameworks:** Do not use Bootstrap, Tailwind, or similar. All styles are in `styles.css`.
- **No JS frameworks:** Do not introduce React, Vue, jQuery, or similar. All logic is in `script.js`.
- **No TypeScript:** The project uses plain JavaScript; do not convert to TypeScript.
- **No external fonts beyond Google Fonts:** The existing CDN link covers all required weights.
- **Inline styles are acceptable** for dynamically injected elements (see the search input in `script.js:168-178`), but prefer `styles.css` for static elements.
- **Accessibility:** Maintain semantic HTML. Keep `aria-label` on the hamburger button. Use `alt` text on images.
- **Print support:** `styles.css` includes `@media print` rules — preserve them when making layout changes.

---

## Common Tasks Reference

| Task | Where to edit |
|------|--------------|
| Add a publication | `index.html` — `#publications` and/or `#full-publications` |
| Add an award | `index.html` — `#awards` tab, add a `.award-item` div |
| Add a position/role | `index.html` — `#positions` tab, add a `.position-item` div |
| Update About text | `index.html` — `#about` tab, edit paragraph text |
| Change profile photo | Replace `profile-picture.jpg` (same filename) |
| Add a new nav tab | `index.html` nav `<ul>` + new `<div id="..." class="tab-content">` in `<main>` |
| Change colors | `styles.css` — update hex values (no CSS variables; find-replace as needed) |
| Change tab behavior | `script.js` — `showTab()` function |
| Add new hover effects | `script.js` — `addHoverEffects()` function, add selector to `hoverElements` query |
| Extend publication search | `script.js` — `addPublicationSearch()` / `addSearchToSection()` |
