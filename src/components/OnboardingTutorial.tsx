import { useState, useEffect, useCallback } from "react";
import { Map, Bot, Briefcase, Compass, X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const TUTORIAL_KEY = "pathwise_tutorial_completed";

interface TutorialStep {
  icon: typeof Sparkles;
  title: string;
  description: string;
  color: string;
  selector: string | null;
}

const steps: TutorialStep[] = [
  {
    icon: Sparkles,
    title: "Welcome to Pathwise",
    description: "Your AI-powered career & education guide. Here's a quick tour!",
    color: "hsl(234 62% 45%)",
    selector: null,
  },
  {
    icon: Map,
    title: "Your Roadmap",
    description: "A personalized monthly plan with tasks to keep you on track.",
    color: "hsl(168 45% 45%)",
    selector: "roadmap",
  },
  {
    icon: Bot,
    title: "AI Chatbot",
    description: "Ask any career or school question — get instant, personalized advice.",
    color: "hsl(258 55% 48%)",
    selector: "chat",
  },
  {
    icon: Compass,
    title: "Explore",
    description: "Browse trending paths, interdisciplinary careers & new opportunities.",
    color: "hsl(200 70% 50%)",
    selector: "explore",
  },
  {
    icon: Briefcase,
    title: "Networking",
    description: "Find connections, events & outreach templates to grow your network.",
    color: "hsl(40 95% 50%)",
    selector: "networking",
  },
];

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function OnboardingTutorial() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);

  // Robust trigger: check on mount, on profile-setup completion event, and on visibility change
  useEffect(() => {
    const shouldShow = () => {
      const done = localStorage.getItem(TUTORIAL_KEY);
      const hasProfile = localStorage.getItem("pathwise-profile");
      // Show tutorial only if not completed AND user has gone through profile setup
      return !done && !!hasProfile;
    };

    const tryShow = () => {
      if (shouldShow() && !visible) {
        // Small delay to let DOM elements (nav items) render
        setTimeout(() => setVisible(true), 800);
      }
    };

    // Check immediately (with delay for DOM)
    tryShow();

    // Listen for custom event dispatched after profile setup completes
    const handler = () => tryShow();
    window.addEventListener("pathwise-onboarding-complete", handler);
    // Also re-check on focus/visibility in case of navigation timing
    document.addEventListener("visibilitychange", handler);

    return () => {
      window.removeEventListener("pathwise-onboarding-complete", handler);
      document.removeEventListener("visibilitychange", handler);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const measureTarget = useCallback((selector: string | null) => {
    if (!selector) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(`[data-tutorial="${selector}"]`);
    if (el) {
      const r = el.getBoundingClientRect();
      setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    } else {
      setTargetRect(null);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const current = steps[step];
    measureTarget(current.selector);
    const interval = setInterval(() => measureTarget(current.selector), 250);
    return () => clearInterval(interval);
  }, [step, visible, measureTarget]);

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
  const hasTarget = !!targetRect;

  const spotlightPadding = 6;
  const spotlightRadius = 10;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - spotlightPadding}
                y={targetRect.top - spotlightPadding}
                width={targetRect.width + spotlightPadding * 2}
                height={targetRect.height + spotlightPadding * 2}
                rx={spotlightRadius}
                ry={spotlightRadius}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.6)"
          mask="url(#spotlight-mask)"
          style={{ pointerEvents: "auto" }}
          onClick={finish}
        />
      </svg>

      {/* Spotlight ring glow */}
      {targetRect && (
        <div
          className="absolute rounded-[10px] border-2 pointer-events-none z-[101] animate-pulse"
          style={{
            top: targetRect.top - spotlightPadding,
            left: targetRect.left - spotlightPadding,
            width: targetRect.width + spotlightPadding * 2,
            height: targetRect.height + spotlightPadding * 2,
            borderColor: current.color,
            boxShadow: `0 0 16px 4px ${current.color}40`,
          }}
        />
      )}

      {/* Tooltip card — on mobile: always centered above bottom nav; on desktop: beside target */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={cn(
            "z-[102] bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden",
            // Mobile: fixed at bottom, full width with margin, above the bottom nav
            // Desktop with target: positioned beside element
            // Desktop/mobile no target: centered
            "fixed"
          )}
          style={(() => {
            const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

            // Mobile: always anchor card above the bottom nav, centered
            if (isMobile) {
              return {
                left: "1rem",
                right: "1rem",
                bottom: hasTarget
                  ? `${window.innerHeight - (targetRect?.top ?? 0) + 16}px`
                  : "5rem",
                maxWidth: "calc(100% - 2rem)",
              };
            }

            // Desktop without target: center screen
            if (!hasTarget) {
              return {
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "22rem",
                maxWidth: "calc(100% - 2rem)",
              };
            }

            // Desktop with target: to the right of sidebar item
            return {
              top: `${targetRect!.top + targetRect!.height / 2}px`,
              left: `${targetRect!.left + targetRect!.width + 16}px`,
              transform: "translateY(-50%)",
              width: "20rem",
              maxWidth: "calc(100% - 2rem)",
            };
          })()}
        >
          {/* Close */}
          <button
            onClick={finish}
            className="absolute top-2 right-2 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors z-10"
            aria-label="Close tutorial"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Content row */}
          <div className="flex items-start gap-3 p-4 pb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: current.color }}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 pr-5">
              <h2 className="text-sm font-display font-bold text-foreground mb-0.5 leading-tight">
                {current.title}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {current.description}
              </p>
            </div>
          </div>

          {/* Progress & actions */}
          <div className="px-4 pb-3 pt-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === step ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/25"
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {step > 0 ? (
                <button
                  onClick={prev}
                  className="flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg active:bg-muted/30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={finish}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg active:bg-muted/30"
                >
                  Skip
                </button>
              )}

              <button
                onClick={next}
                className="flex items-center gap-1 text-xs font-semibold text-white px-3.5 py-1.5 rounded-lg transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
                style={{ background: current.color }}
              >
                {isLast ? "Get Started" : "Next"}
                {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
