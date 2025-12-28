import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language, TranslationKey } from "@/data/translations";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface UserProfile {
  email: string;
  name: string;
  fatherName: string;
  fatherOccupation: string;
  guardianName?: string;
  guardianRelation?: string;
  motherName: string;
  motherOccupation: string;
  familyIncome: string;
  state: string;
  district: string;
  category: string;
  gender: string;
  dateOfBirth: string;
  mobile: string;
  qualification?: string;
  isMarried?: string;
  occupation?: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  supabaseUser: User | null;
  session: Session | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (profile: UserProfile, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  t: (key: TranslationKey) => string;
  bookmarkedSchemes: string[];
  toggleBookmark: (schemeId: string) => Promise<void>;
  appliedSchemes: Record<string, "not-applied" | "in-progress" | "applied">;
  updateSchemeStatus: (schemeId: string, status: "not-applied" | "in-progress" | "applied") => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper function to convert database row to UserProfile
const dbRowToUserProfile = (row: any): UserProfile => ({
  email: row.email || '',
  name: row.name || '',
  fatherName: row.father_name || '',
  fatherOccupation: row.father_occupation || '',
  guardianName: row.guardian_name || undefined,
  guardianRelation: row.guardian_relation || undefined,
  motherName: row.mother_name || '',
  motherOccupation: row.mother_occupation || '',
  familyIncome: row.family_income || '',
  state: row.state || '',
  district: row.district || '',
  category: row.category || '',
  gender: row.gender || '',
  dateOfBirth: row.date_of_birth || '',
  mobile: row.mobile || '',
  qualification: row.qualification || undefined,
  isMarried: row.is_married || undefined,
  occupation: row.occupation || undefined,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState<string[]>([]);
  const [appliedSchemes, setAppliedSchemes] = useState<Record<string, "not-applied" | "in-progress" | "applied">>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile from database
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return null;
      }

      return data ? dbRowToUserProfile(data) : null;
    } catch (err) {
      console.error('Error loading user profile:', err);
      return null;
    }
  };

  // Load user bookmarks from database
  const loadBookmarks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('scheme_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading bookmarks:', error);
        return [];
      }

      return data ? data.map(b => b.scheme_id) : [];
    } catch (err) {
      console.error('Error loading bookmarks:', err);
      return [];
    }
  };

  // Load user scheme applications from database
  const loadSchemeApplications = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_scheme_applications')
        .select('scheme_id, status')
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading scheme applications:', error);
        return {};
      }

      const applications: Record<string, "not-applied" | "in-progress" | "applied"> = {};
      if (data) {
        data.forEach(app => {
          applications[app.scheme_id] = app.status as "not-applied" | "in-progress" | "applied";
        });
      }
      return applications;
    } catch (err) {
      console.error('Error loading scheme applications:', err);
      return {};
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setSupabaseUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession?.user);
        
        if (currentSession?.user) {
          // Load profile from database using setTimeout to avoid auth deadlock
          setTimeout(async () => {
            const profile = await loadUserProfile(currentSession.user.id);
            if (profile) {
              setUser(profile);
            }
            
            // Load bookmarks and applications
            const bookmarks = await loadBookmarks(currentSession.user.id);
            setBookmarkedSchemes(bookmarks);
            
            const applications = await loadSchemeApplications(currentSession.user.id);
            setAppliedSchemes(applications);
          }, 0);
        } else {
          setUser(null);
          setBookmarkedSchemes([]);
          setAppliedSchemes({});
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setSupabaseUser(existingSession?.user ?? null);
      setIsAuthenticated(!!existingSession?.user);
      
      if (existingSession?.user) {
        const profile = await loadUserProfile(existingSession.user.id);
        if (profile) {
          setUser(profile);
        }
        
        const bookmarks = await loadBookmarks(existingSession.user.id);
        setBookmarkedSchemes(bookmarks);
        
        const applications = await loadSchemeApplications(existingSession.user.id);
        setAppliedSchemes(applications);
      }
      setIsLoading(false);
    });

    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem("janmitra_language") as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    return () => subscription.unsubscribe();
  }, []);

  const t = (key: TranslationKey): string => {
    const langTranslations = translations[language as keyof typeof translations];
    if (langTranslations && langTranslations[key]) {
      return langTranslations[key];
    }
    return translations.en[key] || key;
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: "Login failed. Please try again." };
    } catch (err) {
      return { success: false, error: "An unexpected error occurred." };
    }
  };

  const signup = async (profile: UserProfile, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: profile.email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: profile.name,
            fatherName: profile.fatherName,
            fatherOccupation: profile.fatherOccupation,
            motherName: profile.motherName,
            motherOccupation: profile.motherOccupation,
            familyIncome: profile.familyIncome,
            state: profile.state,
            district: profile.district,
            category: profile.category,
            gender: profile.gender,
            dateOfBirth: profile.dateOfBirth,
            mobile: profile.mobile,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          return { success: false, error: "This email is already registered. Please login instead." };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true };
      }

      return { success: false, error: "Signup failed. Please try again." };
    } catch (err) {
      return { success: false, error: "An unexpected error occurred." };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setSupabaseUser(null);
    setSession(null);
    setBookmarkedSchemes([]);
    setAppliedSchemes({});
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!supabaseUser) return;

    try {
      // Update in database
      const updateData: Record<string, any> = {};
      
      if (profile.name !== undefined) updateData.name = profile.name;
      if (profile.fatherName !== undefined) updateData.father_name = profile.fatherName;
      if (profile.fatherOccupation !== undefined) updateData.father_occupation = profile.fatherOccupation;
      if (profile.guardianName !== undefined) updateData.guardian_name = profile.guardianName;
      if (profile.guardianRelation !== undefined) updateData.guardian_relation = profile.guardianRelation;
      if (profile.motherName !== undefined) updateData.mother_name = profile.motherName;
      if (profile.motherOccupation !== undefined) updateData.mother_occupation = profile.motherOccupation;
      if (profile.familyIncome !== undefined) updateData.family_income = profile.familyIncome;
      if (profile.state !== undefined) updateData.state = profile.state;
      if (profile.district !== undefined) updateData.district = profile.district;
      if (profile.category !== undefined) updateData.category = profile.category;
      if (profile.gender !== undefined) updateData.gender = profile.gender;
      if (profile.dateOfBirth !== undefined) updateData.date_of_birth = profile.dateOfBirth || null;
      if (profile.mobile !== undefined) updateData.mobile = profile.mobile;
      if (profile.qualification !== undefined) updateData.qualification = profile.qualification;
      if (profile.isMarried !== undefined) updateData.is_married = profile.isMarried;
      if (profile.occupation !== undefined) updateData.occupation = profile.occupation;

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', supabaseUser.id);

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      // Update local state
      if (user) {
        setUser({ ...user, ...profile });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("janmitra_language", lang);
    // Apply language-specific font class to body
    document.body.className = document.body.className.replace(/lang-\w+/g, '');
    document.body.classList.add(`lang-${lang}`);
  };

  // Apply language font on initial load
  useEffect(() => {
    document.body.classList.add(`lang-${language}`);
    return () => {
      document.body.className = document.body.className.replace(/lang-\w+/g, '');
    };
  }, []);

  const toggleBookmark = async (schemeId: string) => {
    if (!supabaseUser) return;

    try {
      const isBookmarked = bookmarkedSchemes.includes(schemeId);
      
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('user_bookmarks')
          .delete()
          .eq('user_id', supabaseUser.id)
          .eq('scheme_id', schemeId);

        if (error) {
          console.error('Error removing bookmark:', error);
          return;
        }
        
        setBookmarkedSchemes(prev => prev.filter(id => id !== schemeId));
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('user_bookmarks')
          .insert({ user_id: supabaseUser.id, scheme_id: schemeId });

        if (error) {
          console.error('Error adding bookmark:', error);
          return;
        }
        
        setBookmarkedSchemes(prev => [...prev, schemeId]);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const updateSchemeStatus = async (schemeId: string, status: "not-applied" | "in-progress" | "applied") => {
    if (!supabaseUser) return;

    try {
      // Upsert the status
      const { error } = await supabase
        .from('user_scheme_applications')
        .upsert(
          { 
            user_id: supabaseUser.id, 
            scheme_id: schemeId, 
            status 
          },
          { onConflict: 'user_id,scheme_id' }
        );

      if (error) {
        console.error('Error updating scheme status:', error);
        return;
      }

      setAppliedSchemes(prev => ({ ...prev, [schemeId]: status }));
    } catch (err) {
      console.error('Error updating scheme status:', err);
    }
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      user,
      supabaseUser,
      session,
      language,
      setLanguage: handleSetLanguage,
      login,
      signup,
      logout,
      updateProfile,
      t,
      bookmarkedSchemes,
      toggleBookmark,
      appliedSchemes,
      updateSchemeStatus,
      isLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
