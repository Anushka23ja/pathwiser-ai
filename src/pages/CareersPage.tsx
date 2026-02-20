import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile, RoadmapData } from "@/lib/types";
import { generatePlaceholderRoadmap } from "@/lib/placeholderData";
import DashboardLayout from "@/components/DashboardLayout";

function getProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem("pathwise-profile");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export default function CareersPage() {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate("/profile-setup"); return; }
    setProfile(p);
    setRoadmap(generatePlaceholderRoadmap(p));
  }, [navigate]);

  if (!roadmap || !profile) return null;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">Career Paths</h1>
          <p className="text-muted-foreground text-sm">Explore careers aligned with your interests in {(profile.careerInterests || profile.interests).join(", ")}.</p>
        </div>

        <div className="space-y-4">
          {roadmap.possibleCareers.map((career, i) => (
            <motion.div key={career.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="border-border/50 hover:shadow-[var(--shadow-elevated)] transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-foreground">{career.title}</h3>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <DollarSign className="w-3.5 h-3.5" />{career.salary}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-accent font-medium">
                          <TrendingUp className="w-3.5 h-3.5" />{career.growth} growth
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Alternative Paths */}
        <div className="mt-8">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Alternative Paths</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {roadmap.alternativePaths.map((alt, i) => (
              <motion.div key={alt.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }}>
                <Card className="border-border/50 h-full">
                  <CardContent className="p-5">
                    <h3 className="font-display font-semibold text-foreground text-sm mb-1">{alt.title}</h3>
                    <p className="text-muted-foreground text-sm">{alt.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
