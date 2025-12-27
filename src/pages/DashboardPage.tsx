import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { schemes } from "@/data/schemes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SchemeCard from "@/components/SchemeCard";
import Sidebar from "@/components/Sidebar";
import ChatbotPanel from "@/components/ChatbotPanel";
import DeadlineAlert from "@/components/DeadlineAlert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Search, 
  Bell, 
  MessageCircle, 
  Filter,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  X,
  GraduationCap,
  Landmark,
  Home,
  Wallet,
  Check
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t, user, language, bookmarkedSchemes } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const [showDeadlineAlert, setShowDeadlineAlert] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [notifications, setNotifications] = useState([
    { id: "1", type: "deadline", schemeId: "8", read: false },
    { id: "2", type: "deadline", schemeId: "4", read: false },
    { id: "3", type: "new", schemeId: "6", read: false },
  ]);

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

  // Apply type filters
  const applyFilters = (schemeList: typeof schemes) => {
    if (selectedFilters.length === 0) return schemeList;
    return schemeList.filter(s => selectedFilters.includes(s.type));
  };

  const filteredSchemes = applyFilters(
    searchQuery
      ? recommendedSchemes.filter(s => 
          (language === "hi" ? s.titleHi : s.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
          (language === "hi" ? s.descriptionHi : s.description).toLowerCase().includes(searchQuery.toLowerCase())
        )
      : recommendedSchemes
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => setSelectedFilters([]);

  const filterOptions = [
    { id: "scholarship", label: language === "hi" ? "छात्रवृत्ति" : "Scholarship", icon: GraduationCap },
    { id: "welfare", label: language === "hi" ? "कल्याण" : "Welfare", icon: Landmark },
    { id: "subsidy", label: language === "hi" ? "सब्सिडी" : "Subsidy", icon: Home },
    { id: "pension", label: language === "hi" ? "पेंशन" : "Pension", icon: Wallet },
  ];

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
              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon-lg" className="relative">
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-5 h-5 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="flex items-center justify-between p-3 border-b border-border">
                    <h3 className="font-semibold">
                      {language === "hi" ? "सूचनाएं" : "Notifications"}
                    </h3>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                        {language === "hi" ? "सभी पढ़ें" : "Mark all read"}
                      </Button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-muted-foreground text-sm">
                        {language === "hi" ? "कोई सूचना नहीं" : "No notifications"}
                      </p>
                    ) : (
                      notifications.map(notif => {
                        const scheme = schemes.find(s => s.id === notif.schemeId);
                        if (!scheme) return null;
                        const daysLeft = Math.ceil(
                          (new Date(scheme.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                        );
                        return (
                          <div
                            key={notif.id}
                            className={`p-3 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                              !notif.read ? "bg-primary/5" : ""
                            }`}
                            onClick={() => {
                              markAsRead(notif.id);
                              navigate("/schemes");
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                notif.type === "deadline" ? "bg-warning/20 text-warning" : "bg-accent/20 text-accent"
                              }`}>
                                {notif.type === "deadline" ? <Clock className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium line-clamp-1">
                                  {language === "hi" ? scheme.titleHi : scheme.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {notif.type === "deadline" 
                                    ? (language === "hi" ? `${daysLeft} दिन शेष` : `${daysLeft} days left`)
                                    : (language === "hi" ? "नई योजना उपलब्ध" : "New scheme available")
                                  }
                                </p>
                              </div>
                              {!notif.read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="p-2 border-t border-border">
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/deadlines")}>
                      {language === "hi" ? "सभी देखें" : "View all deadlines"}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon-lg" className="relative">
                    <Filter className="h-6 w-6" />
                    {selectedFilters.length > 0 && (
                      <span className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-medium">
                        {selectedFilters.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="end">
                  <div className="flex items-center justify-between p-3 border-b border-border">
                    <h3 className="font-semibold">
                      {language === "hi" ? "फ़िल्टर" : "Filter Schemes"}
                    </h3>
                    {selectedFilters.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                        <X className="h-3 w-3 mr-1" />
                        {language === "hi" ? "साफ करें" : "Clear"}
                      </Button>
                    )}
                  </div>
                  <div className="p-2 space-y-1">
                    {filterOptions.map(option => {
                      const isSelected = selectedFilters.includes(option.id);
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => toggleFilter(option.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isSelected 
                              ? "bg-primary/10 text-primary" 
                              : "hover:bg-muted"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="flex-1 text-left text-sm">{option.label}</span>
                          {isSelected && <Check className="h-4 w-4" />}
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Active Filters */}
          {selectedFilters.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-sm text-muted-foreground">
                {language === "hi" ? "फ़िल्टर:" : "Filters:"}
              </span>
              {selectedFilters.map(filter => {
                const option = filterOptions.find(o => o.id === filter);
                return (
                  <Badge key={filter} variant="secondary" className="gap-1">
                    {option?.label}
                    <button onClick={() => toggleFilter(filter)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
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
              showViewAll
              onViewAll={() => navigate("/deadlines")}
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
            onViewAll={() => navigate("/schemes")}
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
  onViewAll,
}: {
  title: string;
  icon: React.ReactNode;
  schemes: typeof import("@/data/schemes").schemes;
  getTitle: (s: typeof schemes[0]) => string;
  getDescription: (s: typeof schemes[0]) => string;
  showViewAll?: boolean;
  urgent?: boolean;
  onViewAll?: () => void;
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
          <Button variant="ghost" size="sm" className="text-primary" onClick={onViewAll}>
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
