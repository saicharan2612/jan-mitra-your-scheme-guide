import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { languages } from "@/data/indianData";
import { Button } from "@/components/ui/button";
import { Check, Volume2 } from "lucide-react";
import { Language } from "@/data/translations";

export default function LanguageSelectPage() {
  const { language, setLanguage, t } = useApp();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/dashboard");
  };

  const speakLanguage = (langName: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(langName);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="py-8 px-4 text-center bg-gradient-to-b from-primary/10 to-transparent">
        <h1 className="text-3xl font-bold text-primary">{t("appName")}</h1>
        <h2 className="text-2xl font-semibold mt-4">{t("selectLanguage")}</h2>
        <p className="text-muted-foreground mt-2">{t("languageNote")}</p>
      </div>

      {/* Language Grid */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="max-w-lg mx-auto grid grid-cols-2 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code as Language)}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-200 text-left group ${
                language === lang.code
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              {language === lang.code && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              
              <p className="text-2xl font-bold text-foreground">{lang.nativeName}</p>
              <p className="text-muted-foreground mt-1">{lang.name}</p>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakLanguage(lang.name);
                }}
                className="absolute bottom-3 right-3 p-2 rounded-full hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
              >
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-4 bg-background border-t border-border">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleContinue}
            variant="hero"
            size="xl"
            className="w-full"
          >
            {t("continue")}
          </Button>
        </div>
      </div>
    </div>
  );
}
