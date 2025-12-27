import { useApp } from "@/context/AppContext";
import { Scheme } from "@/data/schemes";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Clock, ChevronRight } from "lucide-react";

interface DeadlineAlertProps {
  schemes: Scheme[];
  onClose: () => void;
}

export default function DeadlineAlert({ schemes, onClose }: DeadlineAlertProps) {
  const { t, language } = useApp();

  const getDaysLeft = (deadline: string) => {
    return Math.ceil(
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <div className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/30 animate-slide-up">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-warning">
              {language === "hi" ? "⚠️ समय सीमा जल्द समाप्त!" : "⚠️ Deadlines Closing Soon!"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "hi" 
                ? `${schemes.length} योजनाओं की समय सीमा जल्द समाप्त हो रही है।`
                : `${schemes.length} scheme${schemes.length > 1 ? 's' : ''} closing soon. Don't miss out!`
              }
            </p>
            
            <div className="mt-3 space-y-2">
              {schemes.slice(0, 2).map((scheme) => (
                <div 
                  key={scheme.id}
                  className="flex items-center justify-between gap-4 p-2 rounded-lg bg-background/50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Clock className="h-4 w-4 text-warning flex-shrink-0" />
                    <span className="text-sm font-medium truncate">
                      {language === "hi" ? scheme.titleHi : scheme.title}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-destructive whitespace-nowrap">
                    {getDaysLeft(scheme.deadline)} {t("daysLeft")}
                  </span>
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="mt-3 text-warning border-warning/50 hover:bg-warning/10">
              {t("viewAll")} <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
