-- Drop and recreate the handle_new_user function with input validation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved handle_new_user function with input validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_name TEXT;
  v_email TEXT;
  v_father_name TEXT;
  v_father_occupation TEXT;
  v_mother_name TEXT;
  v_mother_occupation TEXT;
  v_family_income TEXT;
  v_state TEXT;
  v_district TEXT;
  v_category TEXT;
  v_gender TEXT;
  v_date_of_birth DATE;
  v_mobile TEXT;
BEGIN
  -- Sanitize and validate email (required)
  v_email := COALESCE(LEFT(TRIM(NEW.email), 255), '');
  
  -- Sanitize and limit text fields to prevent oversized inputs
  -- Remove control characters and limit lengths
  v_name := LEFT(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'name', ''), E'[\\x00-\\x1F\\x7F]', '', 'g'), 100);
  v_father_name := LEFT(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'fatherName', ''), E'[\\x00-\\x1F\\x7F]', '', 'g'), 100);
  v_father_occupation := LEFT(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'fatherOccupation', ''), E'[\\x00-\\x1F\\x7F]', '', 'g'), 100);
  v_mother_name := LEFT(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'motherName', ''), E'[\\x00-\\x1F\\x7F]', '', 'g'), 100);
  v_mother_occupation := LEFT(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'motherOccupation', ''), E'[\\x00-\\x1F\\x7F]', '', 'g'), 100);
  v_family_income := LEFT(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'familyIncome', ''), E'[\\x00-\\x1F\\x7F]', '', 'g'), 50);
  v_state := LEFT(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'state', ''), E'[\\x00-\\x1F\\x7F]', '', 'g'), 50);
  v_district := LEFT(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'district', ''), E'[\\x00-\\x1F\\x7F]', '', 'g'), 100);
  v_category := LEFT(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'category', ''), E'[\\x00-\\x1F\\x7F]', '', 'g'), 20);
  v_gender := LEFT(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'gender', ''), E'[\\x00-\\x1F\\x7F]', '', 'g'), 20);
  v_mobile := LEFT(REGEXP_REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'mobile', ''), E'[^0-9+\\- ]', '', 'g'), 20);
  
  -- Parse and validate date of birth
  BEGIN
    IF NEW.raw_user_meta_data ->> 'dateOfBirth' IS NOT NULL 
       AND NEW.raw_user_meta_data ->> 'dateOfBirth' != ''
       AND LENGTH(NEW.raw_user_meta_data ->> 'dateOfBirth') <= 10
    THEN
      v_date_of_birth := (NEW.raw_user_meta_data ->> 'dateOfBirth')::DATE;
      -- Validate reasonable date range (between 1900 and current date)
      IF v_date_of_birth < '1900-01-01'::DATE OR v_date_of_birth > CURRENT_DATE THEN
        v_date_of_birth := NULL;
      END IF;
    ELSE
      v_date_of_birth := NULL;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_date_of_birth := NULL;
  END;

  -- Insert the validated and sanitized data
  INSERT INTO public.user_profiles (
    id,
    email,
    name,
    father_name,
    father_occupation,
    mother_name,
    mother_occupation,
    family_income,
    state,
    district,
    category,
    gender,
    date_of_birth,
    mobile
  )
  VALUES (
    NEW.id,
    v_email,
    v_name,
    v_father_name,
    v_father_occupation,
    v_mother_name,
    v_mother_occupation,
    v_family_income,
    v_state,
    v_district,
    v_category,
    v_gender,
    v_date_of_birth,
    v_mobile
  );
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();