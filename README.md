# Foundation Phase Tracker

Progress tracker for the May–July 2026 mocap system foundation phase.

## Local Development

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

### First-time setup

1. Create a new repo on GitHub (e.g. `foundation-phase-tracker`)
2. In `vite.config.js`, set `base` to match your repo name:
   ```js
   base: '/your-repo-name/',
   ```
3. Push your code:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/your-repo-name.git
   git push -u origin main
   ```
4. Install dependencies and deploy:
   ```bash
   npm install
   npm run deploy
   ```

### Subsequent deploys

```bash
npm run deploy
```

This builds the app and pushes the `dist/` folder to the `gh-pages` branch automatically.

### Enable GitHub Pages

In your repo → Settings → Pages → set source to **Deploy from branch** → branch: `gh-pages`, folder: `/ (root)`.

Your site will be live at: `https://YOUR_USERNAME.github.io/your-repo-name/`
