import { useApp } from "@/context/AppContext";
import { nearbyOffices } from "@/data/schemes";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Navigation, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function OfficesPage() {
  const { t, language } = useApp();
  const { toast } = useToast();
  const [locationEnabled, setLocationEnabled] = useState(false);

  const enableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationEnabled(true);
          toast({ title: language === "hi" ? "स्थान सक्षम" : "Location Enabled" });
        },
        () => toast({ title: "Location access denied", variant: "destructive" })
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-4 lg:p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          {t("nearbyOffices")}
        </h1>

        {!locationEnabled && (
          <div className="mb-6 p-6 bg-primary/10 rounded-xl text-center">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-3" />
            <p className="mb-4">{t("locationPermission")}</p>
            <Button onClick={enableLocation} variant="hero">{t("enableLocation")}</Button>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {nearbyOffices.map((office) => (
            <div key={office.id} className="bg-card rounded-xl border p-5 shadow-sm">
              <h3 className="font-semibold text-lg">{language === "hi" ? office.nameHi : office.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4" /> {office.address} • {office.distance}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="h-4 w-4" /> {office.timing}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {office.services.map((s) => (
                  <span key={s} className="text-xs bg-muted px-2 py-1 rounded">{s}</span>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-1" /> Call
                </Button>
                <Button size="sm" className="flex-1">
                  <Navigation className="h-4 w-4 mr-1" /> {t("getDirections")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
