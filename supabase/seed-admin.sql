-- =====================================================
-- Admin User Setup Script
-- Run this in Supabase SQL Editor to create an admin user
-- =====================================================

-- Option 1: If you already have a user created in Supabase Auth,
-- you need to find their user_id and insert them into admin_users

-- First, let's check if there are any users in auth.users
SELECT id, email, created_at FROM auth.users LIMIT 5;

-- Option 2: Insert a demo admin user (replace 'USER_ID_FROM_AUTH' with actual user id)
-- INSERT INTO public.admin_users (user_id, email, role) 
-- VALUES ('USER_ID_FROM_AUTH', 'admin@loufa.sn', 'admin');

-- Option 3: Create a test user and admin (run this after creating user in Authentication tab)
-- Replace the user_id with the actual user id from auth.users

-- =====================================================
-- To create an admin user:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" to create a new user with email/password
-- 3. Copy the user ID (UUID)
-- 4. Run: 
--    INSERT INTO public.admin_users (user_id, email, role) 
--    VALUES ('YOUR_USER_UUID', 'admin@yourdomain.com', 'admin');
-- =====================================================

-- For testing, let's allow all authenticated users to access admin temporarily
-- (Remove this after setting up proper admin)

-- Grant permission to check admin_users table
GRANT SELECT ON public.admin_users TO anon, authenticated;
GRANT INSERT ON public.admin_users TO authenticated;
