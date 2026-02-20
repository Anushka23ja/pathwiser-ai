import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, Target, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useGoals } from "@/hooks/useGoals";
import { toast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const suggestions = [
  "Create a plan to become a Software Engineer",
  "I want to switch from pre-med to business",
  "What should I focus on this semester?",
  "Help me prepare for medical school",
];

function getUserProfile() {
  try {
    const stored = localStorage.getItem("pathwise-profile");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { generatePlan, pivotPlan, agentWorking } = useGoals();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "Hi! I'm your Pathwise AI Advisor. I can do more than just answer questions — I can **generate career plans**, **create task lists**, and **update your roadmap**.\n\nTry saying:\n• \"Create a plan to become a Software Engineer\"\n• \"I want to switch from pre-med to business\"\n• \"What should I focus on this semester?\"\n\nI'll analyze your profile and create actionable plans you can track in the Action Center." },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const detectAgentCommand = (text: string): { type: string; params: any } | null => {
    const lower = text.toLowerCase();
    const planPatterns = [/create a plan (?:to |for )(.+)/i, /plan to (.+)/i, /become (?:a |an )(.+)/i, /i want to be (?:a |an )(.+)/i, /help me become (.+)/i, /generate (?:a )?plan (?:for |to )(.+)/i];
    for (const pattern of planPatterns) {
      const match = text.match(pattern);
      if (match) return { type: "generate_plan", params: { goalTitle: match[1].trim() } };
    }
    const pivotPatterns = [/switch (?:from )(.+?) to (.+)/i, /pivot (?:from )(.+?) to (.+)/i, /change (?:from )(.+?) to (.+)/i, /transition (?:from )(.+?) to (.+)/i];
    for (const pattern of pivotPatterns) {
      const match = text.match(pattern);
      if (match) return { type: "pivot", params: { fromPath: match[1].trim(), toPath: match[2].trim() } };
    }
    return null;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming || agentWorking) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const command = detectAgentCommand(text);
    if (command) {
      const agentMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: agentMsgId, role: "assistant", content: "🤖 **Agent Mode Activated** — Analyzing your profile and generating a structured plan..." }]);

      if (command.type === "generate_plan") {
        const plan = await generatePlan(command.params.goalTitle);
        if (plan) {
          const taskCount = plan.milestones.reduce((acc: number, m: any) => acc + m.tasks.length, 0);
          setMessages(prev => prev.map(m => m.id === agentMsgId ? {
            ...m,
            content: `✅ **Plan Created: ${plan.goal.title}**\n\n${plan.summary}\n\n**${plan.milestones.length} milestones** with **${taskCount} tasks** have been added to your Action Center.\n\n📋 [Go to Action Center →](/actions) to track your progress and mark tasks as complete.`
          } : m));
        } else {
          setMessages(prev => prev.map(m => m.id === agentMsgId ? { ...m, content: "❌ Failed to generate plan. Please try again." } : m));
        }
      } else if (command.type === "pivot") {
        const pivot = await pivotPlan(command.params.fromPath, command.params.toPath);
        if (pivot) {
          setMessages(prev => prev.map(m => m.id === agentMsgId ? {
            ...m,
            content: `🔄 **Career Pivot Complete**\n\n**New Goal:** ${pivot.updatedGoal.title}\n\n${pivot.transitionAdvice}\n\n**Updated Focus:**\n• Schools: ${pivot.updatedSchoolFocus?.join(", ") || "General"}\n• Companies: ${pivot.updatedCompanyFocus?.join(", ") || "General"}\n\nYour old plan has been archived and new tasks are in the [Action Center →](/actions).`
          } : m));
        } else {
          setMessages(prev => prev.map(m => m.id === agentMsgId ? { ...m, content: "❌ Failed to pivot plan. Please try again." } : m));
        }
      }
      return;
    }

    setIsStreaming(true);
    const profile = getUserProfile();
    const apiMessages = [...messages.filter(m => m.id !== "welcome"), userMsg].map(m => ({ role: m.role, content: m.content }));
    let assistantSoFar = "";
    const assistantId = (Date.now() + 1).toString();

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          messages: apiMessages,
          userProfile: profile ? { educationLevel: profile.educationLevel, levelDetails: profile.favoriteSubjects, careerInterests: profile.careerInterests || profile.interests, whyUsing: profile.longTermGoals, schoolName: profile.schoolName } : null,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        toast({ title: "AI Error", description: err.error || "Something went wrong", variant: "destructive" });
        setIsStreaming(false);
        return;
      }
      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              const updated = assistantSoFar;
              setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: updated } : m)));
            }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              const updated = assistantSoFar;
              setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: updated } : m)));
            }
          } catch {}
        }
      }
    } catch (e) {
      console.error("Stream error:", e);
      toast({ title: "Connection Error", description: "Failed to reach AI advisor. Please try again.", variant: "destructive" });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 bg-muted/30">
          <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 sm:gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "assistant" ? "gradient-cta" : "bg-primary"}`}>
                  {msg.role === "assistant" ? <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" /> : <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />}
                </div>
                <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-card border border-border shadow-sm text-foreground prose prose-sm max-w-none"
                    : "bg-primary text-primary-foreground shadow-md"
                }`}>
                  {msg.role === "assistant" ? (
                    <ReactMarkdown components={{
                      a: ({ href, children }) => {
                        if (href?.startsWith("/")) {
                          return <button onClick={() => navigate(href)} className="text-primary underline font-medium">{children}</button>;
                        }
                        return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">{children}</a>;
                      }
                    }}>{msg.content}</ReactMarkdown>
                  ) : msg.content}
                </div>
              </motion.div>
            ))}
            {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full gradient-cta flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border shadow-sm rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-soft" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-soft" style={{ animationDelay: "0.3s" }} />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-soft" style={{ animationDelay: "0.6s" }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-3 sm:px-4 pb-2">
            <div className="max-w-2xl mx-auto flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => sendMessage(s)} className="px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input - higher contrast */}
        <div className="border-t-2 border-border bg-card px-3 sm:px-4 py-3 sm:py-4 shrink-0">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={agentWorking ? "Agent is working..." : "Type your message..."}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm"
              />
              <Button type="submit" disabled={!input.trim() || isStreaming || agentWorking} className="gradient-cta text-primary-foreground border-0 hover:opacity-90 px-4 min-h-[44px]">
                {agentWorking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
