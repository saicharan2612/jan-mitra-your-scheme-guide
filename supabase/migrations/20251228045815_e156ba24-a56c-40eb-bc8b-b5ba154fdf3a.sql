-- Create user_profiles table for storing user profile data with RLS
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  father_name TEXT,
  father_occupation TEXT,
  guardian_name TEXT,
  guardian_relation TEXT,
  mother_name TEXT,
  mother_occupation TEXT,
  family_income TEXT,
  state TEXT,
  district TEXT,
  category TEXT,
  gender TEXT,
  date_of_birth DATE,
  mobile TEXT,
  qualification TEXT,
  is_married TEXT,
  occupation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access - users can only access their own profile
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
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
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    NEW.raw_user_meta_data ->> 'fatherName',
    NEW.raw_user_meta_data ->> 'fatherOccupation',
    NEW.raw_user_meta_data ->> 'motherName',
    NEW.raw_user_meta_data ->> 'motherOccupation',
    NEW.raw_user_meta_data ->> 'familyIncome',
    NEW.raw_user_meta_data ->> 'state',
    NEW.raw_user_meta_data ->> 'district',
    NEW.raw_user_meta_data ->> 'category',
    NEW.raw_user_meta_data ->> 'gender',
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'dateOfBirth' IS NOT NULL 
      AND NEW.raw_user_meta_data ->> 'dateOfBirth' != ''
      THEN (NEW.raw_user_meta_data ->> 'dateOfBirth')::DATE
      ELSE NULL
    END,
    NEW.raw_user_meta_data ->> 'mobile'
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Create user_bookmarks table for storing bookmarked schemes
CREATE TABLE public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheme_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, scheme_id)
);

-- Enable RLS on bookmarks
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" 
ON public.user_bookmarks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" 
ON public.user_bookmarks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
ON public.user_bookmarks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create user_scheme_applications table for tracking scheme application status
CREATE TABLE public.user_scheme_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheme_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not-applied' CHECK (status IN ('not-applied', 'in-progress', 'applied')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, scheme_id)
);

-- Enable RLS on scheme applications
ALTER TABLE public.user_scheme_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for scheme applications
CREATE POLICY "Users can view their own applications" 
ON public.user_scheme_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications" 
ON public.user_scheme_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.user_scheme_applications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates on scheme applications
CREATE TRIGGER update_user_scheme_applications_updated_at
BEFORE UPDATE ON public.user_scheme_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();