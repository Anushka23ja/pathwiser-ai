import { useState, useEffect } from "react";
import { Map, Bot, Briefcase, Compass, X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const TUTORIAL_KEY = "pathwise_tutorial_completed";

const steps = [
  {
    icon: Sparkles,
    title: "Welcome to Pathwise",
    description: "Your AI-powered guide to career planning and education. Let's show you around!",
    color: "hsl(234 62% 45%)",
  },
  {
    icon: Map,
    title: "Your Roadmap",
    description: "A personalized monthly plan with tasks to keep you on track.",
    color: "hsl(168 45% 45%)",
    path: "/roadmap",
  },
  {
    icon: Bot,
    title: "AI Advisor",
    description: "Chat with an AI mentor for guidance on any career question.",
    color: "hsl(258 55% 48%)",
    path: "/chat",
  },
  {
    icon: Briefcase,
    title: "Explore Careers",
    description: "Discover careers that match your interests and skills.",
    color: "hsl(40 95% 50%)",
    path: "/careers",
  },
  {
    icon: Compass,
    title: "Explore Page",
    description: "Browse interdisciplinary paths and trending opportunities.",
    color: "hsl(200 70% 50%)",
    path: "/explore",
  },
];

export default function OnboardingTutorial() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const done = localStorage.getItem(TUTORIAL_KEY);
    if (!done) setVisible(true);
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4"
      >
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.97 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-sm bg-card rounded-2xl shadow-[var(--shadow-elevated)] border border-border/50 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={finish}
            className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon hero */}
          <div
            className="flex items-center justify-center pt-8 pb-4"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: current.color }}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-2 text-center">
            <h2 className="text-lg font-display font-bold text-foreground mb-1.5">
              {current.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 py-4">
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
          <div className="px-6 pb-6 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button
                onClick={prev}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <button
                onClick={finish}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                Skip
              </button>
            )}

            <button
              onClick={next}
              className="flex items-center gap-1.5 text-sm font-semibold text-primary-foreground px-5 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
              style={{ background: current.color }}
            >
              {isLast ? "Get Started" : "Next"}
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
