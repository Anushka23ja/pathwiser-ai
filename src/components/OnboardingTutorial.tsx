import { useState, useEffect } from "react";
import { Map, Bot, Briefcase, Compass, X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const TUTORIAL_KEY = "pathwise_tutorial_completed";

const steps = [
  {
    icon: Sparkles,
    title: "Welcome to Pathwise",
    description: "Your AI-powered career & education guide. Here's a quick tour!",
    color: "hsl(234 62% 45%)",
  },
  {
    icon: Map,
    title: "Your Roadmap",
    description: "A personalized monthly plan with tasks to keep you on track.",
    color: "hsl(168 45% 45%)",
  },
  {
    icon: Bot,
    title: "AI Chatbot",
    description: "Ask any career or school question — get instant, personalized advice.",
    color: "hsl(258 55% 48%)",
  },
  {
    icon: Compass,
    title: "Explore",
    description: "Browse trending paths, interdisciplinary careers & new opportunities.",
    color: "hsl(200 70% 50%)",
  },
  {
    icon: Briefcase,
    title: "Networking Starters",
    description: "Find connections, events & outreach templates to grow your network.",
    color: "hsl(40 95% 50%)",
  },
];

export default function OnboardingTutorial() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(TUTORIAL_KEY);
    if (!done) {
      // Small delay so the dashboard renders first
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const finish = () => {
    localStorage.setItem(TUTORIAL_KEY, "true");
    setVisible(false);
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else finish();
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!visible) return null;

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full sm:max-w-sm bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
          style={{ maxHeight: "85dvh" }}
        >
          {/* Close button */}
          <button
            onClick={finish}
            className="absolute top-3 right-3 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors z-10"
            aria-label="Close tutorial"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon hero */}
          <div className="flex items-center justify-center pt-6 sm:pt-8 pb-3">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: current.color }}
            >
              <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="px-5 sm:px-6 pb-2 text-center">
            <h2 className="text-base sm:text-lg font-display font-bold text-foreground mb-1">
              {current.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 py-3 sm:py-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/25"
                )}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex items-center justify-between gap-3"
            style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
          >
            {step > 0 ? (
              <button
                onClick={prev}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2.5 rounded-lg active:bg-muted/50"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <button
                onClick={finish}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2.5 rounded-lg active:bg-muted/50"
              >
                Skip
              </button>
            )}

            <button
              onClick={next}
              className="flex items-center gap-1.5 text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
              style={{ background: current.color }}
            >
              {isLast ? "Get Started" : "Next"}
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
