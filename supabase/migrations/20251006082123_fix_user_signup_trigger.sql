/*
  # Fix User Signup Trigger and Add Username Validation
  
  1. Changes
    - Drop and recreate the trigger function with better error handling
    - Add function to check username availability before signup
    - Ensure trigger handles duplicate usernames gracefully
  
  2. Security
    - Maintains RLS policies
    - Prevents duplicate usernames
*/

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  username_to_use text;
  avatar_to_use text;
  username_exists boolean;
BEGIN
  username_to_use := COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  avatar_to_use := COALESCE(new.raw_user_meta_data->>'avatar', 'default');
  
  SELECT EXISTS(
    SELECT 1 FROM public.profiles WHERE username = username_to_use
  ) INTO username_exists;
  
  IF username_exists THEN
    username_to_use := split_part(new.email, '@', 1) || '_' || substring(new.id::text from 1 for 8);
  END IF;
  
  INSERT INTO public.profiles (id, username, avatar)
  VALUES (new.id, username_to_use, avatar_to_use)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.is_username_available(username_check text)
RETURNS boolean AS $$
BEGIN
  RETURN NOT EXISTS(
    SELECT 1 FROM public.profiles WHERE username = username_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.is_username_available(text) TO anon, authenticated;
