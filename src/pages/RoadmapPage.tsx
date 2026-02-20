import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, ChevronDown, ChevronRight, Download, RotateCcw,
  CheckCircle2, Circle, Calendar, BookOpen, Award, Briefcase, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserProfile, RoadmapData } from "@/lib/types";
import { generatePlaceholderRoadmap } from "@/lib/placeholderData";
import { generateMonthlyPlan, YearPlan, categoryLabels } from "@/lib/monthlyPlannerData";
import DashboardLayout from "@/components/DashboardLayout";

function getProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem("pathwise-profile");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function MonthBlock({ month, actions, onToggle, completedIds }: {
  month: string;
  actions: { id: string; title: string; description: string; category: string }[];
  onToggle: (id: string) => void;
  completedIds: Set<string>;
}) {
  const done = actions.filter(a => completedIds.has(a.id)).length;
  const progress = Math.round((done / actions.length) * 100);

  return (
    <div className="pl-6 border-l-2 border-border/60 ml-4 pb-4 last:pb-0">
      <div className="flex items-center gap-2 mb-2 -ml-[25px]">
        <div className={`w-3 h-3 rounded-full shrink-0 ${done === actions.length ? "bg-accent" : "bg-border"}`} />
        <span className="text-xs font-semibold text-foreground">{month}</span>
        <span className="text-[10px] text-muted-foreground">{done}/{actions.length}</span>
      </div>
      <div className="space-y-1.5">
        {actions.map((action) => {
          const isDone = completedIds.has(action.id);
          return (
            <button
              key={action.id}
              onClick={() => onToggle(action.id)}
              className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all ${
                isDone ? "border-accent/20 bg-accent/5 opacity-70" : "border-border/40 bg-card hover:border-border/60 hover:shadow-sm"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {action.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{categoryLabels[action.category]?.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function YearBlock({ yearPlan, completedIds, onToggle }: {
  yearPlan: YearPlan;
  completedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const allActions = yearPlan.months.flatMap(m => m.actions);
  const done = allActions.filter(a => completedIds.has(a.id)).length;
  const progress = allActions.length > 0 ? Math.round((done / allActions.length) * 100) : 0;

  return (
    <Card className="premium-card overflow-hidden">
      <button className="w-full text-left p-5 flex items-start gap-4" onClick={() => setExpanded(!expanded)}>
        <div className="w-11 h-11 rounded-xl gradient-cta flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-bold text-foreground">{yearPlan.year}</h3>
            <Badge variant="secondary" className="text-[10px]">{yearPlan.label}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{yearPlan.description}</p>
          <div className="flex items-center gap-3 mt-3">
            <Progress value={progress} className="flex-1 h-2" />
            <span className="text-xs font-bold text-primary">{progress}%</span>
          </div>
        </div>
        <div className="shrink-0 mt-1">
          {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-5 pb-5">
              {yearPlan.months.map((mp) => (
                <MonthBlock key={mp.month} month={mp.month} actions={mp.actions} completedIds={completedIds} onToggle={onToggle} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [monthlyPlan, setMonthlyPlan] = useState<YearPlan[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate("/profile-setup"); return; }
    setProfile(p);
    setRoadmap(generatePlaceholderRoadmap(p));
    const interests = p.careerInterests?.length > 0 ? p.careerInterests : p.interests;
    setMonthlyPlan(generateMonthlyPlan(p.educationLevel, interests));

    // Load completed items from localStorage
    try {
      const saved = localStorage.getItem("pathwise-planner-completed");
      if (saved) setCompletedIds(new Set(JSON.parse(saved)));
    } catch {}
  }, [navigate]);

  const toggleAction = (id: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("pathwise-planner-completed", JSON.stringify([...next]));
      return next;
    });
  };

  const handleSave = () => {
    const data = { profile, roadmap, monthlyPlan, completedIds: [...completedIds], savedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pathwise-planner.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!profile || !roadmap) return null;

  const allActions = monthlyPlan.flatMap(y => y.months.flatMap(m => m.actions));
  const totalDone = allActions.filter(a => completedIds.has(a.id)).length;
  const totalProgress = allActions.length > 0 ? Math.round((totalDone / allActions.length) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight mb-1">Academic Planner</h1>
            <p className="text-muted-foreground text-sm">
              Month-by-month guide for your {profile.educationLevel.toLowerCase()} journey · {totalDone}/{allActions.length} actions completed
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Download className="w-4 h-4 mr-2" />Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/profile-setup")}>
              <RotateCcw className="w-4 h-4 mr-2" />Retake
            </Button>
          </div>
        </motion.div>

        {/* Overall Progress */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-none shadow-[var(--shadow-card)]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="section-label">Overall Progress</span>
                <span className="text-xs font-bold text-primary">{totalProgress}%</span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full gradient-cta"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(totalProgress, 2)}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Planner */}
        <div className="space-y-4">
          {monthlyPlan.map((yp, i) => (
            <motion.div key={yp.year} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
              <YearBlock yearPlan={yp} completedIds={completedIds} onToggle={toggleAction} />
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Majors", value: roadmap.recommendedMajors.length, icon: Award },
              { label: "Careers", value: roadmap.possibleCareers.length, icon: Briefcase },
              { label: "Actions", value: allActions.length, icon: BookOpen },
              { label: "Growth Fields", value: roadmap.possibleCareers.filter(c => parseInt(c.growth) > 15).length, icon: TrendingUp },
            ].map(stat => (
              <Card key={stat.label} className="premium-card">
                <CardContent className="p-4 text-center">
                  <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
