import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ChevronRight, Download, RotateCcw,
  CheckCircle2, Circle, Calendar, BookOpen, TrendingUp,
  AlertTriangle, Zap, Sparkles, Loader2, ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserProfile } from "@/lib/types";
import {
  generateMonthlyPlan, YearPlan, categoryLabels, stageOptions, phaseColors,
} from "@/lib/monthlyPlannerData";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

function getProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem("pathwise-profile");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

interface AIRoadmap {
  stageName: string;
  summary: string;
  years: {
    year: string;
    label: string;
    description: string;
    phase: string;
    months: {
      month: string;
      actions: {
        id: string;
        title: string;
        description: string;
        category: string;
        urgent?: boolean;
      }[];
    }[];
  }[];
}

function getAIRoadmap(): AIRoadmap | null {
  try {
    const stored = localStorage.getItem("pathwise-ai-roadmap");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function aiRoadmapToYearPlans(aiRoadmap: AIRoadmap): YearPlan[] {
  return aiRoadmap.years.map((y) => ({
    year: y.year,
    label: y.label,
    description: y.description,
    phase: y.phase,
    months: y.months.map((m) => ({
      month: m.month,
      actions: m.actions.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        category: a.category as any,
        urgent: a.urgent || false,
      })),
    })),
  })) as YearPlan[];
}

// Category color mapping
const categoryColors: Record<string, string> = {
  academics: "border-l-blue-500",
  testing: "border-l-orange-500",
  applications: "border-l-green-500",
  extracurricular: "border-l-purple-500",
  networking: "border-l-cyan-500",
  career: "border-l-rose-500",
  financial: "border-l-amber-500",
  skills: "border-l-indigo-500",
};

const categoryColorsBg: Record<string, string> = {
  academics: "bg-blue-500",
  testing: "bg-orange-500",
  applications: "bg-green-500",
  extracurricular: "bg-purple-500",
  networking: "bg-cyan-500",
  career: "bg-rose-500",
  financial: "bg-amber-500",
  skills: "bg-indigo-500",
};

// Check deadline proximity
function getDeadlineBadge(action: { urgent?: boolean }, completedIds: Set<string>, actionId: string) {
  if (completedIds.has(actionId)) return null;
  if (action.urgent) return <Badge variant="destructive" className="text-[9px] gap-0.5 px-1.5"><AlertTriangle className="w-2.5 h-2.5" /> Overdue</Badge>;
  return null;
}

// Current month name
const currentMonthName = new Date().toLocaleString("en", { month: "long" });

// ─── Mobile Truncated Text ───────────────────────────────
function MobileTruncatedText({ text, className = "" }: { text: string; className?: string }) {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);

  if (!isMobile || text.length < 100) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p className={className}>
      {expanded ? text : `${text.slice(0, 90)}…`}
      <button
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        className="text-primary font-medium ml-1 hover:underline"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </p>
  );
}

