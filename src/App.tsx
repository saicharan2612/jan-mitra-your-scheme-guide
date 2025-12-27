import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LanguageSelectPage from "./pages/LanguageSelectPage";
import DashboardPage from "./pages/DashboardPage";
import OfficesPage from "./pages/OfficesPage";
import ProfilePage from "./pages/ProfilePage";
import DeadlinesPage from "./pages/DeadlinesPage";
import SchemesPage from "./pages/SchemesPage";
import BookmarksPage from "./pages/BookmarksPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/language-select" element={<LanguageSelectPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/offices" element={<OfficesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/deadlines" element={<DeadlinesPage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
