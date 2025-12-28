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
  updateProfile: (profile: Partial<UserProfile>) => void;
  t: (key: TranslationKey) => string;
  bookmarkedSchemes: string[];
  toggleBookmark: (schemeId: string) => void;
  appliedSchemes: Record<string, "not-applied" | "in-progress" | "applied">;
  updateSchemeStatus: (schemeId: string, status: "not-applied" | "in-progress" | "applied") => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState<string[]>([]);
  const [appliedSchemes, setAppliedSchemes] = useState<Record<string, "not-applied" | "in-progress" | "applied">>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setSupabaseUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession?.user);
        
        // Load user profile from metadata if available
        if (currentSession?.user) {
          const metadata = currentSession.user.user_metadata;
          if (metadata && metadata.profile) {
            setUser(metadata.profile as UserProfile);
          } else if (metadata?.email) {
            // Construct minimal profile from available data
            setUser({
              email: currentSession.user.email || '',
              name: metadata.name || '',
              fatherName: metadata.fatherName || '',
              fatherOccupation: metadata.fatherOccupation || '',
              motherName: metadata.motherName || '',
              motherOccupation: metadata.motherOccupation || '',
              familyIncome: metadata.familyIncome || '',
              state: metadata.state || '',
              district: metadata.district || '',
              category: metadata.category || '',
              gender: metadata.gender || '',
              dateOfBirth: metadata.dateOfBirth || '',
              mobile: metadata.mobile || '',
            });
          }
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setSupabaseUser(existingSession?.user ?? null);
      setIsAuthenticated(!!existingSession?.user);
      
      if (existingSession?.user) {
        const metadata = existingSession.user.user_metadata;
        if (metadata && metadata.profile) {
          setUser(metadata.profile as UserProfile);
        } else if (metadata?.email || existingSession.user.email) {
          setUser({
            email: existingSession.user.email || '',
            name: metadata?.name || '',
            fatherName: metadata?.fatherName || '',
            fatherOccupation: metadata?.fatherOccupation || '',
            motherName: metadata?.motherName || '',
            motherOccupation: metadata?.motherOccupation || '',
            familyIncome: metadata?.familyIncome || '',
            state: metadata?.state || '',
            district: metadata?.district || '',
            category: metadata?.category || '',
            gender: metadata?.gender || '',
            dateOfBirth: metadata?.dateOfBirth || '',
            mobile: metadata?.mobile || '',
          });
        }
      }
      setIsLoading(false);
    });

    // Load non-auth data from localStorage
    const savedLanguage = localStorage.getItem("janmitra_language") as Language;
    const savedBookmarks = localStorage.getItem("janmitra_bookmarks");
    const savedApplied = localStorage.getItem("janmitra_applied");
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    if (savedBookmarks) {
      setBookmarkedSchemes(JSON.parse(savedBookmarks));
    }
    if (savedApplied) {
      setAppliedSchemes(JSON.parse(savedApplied));
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
            profile,
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
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...profile };
      setUser(updatedUser);
      
      // Update user metadata in Supabase
      await supabase.auth.updateUser({
        data: {
          profile: updatedUser,
          ...profile,
        },
      });
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

  const toggleBookmark = (schemeId: string) => {
    setBookmarkedSchemes(prev => {
      const updated = prev.includes(schemeId)
        ? prev.filter(id => id !== schemeId)
        : [...prev, schemeId];
      localStorage.setItem("janmitra_bookmarks", JSON.stringify(updated));
      return updated;
    });
  };

  const updateSchemeStatus = (schemeId: string, status: "not-applied" | "in-progress" | "applied") => {
    setAppliedSchemes(prev => {
      const updated = { ...prev, [schemeId]: status };
      localStorage.setItem("janmitra_applied", JSON.stringify(updated));
      return updated;
    });
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
