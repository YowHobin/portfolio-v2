Portfolio — Full‑Stack Developer

This is a minimalist portfolio built with Next.js 15 and Tailwind v4 (PostCSS plugin) featuring:

- Hero section with aurora/glass UI
- About, Stacks, Projects, and Contact sections
- Smooth light/dark theme toggle with no‑FOUC init script

Getting started (Windows PowerShell):

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

Customize:
- Edit content in components under `components/` (About, Stacks, Projects, Contact)
- Update meta in `app/layout.tsx`
- Replace placeholder email in `components/Contact.tsx`
- Add your logos/images to `public/`

Build and run:

```powershell
npm run build; npm start
```

Notes:
- Dark mode uses `data-theme="dark"` and `.dark` on `<html>` and CSS variables. Tailwind utilities are complemented by custom classes mapped to tokens in `app/globals.css`.
