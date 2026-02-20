import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, RotateCcw, LogOut, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pathwise-profile");
      if (stored) setProfile(JSON.parse(stored));
    } catch {}
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your account and preferences.</p>
        </div>

        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user?.user_metadata?.full_name || (user?.is_anonymous ? "Guest User" : "User")}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {user?.email || "No email (guest)"}
                  </p>
                </div>
                <Badge variant={user?.is_anonymous ? "secondary" : "default"}>
                  {user?.is_anonymous ? "Guest" : "Verified"}
                </Badge>
              </div>

              {user?.is_anonymous && (
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm text-foreground font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4 text-accent" />
                    Create an account to save your progress
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Guest sessions are temporary. Sign up to keep your roadmap and data.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Summary */}
        {profile && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Profile Summary</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/profile-setup")}>
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Retake
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Education Level</span>
                  <span className="font-medium text-foreground">{profile.educationLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interests</span>
                  <span className="font-medium text-foreground text-right">{(profile.careerInterests || profile.interests || []).slice(0, 3).join(", ")}</span>
                </div>
                {profile.favoriteSubjects?.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Focus Areas</span>
                    <span className="font-medium text-foreground text-right">{profile.favoriteSubjects.slice(0, 2).join(", ")}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
