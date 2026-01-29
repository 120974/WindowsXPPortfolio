# 🪟 Windows XP Portfolio

An authentic Windows XP-themed interactive portfolio website showcasing creative work in photography, 3D design, and 2D design. Built with React, TypeScript, and Tailwind CSS. Fully optimized for GitHub Pages.

[![Deploy to GitHub Pages](https://github.com/rishithchintala/portfolio-xp/actions/workflows/deploy.yml/badge.svg)](https://github.com/rishithchintala/portfolio-xp/actions/workflows/deploy.yml)
![Bundle Size](https://img.shields.io/badge/bundle%20size-%3C400KB-success)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### 🎨 Windows XP Experience
- **Authentic Interface**: Complete with start menu, taskbar, draggable windows, and classic XP styling
- **Desktop Icons**: Clickable programs with authentic Windows XP behavior
- **Taskbar**: Functional start button, running apps, and system tray with clock
- **Window Management**: Minimize, maximize, close, and drag windows

### 📁 Portfolio Showcase
- **10 Original Artworks**: 5 Photography, 2 3D Design, 3 2D Design projects
- **Guided Tour**: Shadow the dog guides you through the Urban Echoes portfolio
- **Detail Views**: Enhanced showcase with full-screen capability
- **Professional Layout**: Modern portfolio presentation in classic XP style

### 🎮 Interactive Entertainment
- **Classic Games**: Solitaire, Minesweeper, PAC-MAN, and Snake (all playable!)
- **Deleteable Programs**: Send games to the recycle bin, restore them later
- **Achievement System**: 31 unlockable achievements across 6 categories
- **Easter Eggs**: Hidden BSOD experience and secret features

### 🤖 Assistant & Help
- **Shadow the Dog**: Helpful guide for the portfolio tour
- **Spotlight Tutorial**: Interactive walkthrough of key features
- **Welcome Popup**: First-time visitor guidance

### ⚡ Performance & Quality
- **Optimized Build**: < 400 KB gzipped bundle size
- **No Scroll Layout**: Fixed viewport for authentic desktop experience
- **Fast Loading**: Code splitting and lazy loading
- **PWA Ready**: Installable as standalone app
- **Dark Mode**: Toggle between classic XP and dark themes
- **Responsive**: Works on desktop and mobile devices

## 🚀 Live Demo

Visit the live demo: [https://rishithchintala.github.io/portfolio-xp/](https://rishithchintala.github.io/portfolio-xp/)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Motion (Framer Motion)
- **Build Tool**: Vite 5
- **Deployment**: GitHub Pages (automated)
- **PWA**: Service Worker + Web App Manifest
- **Icons**: Lucide React

## ⚡ Performance

- **Bundle Size**: < 400 KB (gzipped)
- **Load Time**: < 2s on 3G
- **Lighthouse Score**: 90+ Performance
- **Code Splitting**: 6+ optimized chunks
- **Caching**: Service Worker with smart caching
- **No Scroll**: Fixed viewport for desktop experience

## 📱 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/portfolio-xp.git
   cd portfolio-xp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 🚀 Deploy to GitHub Pages

### Automatic Deployment (Recommended)

**Zero-configuration deployment** with GitHub Actions:

1. **Fork this repository** to your GitHub account

2. **Update configuration**:
   - Replace `rishithchintala` in `package.json` with your GitHub username
   - Update `base` in `vite.config.ts` to match your repository name
   - Update repository URL in `package.json`

3. **Enable GitHub Pages**:
   - Go to **Settings** → **Pages**
   - Set **Source** to: `GitHub Actions`

4. **Push to main branch** - automatic deployment starts!
   ```bash
   git push origin main
   ```

5. **Monitor deployment**:
   - Check **Actions** tab for build status
   - Site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Deployment Features

✅ **Automated CI/CD**: GitHub Actions workflow
✅ **Optimized Build**: 2-pass minification, code splitting
✅ **Type Safety**: Pre-deployment TypeScript validation
✅ **Fast Builds**: Cached dependencies (~1-2 min)
✅ **Service Worker**: Smart caching for offline support
✅ **No-Scroll Layout**: Fixed viewport prevents scrolling

### Manual Deployment (Alternative)

```bash
npm run deploy
```

That's it! Your site will automatically deploy on every push to the main branch.

## 🎨 Customization

### Portfolio Content

Edit `/components/constants/artData.ts` to customize:
- Portfolio categories
- Artwork details
- Images and descriptions
- Technical specifications

### Personal Information

Update `/components/AboutApp.tsx` with:
- Your name and contact information
- Bio and experience
- Social media links
- Resume/CV details

### Styling

Modify `/styles/globals.css` for:
- Color schemes
- Typography
- XP-themed components
- Dark mode variants

## 🎮 Features Guide

### Desktop Interaction
- **Double-click** icons to open applications
- **Drag & drop** icons to rearrange or delete them
- **Right-click** for context menus (coming soon)

### Portfolio Navigation
- **Click images** to zoom and explore artwork
- **Use tabs** to switch between different views
- **Read technical details** for each piece

### System Features
- **Start Menu**: Access all applications and settings
- **Taskbar**: Manage open windows and system tray
- **Recycle Bin**: Restore deleted desktop icons
- **Control Panel**: External links and settings

## 📄 Project Structure

```
portfolio-xp/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml         # Automated GitHub Pages deployment
│   ├── CONTRIBUTING.md         # Contribution guidelines
│   └── PULL_REQUEST_TEMPLATE.md
├── components/
│   ├── ui/                    # ShadCN UI components
│   ├── constants/             # Data and configuration
│   │   ├── achievements.ts    # Achievement system data
│   │   ├── appConfig.ts       # App configuration
│   │   ├── artData.ts         # Portfolio content
│   │   └── layout.ts          # Layout constants
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAchievements.ts
│   │   └── useAppState.ts
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Utility functions
│   └── [Components].tsx       # React components
├── styles/
│   └── globals.css            # Tailwind CSS + custom styles
├── public/
│   ├── .nojekyll              # Skip Jekyll processing
│   ├── 404.html               # SPA redirect handler
│   ├── sw.js                  # Service worker
│   ├── manifest.json          # PWA manifest
│   └── robots.txt             # SEO
├── App.tsx                    # Main app component
├── vite.config.ts             # Vite configuration
├── package.json               # Dependencies
├── DEPLOYMENT.md              # Deployment guide
├── OPTIMIZATION.md            # Performance docs
└── README.md                  # This file
```

## 🤝 Contributing

Contributions are welcome!

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run type-check && npm run build`
5. Commit: `git commit -m 'feat: add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- ✅ Follow TypeScript best practices
- ✅ Use Tailwind CSS for styling
- ✅ Maintain Windows XP authenticity
- ✅ Test on multiple browsers
- ✅ Keep bundle size optimized
- ✅ Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Windows XP design inspiration from Microsoft
- React and Vite for the development framework
- Tailwind CSS for styling utilities
- Unsplash for placeholder images

## 📞 Contact

**Rishith Chintala**
- Email: rishithchintala@gmail.com
- LinkedIn: [linkedin.com/in/rishith-chintala-012553232](https://www.linkedin.com/in/rishith-chintala-012553232)
- Portfolio: [https://rishithchintala.github.io/portfolio-xp/](https://rishithchintala.github.io/portfolio-xp/)

---

Made with ❤️ and nostalgia for the Windows XP era