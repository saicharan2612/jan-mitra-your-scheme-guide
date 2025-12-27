import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Scheme } from "@/data/schemes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bookmark, 
  BookmarkCheck, 
  Calendar, 
  ChevronRight,
  FileText,
  GraduationCap,
  Home,
  Landmark,
  Wallet,
  ExternalLink,
  X,
  CheckCircle2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SchemeCardProps {
  scheme: Scheme;
  title: string;
  description: string;
  urgent?: boolean;
}

export default function SchemeCard({ scheme, title, description, urgent }: SchemeCardProps) {
  const { t, language, bookmarkedSchemes, toggleBookmark, appliedSchemes, updateSchemeStatus } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  
  const isBookmarked = bookmarkedSchemes.includes(scheme.id);
  const status = appliedSchemes[scheme.id] || "not-applied";
  
  const daysUntilDeadline = Math.ceil(
    (new Date(scheme.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const getTypeIcon = () => {
    switch (scheme.type) {
      case "scholarship":
        return <GraduationCap className="h-5 w-5" />;
      case "welfare":
        return <Landmark className="h-5 w-5" />;
      case "subsidy":
        return <Home className="h-5 w-5" />;
      case "pension":
        return <Wallet className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "in-progress":
        return <Badge className="bg-warning/20 text-warning border-warning/30">{t("inProgress")}</Badge>;
      case "applied":
        return <Badge className="bg-success/20 text-success border-success/30">{t("applied")}</Badge>;
      default:
        return <Badge variant="secondary">{t("notApplied")}</Badge>;
    }
  };

  return (
    <>
      <div className={`bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
        urgent ? "border-warning/50" : "border-border"
      }`}>
        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                scheme.type === "scholarship" ? "bg-primary/10 text-primary" :
                scheme.type === "welfare" ? "bg-secondary/10 text-secondary" :
                scheme.type === "subsidy" ? "bg-accent/10 text-accent" :
                "bg-muted text-muted-foreground"
              }`}>
                {getTypeIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base line-clamp-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{scheme.category}</p>
              </div>
            </div>
            <button
              onClick={() => toggleBookmark(scheme.id)}
              className="p-2 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-5 w-5 text-primary" />
              ) : (
                <Bookmark className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>

        {/* Benefits */}
        <div className="px-4 pb-3">
          <div className="bg-accent/10 rounded-lg px-3 py-2">
            <p className="text-sm font-medium text-accent">
              💰 {language === "hi" ? scheme.benefitsHi : scheme.benefits}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-muted/30 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 text-sm ${
              daysUntilDeadline <= 7 ? "text-destructive font-medium" :
              daysUntilDeadline <= 30 ? "text-warning font-medium" :
              "text-muted-foreground"
            }`}>
              <Calendar className="h-4 w-4" />
              {daysUntilDeadline} {t("daysLeft")}
            </div>
            {getStatusBadge()}
          </div>
          
          <Button 
            size="sm" 
            variant="default"
            onClick={() => setShowDetails(true)}
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scheme Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                scheme.type === "scholarship" ? "bg-primary/10 text-primary" :
                scheme.type === "welfare" ? "bg-secondary/10 text-secondary" :
                scheme.type === "subsidy" ? "bg-accent/10 text-accent" :
                "bg-muted text-muted-foreground"
              }`}>
                {getTypeIcon()}
              </div>
              <span className="text-lg">{title}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Description */}
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Description</h4>
              <p className="text-sm">{description}</p>
            </div>

            {/* Benefits */}
            <div className="bg-accent/10 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-1">Benefits</h4>
              <p className="text-lg font-medium text-accent">
                {language === "hi" ? scheme.benefitsHi : scheme.benefits}
              </p>
            </div>

            {/* Deadline */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Deadline</span>
              <span className={`text-sm font-semibold ${
                daysUntilDeadline <= 7 ? "text-destructive" :
                daysUntilDeadline <= 30 ? "text-warning" :
                "text-foreground"
              }`}>
                {new Date(scheme.deadline).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
                {" "}({daysUntilDeadline} days left)
              </span>
            </div>

            {/* Required Documents */}
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Required Documents</h4>
              <ul className="space-y-2">
                {scheme.documents.map((doc, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Application Status */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Your Status</span>
              {getStatusBadge()}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  if (status === "not-applied") {
                    updateSchemeStatus(scheme.id, "in-progress");
                  } else if (status === "in-progress") {
                    updateSchemeStatus(scheme.id, "applied");
                  }
                }}
                disabled={status === "applied"}
              >
                {status === "applied" ? t("applied") : status === "in-progress" ? "Mark as Applied" : "Start Application"}
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={() => window.open(scheme.websiteUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Official Website
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}