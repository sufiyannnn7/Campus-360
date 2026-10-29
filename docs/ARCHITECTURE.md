# Campus 360 Architecture Overview

Campus 360 is structured around a **layered, domain-driven frontend architecture** designed for high scalability, maintainability, type safety, and clean separation of concerns.

---

## 🏛️ System Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                       Presentation Layer                    │
│     (Pages, Modals, Feature Views, Layout Orchestrators)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   State Management & Hooks                  │
│       (AuthContext, TanStack Query Hooks, UI Hooks)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Domain Services Layer                   │
│      (AuthService, EventsService, ClubsService, etc.)       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      HTTP & Core Client                     │
│    (ApiClient, ApiError, Token Interceptor, Mock Fallback)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Configuration & Constants                  │
│          (Environment Variables, Routes, Roles)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Presentation Layer (`src/pages/`, `src/components/`)
- **Pages**: Responsible strictly for layout presentation, route orchestration, and passing state to child components. All data querying and mutations are done via hooks.
- **Common Components (`src/components/common/`)**: Reusable UI primitives (e.g., `ErrorBoundary`, `PageHeader`, `StatusBadge`, `LoadingSpinner`, `EmptyState`).
- **Layout (`src/components/layout/`)**: Modularized layout components (`AppShell`, `SidebarLink`, `UserMenu`) ensuring decoupled header/sidebar navigation.

## 2. State Management (`src/context/`, `src/hooks/`)
- **Global User State (`AuthContext`)**:
  - Manages active user session, JWT token persistence, and role state (`student`, `faculty`, `coordinator`, `admin`).
  - Supports dynamic demo role switching for testing different permission views without server re-login.
  - Accessed anywhere via `useAuth()`.
- **Server Cache State (TanStack Query)**:
  - Cache invalidation and query deduplication.
  - Dedicated hooks (`useEvents`, `useClubs`, `useNews`, etc.) isolate fetch lifecycles.

## 3. Domain Services (`src/api/services/`)
- Pure asynchronous service objects encapsulate all business logic and API communication.
- Each domain is represented by its own service:
  - `auth.service.ts`
  - `events.service.ts`
  - `clubs.service.ts`
  - `news.service.ts`
  - `recruitments.service.ts`
  - `certificates.service.ts`
  - `notifications.service.ts`
  - `leaderboard.service.ts`
  - `dashboard.service.ts`
  - `search.service.ts`

## 4. Scalable HTTP Client (`src/api/client.ts`)
- Unified `apiClient` supporting `GET`, `POST`, `PUT`, `DELETE`.
- Automatically attaches Bearer tokens from `STORAGE_KEYS.AUTH_TOKEN`.
- Formats query parameter strings safely.
- Throws structured `ApiError` instances containing HTTP status codes.
- Implements seamless offline mock fallback to keep the app 100% operational in dev and standalone preview environments.

## 5. Environment & Constants (`src/config/`)
- `env.ts`: Validates `import.meta.env` with type-safe fallbacks.
- `constants.ts`: Immutable route definitions, storage keys, user roles, and category mappings.

## 6. Type Definitions (`src/types/`)
- Centralized TypeScript domain interfaces ensuring strict type safety across services, hooks, and presentation components.