// ─── Month Block ─────────────────────────────────────────
function MonthBlock({ month, actions, onToggle, completedIds }: {
  month: string;
  actions: { id: string; title: string; description: string; category: string; urgent?: boolean }[];
  onToggle: (id: string) => void;
  completedIds: Set<string>;
}) {
  const done = actions.filter(a => completedIds.has(a.id)).length;
  const isCurrentMonth = month.toLowerCase().includes(currentMonthName.toLowerCase());

  return (
    <div className={`pl-6 border-l-2 ml-4 pb-4 last:pb-0 ${isCurrentMonth ? "border-primary/60" : "border-border/60"}`}>
      <div className="flex items-center gap-2 mb-2 -ml-[25px]">
        <div className={`w-3 h-3 rounded-full shrink-0 ${
          done === actions.length ? "bg-accent" : isCurrentMonth ? "bg-primary animate-pulse-soft" : "bg-border"
        }`} />
        <span className={`text-xs font-semibold ${isCurrentMonth ? "text-primary" : "text-foreground"}`}>{month}</span>
        {isCurrentMonth && <Badge className="text-[9px] bg-primary/10 text-primary border-primary/20">Current</Badge>}
        <span className="text-[10px] text-muted-foreground">{done}/{actions.length}</span>
      </div>
      <div className="space-y-1.5">
        {actions.map((action) => {
          const isDone = completedIds.has(action.id);
          const catColor = categoryColors[action.category] || "border-l-border";
          return (
            <motion.button
              key={action.id}
              onClick={() => onToggle(action.id)}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border border-l-4 transition-all min-h-[44px] ${catColor} ${
                isDone
                  ? "border-accent/20 bg-accent/5 opacity-70"
                  : action.urgent
                  ? "border-destructive/40 bg-destructive/5 hover:border-destructive/60 hover:shadow-sm"
                  : "border-border/40 bg-card hover:border-border/60 hover:shadow-sm"
              }`}
            >
              {isDone ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                </motion.div>
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className={`text-sm font-medium ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {action.title}
                  </p>
                  {getDeadlineBadge(action, completedIds, action.id)}
                  {action.urgent && !isDone && !getDeadlineBadge(action, completedIds, action.id) && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-destructive">
                      <AlertTriangle className="w-3 h-3" /> Urgent
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{categoryLabels[action.category]?.split(" ")[0] || action.category}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Year Block ──────────────────────────────────────────
function YearBlock({ yearPlan, completedIds, onToggle }: {
  yearPlan: YearPlan;
  completedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const allActions = yearPlan.months.flatMap(m => m.actions);
  const done = allActions.filter(a => completedIds.has(a.id)).length;
  const progress = allActions.length > 0 ? Math.round((done / allActions.length) * 100) : 0;
  const urgentCount = allActions.filter(a => a.urgent && !completedIds.has(a.id)).length;

  return (
    <Card className="premium-card overflow-hidden">
      <button className="w-full text-left p-4 sm:p-5 flex items-start gap-3 sm:gap-4" onClick={() => setExpanded(!expanded)}>
        <div className="w-11 h-11 rounded-xl gradient-cta flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-bold text-foreground">{yearPlan.year}</h3>
            <Badge variant="secondary" className="text-[10px]">{yearPlan.label}</Badge>
            {yearPlan.phase && (
              <Badge variant="outline" className={`text-[10px] ${phaseColors[yearPlan.phase] || ""}`}>
                {yearPlan.phase}
              </Badge>
            )}
            {urgentCount > 0 && (
              <Badge variant="destructive" className="text-[10px] gap-0.5">
                <Zap className="w-3 h-3" /> {urgentCount} urgent
              </Badge>
            )}
          </div>
          <MobileTruncatedText text={yearPlan.description} className="text-xs text-muted-foreground mt-1" />
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

// ─── Main Page ───────────────────────────────────────────
export default function RoadmapPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [monthlyPlan, setMonthlyPlan] = useState<YearPlan[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [stageName, setStageName] = useState("");
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate("/profile-setup"); return; }
    setProfile(p);

    const aiRoadmap = getAIRoadmap();
    if (aiRoadmap) {
      setStageName(aiRoadmap.stageName);
      setAiSummary(aiRoadmap.summary || "");
      setMonthlyPlan(aiRoadmapToYearPlans(aiRoadmap));
      setIsAIGenerated(true);
    } else {
      const savedStageId = localStorage.getItem("pathwise-selected-stage");
      if (savedStageId) {
        const found = stageOptions.find(s => s.id === savedStageId);
        if (found) {
          setStageName(found.label);
          const interests = p.careerInterests?.length > 0 ? p.careerInterests : p.interests;
          setMonthlyPlan(generateMonthlyPlan(found.id, interests));
        } else {
          const fallbackId = deriveFallbackStage(p.educationLevel);
          const fallbackStage = stageOptions.find(s => s.id === fallbackId);
          setStageName(fallbackStage?.label || p.educationLevel);
          const interests = p.careerInterests?.length > 0 ? p.careerInterests : p.interests;
          setMonthlyPlan(generateMonthlyPlan(fallbackId, interests));
        }
      } else {
        const fallbackId = deriveFallbackStage(p.educationLevel);
        const fallbackStage = stageOptions.find(s => s.id === fallbackId);
        setStageName(fallbackStage?.label || p.educationLevel);
        const interests = p.careerInterests?.length > 0 ? p.careerInterests : p.interests;
        setMonthlyPlan(generateMonthlyPlan(fallbackId, interests));
      }
    }

    try {
      const saved = localStorage.getItem("pathwise-planner-completed");
      if (saved) setCompletedIds(new Set(JSON.parse(saved)));
    } catch { }
  }, [navigate]);

  const regenerateRoadmap = async () => {
    if (!profile) return;
    setRegenerating(true);
    try {
      const savedStage = localStorage.getItem("pathwise-selected-stage") || "";
      const { data, error } = await supabase.functions.invoke("onboarding-ai", {
        body: {
          action: "generate_roadmap",
          context: {
            educationLevel: profile.educationLevel,
            stage: savedStage,
            levelDetails: profile.favoriteSubjects || [],
            whyUsing: profile.longTermGoals || [],
            careerInterests: profile.careerInterests || [],
            schoolName: "",
            intendedMajor: (profile as any).intendedMajor || "",
            yearsExperience: (profile as any).yearsExperience || "",
            currentField: (profile as any).currentField || "",
          },
        },
      });

      if (error) throw error;
      if (data?.result) {
        localStorage.setItem("pathwise-ai-roadmap", JSON.stringify(data.result));
        setStageName(data.result.stageName);
        setAiSummary(data.result.summary || "");
        setMonthlyPlan(aiRoadmapToYearPlans(data.result));
        setIsAIGenerated(true);
        toast({ title: "Roadmap regenerated!", description: "Your AI-powered roadmap has been refreshed." });
      }
    } catch (err: any) {
      console.error("Regenerate error:", err);
      toast({ title: "Error", description: "Failed to regenerate roadmap. Please try again.", variant: "destructive" });
    } finally {
      setRegenerating(false);
    }
  };

  const toggleAction = (id: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("pathwise-planner-completed", JSON.stringify([...next]));
      return next;
    });
  };

  const handleSave = () => {
    const data = { profile, monthlyPlan, completedIds: [...completedIds], savedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pathwise-roadmap.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!profile) return null;

  const allActions = monthlyPlan.flatMap(y => y.months.flatMap(m => m.actions));
  const totalDone = allActions.filter(a => completedIds.has(a.id)).length;
  const totalProgress = allActions.length > 0 ? Math.round((totalDone / allActions.length) * 100) : 0;
  const totalUrgent = allActions.filter(a => a.urgent && !completedIds.has(a.id)).length;

  // Category legend
  const usedCategories = [...new Set(allActions.map(a => a.category))];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-3xl font-display font-bold text-foreground tracking-tight">Your Roadmap</h1>
                {isAIGenerated && (
                  <Badge variant="secondary" className="text-[10px] gap-1">
                    <Sparkles className="w-3 h-3" /> AI
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Built for <span className="font-semibold text-foreground">{stageName}</span> · {totalDone}/{allActions.length} done
                {totalUrgent > 0 && <span className="text-destructive font-semibold"> · {totalUrgent} urgent</span>}
              </p>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <Button variant="outline" size="sm" onClick={regenerateRoadmap} disabled={regenerating} className="shrink-0 text-xs min-h-[44px]">
              {regenerating ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1.5" />}
              {regenerating ? "Regenerating..." : "Regenerate"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/profile-setup")} className="shrink-0 text-xs min-h-[44px]">
              <RotateCcw className="w-4 h-4 mr-1.5" />Update Profile
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave} className="shrink-0 text-xs min-h-[44px]">
              <Download className="w-4 h-4 mr-1.5" />Export
            </Button>
          </div>
        </motion.div>

        {/* AI Summary */}
        {aiSummary && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <MobileTruncatedText text={aiSummary} className="text-sm text-foreground" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Category Color Legend */}
        {usedCategories.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
              {usedCategories.map(cat => (
                <div key={cat} className="flex items-center gap-1.5">
                  <div className={`w-3 h-1 rounded-full ${categoryColorsBg[cat] || "bg-border"}`} />
                  <span className="text-[10px] text-muted-foreground capitalize">{categoryLabels[cat]?.split(" ")[0] || cat}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Overall Progress */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-none shadow-[var(--shadow-soft)]">
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
        {monthlyPlan.length === 0 && !regenerating ? (
          <Card className="premium-card">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-display font-bold text-foreground mb-2">No roadmap yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Click "Regenerate" to have AI build your personalized roadmap, or update your profile first.</p>
              <Button onClick={regenerateRoadmap} disabled={regenerating}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate My Roadmap
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {monthlyPlan.map((yp, i) => (
              <motion.div key={yp.year} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                <YearBlock yearPlan={yp} completedIds={completedIds} onToggle={toggleAction} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {allActions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Actions", value: allActions.length, icon: BookOpen },
                { label: "Completed", value: totalDone, icon: CheckCircle2 },
                { label: "Urgent", value: totalUrgent, icon: AlertTriangle },
                { label: "Progress", value: `${totalProgress}%`, icon: TrendingUp },
              ].map(stat => (
                <div key={stat.label} className="stat-card">
                  <stat.icon className="w-4 h-4 text-primary" />
                  <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

function deriveFallbackStage(educationLevel: string): string {
  const level = educationLevel?.toLowerCase() || "";
  if (level.includes("high")) return "11th";
  if (level.includes("college") || level.includes("university")) return "col-fresh";
  if (level.includes("professional") || level.includes("working")) return "early-pro";
  if (level.includes("running")) return "rs-1";
  return "11th";
}
