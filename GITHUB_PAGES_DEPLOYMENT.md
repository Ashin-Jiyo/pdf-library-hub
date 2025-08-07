# GitHub Pages Deployment Guide

## Overview
Your PDF Library Hub is now configured for automatic deployment to GitHub Pages using GitHub Actions.

## Setup Steps

### 1. Push to GitHub
First, make sure your project is in a GitHub repository:

```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Initial commit - PDF Library Hub"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/pdf-library-hub.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**

### 3. Configure Environment Variables (Important!)
Your app uses Firebase and other services. You'll need to set up environment variables:

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** for each of these variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - Any other environment variables your app needs

### 4. Update the GitHub Actions Workflow
The current workflow needs to include environment variables. Let me update it:

## Automatic Deployment
Once set up, every push to the `main` branch will automatically:
1. Build your React app
2. Deploy it to GitHub Pages
3. Your site will be available at: `https://YOUR_USERNAME.github.io/pdf-library-hub/`

## Manual Deployment (Alternative)
If you prefer manual deployment, you can use:

```bash
# Install gh-pages if not already installed
npm install --save-dev gh-pages

# Build and deploy
npm run deploy
```

## Important Notes

### Router Configuration
- The app now uses `HashRouter` instead of `BrowserRouter` for GitHub Pages compatibility
- URLs will have `#` in them (e.g., `/#/dashboard`)

### Base URL
- The app is configured with base URL `/pdf-library-hub/` for GitHub Pages
- This assumes your repository name is `pdf-library-hub`

### Custom Domain (Optional)
If you want to use a custom domain:
1. Create a `CNAME` file in the `public` folder with your domain
2. Configure your domain's DNS to point to GitHub Pages
3. Update the `base` in `vite.config.ts` to `/`

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Ensure your Firebase configuration is correct
- Check the Actions tab for detailed error logs

### Site Not Loading
- Verify the repository name matches the base URL in `vite.config.ts`
- Check that GitHub Pages is enabled in repository settings
- Ensure the deployment completed successfully

### Firebase Issues
- Make sure your Firebase project allows the GitHub Pages domain
- Update Firebase hosting configuration if needed
- Check Firebase security rules

## Development vs Production
- Development: `npm run dev` (uses local server)
- Production build: `npm run build`
- Preview production build: `npm run preview`
