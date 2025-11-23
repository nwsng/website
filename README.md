# New Song Church Website

A modern, one-page website for New Song Church, optimized for web and mobile.

## Features

- ✨ Modern, trendy design with gradient accents
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Smooth animations and transitions
- ⚡ Fast loading and optimized
- 🌐 GitHub Pages ready

## Setup for GitHub Pages

1. **Enable GitHub Pages:**
   - Go to your repository Settings
   - Navigate to Pages
   - Under "Source", select "GitHub Actions"

2. **Custom Domain (newsongchurch.ca):**
   - The `CNAME` file is already included
   - In your repository Settings → Pages, add `newsongchurch.ca` as your custom domain
   - Update your DNS records:
     - Add a CNAME record pointing `newsongchurch.ca` to `yourusername.github.io`
     - Or add A records pointing to GitHub Pages IPs

3. **Deploy:**
   - Push to the `main` branch
   - The GitHub Actions workflow will automatically deploy your site

## Local Development

Simply open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

## Customization

- Update contact information in `index.html`
- Modify colors in `styles.css` (CSS variables in `:root`)
- Adjust content in `index.html` sections

## Files

- `index.html` - Main HTML structure
- `styles.css` - All styling and responsive design
- `script.js` - Navigation and scroll animations
- `.github/workflows/deploy.yml` - GitHub Actions deployment
- `CNAME` - Custom domain configuration
