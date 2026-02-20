import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, Briefcase, TrendingUp, ArrowRight, Map, Building2,
  Bot, Award, Target, BookOpen, ChevronRight, Sparkles, CheckCircle2,
  Flame, Zap, Calendar, Clock, Star, AlertTriangle, Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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

const milestones = [
  { label: "Foundation", position: 0 },
  { label: "Skills", position: 33 },
  { label: "Applications", position: 66 },
  { label: "Career", position: 100 },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name?.split(" ")[0] || "Pathwiser";
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [aiInsightsOpen, setAiInsightsOpen] = useState(true);
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
  const overdueTasks = tasks.filter(t => t.status !== "done" && t.due_date && new Date(t.due_date) < new Date());

  // Find nearest milestone for progress
  const currentMilestoneIdx = milestones.reduce((best, m, i) => overallProgress >= m.position ? i : best, 0);

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return t("dashboard.goodMorning", { name: displayName });
    if (h < 17) return t("dashboard.goodAfternoon", { name: displayName });
    return t("dashboard.goodEvening", { name: displayName });
  }

  const focusItems = [
    {
      icon: Calendar,
      label: upcomingTasks[0]?.title || t("dashboard.setGoal"),
      sublabel: upcomingTasks[0] ? t("dashboard.fromPlan") : t("dashboard.getStarted"),
      path: "/actions",
      priority: 1,
      color: "border-l-primary",
      urgent: upcomingTasks[0]?.priority === "high",
    },
    {
      icon: BookOpen,
      label: t("dashboard.reviewTimeline", { level: profile.educationLevel.toLowerCase() }),
      sublabel: t("dashboard.timelineSub"),
      path: "/roadmap",
      priority: 2,
      color: "border-l-accent",
      urgent: false,
    },
    {
      icon: Briefcase,
      label: t("dashboard.explorePaths", { field: interests[0] || "career" }),
      sublabel: t("dashboard.explorePathsSub"),
      path: "/careers",
      priority: 3,
      color: "border-l-secondary",
      urgent: false,
    },
  ];

  const statsRow = [
    { label: t("dashboard.activeGoals", { count: activeGoals.length }).replace(`${activeGoals.length} `, ""), value: activeGoals.length, icon: Target, accent: "text-primary" },
    { label: "Tasks Done", value: doneTasks, icon: CheckCircle2, accent: "text-accent" },
    { label: "Streak", value: "3d", icon: Flame, accent: "text-destructive" },
    { label: "Next Deadline", value: upcomingTasks[0]?.due_date ? new Date(upcomingTasks[0].due_date).toLocaleDateString("en", { month: "short", day: "numeric" }) : "—", icon: Clock, accent: "text-primary" },
  ];

  const fade = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-10">
        {/* Hero Greeting with frosted gradient */}
        <motion.div initial="hidden" animate="visible" variants={fade} custom={0}>
          <div className="relative overflow-hidden rounded-2xl p-4 sm:p-8" style={{ background: "var(--gradient-hero)" }}>
            <div className="absolute inset-0 bg-background/5 backdrop-blur-[2px]" />
            <div className="relative flex items-start gap-3 sm:gap-5">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/20">
                <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  {getGreeting()}
                </h1>
                <p className="text-white/70 text-xs sm:text-sm mt-1 sm:mt-1.5 leading-relaxed max-w-xl">
                  {profile.educationLevel} · {t("dashboard.focusedOn")} {interests.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div initial="hidden" animate="visible" variants={fade} custom={0.3}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statsRow.map((stat) => (
              <div key={stat.label} className="stat-card">
                <stat.icon className={`w-4.5 h-4.5 ${stat.accent}`} />
                <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Journey Progress — Multi-Milestone Tracker */}
        <motion.div initial="hidden" animate="visible" variants={fade} custom={0.5}>
          <Card className="border-none shadow-[var(--shadow-soft)] overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="section-label">{t("dashboard.yourJourney")}</span>
                    <span className="text-xs font-bold text-primary">{overallProgress}% {t("dashboard.complete")}</span>
                  </div>
                  {/* Milestone bar */}
                  <div className="relative">
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full gradient-cta"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(overallProgress, 3)}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      />
                    </div>
                    {/* Milestone dots */}
                    <div className="flex justify-between mt-2">
                      {milestones.map((m, i) => (
                        <div key={m.label} className="flex flex-col items-center" style={{ width: i === 0 || i === milestones.length - 1 ? "auto" : undefined }}>
                          <div className={`w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                            i <= currentMilestoneIdx
                              ? "bg-primary border-primary"
                              : "bg-muted border-border"
                          } ${i === currentMilestoneIdx ? "animate-pulse-soft ring-2 ring-primary/20" : ""}`} />
                          <span className={`text-[9px] mt-1 font-medium hidden sm:inline ${i <= currentMilestoneIdx ? "text-primary" : "text-muted-foreground"}`}>
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <span>{t("dashboard.tasksDone", { count: doneTasks })}</span>
                    <span>{t("dashboard.activeGoals", { count: activeGoals.length })}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate("/actions")} className="shrink-0 text-xs mt-3 sm:hidden w-full">
                    {t("nav.actionCenter")} <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/actions")} className="shrink-0 text-xs hidden sm:flex">
                  {t("nav.actionCenter")} <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Focus — Elevated */}
        <motion.div initial="hidden" animate="visible" variants={fade} custom={1}>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-destructive" />
            <h2 className="text-sm font-display font-bold text-foreground uppercase tracking-wide">{t("dashboard.todaysFocus")}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {focusItems.map((item, i) => (
              <Card
                key={i}
                className={`card-glow cursor-pointer group border-l-4 ${item.color}`}
                onClick={() => navigate(item.path)}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full gradient-cta flex items-center justify-center text-[10px] font-bold text-white">
                      {item.priority}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                      <item.icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    {item.urgent && (
                      <Badge variant="destructive" className="text-[9px] ml-auto gap-0.5 px-1.5">
                        <Zap className="w-2.5 h-2.5" /> Urgent
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground leading-snug mb-1">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* AI Insights — Proactive Nudges */}
        {(overdueTasks.length > 0 || interests.length > 0) && (
          <motion.div initial="hidden" animate="visible" variants={fade} custom={1.3}>
            <Collapsible open={aiInsightsOpen} onOpenChange={setAiInsightsOpen}>
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 mb-3 group cursor-pointer">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  <h2 className="text-sm font-display font-bold text-foreground uppercase tracking-wide">AI Insights</h2>
                  <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${aiInsightsOpen ? "rotate-90" : ""}`} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="premium-card border-accent/20">
                  <CardContent className="p-5 space-y-3">
                    {overdueTasks.length > 0 && (
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/15">
                        <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            "{overdueTasks[0]?.title}" needs attention. Stay on track!
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/15">
                      <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Hidden path suggestion</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Based on your interest in {interests[0]} and {interests[1] || interests[0]}, have you considered exploring interdisciplinary roles?
                        </p>
                        <Button variant="link" size="sm" className="p-0 h-auto text-xs text-primary mt-1" onClick={() => navigate("/careers")}>
                          Explore careers <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        )}

        {/* Two-column layout wrapped in premium sections */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Pathway + Tasks */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div initial="hidden" animate="visible" variants={fade} custom={2}>
              <div className="premium-section">
                <div className="flex items-center justify-between mb-4">
                  <span className="section-label text-xs">{t("dashboard.academicPathway")}</span>
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

                {upcomingTasks.length > 0 && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="section-label text-xs">{t("dashboard.upNext")}</span>
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
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right: Majors + Schools + Companies */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial="hidden" animate="visible" variants={fade} custom={2.5}>
              <div className="premium-section space-y-5">
                <div>
                  <span className="section-label mb-3 block">{t("dashboard.suggestedMajors")}</span>
                  <Card className="card-glow cursor-pointer" onClick={() => navigate("/roadmap")}>
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
                </div>

                <div>
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
                </div>

                <div>
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
                </div>
              </div>
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
                className="card-glow cursor-pointer"
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
