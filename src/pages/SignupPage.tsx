import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { indianStates, stateDistricts, incomeRanges, categories } from "@/data/indianData";
import { Eye, EyeOff, ArrowRight, ArrowLeft, User, Users, Briefcase, IndianRupee } from "lucide-react";

export default function SignupPage() {
  const { signup, t } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
    familyIncome: "",
    state: "",
    district: "",
    category: "",
    gender: "",
    dateOfBirth: "",
    mobile: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "state") {
      setFormData(prev => ({ ...prev, district: "" }));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { confirmPassword: _, password, ...profile } = formData;
      const success = await signup(profile, password);
      
      if (success) {
        toast({
          title: "Account Created!",
          description: "Please login to continue.",
        });
        navigate("/login");
      } else {
        toast({
          title: "Signup Failed",
          description: "Email already exists. Please use a different email.",
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

  const districts = formData.state ? stateDistricts[formData.state] || [] : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="py-6 px-4 text-center bg-gradient-to-b from-primary/10 to-transparent">
        <h1 className="text-3xl font-bold text-primary">{t("appName")}</h1>
        <p className="text-muted-foreground mt-1">{t("createAccount")}</p>
      </div>

      {/* Progress Indicator */}
      <div className="px-4 py-4 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 mx-1 rounded-full transition-all ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Step {step} of 3
        </p>
      </div>

      {/* Signup Form */}
      <div className="flex-1 px-4 pb-8 overflow-y-auto">
        <form onSubmit={handleSignup} className="max-w-md mx-auto">
          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border/50 animate-slide-up">
            {/* Step 1: Account Details */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Account Details
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="name">{t("userName")} *</Label>
                  <Input
                    id="name"
                    variant="accessible"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")} *</Label>
                  <Input
                    id="email"
                    type="email"
                    variant="accessible"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">{t("mobileNumber")} *</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    variant="accessible"
                    value={formData.mobile}
                    onChange={(e) => updateField("mobile", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")} *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      variant="accessible"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="••••••••"
                      className="pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("confirmPassword")} *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      variant="accessible"
                      value={formData.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      placeholder="••••••••"
                      className="pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Family Details */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Family Details
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="fatherName">{t("fatherName")} *</Label>
                  <Input
                    id="fatherName"
                    variant="accessible"
                    value={formData.fatherName}
                    onChange={(e) => updateField("fatherName", e.target.value)}
                    placeholder="Father's full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fatherOccupation">{t("fatherOccupation")}</Label>
                  <Input
                    id="fatherOccupation"
                    variant="accessible"
                    value={formData.fatherOccupation}
                    onChange={(e) => updateField("fatherOccupation", e.target.value)}
                    placeholder="e.g., Farmer, Teacher, Business"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherName">{t("motherName")} *</Label>
                  <Input
                    id="motherName"
                    variant="accessible"
                    value={formData.motherName}
                    onChange={(e) => updateField("motherName", e.target.value)}
                    placeholder="Mother's full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherOccupation">{t("motherOccupation")}</Label>
                  <Input
                    id="motherOccupation"
                    variant="accessible"
                    value={formData.motherOccupation}
                    onChange={(e) => updateField("motherOccupation", e.target.value)}
                    placeholder="e.g., Homemaker, Teacher"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("familyIncome")} *</Label>
                  <Select value={formData.familyIncome} onValueChange={(v) => updateField("familyIncome", v)}>
                    <SelectTrigger className="h-14 text-lg">
                      <IndianRupee className="h-5 w-5 text-muted-foreground mr-2" />
                      <SelectValue placeholder="Select annual income" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value} className="text-lg py-3">
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Personal & Location Details */}
            {step === 3 && (
              <div className="space-y-5">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Personal Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("selectGender")} *</Label>
                    <Select value={formData.gender} onValueChange={(v) => updateField("gender", v)}>
                      <SelectTrigger className="h-14 text-lg">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male" className="text-lg py-3">{t("male")}</SelectItem>
                        <SelectItem value="female" className="text-lg py-3">{t("female")}</SelectItem>
                        <SelectItem value="other" className="text-lg py-3">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("selectCategory")} *</Label>
                    <Select value={formData.category} onValueChange={(v) => updateField("category", v)}>
                      <SelectTrigger className="h-14 text-lg">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value} className="text-lg py-3">
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">{t("dateOfBirth")} *</Label>
                  <Input
                    id="dob"
                    type="date"
                    variant="accessible"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("selectState")} *</Label>
                  <Select value={formData.state} onValueChange={(v) => updateField("state", v)}>
                    <SelectTrigger className="h-14 text-lg">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {indianStates.map((state) => (
                        <SelectItem key={state.code} value={state.code} className="text-lg py-3">
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("selectDistrict")} *</Label>
                  <Select 
                    value={formData.district} 
                    onValueChange={(v) => updateField("district", v)}
                    disabled={!formData.state}
                  >
                    <SelectTrigger className="h-14 text-lg">
                      <SelectValue placeholder={formData.state ? "Select your district" : "First select state"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {districts.map((district) => (
                        <SelectItem key={district} value={district} className="text-lg py-3">
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  <ArrowLeft className="h-5 w-5" />
                  {t("back")}
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  type="button"
                  variant="accessible"
                  onClick={() => setStep(step + 1)}
                  className="flex-1"
                >
                  {t("continue")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="accessible"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? t("loading") : t("createAccount")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {t("alreadyHaveAccount")}{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                {t("login")}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
