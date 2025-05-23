-- SQL to create user profile table in Supabase
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL -- Note: Storing password here is not recommended; authentication handled by Supabase auth
);
