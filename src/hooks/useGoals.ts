import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  category: string;
  target_date: string | null;
  progress: number;
  ai_generated: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  goal_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  category: string;
  due_date: string | null;
  order_index: number;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

const AGENT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-agent`;

function getUserProfile() {
  try {
    const stored = localStorage.getItem("pathwise-profile");
    if (!stored) return null;
    return JSON.parse(stored);
  } catch { return null; }
}

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [agentWorking, setAgentWorking] = useState(false);

  const fetchGoals = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data: goalsData } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("order_index", { ascending: true });

    if (goalsData) setGoals(goalsData as Goal[]);
    if (tasksData) setTasks(tasksData as Task[]);
    setLoading(false);
  }, [user]);

  const updateTaskStatus = useCallback(async (taskId: string, status: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", taskId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));

    // Recalculate goal progress
    const task = tasks.find(t => t.id === taskId);
    if (task?.goal_id) {
      const goalTasks = tasks.filter(t => t.goal_id === task.goal_id);
      const updated = goalTasks.map(t => t.id === taskId ? { ...t, status } : t);
      const done = updated.filter(t => t.status === "done").length;
      const progress = Math.round((done / updated.length) * 100);

      await supabase.from("goals").update({ progress }).eq("id", task.goal_id);
      setGoals(prev => prev.map(g => g.id === task.goal_id ? { ...g, progress } : g));
    }
  }, [tasks]);

  const generatePlan = useCallback(async (goalTitle: string) => {
    if (!user) return;
    setAgentWorking(true);

    try {
      const profile = getUserProfile();
      const resp = await fetch(AGENT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: "generate_plan",
          userProfile: profile ? {
            educationLevel: profile.educationLevel,
            levelDetails: profile.favoriteSubjects,
            careerInterests: profile.careerInterests || profile.interests,
            whyUsing: profile.longTermGoals,
            schoolName: profile.schoolName,
          } : null,
          context: { goalTitle },
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        toast({ title: "AI Error", description: err.error || "Failed to generate plan", variant: "destructive" });
        return null;
      }

      const data = await resp.json();
      const plan = data.result;

      // Save goal to DB
      const { data: goalData, error: goalError } = await supabase
        .from("goals")
        .insert({
          user_id: user.id,
          title: plan.goal.title,
          description: plan.goal.description,
          category: plan.goal.category,
          target_date: plan.goal.target_date,
          ai_generated: true,
          metadata: { summary: plan.summary },
        })
        .select()
        .single();

      if (goalError || !goalData) {
        toast({ title: "Error", description: goalError?.message || "Failed to save goal", variant: "destructive" });
        return null;
      }

      // Save all tasks
      const allTasks: any[] = [];
      let orderIdx = 0;
      for (const milestone of plan.milestones) {
        for (const task of milestone.tasks) {
          allTasks.push({
            user_id: user.id,
            goal_id: goalData.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            category: task.category || milestone.title,
            order_index: orderIdx++,
            ai_generated: true,
          });
        }
      }

      if (allTasks.length > 0) {
        const { error: tasksError } = await supabase.from("tasks").insert(allTasks);
        if (tasksError) console.error("Error saving tasks:", tasksError);
      }

      await fetchGoals();
      toast({ title: "Plan Generated!", description: `${allTasks.length} tasks created for "${plan.goal.title}"` });
      return plan;
    } catch (e) {
      console.error("Generate plan error:", e);
      toast({ title: "Error", description: "Failed to generate plan", variant: "destructive" });
      return null;
    } finally {
      setAgentWorking(false);
    }
  }, [user, fetchGoals]);

  const pivotPlan = useCallback(async (fromPath: string, toPath: string) => {
    if (!user) return;
    setAgentWorking(true);

    try {
      const profile = getUserProfile();
      const resp = await fetch(AGENT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: "pivot_plan",
          userProfile: profile ? {
            educationLevel: profile.educationLevel,
            levelDetails: profile.favoriteSubjects,
            careerInterests: profile.careerInterests || profile.interests,
            whyUsing: profile.longTermGoals,
            schoolName: profile.schoolName,
          } : null,
          context: { fromPath, toPath },
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        toast({ title: "AI Error", description: err.error, variant: "destructive" });
        return null;
      }

      const data = await resp.json();
      const pivot = data.result;

      // Archive old goals
      for (const goal of goals.filter(g => g.status === "active")) {
        await supabase.from("goals").update({ status: "archived" }).eq("id", goal.id);
      }

      // Create new goal
      const { data: goalData } = await supabase
        .from("goals")
        .insert({
          user_id: user.id,
          title: pivot.updatedGoal.title,
          description: pivot.updatedGoal.description,
          category: pivot.updatedGoal.category,
          ai_generated: true,
          metadata: { transitionAdvice: pivot.transitionAdvice, updatedSchoolFocus: pivot.updatedSchoolFocus, updatedCompanyFocus: pivot.updatedCompanyFocus },
        })
        .select()
        .single();

      if (goalData) {
        const newTasks: any[] = [];
        let orderIdx = 0;
        for (const milestone of pivot.newMilestones) {
          for (const task of milestone.tasks) {
            newTasks.push({
              user_id: user.id,
              goal_id: goalData.id,
              title: task.title,
              description: task.description,
              priority: task.priority,
              category: task.category || milestone.title,
              order_index: orderIdx++,
              ai_generated: true,
            });
          }
        }
        if (newTasks.length > 0) {
          await supabase.from("tasks").insert(newTasks);
        }
      }

      await fetchGoals();
      toast({ title: "Plan Pivoted!", description: pivot.transitionAdvice?.slice(0, 100) });
      return pivot;
    } catch (e) {
      console.error("Pivot error:", e);
      toast({ title: "Error", description: "Failed to pivot plan", variant: "destructive" });
      return null;
    } finally {
      setAgentWorking(false);
    }
  }, [user, goals, fetchGoals]);

  const suggestNextActions = useCallback(async () => {
    if (!user) return null;
    setAgentWorking(true);

    try {
      const profile = getUserProfile();
      const completedTasks = tasks.filter(t => t.status === "done").map(t => t.title);
      const currentGoals = goals.filter(g => g.status === "active").map(g => ({ title: g.title, progress: g.progress }));

      const resp = await fetch(AGENT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: "suggest_next_actions",
          userProfile: profile ? {
            educationLevel: profile.educationLevel,
            levelDetails: profile.favoriteSubjects,
            careerInterests: profile.careerInterests || profile.interests,
            whyUsing: profile.longTermGoals,
          } : null,
          context: { completedTasks, currentGoals },
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        toast({ title: "AI Error", description: err.error, variant: "destructive" });
        return null;
      }

      const data = await resp.json();
      return data.result;
    } catch (e) {
      console.error("Suggest error:", e);
      return null;
    } finally {
      setAgentWorking(false);
    }
  }, [user, tasks, goals]);

  const deleteGoal = useCallback(async (goalId: string) => {
    await supabase.from("goals").delete().eq("id", goalId);
    setGoals(prev => prev.filter(g => g.id !== goalId));
    setTasks(prev => prev.filter(t => t.goal_id !== goalId));
  }, []);

  return {
    goals,
    tasks,
    loading,
    agentWorking,
    fetchGoals,
    updateTaskStatus,
    generatePlan,
    pivotPlan,
    suggestNextActions,
    deleteGoal,
  };
}
