import { useState, useEffect, useCallback, useRef } from "react";
import { Map, Bot, Briefcase, Compass, X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const TUTORIAL_KEY = "pathwise_tutorial_completed";

interface TutorialStep {
  icon: typeof Sparkles;
  title: string;
  description: string;
  color: string;
  /** data-tutorial value to spotlight. null = centered (no spotlight) */
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
  const rafRef = useRef<number>();

  useEffect(() => {
    const done = localStorage.getItem(TUTORIAL_KEY);
    if (!done) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

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

  // Re-measure on step change and on scroll/resize
  useEffect(() => {
    if (!visible) return;
    const current = steps[step];
    measureTarget(current.selector);

    const update = () => {
      measureTarget(current.selector);
      rafRef.current = requestAnimationFrame(update);
    };
    // Use a simpler interval approach for re-measuring
    const interval = setInterval(() => measureTarget(current.selector), 200);
    return () => {
      clearInterval(interval);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
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

  // Calculate tooltip position
  const getTooltipPosition = (): React.CSSProperties => {
    if (!targetRect) return {};

    const isMobile = window.innerWidth < 640;
    const padding = 12;

    if (isMobile) {
      // On mobile, position the card above the bottom nav
      // The target is in the bottom nav, so place tooltip above it
      return {
        position: "fixed",
        bottom: `${window.innerHeight - targetRect.top + padding}px`,
        left: "50%",
        transform: "translateX(-50%)",
      };
    }

    // On desktop, position to the right of the sidebar item
    return {
      position: "fixed",
      top: `${targetRect.top + targetRect.height / 2}px`,
      left: `${targetRect.left + targetRect.width + padding}px`,
      transform: "translateY(-50%)",
    };
  };

  // SVG spotlight overlay
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

      {/* Tooltip card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: hasTarget ? 10 : 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: hasTarget ? 10 : 40, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={cn(
            "z-[102] bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden",
            !hasTarget
              ? "fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 bottom-4 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:max-w-sm"
              : "fixed w-[calc(100%-2rem)] sm:w-80"
          )}
          style={hasTarget ? getTooltipPosition() : undefined}
        >
          {/* Close button */}
          <button
            onClick={finish}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors z-10"
            aria-label="Close tutorial"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Icon + Content */}
          <div className="flex items-start gap-3 p-4 pt-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: current.color }}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 pr-4">
              <h2 className="text-sm font-display font-bold text-foreground mb-0.5">
                {current.title}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {current.description}
              </p>
            </div>
          </div>

          {/* Progress dots + Actions */}
          <div
            className="px-4 pb-3 flex items-center justify-between"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            {/* Dots */}
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

            {/* Buttons */}
            <div className="flex items-center gap-2">
              {step > 0 ? (
                <button
                  onClick={prev}
                  className="flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={finish}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-lg"
                >
                  Skip
                </button>
              )}

              <button
                onClick={next}
                className="flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
                style={{ background: current.color }}
              >
                {isLast ? "Get Started" : "Next"}
                {!isLast && <ChevronRight className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
