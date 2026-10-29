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

## 3. Set Redirect URLs (So Users Land on Login After Clicking)

1. In Supabase Dashboard, navigate to **Authentication** > **URL Configuration**.
2. Set **Site URL** to:
   - For local development: `http://localhost:5180` (or `http://localhost:5173`)
   - For production: Your deployed web domain (e.g. `https://campus360.nkocet.ac.in`)
3. Under **Redirect URLs**, add:
   - `http://localhost:5180/**`
   - `http://localhost:5180/login?confirmed=true`
   - `http://localhost:5173/**`
   - Your production URL with `/**`
4. Click **Save**.
