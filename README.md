# 🎓 Campus 360 — Unified Campus Operating System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/TanStack_Query-5.66-ff4154.svg)](https://tanstack.com/query)

**Campus 360** is a modern, modular, and performant campus management and engagement platform designed for university campuses (NKOCET Solapur). It integrates event lifecycles, club directories, recruitment workflows, interactive venue mapping, gamified leaderboards, verified digital certificates, and AI-powered campus assistance into a single unified web experience.

---

## ✨ Key Features

- 🎪 **Event Hub & Ticketing**: Discover, filter, and register for campus events with automated digital QR passes.
- 👥 **Clubs & Communities**: Explore student chapters (GDG, CSESA, E-Cell, SAE Baja, etc.) and submit membership applications.
- 🗺️ **Interactive Campus Map**: Visual navigation across campus buildings, labs, athletic fields, and dining halls with coordinates.
- 📅 **Interactive Calendar**: Multi-view campus agenda (Month, Week, Day, Agenda) with category filters and iCal exports.
- 🏆 **Gamified Leaderboard**: Track student points, badges, event attendance, and department rankings.
- 📜 **QR-Verified Digital Certificates**: View earned achievement certificates with cryptographically verifiable QR codes.
- 🤖 **Embedded AI Campus Assistant**: Floating AI assistant answering campus FAQs, event schedules, and room directions.
- 🛡️ **Role-Based Views**: Dynamic role switching (`Student`, `Faculty Advisor`, `Club Coordinator`, `Super Admin`).

---

## 🏗️ Architecture & Refactoring Highlights

This project has been systematically reorganized into a **clean 5-layer domain-driven architecture**:

1. **Clean Folder Structure**: Organized into `api/`, `config/`, `context/`, `types/`, `hooks/`, `components/common/`, `components/layout/`, and `pages/`.
2. **Separated Business Logic**: Pure domain services (`src/api/services/`) handle business rules and API requests away from React presentation components.
3. **Decoupled Environment Configs**: Environment variables are strictly managed in `src/config/env.ts` with type-safe fallbacks and `.env.example`.
4. **Centralized State Management**: Global `AuthContext` with reactive session persistence, demo role switcher, and `useAuth()` hook.
5. **Robust Error Handling**: Structured `ApiError` class, response status code handling, toast alerts, and enterprise-grade `ErrorBoundary`.
6. **Reusable Modular Components**: Standardized `PageHeader`, `StatusBadge`, `LoadingSpinner`, `EmptyState`, and `SidebarLink`.
7. **Type-Safe Domain Models**: Strongly-typed interfaces in `src/types/` for all entities (Users, Events, Clubs, News, Venues, Certificates).
8. **Scalable HTTP Engine**: Central HTTP client with token injection, query formatting, interceptors, and fallback mock simulation.
9. **Zero-Warning Production Bundling**: Optimized Vite rollup chunking for ultra-fast load times.
10. **Comprehensive Documentation**: Complete guides in `docs/ARCHITECTURE.md`, `docs/FOLDER_STRUCTURE.md`, and `docs/API_REFERENCE.md`.

---

## 📂 Quick Folder Overview

```
src/
├── api/            # HTTP client, endpoints catalog & domain services
├── config/         # Environment variables & app constants
├── context/        # Global auth & session state management
├── types/          # TypeScript domain models & API contracts
├── hooks/          # TanStack React Query & custom utility hooks
├── components/
│   ├── common/     # Reusable UI primitives (ErrorBoundary, PageHeader, etc.)
│   ├── layout/     # AppShell, Navbar, SidebarLink, UserMenu
│   ├── landing/    # Landing page sections
│   └── ui/         # Radix primitives & design tokens
├── pages/          # Application views & route handlers
├── data/           # Mock data fallbacks
└── lib/            # Utility helpers & backward-compatible bridge
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm or pnpm

### 1. Installation
```bash
npm install
```

### 2. Configure Environment
Copy the example environment configuration:
```bash
cp .env.example .env
```

### 3. Development Server
Start the Vite development server:
```bash
npm run dev
```

### 4. Type Checking
Validate all TypeScript types:
```bash
npm run typecheck
```

### 5. Production Build
Build optimized production assets:
```bash
npm run build
```

---

## 📖 Further Reading

- [System Architecture](file:///docs/ARCHITECTURE.md)
- [Folder Structure Specification](file:///docs/FOLDER_STRUCTURE.md)
- [API Reference & Service Contracts](file:///docs/API_REFERENCE.md)
