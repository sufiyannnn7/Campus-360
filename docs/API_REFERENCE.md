# Campus 360 API Reference

This document outlines the API layer, endpoints, domain services, and React Query custom hooks.

---

## 🌐 Endpoints Catalog (`src/api/endpoints.ts`)

| Domain | Key | Endpoint Path | Method | Description |
|---|---|---|---|---|
| **Auth** | `AUTH.ME` | `/api/auth/me` | GET | Retrieve authenticated user session |
| | `AUTH.LOGIN` | `/api/auth/login` | POST | Authenticate with credentials |
| | `AUTH.SIGNUP` | `/api/auth/signup` | POST | Register new student or faculty account |
| | `AUTH.LOGOUT` | `/api/auth/logout` | POST | Invalidate session |
| **Dashboard** | `DASHBOARD.STUDENT` | `/api/dashboard/student` | GET | Retrieve student metric dashboard data |
| | `DASHBOARD.ADMIN` | `/api/dashboard/admin` | GET | Retrieve admin analytical overview |
| **Events** | `EVENTS.LIST` | `/api/events` | GET | List events with filtering & pagination |
| | `EVENTS.DETAIL` | `/api/events/:id` | GET | Retrieve event details by ID |
| | `EVENTS.REGISTER` | `/api/events/:id/register` | POST | Register user for an event |
| | `EVENTS.CANCEL` | `/api/events/:id/cancel` | POST | Cancel user registration for an event |
| **Clubs** | `CLUBS.LIST` | `/api/clubs` | GET | List campus clubs & organizations |
| | `CLUBS.DETAIL` | `/api/clubs/:id` | GET | Retrieve club details & team members |
| | `CLUBS.JOIN` | `/api/clubs/:id/join` | POST | Submit membership request |
| | `CLUBS.LEAVE` | `/api/clubs/:id/leave` | POST | Leave club membership |
| **News** | `NEWS.LIST` | `/api/news` | GET | List news, blogs, and announcements |
| | `NEWS.DETAIL` | `/api/news/:id` | GET | Retrieve full news article |
| **Recruitments**| `RECRUITMENTS.LIST` | `/api/recruitments` | GET | List active club recruitment roles |
| | `RECRUITMENTS.APPLY`| `/api/recruitments/:id/apply` | POST | Submit application for open role |
| **Certificates**| `CERTIFICATES.LIST` | `/api/certificates` | GET | List earned certificates for active user |
| | `CERTIFICATES.VERIFY`| `/api/certificates/verify/:code` | GET | Verify certificate by QR verification code |
| **Notifications**| `NOTIFICATIONS.LIST` | `/api/notifications` | GET | List user notifications |
| | `NOTIFICATIONS.MARK_READ`| `/api/notifications/:id/read` | POST | Mark single notification as read |
| | `NOTIFICATIONS.MARK_ALL_READ`| `/api/notifications/read-all` | POST | Mark all notifications as read |
| **Leaderboard** | `LEADERBOARD.LIST` | `/api/leaderboard` | GET | Student activity & gamification points |
| **Search** | `SEARCH.GLOBAL` | `/api/search` | GET | Global query across events, clubs, news |

---

## 🛠️ Domain Services (`src/api/services/`)

All services return strongly-typed promises using interfaces from `@/types/`.

### Example: Events Service
```ts
import { eventsService } from "@/api/services/events.service";

// List all events matching criteria
const events = await eventsService.listEvents({ category: "Technical", q: "Hackathon" });

// Get single event
const event = await eventsService.getEventById(1);

// Register for event
await eventsService.registerEvent(1, { participantName: "Sufiyan Shaikh" });
```

---

## 🪝 React Query Hooks (`src/hooks/`)

| Hook | Parameters | Returns | Cache Key |
|---|---|---|---|
| `useEvents(params?)` | `EventFilterParams?` | `QueryResult<EventItem[]>` | `["/api/events", params]` |
| `useEvent(id)` | `string \| number` | `QueryResult<EventItem>` | `["/api/events", id]` |
| `useRegisterEvent()` | - | `MutationResult` | - |
| `useCancelEventRegistration()` | - | `MutationResult` | - |
| `useClubs(params?)` | `ClubFilterParams?` | `QueryResult<ClubItem[]>` | `["/api/clubs", params]` |
| `useClub(id)` | `string \| number` | `QueryResult<ClubItem>` | `["/api/clubs", id]` |
| `useJoinClub()` | - | `MutationResult` | - |
| `useLeaveClub()` | - | `MutationResult` | - |
| `useNews(params?)` | `NewsFilterParams?` | `QueryResult<NewsArticle[]>` | `["/api/news", params]` |
| `useNewsItem(id)` | `string \| number` | `QueryResult<NewsArticle>` | `["/api/news", id]` |
| `useRecruitments(params?)` | `any` | `QueryResult<Recruitment[]>` | `["/api/recruitments", params]` |
| `useApplyRecruitment()` | - | `MutationResult` | - |
| `useCertificates()` | - | `QueryResult<Certificate[]>` | `["/api/certificates"]` |
| `useVerifyCertificate(code)` | `string` | `QueryResult<VerificationResult>` | `["/api/certificates/verify", code]` |
| `useNotifications()` | - | `QueryResult<CampusNotification[]>` | `["/api/notifications"]` |
| `useLeaderboard()` | - | `QueryResult<LeaderboardEntry[]>` | `["/api/leaderboard"]` |
| `useStudentDashboard()` | - | `QueryResult<StudentDashboardData>` | `["/api/dashboard/student"]` |
| `useAdminDashboard()` | - | `QueryResult<AdminDashboardData>` | `["/api/dashboard/admin"]` |
| `useGlobalSearch(query)` | `{ q?: string }` | `QueryResult<SearchResult>` | `["/api/search", q]` |

---

## 🛡️ Error Handling

The HTTP client defines `ApiError`:

```ts
export class ApiError extends Error {
  public statusCode: number;
  public details?: any;
}
```

Whenever an API request fails, `ApiError` is thrown with the exact HTTP status code (e.g. 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Error) and caught automatically by mutation handlers or the root `ErrorBoundary`.
