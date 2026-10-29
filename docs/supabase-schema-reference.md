# Campus-360: Supabase Schema Reference

This document provides the complete schema reference for the Campus-360 Supabase PostgreSQL backend, matching the initial migration file `supabase/migrations/001_campus360_initial_schema.sql`.

---

## Architecture Overview

Campus-360 uses Supabase for:
1. **Authentication:** Supabase Auth (`auth.users`) with email/password and custom metadata (`name`, `role`, `department`).
2. **Database:** PostgreSQL with Row Level Security (RLS) enabled on all public tables.
3. **Database Triggers:** Automated profile creation, timestamp updates, registration counter synchronization, and user attendance tracking.
4. **Storage (optional/future):** Buckets for event banners, club logos, certificates, and resumes.

---

## 1. Custom Types & Enums

### `user_role`
- Values: `'student'`, `'faculty'`, `'coordinator'`, `'admin'`
- Default: `'student'`
- Description: Determines access rights and views across the platform.

### `event_status`
- Values: `'upcoming'`, `'live'`, `'completed'`, `'cancelled'`, `'postponed'`
- Default: `'upcoming'`

### `event_category`
- Values: `'Academic'`, `'Technical'`, `'Cultural'`, `'Sports'`, `'Club'`, `'Workshop'`, `'Hackathon'`, `'Seminar'`, `'General'`
- Default: `'General'`

### `club_category`
- Values: `'Technical'`, `'Cultural'`, `'Sports'`, `'Literary'`, `'Social'`, `'Entrepreneurship'`, `'General'`
- Default: `'General'`

### `recruitment_status`
- Values: `'open'`, `'closing_soon'`, `'closed'`
- Default: `'open'`

### `application_stage`
- Values: `'applied'`, `'under_review'`, `'shortlisted'`, `'interview'`, `'accepted'`, `'rejected'`
- Default: `'applied'`

### `notification_type`
- Values: `'event'`, `'club'`, `'announcement'`, `'system'`, `'reminder'`, `'event_reminder'`, `'points_awarded'`, `'recruitment'`
- Default: `'system'`

### `certificate_status`
- Values: `'valid'`, `'revoked'`, `'pending'`
- Default: `'valid'`

### `venue_category`
- Values: `'Academic'`, `'Sports'`, `'Canteen'`, `'Hostel'`, `'Workshop'`, `'Administration'`, `'Other'`
- Default: `'Academic'`

---

## 2. Table Specifications

### 2.1 `profiles`
Extends `auth.users` with student/faculty/coordinator application details, gamification points, and stats.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `uuid` | PK, FK -> `auth.users(id)` ON DELETE CASCADE | Matches auth user ID |
| `name` | `text` | NOT NULL | Full name of the user |
| `email` | `text` | NOT NULL, UNIQUE | User email address |
| `role` | `user_role` | NOT NULL, DEFAULT `'student'` | System role |
| `department` | `text` | NULL | Department (e.g. "Computer Engineering") |
| `year` | `text` | NULL | Academic year (e.g. "FE", "SE", "TE", "BE") |
| `prn` | `text` | NULL | Permanent Registration Number |
| `roll_number` | `text` | NULL | College roll number |
| `bio` | `text` | NULL | Personal bio / about |
| `avatar_url` | `text` | NULL | Link to profile avatar |
| `points` | `integer` | NOT NULL, DEFAULT 0, CHECK >= 0 | Gamification points for leaderboard |
| `badges_count` | `integer` | NOT NULL, DEFAULT 0, CHECK >= 0 | Total badges earned |
| `events_attended` | `integer` | NOT NULL, DEFAULT 0, CHECK >= 0 | Auto-synced count of attended events |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Record creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**Triggers & Functions:**
- `trg_profiles_updated_at`: Updates `updated_at` on row modification.
- `trg_on_auth_user_created`: Automatically inserts a record into `profiles` whenever a user signs up in `auth.users`.

---

