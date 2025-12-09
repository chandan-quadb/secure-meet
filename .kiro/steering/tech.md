# Tech Stack

## Build System & Framework
- **Vite** (rolldown-vite@7.2.5) - Build tool and dev server
- **React 19.2.0** - UI framework
- **React Router DOM 7.9.6** - Client-side routing

## Styling
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Icons** - Additional icon library

## State Management
- **Redux Toolkit 2.11.0** - State management
- **React Redux 9.2.0** - React bindings for Redux
- **Redux Persist 6.0.0** - Persist Redux state to localStorage
- **Redux Persist Transform Encrypt 5.1.1** - Encrypt persisted state
- **Crypto-js 4.2.0** - Encryption utilities

## Authentication
- **@react-oauth/google 0.12.2** - Google OAuth integration
- Custom email/password authentication via backend API

## UI/UX
- **React Hot Toast 2.6.0** - Toast notifications

## Code Quality
- **ESLint 9.39.1** - Linting

## Common Commands

```bash
# Development
npm run dev          # Start dev server on port 3000

# Build
npm run build        # Production build

# Linting
npm run lint         # Run ESLint

# Preview
npm run preview      # Preview production build
```

## Environment Variables
All environment variables use the `VITE_APP_` prefix and are accessed via `import.meta.env`:
- `VITE_APP_BACKEND_URL` - Backend API base URL
- `VITE_APP_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `VITE_APP_ENCRYPTION` - Encryption key for user data
- `VITE_APP_REDUX_PERSIST_SECRET_KEY` - Redux persist encryption key
- `VITE_APP_ADMIN` - Admin identifier
- `VITE_APP_ADMIN_TYPE` - Admin type identifier

## API Integration
- Base URL configured via `VITE_APP_BACKEND_URL`
- Authentication endpoints:
  - `POST /api/v1/live-lecture/login` - Email/password login
  - `POST /api/v1/live-lecture/login/google` - Google OAuth login
  - `POST /api/v1/live-lecture/forgot-password` - Password reset OTP
  - `POST /api/v1/live-lecture/reset-password` - Reset password with OTP
