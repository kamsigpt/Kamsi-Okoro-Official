# Portfolio Site

Static portfolio site built with plain HTML, CSS, and JavaScript.

## Local preview

```bash
npm run dev
```

This serves the site at `http://localhost:3000`.

## GitHub publish setup

This repo is prepared for GitHub Pages.

Files added for deployment:

- `.github/workflows/deploy-pages.yml`
- `.nojekyll`
- `.gitignore`

## Push and go live

1. Create a new GitHub repository.
2. Upload this project or push it to the `main` branch.
3. In GitHub, open `Settings -> Pages`.
4. Set `Source` to `GitHub Actions`.
5. Push to `main` again if needed.

After the workflow finishes, the site will be live at:

`https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/`

## Notes

- `node_modules/` is ignored and should not be committed.
- This is a static site, so no build step is required for deployment.