### 2.2 `venues`
Campus venues displayed on the interactive campus map (`/map`).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigint` | PK, GENERATED ALWAYS AS IDENTITY | Primary identifier |
| `name` | `text` | NOT NULL | Venue name (e.g. "Main Seminar Hall") |
| `code` | `text` | NOT NULL, UNIQUE | Short code (e.g. "MSH-01") |
| `building` | `text` | NOT NULL | Building name |
| `floor` | `text` | NULL | Floor level |
| `capacity` | `integer` | NULL, CHECK > 0 | Seating capacity |
| `category` | `venue_category` | NOT NULL, DEFAULT `'Academic'` | Type of facility |
| `facilities` | `text[]` | NOT NULL, DEFAULT `'{}'` | Amenities list (e.g. `['Projector', 'AC']`) |
| `coord_x` | `numeric` | NULL | Map X coordinate |
| `coord_y` | `numeric` | NULL | Map Y coordinate |
| `description` | `text` | NULL | Brief description |
| `image_url` | `text` | NULL | Optional venue photo URL |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

---

### 2.3 `clubs`
Campus clubs and student organizations (`/clubs`).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigint` | PK, GENERATED ALWAYS AS IDENTITY | Club identifier |
| `name` | `text` | NOT NULL | Official club name |
| `slug` | `text` | NOT NULL, UNIQUE | URL-safe slug |
| `category` | `club_category` | NOT NULL, DEFAULT `'General'` | Category |
| `tagline` | `text` | NOT NULL | Short slogan/tagline |
| `description` | `text` | NULL | Full description and mission |
| `logo_url` | `text` | NULL | Club emblem/avatar |
| `banner_url` | `text` | NULL | Header cover banner |
| `member_count` | `integer` | NOT NULL, DEFAULT 0, CHECK >= 0 | Display member count |
| `established_year` | `integer` | NULL | Year founded |
| `faculty_advisor` | `text` | NULL | Faculty mentor name |
| `social_links` | `jsonb` | NULL | JSON `{ instagram, linkedin, github, website }` |
| `tags` | `text[]` | NOT NULL, DEFAULT `'{}'` | Keyword tags |
| `is_active` | `boolean` | NOT NULL, DEFAULT `true` | Visibility flag |
| `created_by` | `uuid` | NULL, FK -> `profiles(id)` | Creator profile |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

---

### 2.4 `club_members`
Junction table tracking club memberships and leadership roles.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigint` | PK, GENERATED ALWAYS AS IDENTITY | Primary identifier |
| `club_id` | `bigint` | NOT NULL, FK -> `clubs(id)` ON DELETE CASCADE | Club reference |
| `user_id` | `uuid` | NOT NULL, FK -> `profiles(id)` ON DELETE CASCADE | User reference |
| `role` | `text` | NOT NULL, DEFAULT `'member'` | `'lead'`, `'member'`, `'advisor'` |
| `joined_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Join timestamp |

- **Unique Constraint:** `(club_id, user_id)` prevents duplicate memberships.

---

