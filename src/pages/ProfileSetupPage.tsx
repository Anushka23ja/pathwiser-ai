import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Building2, Briefcase, Target, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const steps = [
  { id: "level", title: "About You" },
  { id: "details", title: "Your Situation" },
  { id: "why", title: "Your Why" },
  { id: "careers", title: "Career Goals" },
];

const levelCards = [
  {
    value: "High School",
    icon: GraduationCap,
    title: "High School Student",
    description: "I'm in high school exploring what comes next — college, trade school, or other paths.",
  },
  {
    value: "College",
    icon: Building2,
    title: "College Student",
    description: "I'm currently enrolled in college (community college, university, or Running Start).",
  },
  {
    value: "Professional",
    icon: Briefcase,
    title: "Working Professional",
    description: "I'm already working and looking to advance, switch careers, or go back to school.",
  },
];

const levelDetailOptions: Record<string, { label: string; description: string }[]> = {
  "High School": [
    { label: "Running Start / Dual Enrollment", description: "I want to earn college credits while still in high school" },
    { label: "First-Generation College Student", description: "I'd be the first in my family to attend college" },
    { label: "AP / IB Courses", description: "I'm taking or plan to take Advanced Placement or IB classes" },
    { label: "College Prep & Applications", description: "I need help with college applications, essays, and scholarships" },
    { label: "Trade / Vocational Path", description: "I'm interested in trade school, apprenticeships, or certifications" },
    { label: "Undecided on College", description: "I'm not sure if college is the right move for me" },
    { label: "Financial Aid & Scholarships", description: "I need guidance on how to pay for higher education" },
    { label: "Early Career Exploration", description: "I want to explore careers through internships or job shadowing" },
  ],
  "College": [
    { label: "Thinking of Switching Majors", description: "My current major might not be the right fit for me" },
    { label: "Transfer Student", description: "I'm transferring or considering transferring to another school" },
    { label: "Graduate School Prep", description: "I want to prepare for a master's, PhD, or professional degree" },
    { label: "First-Generation College Student", description: "I'm the first in my family to attend college" },
    { label: "Internship & Co-op Search", description: "I want to land internships or co-ops in my field" },
    { label: "Research Opportunities", description: "I want to get involved in academic or industry research" },
    { label: "Career Fair & Networking", description: "I need help preparing for career fairs and building connections" },
    { label: "Debt & Financial Planning", description: "I want to manage student loans and plan financially" },
  ],
  "Professional": [
    { label: "Career Switch", description: "I want to transition into a completely different field" },
    { label: "Going Back to School", description: "I'm considering a degree or certificate program" },
    { label: "Certifications & Upskilling", description: "I want to earn certifications to advance or pivot" },
    { label: "Leadership & Management", description: "I want to move into a leadership or management role" },
    { label: "Freelance / Side Business", description: "I'm exploring freelancing or starting a side business" },
    { label: "Salary Negotiation & Growth", description: "I want to increase my earning potential" },
    { label: "Bootcamp or Accelerated Program", description: "I'm looking at intensive short-term programs" },
    { label: "Work-Life Balance Optimization", description: "I want a career that better fits my lifestyle goals" },
  ],
};

const whyOptions = [
  "I don't know what career to pick",
  "I want to switch my major or career",
  "I'm exploring graduate school options",
  "I want to advance in my current field",
  "I need help planning my next steps",
  "I want to compare different career paths",
  "I'm considering going back to school",
  "I want to find higher-paying opportunities",
];

const careerInterestOptions = [
  "Software & Tech",
  "Healthcare & Medicine",
  "Business & Finance",
  "Engineering",
  "Education & Teaching",
  "Creative & Design",
  "Law & Policy",
  "Science & Research",
  "Trades & Skilled Labor",
  "Marketing & Communications",
  "Social Work & Counseling",
  "Entrepreneurship",
];

function ToggleChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-elevated"
          : "bg-card text-foreground border-border hover:border-primary/30 hover:bg-muted"
      }`}
    >
      {selected && <CheckCircle2 className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
      {label}
    </button>
  );
}

function DetailCard({ label, description, selected, onClick }: { label: string; description: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
        selected
          ? "border-primary bg-primary/5 shadow-elevated"
          : "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
        selected ? "border-primary bg-primary" : "border-border"
      }`}>
        {selected && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-foreground text-sm">{label}</h4>
        <p className="text-muted-foreground text-xs mt-0.5">{description}</p>
      </div>
    </button>
  );
}

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    educationLevel: "",
    levelDetails: [] as string[],
    whyUsing: [] as string[],
    careerInterests: [] as string[],
    schoolName: "",
  });

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  const toggleArrayItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item];

  const canProceed = () => {
    switch (step) {
      case 0: return profile.educationLevel !== "";
      case 1: return profile.levelDetails.length > 0;
      case 2: return profile.whyUsing.length > 0;
      case 3: return profile.careerInterests.length > 0;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          education_level: profile.educationLevel,
          school_name: profile.schoolName || null,
          interests: profile.whyUsing,
          career_interests: profile.careerInterests,
          long_term_goals: profile.whyUsing,
          favorite_subjects: profile.levelDetails,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      localStorage.setItem("pathwise-profile", JSON.stringify({
        educationLevel: profile.educationLevel,
        interests: profile.careerInterests,
        favoriteSubjects: profile.levelDetails,
        careerInterests: profile.careerInterests,
        gpaRange: "",
        budgetConcern: "",
        location: "",
        longTermGoals: profile.whyUsing,
      }));

      toast({ title: "You're all set!", description: "Generating your personalized roadmap..." });
      navigate("/roadmap");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const progress = ((step + 1) / steps.length) * 100;
  const detailOptions = levelDetailOptions[profile.educationLevel] || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            Path<span className="text-primary">wise</span>
          </span>
          <span className="text-sm text-muted-foreground">
            Step {step + 1} of {steps.length}
          </span>
        </div>
      </nav>

      <div className="w-full bg-muted h-1.5">
        <motion.div
          className="h-full gradient-cta rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Education Level */}
              {step === 0 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">Which best describes you?</h2>
                  <p className="text-muted-foreground mb-8">Pick one so we can personalize your experience.</p>

                  <div className="grid gap-4">
                    {levelCards.map((card) => (
                      <button
                        key={card.value}
                        type="button"
                        onClick={() => setProfile({ ...profile, educationLevel: card.value, levelDetails: [] })}
                        className={`flex items-start gap-4 p-5 rounded-xl border text-left transition-all duration-200 ${
                          profile.educationLevel === card.value
                            ? "border-primary bg-primary/5 shadow-elevated"
                            : "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          profile.educationLevel === card.value
                            ? "gradient-cta"
                            : "bg-muted"
                        }`}>
                          <card.icon className={`w-6 h-6 ${
                            profile.educationLevel === card.value
                              ? "text-primary-foreground"
                              : "text-muted-foreground"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-display font-semibold text-foreground">{card.title}</h3>
                            {profile.educationLevel === card.value && (
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm mt-1">{card.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {profile.educationLevel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6"
                    >
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {profile.educationLevel === "Professional"
                          ? "Company or last school (optional)"
                          : "School or college name (optional)"}
                      </label>
                      <input
                        type="text"
                        placeholder={
                          profile.educationLevel === "High School"
                            ? "e.g. Lincoln High School"
                            : profile.educationLevel === "College"
                            ? "e.g. University of Washington"
                            : "e.g. Google, Amazon, previous school..."
                        }
                        value={profile.schoolName}
                        onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 2: Level-specific details */}
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-7 h-7 text-primary" />
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                      {profile.educationLevel === "High School"
                        ? "Tell us more about your path"
                        : profile.educationLevel === "College"
                        ? "Where are you in your journey?"
                        : "What are you looking for?"}
                    </h2>
                  </div>
                  <p className="text-muted-foreground mb-8">
                    Select all that apply — this helps us show you the most relevant options and resources.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {detailOptions.map((opt) => (
                      <DetailCard
                        key={opt.label}
                        label={opt.label}
                        description={opt.description}
                        selected={profile.levelDetails.includes(opt.label)}
                        onClick={() => setProfile({ ...profile, levelDetails: toggleArrayItem(profile.levelDetails, opt.label) })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Why are you here */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Lightbulb className="w-7 h-7 text-primary" />
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Why are you using Pathwise?</h2>
                  </div>
                  <p className="text-muted-foreground mb-8">Select all that apply — this helps us give better recommendations.</p>
                  <div className="flex flex-wrap gap-3">
                    {whyOptions.map((opt) => (
                      <ToggleChip
                        key={opt}
                        label={opt}
                        selected={profile.whyUsing.includes(opt)}
                        onClick={() => setProfile({ ...profile, whyUsing: toggleArrayItem(profile.whyUsing, opt) })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Career interests */}
              {step === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-7 h-7 text-primary" />
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Careers you want to explore</h2>
                  </div>
                  <p className="text-muted-foreground mb-8">Pick the fields you're curious about — we'll build your roadmap around these.</p>
                  <div className="flex flex-wrap gap-3">
                    {careerInterestOptions.map((opt) => (
                      <ToggleChip
                        key={opt}
                        label={opt}
                        selected={profile.careerInterests.includes(opt)}
                        onClick={() => setProfile({ ...profile, careerInterests: toggleArrayItem(profile.careerInterests, opt) })}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-12">
            <Button
              variant="outline"
              onClick={() => (step > 0 ? setStep(step - 1) : null)}
              disabled={step === 0}
              className="border-border hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button
                className="gradient-cta text-primary-foreground border-0 hover:opacity-90"
                disabled={!canProceed()}
                onClick={() => setStep(step + 1)}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="gradient-cta text-primary-foreground border-0 hover:opacity-90"
                disabled={!canProceed() || saving}
                onClick={handleSubmit}
              >
                {saving ? "Saving..." : "Build My Roadmap"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
