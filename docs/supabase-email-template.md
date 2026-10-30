# Supabase Auth Custom Email & Admin Setup Guide
**Project:** Campus 360 (NKOCET)

---

## 1. How to Fix the Admin Role Update Error in Supabase

In the Supabase SQL Editor, running `UPDATE public.profiles SET role = 'admin' ...` can trigger `prevent_profile_role_change()`. 

Run the following SQL snippet in your **Supabase Dashboard > SQL Editor**:

```sql
-- Step 1: Temporarily disable the role trigger
ALTER TABLE public.profiles DISABLE TRIGGER trg_prevent_profile_role_change;

-- Step 2: Elevate your account to Super Admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'sufiyannnn7@gmail.com';

-- Step 3: Upgrade the trigger function to allow SQL editor & postgres superuser runs
CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL 
     OR current_user IN ('postgres', 'service_role', 'dashboard_user', 'supabase_admin')
     OR session_user IN ('postgres', 'service_role', 'dashboard_user', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can modify user roles';
  END IF;
  RETURN NEW;
END;
$$;

-- Step 4: Re-enable the trigger
ALTER TABLE public.profiles ENABLE TRIGGER trg_prevent_profile_role_change;

-- Verify
SELECT id, name, email, role, department FROM public.profiles WHERE email = 'sufiyannnn7@gmail.com';
```

---

## 2. How to Apply the Custom Campus 360 Signup Email Template

1. Open your **Supabase Project Dashboard**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. In the left navigation, click **Authentication** (the user icon with a lock).
3. Under **Configuration**, select **Email Templates**.
4. Click on the **"Confirm signup"** tab.
5. Set the **Subject line**:
   ```
   Welcome to Campus 360 | Confirm your student/faculty account
   ```
6. Replace the entire **Message body** with the HTML code from:
   [`supabase/email-templates/confirm-signup.html`](file:///d:/sufiyan%20projects/Campus-360-main-final-boss/supabase/email-templates/confirm-signup.html)
7. Click **Save Changes** at the bottom.

---

---

## 3. How to Apply the Custom Campus 360 Reset Password Email Template

1. Open your **Supabase Project Dashboard**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. In the left navigation, click **Authentication** > **Email Templates**.
3. Click on the **"Reset Password"** tab.
4. Set the **Subject line**:
   ```
   Reset Your Campus 360 Password | NKOCET
   ```
5. Replace the entire **Message body** with the HTML code from:
   [`supabase/email-templates/reset-password.html`](file:///d:/sufiyan%20projects/Campus-360-main-final-boss/supabase/email-templates/reset-password.html)
6. Click **Save Changes**.

---

## 4. Set Redirect URLs (For Password Recovery & Email Confirmation)

1. In Supabase Dashboard, navigate to **Authentication** > **URL Configuration**.
2. Set **Site URL** to:
   ```
   https://campus360nkocet.onrender.com
   ```
3. Under **Redirect URLs**, make sure the following entries are added:
   - `https://campus360nkocet.onrender.com/**`
   - `https://campus360nkocet.onrender.com/reset-password`
   - `https://campus360nkocet.onrender.com/login`
   - `http://localhost:5180/**`
   - `http://localhost:5180/reset-password`
   - `http://localhost:5180/login`
4. Click **Save**.

---

## 5. Prevent Email Sending Rate Limit Errors (Supabase Built-in SMTP)

The Supabase default email service is restricted to **3-4 emails per hour** globally. When testing signups or password resets repeatedly, Supabase returns error `429: over_email_send_rate_limit` ("Email rate limit exceeded").

### To enable unlimited, reliable delivery via Custom SMTP:
1. In Supabase Dashboard, go to **Project Settings** > **Authentication**.
2. Scroll to **SMTP Settings** and toggle **Enable Custom SMTP**.
3. Enter your SMTP provider credentials:
   - **Sender email**: e.g., `noreply@nkocet.org` or your verified Gmail / Resend / SendGrid / Brevo address
   - **Sender name**: `Campus 360 - NKOCET`
   - **Host**: e.g., `smtp.resend.com` (port 465 or 587) or `smtp.gmail.com`
   - **User**: your SMTP username / API key
   - **Password**: your SMTP password / API token
4. Click **Save Changes**.

---

## 6. Fix Render HTTP 404 on Direct Page Refresh (SPA Fallback Rewrite)

When hosting a Single Page Application (React + Vite) on Render Static Sites, direct navigation to subpaths like `/coordinator`, `/login`, or `/reset-password` returns `404 Not Found` unless a fallback rewrite is configured.

### In Render Dashboard:
1. Go to your Static Site service (`campus360nkocet`) on [dashboard.render.com](https://dashboard.render.com).
2. Click **Redirects/Rewrites** in the sidebar.
3. Click **Add Rule**:
   - **Type**: `Rewrite` (NOT Redirect)
   - **Source**: `/*`
   - **Destination**: `/index.html`
4. Click **Save Changes**. All browser refreshes and direct links will now correctly load the SPA!