### 2.5 `events`
Campus events, workshops, hackathons, and seminars (`/events`).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigint` | PK, GENERATED ALWAYS AS IDENTITY | Event identifier |
| `title` | `text` | NOT NULL | Event title |
| `tagline` | `text` | NULL | Short highlight |
| `description` | `text` | NULL | Markdown/text details |
| `category` | `event_category` | NOT NULL, DEFAULT `'General'` | Category |
| `status` | `event_status` | NOT NULL, DEFAULT `'upcoming'` | Status |
| `start_datetime` | `timestamptz` | NOT NULL | Start timestamp with timezone |
| `end_datetime` | `timestamptz` | NULL | End timestamp |
| `registration_deadline`| `timestamptz` | NULL | Cut-off for registrations |
| `venue_id` | `bigint` | NULL, FK -> `venues(id)` ON DELETE SET NULL | Physical venue reference |
| `venue_name` | `text` | NULL | Denormalized venue name for fast display |
| `organizer_name` | `text` | NOT NULL | Organizing body or club name |
| `organizer_club_id` | `bigint` | NULL, FK -> `clubs(id)` ON DELETE SET NULL | Linked club |
| `capacity` | `integer` | NULL, CHECK > 0 | Maximum participants |
| `registered_count` | `integer` | NOT NULL, DEFAULT 0, CHECK >= 0 | Current registrations count |
| `banner_url` | `text` | NULL | Event banner image |
| `poster_url` | `text` | NULL | Promotional poster |
| `tags` | `text[]` | NOT NULL, DEFAULT `'{}'` | Search tags |
| `schedule` | `jsonb` | NULL | Array of `[{ time, title }]` items |
| `coordinators` | `jsonb` | NULL | Array of `[{ name, contact, role }]` |
| `prizes` | `jsonb` | NULL | Array of `[{ position, reward }]` |
| `is_featured` | `boolean` | NOT NULL, DEFAULT `false` | Highlighted on landing page |
| `created_by` | `uuid` | NULL, FK -> `profiles(id)` | Event creator |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

---

### 2.6 `event_registrations`
User sign-ups and ticket attendance tracking.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigint` | PK, GENERATED ALWAYS AS IDENTITY | Registration ID |
| `event_id` | `bigint` | NOT NULL, FK -> `events(id)` ON DELETE CASCADE | Target event |
| `user_id` | `uuid` | NOT NULL, FK -> `profiles(id)` ON DELETE CASCADE | Registered user |
| `participant_name` | `text` | NULL | Participant name snapshot |
| `participant_email`| `text` | NULL | Participant email snapshot |
| `department` | `text` | NULL | Department snapshot |
| `year` | `text` | NULL | Year snapshot |
| `roll_number` | `text` | NULL | Roll number snapshot |
| `status` | `text` | NOT NULL, DEFAULT `'registered'` | `'registered'`, `'confirmed'`, `'attended'`, `'cancelled'` |
| `qr_code` | `text` | NULL, UNIQUE | Verification token for attendance scanning |
| `registered_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Registration timestamp |

- **Unique Constraint:** `(event_id, user_id)` ensures a user cannot register twice for the same event.
- **Triggers:**
  - `trg_event_reg_count`: Automatically updates `events.registered_count` on INSERT, UPDATE (status changes), and DELETE.
  - `trg_profile_events_attended`: Increments `profiles.events_attended` when status changes to `'attended'`.

---

### 2.7 `news_articles`
Campus news and announcements feed (`/news`).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigint` | PK, GENERATED ALWAYS AS IDENTITY | Article ID |
| `title` | `text` | NOT NULL | Article headline |
| `summary` | `text` | NULL | Excerpt/summary |
| `content` | `text` | NULL | Full article body |
| `category` | `text` | NULL | News category (e.g. "Academic", "Sports") |
| `author` | `text` | NULL | Author display name |
| `author_role` | `text` | NULL | Role title of the author |
| `published_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Publication date |
| `image_url` | `text` | NULL | Featured header image |
| `read_time` | `text` | NULL | Estimated reading duration (e.g. "3 min read") |
| `is_important` | `boolean` | NOT NULL, DEFAULT `false` | Urgent/pinned notice |
| `tags` | `text[]` | NOT NULL, DEFAULT `'{}'` | Search tags |
| `is_published` | `boolean` | NOT NULL, DEFAULT `true` | Public visibility flag |
| `created_by` | `uuid` | NULL, FK -> `profiles(id)` | Author profile |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

---

### 2.8 `recruitments`
Club recruitment drives (`/recruitments`).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigint` | PK, GENERATED ALWAYS AS IDENTITY | Recruitment drive ID |
| `club_id` | `bigint` | NOT NULL, FK -> `clubs(id)` ON DELETE CASCADE | Host club |
| `role_title` | `text` | NOT NULL | Open role (e.g. "Frontend Developer", "Event Lead") |
| `department` | `text` | NULL | Target department/team |
| `description` | `text` | NOT NULL | Responsibilities and role overview |
| `requirements` | `text[]` | NOT NULL, DEFAULT `'{}'` | Prerequisites and required skills |
| `deadline` | `date` | NOT NULL | Closing date |
| `positions_count` | `integer` | NULL, CHECK > 0 | Number of openings |
| `status` | `recruitment_status` | NOT NULL, DEFAULT `'open'` | `'open'`, `'closing_soon'`, `'closed'` |
| `form_fields` | `jsonb` | NULL | Custom questions schema |
| `is_active` | `boolean` | NOT NULL, DEFAULT `true` | Active listing status |
| `created_by` | `uuid` | NULL, FK -> `profiles(id)` | Coordinator who created the listing |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

---

### 2.9 `recruitment_applications`
Student submissions for club recruitment listings.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigint` | PK, GENERATED ALWAYS AS IDENTITY | Application ID |
| `recruitment_id` | `bigint` | NOT NULL, FK -> `recruitments(id)` ON DELETE CASCADE | Target listing |
| `applicant_id` | `uuid` | NOT NULL, FK -> `profiles(id)` ON DELETE CASCADE | Applicant profile |
| `applicant_name` | `text` | NOT NULL | Applicant full name |
| `applicant_email` | `text` | NOT NULL | Applicant contact email |
| `department` | `text` | NULL | Applicant department |
| `year` | `text` | NULL | Academic year |
| `cover_letter` | `text` | NULL | Cover letter / intro message |
| `portfolio_url` | `text` | NULL | Portfolio / GitHub / LinkedIn link |
| `statement_of_purpose` | `text` | NULL | Why they want to join |
| `answers` | `jsonb` | NULL | Answers to custom recruitment form fields |
| `stage` | `application_stage` | NOT NULL, DEFAULT `'applied'` | Kanban stage (`applied`, `under_review`, `shortlisted`, `interview`, `accepted`, `rejected`) |
| `applied_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Application submission timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

