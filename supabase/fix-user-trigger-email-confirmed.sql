-- Fix User Registration Trigger - Only Create User After Email Confirmation
-- Run this in your Supabase SQL Editor to fix the user registration issue

-- Drop the existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS handle_email_confirmed();

-- Create a function to handle email confirmation
CREATE OR REPLACE FUNCTION handle_email_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create user record if email is confirmed and wasn't confirmed before
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    INSERT INTO users (id, name, email, address, created_at, updated_at)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'address', ''),
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = COALESCE(NEW.raw_user_meta_data->>'name', users.name),
      email = NEW.email,
      address = COALESCE(NEW.raw_user_meta_data->>'address', users.address),
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth user update
    RAISE WARNING 'Failed to create user record after email confirmation: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger for email confirmation
CREATE TRIGGER on_auth_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_email_confirmed();

-- Test the function (optional)
SELECT 'Email confirmation trigger created successfully!' as status;



