import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, RotateCcw, LogOut, Shield, Globe, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-3 sm:space-y-5">
        <div className="mb-2 sm:mb-4">
          <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-0.5">{t("settings.title")}</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">{t("settings.subtitle")}</p>
        </div>

        {/* Account + Profile combined card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/50">
            <CardContent className="p-4 space-y-3">
              {/* Account row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.user_metadata?.full_name || (user?.is_anonymous ? t("settings.guestUser") : "User")}
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3 shrink-0" />
                      {user?.email || t("settings.noEmail")}
                    </p>
                  </div>
                </div>
                <Badge variant={user?.is_anonymous ? "secondary" : "default"} className="text-[10px] shrink-0">
                  {user?.is_anonymous ? t("settings.guest") : t("settings.verified")}
                </Badge>
              </div>

              {user?.is_anonymous && (
                <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-xs text-foreground font-medium flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-accent" />
                    {t("settings.createAccount")}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{t("settings.guestWarning")}</p>
                </div>
              )}

              {/* Profile summary inline */}
              {profile && (
                <div className="pt-2 border-t border-border/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">{t("settings.profileSummary")}</span>
                    <Button variant="ghost" size="sm" className="text-[11px] h-6 px-2" onClick={() => navigate("/profile-setup")}>
                      <RotateCcw className="w-3 h-3 mr-1" />{t("settings.retake")}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <span className="text-muted-foreground">{t("settings.educationLevel")}</span>
                    <span className="font-medium text-foreground text-right truncate">{profile.educationLevel}</span>
                    <span className="text-muted-foreground">{t("settings.interests")}</span>
                    <span className="font-medium text-foreground text-right truncate">{(profile.careerInterests || profile.interests || []).slice(0, 2).join(", ")}</span>
                    {profile.favoriteSubjects?.length > 0 && (
                      <>
                        <span className="text-muted-foreground">{t("settings.focusAreas")}</span>
                        <span className="font-medium text-foreground text-right truncate">{profile.favoriteSubjects.slice(0, 2).join(", ")}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Language - compact grid */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{t("settings.language")}</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center gap-1.5 px-2 py-2 rounded-lg border text-left transition-all text-xs ${
                      i18n.language === lang.code
                        ? "border-primary bg-primary/5 font-semibold"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <span className="text-sm">{lang.flag}</span>
                    <span className="flex-1 truncate text-foreground">{lang.label}</span>
                    {i18n.language === lang.code && <Check className="w-3 h-3 text-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sign Out */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Button variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground h-10" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            {t("settings.signOut")}
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
