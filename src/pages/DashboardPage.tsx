import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, Briefcase, TrendingUp, ArrowRight, Map, Building2,
  Bot, Award, Target, BookOpen, ChevronRight, Sparkles, CheckCircle2,
  Flame, Zap, Calendar, Clock, Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { UserProfile, RoadmapData } from "@/lib/types";
import { generatePlaceholderRoadmap } from "@/lib/placeholderData";
import { getSchoolsForProfile, getCompaniesForProfile } from "@/lib/mockData";
import { useGoals } from "@/hooks/useGoals";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";

function getProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem("pathwise-profile");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name?.split(" ")[0] || "Pathwiser";
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
  const upcomingTasks = tasks.filter(t => t.status !== "done" && t.status !== "skipped").slice(0, 3);
  const interests = (profile.careerInterests || profile.interests).slice(0, 3);

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return t("dashboard.goodMorning", { name: displayName });
    if (h < 17) return t("dashboard.goodAfternoon", { name: displayName });
    return t("dashboard.goodEvening", { name: displayName });
  }

  const focusItems = [
    { icon: Calendar, label: upcomingTasks[0]?.title || t("dashboard.setGoal"), sublabel: upcomingTasks[0] ? t("dashboard.fromPlan") : t("dashboard.getStarted"), path: "/actions" },
    { icon: BookOpen, label: t("dashboard.reviewTimeline", { level: profile.educationLevel.toLowerCase() }), sublabel: t("dashboard.timelineSub"), path: "/roadmap" },
    { icon: Briefcase, label: t("dashboard.explorePaths", { field: interests[0] || "career" }), sublabel: t("dashboard.explorePathsSub"), path: "/careers" },
  ];

  const fade = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
        {/* Hero Greeting */}
        <motion.div initial="hidden" animate="visible" variants={fade} custom={0}>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center shrink-0 shadow-[var(--shadow-elevated)]">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
                {getGreeting()}
              </h1>
              <p className="text-muted-foreground text-sm mt-1 leading-relaxed max-w-xl">
                {profile.educationLevel} · {t("dashboard.focusedOn")} {interests.join(", ")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Journey Progress Bar */}
        <motion.div initial="hidden" animate="visible" variants={fade} custom={0.5}>
          <Card className="border-none shadow-[var(--shadow-card)] overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-6 p-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="section-label">{t("dashboard.yourJourney")}</span>
                    <span className="text-xs font-bold text-primary">{overallProgress}% {t("dashboard.complete")}</span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full gradient-cta"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(overallProgress, 3)}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{t("dashboard.tasksDone", { count: doneTasks })}</span>
                    <span>{t("dashboard.activeGoals", { count: activeGoals.length })}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/actions")} className="shrink-0 text-xs">
                  {t("nav.actionCenter")} <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Focus */}
        <motion.div initial="hidden" animate="visible" variants={fade} custom={1}>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-destructive" />
            <h2 className="text-sm font-display font-bold text-foreground uppercase tracking-wide">{t("dashboard.todaysFocus")}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {focusItems.map((item, i) => (
              <Card
                key={i}
                className="premium-card-hover cursor-pointer group"
                onClick={() => navigate(item.path)}
              >
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-3 group-hover:bg-primary/12 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground leading-snug mb-1">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Pathway + Tasks */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div initial="hidden" animate="visible" variants={fade} custom={2}>
              <div className="flex items-center justify-between mb-3">
                <span className="section-label">{t("dashboard.academicPathway")}</span>
                <Button variant="ghost" size="sm" onClick={() => navigate("/roadmap")} className="text-xs text-muted-foreground h-7">
                  {t("dashboard.monthlyPlanner")} <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <Card className="premium-card">
                <CardContent className="p-5 space-y-4">
                  {roadmap.timeline.slice(0, 3).map((item, i) => (
                    <div key={item.year} className="flex gap-4 items-start">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-xl gradient-cta flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        {i < 2 && <div className="w-px flex-1 bg-border mt-2 min-h-[16px]" />}
                      </div>
                      <div className="flex-1 min-w-0 pb-1">
                        <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">{item.year}</span>
                        <h4 className="font-display font-semibold text-sm text-foreground mt-0.5">{item.title}</h4>
                        <p className="text-muted-foreground text-xs mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {upcomingTasks.length > 0 && (
              <motion.div initial="hidden" animate="visible" variants={fade} custom={3}>
                <div className="flex items-center justify-between mb-3">
                  <span className="section-label">{t("dashboard.upNext")}</span>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/actions")} className="text-xs text-muted-foreground h-7">
                    {t("dashboard.allTasks")} <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {upcomingTasks.map((task) => (
                    <Card key={task.id} className="premium-card-hover cursor-pointer" onClick={() => navigate("/actions")}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${task.priority === "high" ? "bg-destructive" : task.priority === "medium" ? "bg-primary" : "bg-muted-foreground"}`} />
                        <span className="text-sm text-foreground flex-1 truncate">{task.title}</span>
                        <Badge variant="outline" className="text-[10px]">{task.priority}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Majors + Schools + Companies */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial="hidden" animate="visible" variants={fade} custom={2.5}>
              <span className="section-label mb-3 block">{t("dashboard.suggestedMajors")}</span>
              <Card className="premium-card-hover cursor-pointer" onClick={() => navigate("/roadmap")}>
                <CardContent className="p-5">
                  <ul className="space-y-2.5">
                    {roadmap.recommendedMajors.slice(0, 4).map((m) => (
                      <li key={m} className="flex items-center gap-2.5 text-sm text-foreground">
                        <Star className="w-3.5 h-3.5 text-accent shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fade} custom={3.5}>
              <div className="flex items-center justify-between mb-3">
                <span className="section-label">{t("dashboard.topSchools")}</span>
                <Button variant="ghost" size="sm" onClick={() => navigate("/schools")} className="text-xs text-muted-foreground h-7">
                  {t("dashboard.seeAll")} <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <Card className="premium-card">
                <CardContent className="p-4 space-y-3">
                  {schools.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/40 cursor-pointer transition-colors" onClick={() => navigate("/schools")}>
                      <div className="w-9 h-9 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">{s.name}</h4>
                        <p className="text-[11px] text-muted-foreground">{s.location}</p>
                      </div>
                      <span className="text-xs font-bold text-accent">{s.matchScore}%</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fade} custom={4}>
              <div className="flex items-center justify-between mb-3">
                <span className="section-label">{t("dashboard.alignedCompanies")}</span>
                <Button variant="ghost" size="sm" onClick={() => navigate("/companies")} className="text-xs text-muted-foreground h-7">
                  {t("dashboard.seeAll")} <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
              <Card className="premium-card">
                <CardContent className="p-4 space-y-3">
                  {companies.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/40 cursor-pointer transition-colors" onClick={() => navigate("/companies")}>
                      <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">{c.name}</h4>
                        <p className="text-[11px] text-muted-foreground">{c.industry}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Quick Nav */}
        <motion.div initial="hidden" animate="visible" variants={fade} custom={5}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: t("nav.actionCenter"), icon: Target, path: "/actions" },
              { label: t("nav.roadmap"), icon: Map, path: "/roadmap" },
              { label: t("nav.aiAdvisor"), icon: Bot, path: "/chat" },
              { label: t("nav.networking"), icon: Zap, path: "/networking" },
            ].map((item) => (
              <Card
                key={item.path}
                className="premium-card-hover cursor-pointer"
                onClick={() => navigate(item.path)}
              >
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-xs font-semibold text-foreground">{item.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
