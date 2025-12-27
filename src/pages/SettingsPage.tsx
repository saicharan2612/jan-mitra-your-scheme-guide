import { useApp } from "@/context/AppContext";
import { languages } from "@/data/indianData";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Settings, Globe, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Language } from "@/data/translations";

export default function SettingsPage() {
  const { t, language, setLanguage, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 p-4 lg:p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <Settings className="h-6 w-6" />
            {t("settings")}
          </h1>

          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5" />
                {t("selectLanguage")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={language === lang.code ? "default" : "outline"}
                    className="h-auto py-3 flex flex-col items-center gap-1"
                    onClick={() => setLanguage(lang.code as Language)}
                  >
                    <span className="text-lg">{lang.nativeName}</span>
                    <span className="text-xs text-muted-foreground">{lang.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4">Account</h2>
              <Button variant="destructive" onClick={handleLogout} className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                {t("logout")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}