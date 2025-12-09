# Project Structure

## Directory Organization

```
src/
├── Store/              # Redux state management
│   ├── Slices/        # Redux slices (UserSlice.js)
│   └── store.js       # Store configuration with persistence
├── Utils/             # Utility components and helpers
│   ├── AdminProtectedRoute.jsx
│   ├── AuthContext.jsx
│   ├── AuthenticationApi.js
│   ├── CustomGoogleButton.jsx
│   ├── GoogleLogin.js
│   └── ProtectedRoute.jsx
├── assets/            # Static assets (images, icons)
├── pages/             # Page components
│   ├── Authentication.jsx
│   ├── Courses.jsx
│   ├── MeetingList.jsx
│   └── NotFound.jsx
├── App.jsx            # Main app component with routing
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

## Naming Conventions

### Files & Folders
- **Components/Pages**: PascalCase with `.jsx` extension (e.g., `Authentication.jsx`)
- **Utilities**: PascalCase for React components, camelCase for JS modules (e.g., `AuthenticationApi.js`)
- **Folders**: PascalCase (e.g., `Store/`, `Utils/`)
- **Redux Slices**: PascalCase with "Slice" suffix (e.g., `UserSlice.js`)

### Code
- **React Components**: PascalCase function components
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth`)
- **Redux Actions**: camelCase (e.g., `addUserData`, `removeUserData`)
- **API Functions**: camelCase (e.g., `loginUser`, `googleLoginUser`)

## Architecture Patterns

### State Management
- Redux Toolkit for global state
- Redux Persist with encryption for sensitive data (user state)
- User data is encrypted twice: once by backend (AES), once by redux-persist
- Context API for lightweight auth state (`AuthContext`)

### Routing
- React Router DOM v7 with BrowserRouter
- Route protection via `ProtectedRoute` and `AdminProtectedRoute` components
- Centralized routing in `App.jsx`

### Authentication Flow
1. User authenticates via email/password or Google OAuth
2. Backend returns encrypted user data
3. Frontend decrypts and stores in Redux (UserSlice)
4. Redux state persisted to localStorage with encryption
5. Protected routes check Redux state for authentication

### API Layer
- Centralized API functions in `Utils/AuthenticationApi.js`
- Uses native `fetch` API
- Base URL from environment variables
- Error handling with try/catch and console logging

### Component Organization
- **Pages**: Top-level route components in `pages/`
- **Utils**: Reusable utilities, HOCs, and helpers in `Utils/`
- **Store**: All Redux-related code in `Store/`

## Key Patterns to Follow

1. **Environment Variables**: Always use `import.meta.env.VITE_APP_*` prefix
2. **Error Handling**: Use try/catch with console.error for API calls
3. **Toast Notifications**: Use `react-hot-toast` for user feedback
4. **Styling**: Tailwind CSS utility classes, avoid custom CSS when possible
5. **Encryption**: User data must be decrypted using `crypto-js` AES with `VITE_APP_ENCRYPTION` key
6. **Protected Routes**: Wrap authenticated pages with `ProtectedRoute` or `AdminProtectedRoute`
