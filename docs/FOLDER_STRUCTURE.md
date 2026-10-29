# Clean Folder Structure Guide

```
Campus-360/
├── docs/                        # Architecture, API & codebase documentation
│   ├── ARCHITECTURE.md          # System design & separation of concerns
│   ├── FOLDER_STRUCTURE.md      # Directory organization guide
│   └── API_REFERENCE.md         # API services, endpoints & hooks
│
├── public/                      # Static assets (favicons, images, logos)
│
├── src/
│   ├── api/                     # Scalable API layer
│   │   ├── client.ts            # Base HTTP client with interceptors & ApiError
│   │   ├── endpoints.ts         # Central catalog of all API endpoints
│   │   ├── services/            # Domain services isolating business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── events.service.ts
│   │   │   ├── clubs.service.ts
│   │   │   ├── news.service.ts
│   │   │   ├── recruitments.service.ts
│   │   │   ├── certificates.service.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── leaderboard.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── search.service.ts
│   │   └── index.ts             # Barrel export
│   │
│   ├── config/                  # Environment & App Constants
│   │   ├── env.ts               # Type-safe environment variable access
│   │   ├── constants.ts         # Routes, roles, storage keys, categories
│   │   └── index.ts
│   │
│   ├── context/                 # Application State Management
│   │   ├── auth-context.tsx     # User session, role state & auth actions
│   │   └── index.ts
│   │
│   ├── types/                   # Centralized TypeScript Domain Models
│   │   ├── auth.ts              # User, Role, Credentials, Signup
│   │   ├── events.ts            # EventItem, FilterParams, Registration
│   │   ├── clubs.ts             # ClubItem, Members, Categories
│   │   ├── news.ts              # NewsArticle, FilterParams
│   │   ├── venue.ts             # CampusVenue, Coordinates, Categories
│   │   ├── certificates.ts      # Certificate, Verification
│   │   ├── notifications.ts     # CampusNotification, Types
│   │   ├── recruitments.ts      # Recruitment, Applications
│   │   ├── leaderboard.ts       # LeaderboardEntry, Points
│   │   ├── api.ts               # ApiResponse, ApiErrorResponse
│   │   └── index.ts
│   │
│   ├── hooks/                   # Custom Hooks & React Query Logic
│   │   ├── use-auth.ts          # Auth state hook
│   │   ├── use-events.ts        # Events queries & mutations
│   │   ├── use-clubs.ts         # Clubs queries & mutations
│   │   ├── use-news.ts          # News queries
│   │   ├── use-recruitments.ts  # Recruitments queries & applications
│   │   ├── use-notifications.ts # Notification queries & mark-read
│   │   ├── use-certificates.ts  # Certificate queries & verify
│   │   ├── use-leaderboard.ts   # Leaderboard queries
│   │   ├── use-dashboard.ts     # Student & Admin dashboard queries
│   │   ├── use-search.ts        # Global search query
│   │   ├── use-debounce.ts      # Input debounce utility hook
│   │   ├── use-mobile.tsx       # Viewport breakpoint detection
│   │   └── use-toast.ts         # Toast notifications hook
│   │
│   ├── components/
│   │   ├── common/              # Modular Reusable Components
│   │   │   ├── error-boundary.tsx # Production error boundary with retry
│   │   │   ├── page-header.tsx    # Standard page title & action header
│   │   │   ├── status-badge.tsx   # Live / Upcoming / Closed badges
│   │   │   ├── loading-spinner.tsx# Loading spinners & skeleton cards
│   │   │   ├── empty-state.tsx    # Standard empty list view
│   │   │   └── index.ts
│   │   ├── layout/              # Layout Orchestrators
│   │   │   ├── shell.tsx        # AppShell layout container
│   │   │   ├── sidebar-link.tsx # Nav items with active state detection
│   │   │   └── user-menu.tsx    # User avatar, demo role switcher, logout
│   │   ├── landing/             # Landing page sections
│   │   └── ui/                  # Radix UI + Tailwind design tokens
│   │
│   ├── data/                    # Static dataset & fallback seed data
│   │   └── landing-data.ts
│   │
│   ├── lib/
│   │   ├── api-client-react.ts  # Backward-compatible bridge to services
│   │   └── utils.ts             # Utility functions (cn, formatDate)
│   │
│   ├── pages/                   # Application Views & Routes
│   │   ├── clubs/               # Clubs directory & detail pages
│   │   ├── events/              # Events catalog & detail pages
│   │   ├── news/                # Campus news & detail pages
│   │   ├── calendar.tsx         # Interactive campus calendar
│   │   ├── certificate-verify.tsx # Public certificate verification
│   │   ├── certificates.tsx     # Student certificates list
│   │   ├── dashboard.tsx        # Role-based dashboard
│   │   ├── landing.tsx          # Public homepage
│   │   ├── leaderboard.tsx      # Student engagement leaderboard
│   │   ├── login.tsx            # Login page
│   │   ├── map.tsx              # Interactive campus map
│   │   ├── not-found.tsx        # 404 error page
│   │   ├── notifications.tsx    # Notifications center
│   │   ├── profile.tsx          # Student / faculty profile settings
│   │   ├── recruitments.tsx     # Club team recruitment openings
│   │   ├── search.tsx           # Global search results
│   │   └── signup.tsx           # Account registration
│   │
│   ├── App.tsx                  # Root app component & route definitions
│   ├── index.css                # Global styles & Tailwind directives
│   └── main.tsx                 # Application DOM entrypoint
│
├── .env.example                 # Example environment variables
├── package.json                 # Dependencies and npm scripts
├── tsconfig.json                # TypeScript compiler configuration
└── vite.config.ts               # Vite build configuration with chunking
```
