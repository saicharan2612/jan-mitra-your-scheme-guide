import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language, TranslationKey } from "@/data/translations";

interface UserProfile {
  email: string;
  name: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  familyIncome: string;
  state: string;
  district: string;
  category: string;
  gender: string;
  dateOfBirth: string;
  mobile: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (profile: UserProfile, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  t: (key: TranslationKey) => string;
  bookmarkedSchemes: string[];
  toggleBookmark: (schemeId: string) => void;
  appliedSchemes: Record<string, "not-applied" | "in-progress" | "applied">;
  updateSchemeStatus: (schemeId: string, status: "not-applied" | "in-progress" | "applied") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState<string[]>([]);
  const [appliedSchemes, setAppliedSchemes] = useState<Record<string, "not-applied" | "in-progress" | "applied">>({});

  useEffect(() => {
    const savedUser = localStorage.getItem("janmitra_user");
    const savedLanguage = localStorage.getItem("janmitra_language") as Language;
    const savedBookmarks = localStorage.getItem("janmitra_bookmarks");
    const savedApplied = localStorage.getItem("janmitra_applied");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    if (savedBookmarks) {
      setBookmarkedSchemes(JSON.parse(savedBookmarks));
    }
    if (savedApplied) {
      setAppliedSchemes(JSON.parse(savedApplied));
    }
  }, []);

  const t = (key: TranslationKey): string => {
    const langTranslations = translations[language as keyof typeof translations];
    if (langTranslations && langTranslations[key]) {
      return langTranslations[key];
    }
    return translations.en[key] || key;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const savedUsers = localStorage.getItem("janmitra_users");
    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      const foundUser = users.find((u: { email: string; password: string }) => 
        u.email === email && u.password === password
      );
      if (foundUser) {
        const { password: _, ...userProfile } = foundUser;
        setUser(userProfile);
        setIsAuthenticated(true);
        localStorage.setItem("janmitra_user", JSON.stringify(userProfile));
        return true;
      }
    }
    return false;
  };

  const signup = async (profile: UserProfile, password: string): Promise<boolean> => {
    const savedUsers = localStorage.getItem("janmitra_users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    if (users.some((u: { email: string }) => u.email === profile.email)) {
      return false;
    }
    
    users.push({ ...profile, password });
    localStorage.setItem("janmitra_users", JSON.stringify(users));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("janmitra_user");
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...profile };
      setUser(updatedUser);
      localStorage.setItem("janmitra_user", JSON.stringify(updatedUser));
      
      const savedUsers = localStorage.getItem("janmitra_users");
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const userIndex = users.findIndex((u: { email: string }) => u.email === user.email);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...profile };
          localStorage.setItem("janmitra_users", JSON.stringify(users));
        }
      }
    }
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("janmitra_language", lang);
  };

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
