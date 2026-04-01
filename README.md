# Jonathan Barani — Cosmic Web3 Journey

Single-file portfolio (HTML/CSS/JS) — lightweight, animated, and accessible.

Files:
- `index.html` — main page
- `style.css` — styles (glassmorphism, neon theme)
- `script.js` — interactions (particles, typing, custom cursor)

Quick local test (Windows PowerShell):
```powershell
cd 'e:\Cours\E-portefolio\Site'
Start-Process .\index.html
```

Notes & accessibility:
- Includes a `Skip to content` link for keyboard users.
- Respects `prefers-reduced-motion`: heavy animations and particles are disabled.
- Focus outlines are shown only when navigating with keyboard.
- Custom cursor is hidden on touch devices (mobile) for usability.

Performance & deployment:
- For best performance on mobile, particles are reduced/discarded automatically.
- Deploy easily to GitHub Pages: push this folder to `gh-pages` branch or set the repository Pages source to `/`.
- Vercel or Netlify: drag-and-drop or connect repo and deploy (static site).

Possible next steps:
- Add a contact form (Netlify Forms / serverless function).
- Add micro-animations (hover sound, more memetic visuals) — consider accessibility.
- Prepare optimized assets and CI for deployment.
