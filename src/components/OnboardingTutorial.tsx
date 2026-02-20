import { useState, useEffect, useCallback, useRef } from "react";
import { Map, Bot, Briefcase, Compass, X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const TUTORIAL_KEY = "pathwise_tutorial_completed";

const steps = [
  {
    icon: Sparkles,
    title: "Welcome to Pathwise",
    description: "Your AI-powered guide to career planning and education. Let's show you around!",
    color: "hsl(234 62% 45%)",
    selector: null,
  },
  {
    icon: Map,
    title: "Your Roadmap",
    description: "A personalized monthly plan with tasks to keep you on track.",
    color: "hsl(168 45% 45%)",
    selector: '[data-tutorial="roadmap"]',
  },
  {
    icon: Bot,
    title: "AI Advisor",
    description: "Chat with an AI mentor for guidance on any career question.",
    color: "hsl(258 55% 48%)",
    selector: '[data-tutorial="chat"]',
  },
  {
    icon: Briefcase,
    title: "Explore Careers",
    description: "Discover careers that match your interests and skills.",
    color: "hsl(40 95% 50%)",
    selector: '[data-tutorial="careers"]',
  },
  {
    icon: Compass,
    title: "Explore Page",
    description: "Browse interdisciplinary paths and trending opportunities.",
    color: "hsl(200 70% 50%)",
    selector: '[data-tutorial="explore"]',
  },
];

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function OnboardingTutorial() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const highlightedElRef = useRef<Element | null>(null);

  useEffect(() => {
    const done = localStorage.getItem(TUTORIAL_KEY);
    if (!done) setVisible(true);
  }, []);

  const clearHighlight = useCallback(() => {
    if (highlightedElRef.current) {
      (highlightedElRef.current as HTMLElement).style.removeProperty("position");
      (highlightedElRef.current as HTMLElement).style.removeProperty("z-index");
      (highlightedElRef.current as HTMLElement).style.removeProperty("pointer-events");
      highlightedElRef.current = null;
    }
  }, []);

  const measureTarget = useCallback(
    (selector: string | null) => {
      clearHighlight();

      if (!selector) {
        setTargetRect(null);
        return;
      }

      // Try multiple selectors — sidebar items may be hidden on mobile
      const el = document.querySelector(selector);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Only use if element is actually visible (has dimensions and is on screen)
        if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.top < window.innerHeight) {
          // Elevate the element above the overlay so it's visible through the cutout
          const htmlEl = el as HTMLElement;
          htmlEl.style.position = "relative";
          htmlEl.style.zIndex = "102";
          htmlEl.style.pointerEvents = "none";
          highlightedElRef.current = el;

          setTargetRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          });
          return;
        }
      }

      // Element not found or not visible — show centered fallback
      setTargetRect(null);
    },
    [clearHighlight]
  );

  // Measure on step change
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => measureTarget(steps[step].selector), 150);
    return () => clearTimeout(timer);
  }, [step, visible, measureTarget]);

  // Re-measure on resize
  useEffect(() => {
    if (!visible) return;
    const handler = () => measureTarget(steps[step].selector);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [step, visible, measureTarget]);

  // Clean up highlight on unmount
  useEffect(() => {
    return () => clearHighlight();
  }, [clearHighlight]);

  const finish = () => {
    clearHighlight();
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
  const hasTarget = !!(current.selector && targetRect);
  const pad = 8;

  const cutout = targetRect
    ? {
        x: targetRect.left - pad,
        y: targetRect.top - pad,
        w: targetRect.width + pad * 2,
        h: targetRect.height + pad * 2,
        r: 14,
      }
    : null;

  // Position tooltip above the target, clamped to screen
  const tooltipStyle: React.CSSProperties = hasTarget && targetRect
    ? {
        position: "fixed",
        bottom: `${window.innerHeight - targetRect.top + 20}px`,
        left: `clamp(16px, ${targetRect.left + targetRect.width / 2}px, calc(100vw - 16px))`,
        transform: "translateX(-50%)",
      }
    : {
        position: "relative",
      };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "fixed inset-0 z-[100] flex items-center justify-center p-4",
          !hasTarget && "bg-foreground/60 backdrop-blur-sm"
        )}
        onClick={(e) => {
          // Only close if clicking the backdrop itself (not the card)
          if (e.target === e.currentTarget && !hasTarget) finish();
        }}
      >
        {/* SVG overlay with spotlight cutout */}
        {hasTarget && cutout && (
          <svg
            className="fixed inset-0 w-full h-full z-[100]"
            style={{ pointerEvents: "none" }}
          >
            <defs>
              <mask id="tutorial-spotlight-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect
                  x={cutout.x}
                  y={cutout.y}
                  width={cutout.w}
                  height={cutout.h}
                  rx={cutout.r}
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.6)"
              mask="url(#tutorial-spotlight-mask)"
              style={{ pointerEvents: "all" }}
              onClick={finish}
            />
            {/* Glow ring around cutout */}
            <rect
              x={cutout.x - 2}
              y={cutout.y - 2}
              width={cutout.w + 4}
              height={cutout.h + 4}
              rx={cutout.r + 2}
              fill="none"
              stroke="hsl(234 62% 55%)"
              strokeWidth="2"
              strokeOpacity="0.5"
            />
          </svg>
        )}

        {/* Tooltip card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: hasTarget ? 8 : 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={cn(
            "relative z-[101] w-full max-w-xs bg-card rounded-2xl shadow-2xl border border-border/50 overflow-visible"
          )}
          style={tooltipStyle}
        >
          {/* Arrow pointing down to target */}
          {hasTarget && (
            <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-card border-r border-b border-border/50" />
          )}

          {/* Close button */}
          <button
            onClick={finish}
            className="absolute top-3 right-3 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon */}
          <div className="flex items-center justify-center pt-6 pb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: current.color }}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="px-5 pb-1.5 text-center">
            <h2 className="text-base font-display font-bold text-foreground mb-1">
              {current.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 py-3">
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

          {/* Actions */}
          <div className="px-5 pb-5 flex items-center justify-between gap-3">
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
              className="flex items-center gap-1.5 text-sm font-semibold text-primary-foreground px-5 py-2 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
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
