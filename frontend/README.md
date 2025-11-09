# FloSmart PDF Annotator - Frontend

A modern, production-ready React application for PDF file management and viewing with role-based access control.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

## ✨ Features

- 📄 **PDF Upload & Management** - Upload, view, and delete PDF files
- 👥 **Role-Based Access** - Four user roles (A1, D1, D2, R1) with different permissions
- 📱 **Modern UI** - Clean, responsive design with CSS Modules
- 🎨 **Design System** - CSS variables for consistent theming
- ⚡ **Optimized Build** - Code splitting and lazy loading
- 🛡️ **Type Safe** - Full TypeScript strict mode
- 🔍 **Error Handling** - Error boundaries and custom error classes

## 🏗️ Tech Stack

- **React 18.3.1** - Modern React with hooks
- **TypeScript 5.6.2** - Strict type checking
- **Vite 5.4.8** - Fast build tool and dev server
- **React Router 6.26.2** - Client-side routing
- **react-pdf 9.1.1** - PDF viewing with navigation
- **CSS Modules** - Scoped component styling

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── ErrorBoundary/   # Error boundary wrapper
│   ├── FileList/        # File list display
│   ├── FileUploader/    # File upload form
│   └── Header/          # App header with role switcher
├── contexts/            # React contexts
│   └── UserContext.tsx  # User role management
├── pages/               # Page components
│   ├── Dashboard/       # Main dashboard
│   └── PdfViewer/       # PDF viewer page
├── styles/              # Global styles
│   ├── globals.css      # Global CSS reset
│   └── variables.css    # CSS custom properties
├── types/               # TypeScript types
│   ├── index.ts         # Shared types
│   └── css.d.ts         # CSS module types
├── utils/               # Utility functions
│   └── api.ts           # API client
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

## 🎨 CSS Architecture

This project uses **CSS Modules** for component-scoped styling and **CSS Variables** for theming:

```typescript
// Component with CSS Module
import styles from './Component.module.css';

<div className={styles.container}>
  <button className={styles.button}>Click me</button>
</div>
```

Design tokens are defined in `src/styles/variables.css`:
- Colors (primary, danger, success, neutrals)
- Spacing scale (xs to 2xl)
- Typography system
- Shadows and transitions

## 🔧 Configuration

### Environment Variables

Create a `.env` file:
```env
VITE_API_URL=http://localhost:4000/api
```

### Path Aliases

Configured in `vite.config.ts` and `tsconfig.app.json`:
```typescript
import { Header } from '@components/Header';
import { useUserContext } from '@contexts/UserContext';
import type { Role } from '@/types';
```

## 📚 Documentation

- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Complete modernization summary
- **[MODERNIZATION.md](./MODERNIZATION.md)** - Detailed modernization guide
- **[BEFORE_AFTER.md](./BEFORE_AFTER.md)** - Visual comparison of changes
- **[CHECKLIST.md](./CHECKLIST.md)** - Post-modernization checklist

## 🧪 Testing

### Manual Testing Checklist
- [ ] User role switching works
- [ ] File upload (A1 only)
- [ ] File list displays correctly
- [ ] PDF viewer with navigation
- [ ] File deletion (A1 only)
- [ ] Responsive design
- [ ] Error handling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output in `dist/` directory:
- Optimized bundles with code splitting
- Separate vendor chunks (react, pdf)
- Source maps for debugging
- Gzipped assets

### Deploy to Netlify/Vercel
```bash
# Build command
npm run build

# Publish directory
dist
```

## 🎯 User Roles

- **A1 (Admin)** - Full access: upload, view, delete
- **D1, D2 (Developers)** - View only
- **R1 (Reviewer)** - View only

## 🛠️ Development

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- CSS Modules for scoped styles
- Functional components with hooks

### Performance
- Code splitting (react-vendor, pdf-vendor)
- Lazy loading of routes
- Memoization with useMemo/useCallback
- Optimized re-renders

## 📦 Build Output

```
dist/
├── index.html                     0.62 kB
├── assets/
│   ├── index-*.css               20.27 kB (gzip: 4.20 kB)
│   ├── index-*.js                 9.81 kB (gzip: 3.86 kB)
│   ├── react-vendor-*.js        161.79 kB (gzip: 52.81 kB)
│   └── pdf-vendor-*.js          375.13 kB (gzip: 112.01 kB)
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
