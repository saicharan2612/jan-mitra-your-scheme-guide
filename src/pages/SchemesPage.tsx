import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { schemes } from "@/data/schemes";
import Sidebar from "@/components/Sidebar";
import SchemeCard from "@/components/SchemeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Filter } from "lucide-react";

export default function SchemesPage() {
  const { t, language, user } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // Calculate user age
  const getUserAge = () => {
    if (!user?.dateOfBirth) return null;
    const today = new Date();
    const birth = new Date(user.dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const userAge = getUserAge();

  // Filter schemes based on user profile
  const getFilteredSchemes = () => {
    return schemes.filter(scheme => {
      // Hide scholarships if married
      if (user?.isMarried === "yes" && scheme.type === "scholarship") {
        return false;
      }

      // Filter by type
      if (filterType !== "all" && scheme.type !== filterType) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const title = language === "hi" ? scheme.titleHi : scheme.title;
        const desc = language === "hi" ? scheme.descriptionHi : scheme.description;
        if (!title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !desc.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
      }

      // Age-based filtering
      if (userAge !== null) {
        // Scholarships mainly for younger people (under 35)
        if (scheme.type === "scholarship" && userAge > 35) {
          return false;
        }
        // Pension schemes for older people (above 18)
        if (scheme.type === "pension" && userAge < 18) {
          return false;
        }
      }

      // Occupation-based filtering
      if (user?.occupation) {
        const occupation = user.occupation.toLowerCase();
        // Show farmer schemes to farmers
        if (scheme.category === "Agriculture" && !occupation.includes("farmer") && !occupation.includes("agriculture")) {
          // Still show but don't prioritize
        }
      }

      return true;
    });
  };

  const filteredSchemes = getFilteredSchemes();
  const getTitle = (scheme: typeof schemes[0]) => language === "hi" ? scheme.titleHi : scheme.title;
  const getDescription = (scheme: typeof schemes[0]) => language === "hi" ? scheme.descriptionHi : scheme.description;

  const schemeTypes = [
    { value: "all", label: "All Schemes" },
    { value: "scholarship", label: "Scholarships" },
    { value: "welfare", label: "Welfare" },
    { value: "subsidy", label: "Subsidies" },
    { value: "pension", label: "Pension" },
  ];

  // Hide scholarship filter if married
  const visibleTypes = user?.isMarried === "yes" 
    ? schemeTypes.filter(t => t.value !== "scholarship")
    : schemeTypes;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <BookOpen className="h-6 w-6" />
            {t("schemes")}
          </h1>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {visibleTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={filterType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredSchemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                title={getTitle(scheme)}
                description={getDescription(scheme)}
                urgent={scheme.status === "closing-soon"}
              />
            ))}
          </div>

          {filteredSchemes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No schemes found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
