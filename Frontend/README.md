# CommUnity — React Vite Frontend

A full-featured community management app frontend for the CommUnity Spring Boot backend.

## Setup

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api` → `http://localhost:8080`.

## Features

- **Auth**: Register, Login, Email OTP Verification, Forgot/Reset Password
- **Communities**: Browse all, create, join by code, leave, view details & members
- **Posts**: Create, view, delete, ♥ Feel Good reactions (toggle)
- **Comments**: Add and delete comments per post
- **Profile**: View and edit name/mobile

## Project Structure

```
src/
├── api/          # Axios API calls (all endpoints)
├── context/      # Auth context & user state
├── components/   # Reusable UI: Button, Input, Card, Modal, Badge, Toast…
│   ├── UI.jsx
│   └── Navbar.jsx
└── pages/
    ├── LoginPage.jsx
    ├── RegisterPage.jsx      # with OTP step
    ├── ForgotPasswordPage.jsx
    ├── DashboardPage.jsx
    ├── CommunitiesPage.jsx
    ├── CommunityDetailPage.jsx  # posts + comments + members
    ├── MyCommunitiesPage.jsx
    └── ProfilePage.jsx
```

## Backend

Make sure your Spring Boot app runs on port **8080**.
The Vite dev server proxies all `/api/*` requests to it automatically.
