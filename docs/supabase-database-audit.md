# Campus-360 Supabase Database Audit

> Source: automated inspection of src/  Status: Phase 1 Audit Only (no code changed)

## 1. Routes and Pages Discovered (19 total)

| Route | Page | Auth Required | Role |
|---|---|---|---|
| / | landing.tsx | No | None |
| /login | login.tsx | No | None |
| /signup | signup.tsx | No | None |
| /dashboard | dashboard.tsx | Yes | All (role-switched views) |
| /events | events/index.tsx | No read / Yes register | None |
| /events/:id | events/detail.tsx | No read / Yes register | None |
| /calendar | calendar.tsx | No | None |
| /map | map.tsx | No | None |
| /clubs | clubs/index.tsx | No read / Yes join | None |
| /clubs/:id | clubs/detail.tsx | No read / Yes join | None |
| /recruitments | recruitments.tsx | No read / Yes apply | Kanban: Coordinator/Admin |
| /news | news/index.tsx | No | None |
| /news/:id | news/detail.tsx | No | None |
| /leaderboard | leaderboard.tsx | No | None |
| /profile | profile.tsx | Yes | Self only |
| /certificates | certificates.tsx | Yes | Self only |
| /certificates/verify/:code | certificate-verify.tsx | No (public) | None |
| /notifications | notifications.tsx | Yes | Self only |
| /search | search.tsx | No | None |

## 2. User Roles

Four roles: student, faculty, coordinator, admin.
Signup allows student/faculty/coordinator self-selection. Admin is never self-assignable.

## 3. Forms and Fields

### Login
- email (required, valid email)
- password (required)

### Signup
- name (required, min 2 chars)
- email (required, valid email)
- password (required, min 6 chars)
- role (enum: student/faculty/coordinator)
- department (optional)

### Profile Edit
- name (editable)
- bio (editable)
- department (editable)
- email (read-only)
- role (read-only)

### Event Registration
- No inline form fields -- single-click action
- Payload type: eventId, participantName, participantEmail, department, year, rollNumber

### Recruitment Application
- coverLetter (required textarea)
- portfolioUrl (optional)
- recruitmentId from card selection
- Full type also has: applicantName, applicantEmail, department, year, statementOfPurpose, answers (JSONB)

### Certificate Verification
- Code from URL param only -- no form

### Notifications Mark All Read
- POST with no body

## 4. Mock Data Inventory

All data from handleMockFallback() in src/api/client.ts:

| Endpoint | Source |
|---|---|
| /api/auth/me | Inline hardcoded user by role |
| /api/events | UPCOMING_EVENTS_DATA (9+ events) |
| /api/clubs | FEATURED_CLUBS_DATA (9 clubs) |
| /api/news | LATEST_NEWS_DATA |
| /api/dashboard/student | Inline object |
| /api/dashboard/admin | Inline object |
| /api/notifications | Inline array (3 items) |
| /api/certificates | Inline array (2 items, code prefix CERT-C360-) |
| /api/leaderboard | Inline array (5 entries) |
| /api/recruitments | Inline array (2 items) |

## 5. Feature-to-Table Mapping

| Feature | Tables | Operations |
|---|---|---|
| Signup/Login | profiles + auth.users | INSERT on signup |
| Profile view/edit | profiles | SELECT own, UPDATE own |
| Events listing | events | SELECT with filters |
| Event detail | events | SELECT by id |
| Event registration | event_registrations | INSERT unique(user+event), DELETE cancel |
| Clubs listing | clubs | SELECT |
| Club detail | clubs, club_members | SELECT |
| Join/leave club | club_members | INSERT/DELETE |
| Recruitments | recruitments | SELECT filter by status |
| Apply to recruitment | recruitment_applications | INSERT |
| Recruitment Kanban | recruitment_applications | SELECT for club, UPDATE stage |
| News | news_articles | SELECT |
| Leaderboard | profiles ordered by points | SELECT |
| My certificates | certificates | SELECT by user_id |
| Certificate verify | certificates | SELECT by verification_code (public) |
| Notifications | notifications | SELECT own, UPDATE read_status |
| Student dashboard | profiles, event_registrations, club_members, certificates | Aggregates |
| Admin dashboard | profiles, events, clubs | COUNT aggregates |
| Search | events, clubs, news_articles | ILIKE |
| Campus Map | venues | SELECT (static seed) |
| Calendar | events | SELECT with date range |

## 6. Storage Buckets Required

| Bucket | Access | Purpose |
|---|---|---|
| event-banners | Public | Event banner/poster images |
| club-assets | Public | Club logos and banners |
| news-images | Public | News article images |
| avatars | Public user-scoped | Profile avatars |
| certificates | Private owner-read | Certificate PDF downloads |

## 7. Assumptions

A1: admin role assigned manually, never via self-signup
A2: Each user registers for same event only once (UNIQUE user+event)
A3: Club membership roles (Lead/Member/Advisor) in club_members.role
A4: Certificates issued by admins/coordinators, not users
A5: Points on profiles.points (manual or trigger)
A6: Notifications inserted server-side
A7: Venue data is static seed data
A8: Event schedule/coordinators/prizes stored as JSONB
A9: Recruitment formFields as JSONB
A10: Application answers as JSONB

## 8. Open Questions

Q1: Should students see recruitments they already applied to (even if closed)?
Q2: Should event registration generate a QR pass via DB trigger or frontend?
Q3: Should notifications auto-insert via DB triggers on registration/application?
Q4: Is there a separate QR attendance/check-in table distinct from registrations?
Q5: Should club join require coordinator approval or be instant?
