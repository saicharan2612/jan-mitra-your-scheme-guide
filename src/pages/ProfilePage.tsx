import { useState } from "react";
import { useApp } from "@/context/AppContext";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { indianStates, stateDistricts, incomeRanges, categories, qualifications } from "@/data/indianData";
import { User, Save, Edit2 } from "lucide-react";

export default function ProfilePage() {
  const { t, user, updateProfile } = useApp();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    fatherName: user?.fatherName || "",
    fatherOccupation: user?.fatherOccupation || "",
    guardianName: user?.guardianName || "",
    guardianRelation: user?.guardianRelation || "",
    motherName: user?.motherName || "",
    motherOccupation: user?.motherOccupation || "",
    familyIncome: user?.familyIncome || "",
    state: user?.state || "",
    district: user?.district || "",
    category: user?.category || "",
    gender: user?.gender || "",
    dateOfBirth: user?.dateOfBirth || "",
    mobile: user?.mobile || "",
    qualification: user?.qualification || "",
    isMarried: user?.isMarried || "no",
    occupation: user?.occupation || "",
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "state") {
      setFormData(prev => ({ ...prev, district: "" }));
    }
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const districts = formData.state ? stateDistricts[formData.state] || [] : [];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 p-4 lg:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User className="h-6 w-6" />
              {t("profile")}
            </h1>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4 mr-2" />
                  {t("edit")}
                </>
              )}
            </Button>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            {/* Personal Info */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Personal Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("userName")}</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("mobileNumber")}</Label>
                  <Input
                    value={formData.mobile}
                    onChange={(e) => updateField("mobile", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("dateOfBirth")}</Label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("selectGender")}</Label>
                  <Select value={formData.gender} onValueChange={(v) => updateField("gender", v)} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t("male")}</SelectItem>
                      <SelectItem value="female">{t("female")}</SelectItem>
                      <SelectItem value="other">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Qualification</Label>
                  <Select value={formData.qualification} onValueChange={(v) => updateField("qualification", v)} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualifications.map((q) => (
                        <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Marital Status</Label>
                  <Select value={formData.isMarried} onValueChange={(v) => updateField("isMarried", v)} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">Unmarried</SelectItem>
                      <SelectItem value="yes">Married</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Your Occupation</Label>
                  <Input
                    value={formData.occupation}
                    onChange={(e) => updateField("occupation", e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Student, Farmer, Business"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("selectCategory")}</Label>
                  <Select value={formData.category} onValueChange={(v) => updateField("category", v)} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Family Info */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Family Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Father/Guardian Details Block */}
                <div className="md:col-span-2 p-4 bg-muted/30 rounded-lg space-y-4">
                  <h3 className="font-medium text-sm">Father / Guardian Details</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t("fatherName")}</Label>
                      <Input
                        value={formData.fatherName}
                        onChange={(e) => updateField("fatherName", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("fatherOccupation")}</Label>
                      <Input
                        value={formData.fatherOccupation}
                        onChange={(e) => updateField("fatherOccupation", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Guardian Name (if different)</Label>
                      <Input
                        value={formData.guardianName}
                        onChange={(e) => updateField("guardianName", e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter guardian name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Guardian Relation</Label>
                      <Select value={formData.guardianRelation} onValueChange={(v) => updateField("guardianRelation", v)} disabled={!isEditing}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="uncle">Uncle</SelectItem>
                          <SelectItem value="aunt">Aunt</SelectItem>
                          <SelectItem value="grandfather">Grandfather</SelectItem>
                          <SelectItem value="grandmother">Grandmother</SelectItem>
                          <SelectItem value="brother">Brother</SelectItem>
                          <SelectItem value="sister">Sister</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Mother Details Block (Optional) */}
                <div className="md:col-span-2 p-4 bg-muted/30 rounded-lg space-y-4">
                  <h3 className="font-medium text-sm">{t("motherName")} <span className="text-muted-foreground">(Optional)</span></h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t("motherName")}</Label>
                      <Input
                        value={formData.motherName}
                        onChange={(e) => updateField("motherName", e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter mother's name (optional)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("motherOccupation")}</Label>
                      <Input
                        value={formData.motherOccupation}
                        onChange={(e) => updateField("motherOccupation", e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter mother's occupation (optional)"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>{t("familyIncome")}</Label>
                  <Select value={formData.familyIncome} onValueChange={(v) => updateField("familyIncome", v)} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground">Location</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("selectState")}</Label>
                  <Select value={formData.state} onValueChange={(v) => updateField("state", v)} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {indianStates.map((state) => (
                        <SelectItem key={state.code} value={state.code}>{state.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("selectDistrict")}</Label>
                  <Select value={formData.district} onValueChange={(v) => updateField("district", v)} disabled={!isEditing || !formData.state}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
