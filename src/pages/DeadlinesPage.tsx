import { useApp } from "@/context/AppContext";
import { schemes } from "@/data/schemes";
import Sidebar from "@/components/Sidebar";
import SchemeCard from "@/components/SchemeCard";
import { Clock } from "lucide-react";

export default function DeadlinesPage() {
  const { t, language, user } = useApp();

  // Sort schemes by deadline (closest first)
  const sortedSchemes = [...schemes]
    .filter(scheme => {
      // Hide scholarships if married
      if (user?.isMarried === "yes" && scheme.type === "scholarship") {
        return false;
      }
      return true;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const getTitle = (scheme: typeof schemes[0]) => language === "hi" ? scheme.titleHi : scheme.title;
  const getDescription = (scheme: typeof schemes[0]) => language === "hi" ? scheme.descriptionHi : scheme.description;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <Clock className="h-6 w-6" />
            {t("deadlines")}
          </h1>

          <div className="grid gap-4 md:grid-cols-2">
            {sortedSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                title={getTitle(scheme)}
                description={getDescription(scheme)}
                urgent={scheme.status === "closing-soon"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
