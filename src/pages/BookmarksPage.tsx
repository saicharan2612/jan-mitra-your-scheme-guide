import { useApp } from "@/context/AppContext";
import { schemes } from "@/data/schemes";
import Sidebar from "@/components/Sidebar";
import SchemeCard from "@/components/SchemeCard";
import { Bookmark } from "lucide-react";

export default function BookmarksPage() {
  const { t, language, bookmarkedSchemes, user } = useApp();

  const savedSchemes = schemes.filter(s => {
    // Hide scholarships if married
    if (user?.isMarried === "yes" && s.type === "scholarship") {
      return false;
    }
    return bookmarkedSchemes.includes(s.id);
  });

  const getTitle = (scheme: typeof schemes[0]) => language === "hi" ? scheme.titleHi : scheme.title;
  const getDescription = (scheme: typeof schemes[0]) => language === "hi" ? scheme.descriptionHi : scheme.description;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <Bookmark className="h-6 w-6" />
            {t("bookmarks")}
          </h1>

          {savedSchemes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {savedSchemes.map((scheme) => (
                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  title={getTitle(scheme)}
                  description={getDescription(scheme)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bookmarked schemes yet.</p>
              <p className="text-sm">Bookmark schemes to save them for later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