- **Unique Constraint:** `(recruitment_id, applicant_id)` prevents multiple submissions per user per listing.

---

### 2.10 `certificates`
Participation, achievement, and completion certificates (`/certificates` and `/certificates/verify/:code`).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigint` | PK, GENERATED ALWAYS AS IDENTITY | Certificate ID |
| `user_id` | `uuid` | NOT NULL, FK -> `profiles(id)` ON DELETE CASCADE | Recipient |
| `title` | `text` | NOT NULL | Certificate title (e.g. "First Prize - Hackathon 2026") |
| `event_name` | `text` | NOT NULL | Name of related event |
| `event_id` | `bigint` | NULL, FK -> `events(id)` ON DELETE SET NULL | Event link |
| `issuer` | `text` | NOT NULL | Issuing organization or authority |
| `verification_code` | `text` | NOT NULL, UNIQUE | Public verification string (e.g. "CAMPUS-2026-X9A2") |
| `category` | `text` | NULL | Type (Participation, Winner, Merit) |
| `description` | `text` | NULL | Description of achievement |
| `status` | `certificate_status` | NOT NULL, DEFAULT `'valid'` | `'valid'`, `'revoked'`, `'pending'` |
| `download_url` | `text` | NULL | PDF / image download link |
| `issued_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Issuance date |
| `issued_by` | `uuid` | NULL, FK -> `profiles(id)` | Admin or coordinator issuer |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Auto-updated via trigger |

**RPC Functions:**
- `verify_certificate(cert_code text)`: Securely returns verification status and certificate metadata for public certificate verification without exposing raw profiles data to anonymous users.

---

### 2.11 `notifications`
In-app notification bell notifications (`/notifications`).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `bigint` | PK, GENERATED ALWAYS AS IDENTITY | Notification ID |
| `user_id` | `uuid` | NOT NULL, FK -> `profiles(id)` ON DELETE CASCADE | Target recipient |
| `title` | `text` | NOT NULL | Notification title |
| `body` | `text` | NOT NULL | Message body |
| `type` | `notification_type` | NOT NULL, DEFAULT `'system'` | Category |
| `action_url` | `text` | NULL | Deep-link to event, club, or application |
| `read_status` | `boolean` | NOT NULL, DEFAULT `false` | Unread indicator |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Triggered timestamp |

**RPC Functions:**
- `mark_all_notifications_read()`: Marks all unread notifications for `auth.uid()` as read in a single transactional query. Granted explicitly to `authenticated` users.

---

## 3. Row Level Security (RLS) Summary

Every table has RLS enabled. The security matrix is structured as follows:

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | Authenticated users (for leaderboard/directory) | Trigger (`handle_new_user`), Self (`profiles_insert_own`), or Admin | Self (`trg_prevent_profile_role_change` blocks role elevation) or Admin | Admin |
| `venues` | Public (anon & auth) | Admin | Admin | Admin |
| `clubs` | Public (anon & auth) | Admin | Admin | Admin |
| `club_members` | Authenticated users | Self (`role = 'member'`) or Admin | Admin | Self (leave club) or Admin |
| `events` | Public (anon & auth) | Admin | Admin | Admin |
| `event_registrations` | Self or Admin | Authenticated user (`user_id = auth.uid()`) | Self (cancel only) or Admin | Admin |
| `news_articles` | Public (`is_published = true`) | Admin | Admin | Admin |
| `recruitments` | Public (`is_active = true`) | Club Coordinator or Admin | Club Coordinator or Admin | Club Coordinator or Admin |
| `recruitment_applications` | Applicant, Club Coordinator, or Admin | Authenticated user (`applicant_id = auth.uid()`) | Club Coordinator (stage change) or Admin | Admin |
| `certificates` | Recipient (own only) or Admin | Admin | Admin | Admin |
| `notifications` | Self (`user_id = auth.uid()`) | Admin (or DB Triggers) | Self (`read_status` toggle) or Admin | Admin |
