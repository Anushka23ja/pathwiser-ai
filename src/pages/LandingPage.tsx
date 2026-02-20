import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Target, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.png";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Paths",
    description: "Get personalized academic recommendations based on your unique interests, goals, and circumstances.",
  },
  {
    icon: BookOpen,
    title: "Year-by-Year Roadmap",
    description: "See a clear timeline of courses, extracurriculars, and milestones from where you are to where you want to be.",
  },
  {
    icon: Target,
    title: "Career Alignment",
    description: "Discover majors and careers that match your passions, with salary data and growth projections.",
  },
  {
    icon: MessageCircle,
    title: "AI Advisor Chat",
    description: "Ask questions about Running Start, medical school prep, choosing majors, and more.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            Path<span className="text-primary">wise</span>
          </span>
          <Button
            size="sm"
            className="gradient-cta text-primary-foreground border-0 hover:opacity-90 transition-opacity"
            onClick={() => navigate("/auth")}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="container mx-auto relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Education Planning
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6"
            >
              Find Your Education Path{" "}
              <span className="text-gradient">with AI</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Personalized academic planning for every stage — from high school to
              master's degree. Get AI-driven recommendations tailored to your
              goals, interests, and budget.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-cta text-primary-foreground border-0 hover:opacity-90 transition-opacity text-lg px-8 py-6 shadow-elevated"
                onClick={() => navigate("/auth")}
              >
                Start My Path
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-border hover:bg-muted transition-colors"
                onClick={() => navigate("/chat")}
              >
                Ask AI Advisor
                <MessageCircle className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Everything You Need to Plan Ahead
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Smart tools to navigate your academic journey with confidence.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass-card rounded-xl p-6 hover:shadow-elevated transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          className="container mx-auto max-w-3xl gradient-hero rounded-2xl p-12 text-center shadow-elevated relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent blur-3xl" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold text-primary-foreground mb-4">
              Ready to Map Your Future?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
              Answer a few questions and get a personalized education roadmap in minutes.
            </p>
            <Button
              size="lg"
              className="bg-card text-foreground hover:bg-card/90 text-lg px-8 py-6 shadow-elevated"
              onClick={() => navigate("/auth")}
            >
              Start My Path
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <span className="font-display font-semibold text-foreground">
            Path<span className="text-primary">wise</span>
          </span>
          <p>© 2026 Pathwise. AI-powered education planning.</p>
        </div>
      </footer>
    </div>
  );
}
