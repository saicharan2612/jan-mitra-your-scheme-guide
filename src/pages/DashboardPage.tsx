import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { schemes } from "@/data/schemes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SchemeCard from "@/components/SchemeCard";
import Sidebar from "@/components/Sidebar";
import ChatbotPanel from "@/components/ChatbotPanel";
import DeadlineAlert from "@/components/DeadlineAlert";
import { 
  Search, 
  Bell, 
  MessageCircle, 
  Filter,
  TrendingUp,
  Clock,
  Star,
  ChevronRight
} from "lucide-react";

export default function DashboardPage() {
  const { t, user, language, bookmarkedSchemes } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const [showDeadlineAlert, setShowDeadlineAlert] = useState(true);

  // Filter schemes based on user profile
  const getRecommendedSchemes = () => {
    return schemes.filter(scheme => {
      if (!user) return true;
      
      // Check income eligibility
      if (scheme.eligibility.income && user.familyIncome) {
        if (!scheme.eligibility.income.includes(user.familyIncome)) {
          return false;
        }
      }
      
      // Check category eligibility
      if (scheme.eligibility.category && user.category) {
        if (!scheme.eligibility.category.includes(user.category)) {
          return false;
        }
      }
      
      // Check gender eligibility
      if (scheme.eligibility.gender && user.gender) {
        if (!scheme.eligibility.gender.includes(user.gender)) {
          return false;
        }
      }
      
      return true;
    });
  };

  const recommendedSchemes = getRecommendedSchemes();
  const closingSoonSchemes = schemes.filter(s => s.status === "closing-soon");
  const newSchemes = schemes.filter(s => s.status === "new");
  const savedSchemes = schemes.filter(s => bookmarkedSchemes.includes(s.id));

  const filteredSchemes = searchQuery
    ? recommendedSchemes.filter(s => 
        (language === "hi" ? s.titleHi : s.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (language === "hi" ? s.descriptionHi : s.description).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recommendedSchemes;

  const getTitle = (scheme: typeof schemes[0]) => language === "hi" ? scheme.titleHi : scheme.title;
  const getDescription = (scheme: typeof schemes[0]) => language === "hi" ? scheme.descriptionHi : scheme.description;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("search") + " " + t("schemes").toLowerCase() + "..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-lg" className="relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-destructive rounded-full" />
              </Button>
              <Button variant="ghost" size="icon-lg">
                <Filter className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto pb-24">
          {/* Deadline Alert */}
          {showDeadlineAlert && closingSoonSchemes.length > 0 && (
            <DeadlineAlert 
              schemes={closingSoonSchemes}
              onClose={() => setShowDeadlineAlert(false)}
            />
          )}

          {/* Welcome Message */}
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <h1 className="text-2xl font-bold">
              {t("welcome")}, {user?.name?.split(" ")[0] || "User"}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === "hi" 
                ? "आइए आपके लिए सबसे अच्छी सरकारी योजनाएं खोजें।"
                : "Let's find the best government schemes for you."}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<TrendingUp className="h-6 w-6" />}
              label={t("recommendedSchemes")}
              value={recommendedSchemes.length}
              color="primary"
            />
            <StatCard
              icon={<Clock className="h-6 w-6" />}
              label={t("upcomingDeadlines")}
              value={closingSoonSchemes.length}
              color="warning"
            />
            <StatCard
              icon={<Star className="h-6 w-6" />}
              label={t("bookmarks")}
              value={savedSchemes.length}
              color="accent"
            />
            <StatCard
              icon={<Bell className="h-6 w-6" />}
              label={t("newSchemes")}
              value={newSchemes.length}
              color="secondary"
            />
          </div>

          {/* Closing Soon Section */}
          {closingSoonSchemes.length > 0 && (
            <Section
              title={t("upcomingDeadlines")}
              icon={<Clock className="h-5 w-5 text-warning" />}
              schemes={closingSoonSchemes}
              getTitle={getTitle}
              getDescription={getDescription}
              urgent
            />
          )}

          {/* Recommended Schemes */}
          <Section
            title={t("recommendedSchemes")}
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            schemes={filteredSchemes.slice(0, 4)}
            getTitle={getTitle}
            getDescription={getDescription}
            showViewAll
          />

          {/* New Schemes */}
          {newSchemes.length > 0 && (
            <Section
              title={t("newSchemes")}
              icon={<Star className="h-5 w-5 text-accent" />}
              schemes={newSchemes}
              getTitle={getTitle}
              getDescription={getDescription}
            />
          )}
        </main>

        {/* Floating Chatbot Button */}
        <Button
          onClick={() => setShowChatbot(true)}
          variant="hero"
          size="icon-lg"
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-glow z-50"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>

        {/* Chatbot Panel */}
        <ChatbotPanel 
          isOpen={showChatbot} 
          onClose={() => setShowChatbot(false)} 
        />
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number;
  color: "primary" | "warning" | "accent" | "secondary";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/10 text-warning",
    accent: "bg-accent/10 text-accent",
    secondary: "bg-secondary/10 text-secondary",
  };

  return (
    <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground line-clamp-1">{label}</p>
    </div>
  );
}

function Section({
  title,
  icon,
  schemes,
  getTitle,
  getDescription,
  showViewAll,
  urgent,
}: {
  title: string;
  icon: React.ReactNode;
  schemes: typeof import("@/data/schemes").schemes;
  getTitle: (s: typeof schemes[0]) => string;
  getDescription: (s: typeof schemes[0]) => string;
  showViewAll?: boolean;
  urgent?: boolean;
}) {
  if (schemes.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h2>
        {showViewAll && (
          <Button variant="ghost" size="sm" className="text-primary">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {schemes.map((scheme) => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            title={getTitle(scheme)}
            description={getDescription(scheme)}
            urgent={urgent}
          />
        ))}
      </div>
    </section>
  );
}
