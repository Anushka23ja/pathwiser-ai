import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, CheckCircle2, Circle, Clock, Sparkles, Plus, ChevronDown, ChevronUp,
  Trash2, Zap, ArrowRight, Loader2, AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGoals, Goal, Task } from "@/hooks/useGoals";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "@/hooks/use-toast";

const priorityColors: Record<string, string> = {
  high: "text-destructive border-destructive/30 bg-destructive/5",
  medium: "text-primary border-primary/30 bg-primary/5",
  low: "text-muted-foreground border-border bg-muted/30",
};

const statusIcons: Record<string, React.ReactNode> = {
  todo: <Circle className="w-4 h-4 text-muted-foreground" />,
  in_progress: <Clock className="w-4 h-4 text-primary" />,
  done: <CheckCircle2 className="w-4 h-4 text-accent" />,
  skipped: <AlertCircle className="w-4 h-4 text-muted-foreground" />,
};

function GoalCard({ goal, tasks, onTaskUpdate, onDelete, agentWorking }: {
  goal: Goal;
  tasks: Task[];
  onTaskUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  agentWorking: boolean;
}) {
  const [expanded, setExpanded] = useState(true);
  const goalTasks = tasks.filter(t => t.goal_id === goal.id);
  const doneTasks = goalTasks.filter(t => t.status === "done").length;

  const cycleStatus = (task: Task) => {
    const next: Record<string, string> = { todo: "in_progress", in_progress: "done", done: "todo", skipped: "todo" };
    onTaskUpdate(task.id, next[task.status] || "todo");
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base">{goal.title}</CardTitle>
              <Badge variant="secondary" className="text-[10px]">{goal.category}</Badge>
              {goal.status === "archived" && <Badge variant="outline" className="text-[10px]">Archived</Badge>}
            </div>
            {goal.description && <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onDelete(goal.id)}>
              <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Progress value={goal.progress} className="flex-1 h-2" />
          <span className="text-xs font-medium text-muted-foreground">{doneTasks}/{goalTasks.length}</span>
        </div>
        {goal.target_date && (
          <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Target: {goal.target_date}
          </p>
        )}
      </CardHeader>

      <AnimatePresence>
        {expanded && goalTasks.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <CardContent className="pt-0 space-y-1.5">
              {goalTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer hover:bg-muted/30 ${
                    task.status === "done" ? "opacity-60" : ""
                  } ${priorityColors[task.priority] || ""}`}
                  onClick={() => cycleStatus(task)}
                >
                  <div className="mt-0.5 shrink-0">{statusIcons[task.status]}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">{task.priority}</Badge>
                </div>
              ))}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function ActionCenterPage() {
  const { goals, tasks, loading, agentWorking, fetchGoals, updateTaskStatus, generatePlan, suggestNextActions, deleteGoal } = useGoals();
  const [goalInput, setGoalInput] = useState("");
  const [suggestions, setSuggestions] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const handleGeneratePlan = async () => {
    if (!goalInput.trim()) return;
    await generatePlan(goalInput.trim());
    setGoalInput("");
  };

  const handleSuggestNext = async () => {
    const result = await suggestNextActions();
    if (result) {
      setSuggestions(result);
      setShowSuggestions(true);
    }
  };

  const activeGoals = goals.filter(g => g.status === "active");
  const archivedGoals = goals.filter(g => g.status !== "active");
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === "done").length;
  const overallProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const quickGoals = [
    "Become a Software Engineer",
    "Get into Medical School",
    "Land a Finance Internship",
    "Build a Design Portfolio",
    "Switch to Data Science",
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-1">Action Center</h1>
            <p className="text-muted-foreground text-sm">AI-generated goals and tasks to track your progress.</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSuggestNext} disabled={agentWorking || goals.length === 0}>
            {agentWorking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            AI Suggestions
          </Button>
        </div>

        {/* Overall Progress */}
        {totalTasks > 0 && (
          <Card className="border-none shadow-[var(--shadow-card)] bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Overall Progress</span>
                <span className="text-sm font-bold text-primary">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">{doneTasks} of {totalTasks} tasks completed across {activeGoals.length} active goal{activeGoals.length !== 1 ? "s" : ""}</p>
            </CardContent>
          </Card>
        )}

        {/* Generate New Goal */}
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Generate a New Plan</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGeneratePlan()}
                placeholder='e.g. "Become a Software Engineer at Google"'
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                disabled={agentWorking}
              />
              <Button onClick={handleGeneratePlan} disabled={!goalInput.trim() || agentWorking} className="gradient-cta text-primary-foreground border-0">
                {agentWorking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </Button>
            </div>
            {goals.length === 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {quickGoals.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setGoalInput(q); }}
                    className="px-3 py-1.5 rounded-full text-xs border border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Agent Working Indicator */}
        {agentWorking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <div>
              <p className="text-sm font-medium text-foreground">AI Agent is working...</p>
              <p className="text-xs text-muted-foreground">Analyzing your profile, generating milestones, and creating tasks.</p>
            </div>
          </motion.div>
        )}

        {/* AI Suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Card className="border-accent/30 bg-accent/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-accent" /> AI Suggestions
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setShowSuggestions(false)}>Dismiss</Button>
                  </div>
                  {suggestions.progressInsight && (
                    <p className="text-xs text-foreground/80 mt-1">{suggestions.progressInsight}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestions.suggestions?.map((s: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-card/50">
                      <ArrowRight className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.title}</p>
                        <p className="text-xs text-muted-foreground">{s.reasoning}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0 ml-auto">{s.priority}</Badge>
                    </div>
                  ))}
                  {suggestions.shouldRevisePlan && (
                    <div className="p-2 rounded-lg bg-destructive/5 border border-destructive/20 mt-2">
                      <p className="text-xs text-destructive font-medium">⚠ Plan revision recommended</p>
                      <p className="text-xs text-muted-foreground">{suggestions.revisionReason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Goals */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : activeGoals.length > 0 ? (
          <div className="space-y-4">
            {activeGoals.map((goal) => (
              <motion.div key={goal.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <GoalCard goal={goal} tasks={tasks} onTaskUpdate={updateTaskStatus} onDelete={deleteGoal} agentWorking={agentWorking} />
              </motion.div>
            ))}
          </div>
        ) : !agentWorking ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-display font-semibold text-foreground mb-1">No goals yet</h3>
            <p className="text-sm text-muted-foreground">Enter a career goal above and let the AI build your personalized plan.</p>
          </div>
        ) : null}

        {/* Archived Goals */}
        {archivedGoals.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Archived Goals</h3>
            <div className="space-y-3 opacity-60">
              {archivedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} tasks={tasks} onTaskUpdate={updateTaskStatus} onDelete={deleteGoal} agentWorking={agentWorking} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
