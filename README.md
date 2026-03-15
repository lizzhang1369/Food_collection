# Meal Moments (美食瞬间)

A lightweight web app for sharing and tracking your recent meals. Add a dish with a photo, filter by category and cooking time, browse in card or gallery mode, and export your “meal moments” list as a PDF.

## Features

- Add / delete meal entries (photo + name + author + date)
- Ratings: deliciousness, difficulty, prep time
- Filters: category (荤菜/素菜) and time range
- Two layouts: cards and gallery
- Export: generate a PDF from the current list (client-side)

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS
- Motion (animations)
- `html2canvas` + `jspdf` (PDF export)

## Run Locally

Prerequisites: Node.js 20+ recommended.

```bash
npm install
npm run dev
```

Then open the URL printed in your terminal (default `http://localhost:3000`).

## Deploy To GitHub Pages

This repo includes a GitHub Actions workflow that builds and deploys `dist/` to GitHub Pages.

1. Push to the `main` branch.
2. In GitHub: `Settings -> Pages -> Source` set to **GitHub Actions**.
3. Wait for the workflow **Deploy to GitHub Pages** to finish.

Your site will be available at:

`https://<username>.github.io/<repo>/`

## Project Structure

- `src/`: web app source code
- `.github/workflows/pages.yml`: GitHub Pages deployment workflow
- `miniapp/`: WeChat Mini Program version (Taro-based)
