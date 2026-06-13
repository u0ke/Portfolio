# ❄️ Hamza Bari (Ice) — Portfolio

A production-ready, ultra-minimalist personal portfolio website with a complete admin dashboard for content management. Inspired by the calm, focused aesthetic of the Helium browser.

## ✨ Features 

### Public Site (`index.html`)
- 🎨 **Helium-aesthetic** — deep indigo-to-blue gradient, stark white text, pill-shaped buttons
- 🪄 **Animated name reveal** with per-letter staggered entrance
- 👤 **Dynamic profile** — avatar, bio, fun facts (gym, PC, code, coffee)
- 🛠️ **Skills** — hard skills with animated level bars + soft skill chips
- 📁 **Projects** — minimalist cards with image, stack tags, demo + GitHub links
- 🎓 **Education** — clean rows
- 📝 **Blog** — articles list
- ✉️ **Contact form** — minimalist underline inputs, saves submissions to dashboard
- 📱 **Fully responsive** — mobile, tablet, desktop
- 🌊 **AOS animations** — subtle, smooth, scroll-triggered
- ♿ **Accessible** — focus rings, semantic HTML, reduced-motion support

### Admin Dashboard (`admin.html`)
- 🔐 **Session-based login** (`login.html`) — 8-hour sessions
- 📊 **Dashboard overview** — stats cards, quick actions, recent messages
- 👤 **Profile manager** — name, bio, contact, avatar, fun facts, education
- 🛠️ **Skills manager** — add/edit/remove hard & soft skills with live sync
- 📁 **Projects manager** — full CRUD with modal-based editor
- 📝 **Blog manager** — full CRUD with modal-based editor
- 📨 **Messages inbox** — view, mark read, delete contact submissions
- ⚙️ **Settings** — site title, accent color, theme
- 🔑 **Change credentials** — username + password
- 💾 **Import/Export JSON** — full data backup
- 🔄 **Reset to defaults**

## 🛠️ Tech Stack

- **HTML5** semantic markup
- **Tailwind CSS** (via CDN, with custom config for the indigo/electric palette)
- **Vanilla JavaScript** — no framework, no build step
- **AOS** for scroll animations
- **localStorage** for data persistence
- **JSON** for the canonical data file

## 📂 Project Structure

```
/portfolio
├── index.html              # Public site
├── admin.html              # Admin dashboard
├── login.html              # Admin login
├── css/
│   ├── main.css            # Public site styles
│   └── admin.css           # Admin styles
├── js/
│   ├── main.js             # Public site logic
│   ├── admin.js            # Admin logic
│   └── auth.js             # Auth helpers
├── data/
│   └── portfolio.json      # Default content
├── assets/
│   ├── images/             # Avatar + project images
│   ├── icons/              # (reserved)
│   └── uploads/            # (reserved)
└── README.md
```

## 🚀 Getting Started

### Option 1 — Open directly (simplest)
Just double-click `index.html`. The site will load with bundled defaults.

> **Note:** Browsers block `fetch()` of local JSON files on the `file://` protocol. The site falls back to bundled defaults in that case, and the admin saves everything to `localStorage`.

### Option 2 — Local server (recommended)
For the full experience (loading `data/portfolio.json`):

```bash
# Python 3
python -m http.server 8000

# OR Node.js
npx serve .

# OR PHP
php -S localhost:8000
```

Then open http://localhost:8000

## 🎨 Design System

- **Background:** `from-deep (#1E1B4B) via ocean (#1E3A8A) to ink (#0A0F2C)`
- **Text:** Stark white `#FFFFFF` with `text-white/70` for body
- **Accent:** Electric cyan `#1BFFFF`
- **Buttons:** Pill-shaped (`rounded-full`), solid white with dark text
- **Inputs:** Underline-only flat design
- **Type:** Inter (Google Fonts), tight tracking on display sizes
- **Cards:** Subtle `bg-white/5` with thin `border-white/10`

## 📝 Customization Quick Start

1. Log into `/login.html`
2. Edit your **Profile** (name, bio, avatar, fun facts)
3. Add/edit **Skills** (hard & soft)
4. Add your **Projects** with images, stack, demo + GitHub links
5. Add **Blog** posts
6. Adjust **Settings** (site title, accent)
7. Hit **Export JSON** to back up your data

## 🔒 Security Note

This is a static-site admin — credentials are stored in `localStorage`. For production, you'd want a real backend. For personal portfolios and demos, this is more than enough.

## 📜 License

MIT — feel free to use, modify, and ship.

---

Built with ❄️ by **Hamza Bari (Ice)** — Agadir, Morocco.
