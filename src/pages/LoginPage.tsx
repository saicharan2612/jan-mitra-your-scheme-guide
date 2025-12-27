import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login, t } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: t("welcome"),
          description: "Login successful!",
        });
        navigate("/language-select");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="py-6 px-4 text-center bg-gradient-to-b from-primary/10 to-transparent">
        <h1 className="text-3xl font-bold text-primary">{t("appName")}</h1>
        <p className="text-muted-foreground mt-1">{t("tagline")}</p>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="bg-card rounded-2xl shadow-lg p-8 border border-border/50">
            <h2 className="text-2xl font-bold text-center mb-6">{t("login")}</h2>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">
                  {t("email")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    variant="accessible"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="pl-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium">
                  {t("password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    variant="accessible"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  {t("forgotPassword")}
                </Link>
              </div>

              <Button
                type="submit"
                variant="accessible"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? t("loading") : t("login")}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {t("dontHaveAccount")}{" "}
                <Link to="/signup" className="text-primary font-semibold hover:underline">
                  {t("signup")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
