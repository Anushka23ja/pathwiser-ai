import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, RotateCcw, LogOut, Shield, Globe, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { languages } from "@/i18n";
import DashboardLayout from "@/components/DashboardLayout";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pathwise-profile");
      if (stored) setProfile(JSON.parse(stored));
    } catch {}
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("pathwise-language", code);
    // Set document direction for RTL languages
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">{t("settings.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("settings.subtitle")}</p>
        </div>

        {/* Language Selector */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} id="language">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                {t("settings.language")}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{t("settings.languageDesc")}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all text-sm ${
                      i18n.language === lang.code
                        ? "border-primary bg-primary/5 font-semibold"
                        : "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="flex-1 truncate text-foreground">{lang.label}</span>
                    {i18n.language === lang.code && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                {t("settings.account")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user?.user_metadata?.full_name || (user?.is_anonymous ? t("settings.guestUser") : "User")}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {user?.email || t("settings.noEmail")}
                  </p>
                </div>
                <Badge variant={user?.is_anonymous ? "secondary" : "default"}>
                  {user?.is_anonymous ? t("settings.guest") : t("settings.verified")}
                </Badge>
              </div>

              {user?.is_anonymous && (
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm text-foreground font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4 text-accent" />
                    {t("settings.createAccount")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("settings.guestWarning")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Summary */}
        {profile && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{t("settings.profileSummary")}</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/profile-setup")}>
                    <RotateCcw className="w-3 h-3 mr-1" />
                    {t("settings.retake")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("settings.educationLevel")}</span>
                  <span className="font-medium text-foreground">{profile.educationLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("settings.interests")}</span>
                  <span className="font-medium text-foreground text-right">{(profile.careerInterests || profile.interests || []).slice(0, 3).join(", ")}</span>
                </div>
                {profile.favoriteSubjects?.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("settings.focusAreas")}</span>
                    <span className="font-medium text-foreground text-right">{profile.favoriteSubjects.slice(0, 2).join(", ")}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                {t("settings.signOut")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
