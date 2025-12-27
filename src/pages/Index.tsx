import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Bell, FileText, MapPin, MessageCircle, ArrowRight, Shield } from "lucide-react";

export default function Index() {
  const features = [
    { icon: CheckCircle, title: "Personalized Matching", desc: "Get schemes matched to your profile" },
    { icon: Users, title: "Multilingual Support", desc: "Available in 12 Indian languages" },
    { icon: Bell, title: "Smart Notifications", desc: "Never miss a deadline" },
    { icon: FileText, title: "Document Checklist", desc: "Know exactly what you need" },
    { icon: MapPin, title: "Nearby Offices", desc: "Find government offices near you" },
    { icon: MessageCircle, title: "AI Assistant", desc: "Get help anytime with voice support" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" /> Trusted by 1M+ Citizens
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            जन-मित्र
          </h1>
          <p className="text-xl text-primary font-medium mt-2">Jan-Mitra</p>
          <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Your Digital Guide to Government Benefits. Discover scholarships, welfare schemes & subsidies you're eligible for.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/signup">
              <Button variant="hero" size="xl">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="hero-outline" size="xl">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Everything You Need to Access Government Benefits
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-muted-foreground mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary/5 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to find your benefits?</h2>
          <p className="text-muted-foreground mt-2">Join thousands of citizens who never miss a government scheme.</p>
          <Link to="/signup">
            <Button variant="hero" size="xl" className="mt-6">
              Create Free Account <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
