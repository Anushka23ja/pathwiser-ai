import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, TrendingUp, Clock, Award, ArrowRight, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate("/profile-setup"); return; }
    setProfile(p);
    const timer = setTimeout(() => {
      setRoadmap(generatePlaceholderRoadmap(p));
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSave = () => {
    const data = { profile, roadmap, savedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pathwise-roadmap.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center">
          <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-cta animate-pulse-soft" />
            <h2 className="text-xl font-display font-bold text-foreground mb-2">Generating Your Roadmap</h2>
            <p className="text-muted-foreground text-sm">Analyzing your profile...</p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  if (!roadmap || !profile) return null;

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Summary */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <Card className="border-none shadow-[var(--shadow-card)] bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-cta flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-1">Your Personalized Roadmap</h1>
                  <p className="text-muted-foreground text-sm">{profile.educationLevel} • {profile.interests.join(", ")}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleSave} className="shrink-0">
                  <Download className="w-4 h-4 mr-2" />Save
                </Button>
              </div>
              <p className="text-foreground/80 text-sm mt-4 leading-relaxed">{roadmap.summary}</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Majors */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <Card className="border-border/50 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />Recommended Majors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {roadmap.recommendedMajors.map((m) => (
                    <li key={m} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{m}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Careers */}
          <motion.div className="lg:col-span-2" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
            <Card className="border-border/50 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />Possible Careers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {roadmap.possibleCareers.map((c) => (
                  <div key={c.title} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="font-medium text-foreground text-sm">{c.title}</span>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{c.salary}</span>
                      <span className="flex items-center gap-1 text-accent font-medium">
                        <TrendingUp className="w-3 h-3" />{c.growth}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />Year-by-Year Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {roadmap.timeline.map((t, i) => (
                  <div key={t.year} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full gradient-cta flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">{i + 1}</div>
                      {i < roadmap.timeline.length - 1 && <div className="w-0.5 flex-1 bg-border my-1" />}
                    </div>
                    <div className="pb-6">
                      <span className="text-[11px] font-medium text-accent uppercase tracking-wider">{t.year}</span>
                      <h3 className="font-display font-semibold text-foreground text-sm mt-0.5">{t.title}</h3>
                      <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{t.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
            <Card className="border-border/50 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Recommended Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {roadmap.extracurriculars.map((e) => (
                    <li key={e} className="flex items-start gap-2 text-sm text-foreground/80">
                      <ArrowRight className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />{e}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
            <Card className="border-border/50 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Alternative Paths</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {roadmap.alternativePaths.map((a) => (
                  <div key={a.title}>
                    <h4 className="font-medium text-foreground text-sm">{a.title}</h4>
                    <p className="text-muted-foreground text-xs mt-0.5">{a.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="text-center">
          <Button variant="outline" size="sm" onClick={() => navigate("/profile-setup")}>
            <RotateCcw className="w-4 h-4 mr-2" />Retake Assessment
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
