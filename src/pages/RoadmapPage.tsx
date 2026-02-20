import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, TrendingUp, Clock, Award, ArrowRight, Download, MessageCircle, RotateCcw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile, RoadmapData } from "@/lib/types";
import { generatePlaceholderRoadmap } from "@/lib/placeholderData";
import { useAuth } from "@/hooks/useAuth";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-cta animate-pulse-soft" />
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">Generating Your Roadmap</h2>
        <p className="text-muted-foreground">Analyzing your profile and finding the best paths...</p>
      </motion.div>
    </div>
  );
}

export default function RoadmapPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("pathwise-profile");
    if (!stored) {
      navigate("/onboarding");
      return;
    }
    const p: UserProfile = JSON.parse(stored);
    setProfile(p);

    const timer = setTimeout(() => {
      setRoadmap(generatePlaceholderRoadmap(p));
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSave = () => {
    const data = { profile, roadmap, savedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pathwise-roadmap.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingScreen />;
  if (!roadmap || !profile) return null;

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/")} className="font-display text-xl font-bold text-foreground tracking-tight">
            Path<span className="text-primary">wise</span>
          </button>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleSave} className="border-border">
              <Download className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button size="sm" className="gradient-cta text-primary-foreground border-0" onClick={() => navigate("/chat")}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask AI
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Summary */}
        <motion.div
          className="glass-card rounded-2xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-cta flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">Your Personalized Roadmap</h1>
              <p className="text-muted-foreground">
                {profile.educationLevel} • {profile.interests.join(", ")}
              </p>
            </div>
          </div>
          <p className="text-foreground/80 leading-relaxed">{roadmap.summary}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Recommended Majors */}
          <motion.div className="glass-card rounded-xl p-6" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Recommended Majors</h2>
            </div>
            <ul className="space-y-2">
              {roadmap.recommendedMajors.map((m) => (
                <li key={m} className="flex items-center gap-2 text-foreground/80">
                  <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Careers */}
          <motion.div className="glass-card rounded-xl p-6 lg:col-span-2" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Possible Careers</h2>
            </div>
            <div className="space-y-3">
              {roadmap.possibleCareers.map((c) => (
                <div key={c.title} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium text-foreground">{c.title}</span>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{c.salary}</span>
                    <span className="flex items-center gap-1 text-accent">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {c.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          className="glass-card rounded-xl p-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Year-by-Year Timeline</h2>
          </div>
          <div className="space-y-0">
            {roadmap.timeline.map((t, i) => (
              <div key={t.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full gradient-cta flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  {i < roadmap.timeline.length - 1 && <div className="w-0.5 flex-1 bg-border my-1" />}
                </div>
                <div className="pb-8">
                  <span className="text-xs font-medium text-accent uppercase tracking-wider">{t.year}</span>
                  <h3 className="font-display font-semibold text-foreground mt-1">{t.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Extracurriculars */}
          <motion.div className="glass-card rounded-xl p-6" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <h2 className="font-display font-semibold text-foreground mb-4">Recommended Activities</h2>
            <ul className="space-y-2">
              {roadmap.extracurriculars.map((e) => (
                <li key={e} className="flex items-center gap-2 text-foreground/80 text-sm">
                  <ArrowRight className="w-3.5 h-3.5 text-accent shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Alternative Paths */}
          <motion.div className="glass-card rounded-xl p-6" initial="hidden" animate="visible" variants={fadeUp} custom={4}>
            <h2 className="font-display font-semibold text-foreground mb-4">Alternative Paths</h2>
            <div className="space-y-4">
              {roadmap.alternativePaths.map((a) => (
                <div key={a.title}>
                  <h3 className="font-medium text-foreground text-sm">{a.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{a.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={() => navigate("/onboarding")} className="border-border">
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
