import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, Briefcase, TrendingUp, ArrowRight, Map, Building2,
  Users, Bot, Award, Target, BookOpen, ChevronRight, Sparkles, CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserProfile, RoadmapData } from "@/lib/types";
import { generatePlaceholderRoadmap } from "@/lib/placeholderData";
import { getSchoolsForProfile, getCompaniesForProfile } from "@/lib/mockData";
import { useGoals } from "@/hooks/useGoals";
import DashboardLayout from "@/components/DashboardLayout";

function getProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem("pathwise-profile");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const { goals, tasks, fetchGoals } = useGoals();

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate("/profile-setup"); return; }
    setProfile(p);
    setRoadmap(generatePlaceholderRoadmap(p));
    fetchGoals();
  }, [navigate, fetchGoals]);

  if (!profile || !roadmap) return null;

  const schools = getSchoolsForProfile(profile).slice(0, 3);
  const companies = getCompaniesForProfile(profile).slice(0, 3);
  const activeGoals = goals.filter(g => g.status === "active");
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === "done").length;
  const overallProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const upcomingTasks = tasks.filter(t => t.status !== "done" && t.status !== "skipped").slice(0, 4);

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Profile Summary */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <Card className="border-none shadow-[var(--shadow-card)] bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center shrink-0">
                  <GraduationCap className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-1">
                    Welcome to Your Dashboard
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {profile.educationLevel} • Interested in {(profile.careerInterests || profile.interests).slice(0, 3).join(", ")}
                  </p>
                  <p className="text-foreground/80 text-sm mt-3 leading-relaxed line-clamp-2">{roadmap.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Action Center", icon: Target, path: "/actions", color: "text-primary" },
            { label: "My Roadmap", icon: Map, path: "/roadmap", color: "text-accent" },
            { label: "Companies", icon: Building2, path: "/companies", color: "text-secondary" },
            { label: "AI Advisor", icon: Bot, path: "/chat", color: "text-primary" },
          ].map((item) => (
            <Card
              key={item.label}
              className="cursor-pointer hover:shadow-[var(--shadow-elevated)] transition-shadow border-border/50"
              onClick={() => navigate(item.path)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <item.icon className={`w-6 h-6 ${item.color}`} />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Goal Progress Widget */}
        {(activeGoals.length > 0 || upcomingTasks.length > 0) && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1.5}>
            <Card className="border-border/50 cursor-pointer hover:shadow-[var(--shadow-elevated)] transition-shadow" onClick={() => navigate("/actions")}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Goal Progress
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                    Action Center <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <Progress value={overallProgress} className="flex-1 h-2" />
                  <span className="text-sm font-bold text-primary">{overallProgress}%</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{doneTasks}/{totalTasks} tasks done • {activeGoals.length} active goal{activeGoals.length !== 1 ? "s" : ""}</p>
                {upcomingTasks.length > 0 && (
                  <div className="space-y-1.5">
                    {upcomingTasks.map(t => (
                      <div key={t.id} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="text-foreground/80 truncate">{t.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recommended Pathway */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Academic Pathway
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/roadmap")} className="text-xs text-muted-foreground">
                    View Full Roadmap <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {roadmap.timeline.slice(0, 3).map((t, i) => (
                  <div key={t.year} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full gradient-cta flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-accent uppercase tracking-wider">{t.year}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-foreground">{t.title}</h4>
                      <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{t.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Suggested Majors */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Card className="border-border/50 cursor-pointer hover:shadow-[var(--shadow-elevated)] transition-shadow" onClick={() => navigate("/roadmap")}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  Suggested Majors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {roadmap.recommendedMajors.slice(0, 4).map((m) => (
                    <li key={m} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Schools */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-accent" />
                    Suggested Schools
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/schools")} className="text-xs text-muted-foreground">
                    See All <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {schools.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate("/schools")}>
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{s.name}</h4>
                      <p className="text-xs text-muted-foreground">{s.location} • {s.type}</p>
                    </div>
                    <span className="text-xs font-semibold text-accent">{s.matchScore}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Companies */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    Aligned Companies
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/companies")} className="text-xs text-muted-foreground">
                    See All <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {companies.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => navigate("/companies")}>
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{c.name}</h4>
                      <p className="text-xs text-muted-foreground">{c.industry} • {c.size} employees</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Next Steps */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Recommended Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2">
                {roadmap.extracurriculars.slice(0, 6).map((e) => (
                  <div key={e} className="flex items-start gap-2 text-sm text-foreground/80 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                    <span>{e}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
