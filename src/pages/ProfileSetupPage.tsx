import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Building2, Briefcase, Target, Lightbulb, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { stageOptions, StageOption } from "@/lib/monthlyPlannerData";

const steps = [
  { id: "level", title: "About You" },
  { id: "stage", title: "Your Stage" },
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

// Stage options grouped by education level
function getStageOptionsForLevel(level: string): StageOption[] {
  switch (level) {
    case "High School":
      return stageOptions.filter(s => s.group === "High School" || s.id === "rs-1" || s.id === "rs-2" || s.id === "gap-year");
    case "College":
      return stageOptions.filter(s => s.group === "College" || s.id === "masters" || s.id === "gap-year");
    case "Professional":
      return stageOptions.filter(s => s.id === "early-pro" || s.id === "masters" || s.id === "gap-year");
    default:
      return [];
  }
}

function getWhyOptions(stage: string): string[] {
  // High school stages
  if (["9th", "10th"].includes(stage)) return [
    "I don't know what career to pick",
    "I want to explore different college options",
    "I need help building my extracurricular profile",
    "I want to prepare for standardized tests",
    "I want to understand what majors fit me",
    "I'm exploring trade school vs. college",
    "I want to start preparing early for scholarships",
  ];
  if (["11th", "12th"].includes(stage)) return [
    "I need help with college applications and essays",
    "I want to compare colleges and programs",
    "I need to prepare for SAT/ACT",
    "I'm looking for scholarships and financial aid",
    "I want to explore gap year options",
    "I don't know what major to choose",
    "I want to build a strong application profile",
    "I'm considering Running Start or dual enrollment",
  ];
  // Running Start
  if (["rs-1", "rs-2"].includes(stage)) return [
    "I want to maximize my transfer credits",
    "I need help choosing a 4-year university",
    "I want to balance HS requirements and college courses",
    "I'm planning my associate degree completion",
    "I want to explore career options while earning credits",
    "I need help with transfer applications",
    "I want to find scholarships for transfer students",
  ];
  // College stages
  if (stage === "col-fresh") return [
    "I'm undecided on my major",
    "I want to explore different career paths",
    "I want to get involved on campus",
    "I need help adjusting to college academics",
    "I want to find research or internship opportunities",
    "I'm considering switching schools",
    "I need help managing finances and budgeting",
  ];
  if (stage === "col-soph") return [
    "I need to declare my major",
    "I want to land my first internship",
    "I'm thinking about switching majors",
    "I want to build a professional network",
    "I'm considering study abroad",
    "I need help with career fair preparation",
    "I want to start building my portfolio",
  ];
  if (stage === "col-junior") return [
    "I want to secure a competitive internship",
    "I'm deciding between grad school and working",
    "I need to prepare for the GRE/GMAT/LSAT",
    "I want to build leadership experience",
    "I need help with graduate school applications",
    "I want to network with industry professionals",
    "I'm planning my senior year strategically",
  ];
  if (stage === "col-senior") return [
    "I'm applying to full-time jobs",
    "I'm applying to graduate programs",
    "I need help with interview preparation",
    "I want to negotiate my first salary",
    "I'm finishing my thesis or capstone",
    "I need to compare job offers",
    "I'm planning my post-graduation transition",
  ];
  // Master's applicant
  if (stage === "masters") return [
    "I want to find the right graduate program",
    "I need help with my statement of purpose",
    "I'm preparing for entrance exams (GRE/GMAT/LSAT)",
    "I want to secure research or teaching assistantships",
    "I need to find fellowship and funding opportunities",
    "I want to strengthen my application profile",
    "I'm comparing programs by career outcomes",
    "I want to transition into a new field through grad school",
  ];
  // Gap year
  if (stage === "gap-year") return [
    "I want to use my gap year productively",
    "I'm exploring career options before committing",
    "I want to gain work or volunteer experience",
    "I need to save money for school",
    "I'm applying to college during my gap year",
    "I want to travel and learn new skills",
    "I need a plan so I don't lose momentum",
  ];
  // Early professional
  if (stage === "early-pro") return [
    "I want to advance in my current role",
    "I'm considering a career switch",
    "I want to earn certifications or upskill",
    "I'm thinking about going back to school",
    "I want to move into management or leadership",
    "I'm exploring freelancing or entrepreneurship",
    "I want to increase my earning potential",
    "I need better work-life balance",
  ];
  // Default
  return [
    "I don't know what career to pick",
    "I want to switch my major or career",
    "I'm exploring graduate school options",
    "I want to advance in my current field",
    "I need help planning my next steps",
    "I want to compare different career paths",
    "I want to find higher-paying opportunities",
  ];
}

function getCareerOptions(stage: string): string[] {
  // Master's / grad-focused
  if (stage === "masters") return [
    "Academic Research",
    "Data Science & AI",
    "Healthcare & Clinical Research",
    "Business & Consulting",
    "Engineering & R&D",
    "Law & Policy",
    "Education & Higher Ed Administration",
    "Biotech & Pharmaceuticals",
    "Finance & Quantitative Analysis",
    "Public Health & Epidemiology",
    "Psychology & Counseling",
    "Environmental Science & Sustainability",
  ];
  // Early professional
  if (stage === "early-pro") return [
    "Software & Tech",
    "Product Management",
    "Data & Analytics",
    "Healthcare & Medicine",
    "Business & Consulting",
    "Marketing & Growth",
    "Finance & Investment",
    "Engineering & Manufacturing",
    "Design & UX",
    "Sales & Business Development",
    "Project & Operations Management",
    "Entrepreneurship & Startups",
  ];
  // College juniors/seniors — career-focused
  if (["col-junior", "col-senior"].includes(stage)) return [
    "Software & Tech",
    "Healthcare & Medicine",
    "Business & Finance",
    "Engineering",
    "Data Science & Analytics",
    "Creative & Design",
    "Law & Policy",
    "Consulting & Strategy",
    "Science & Research",
    "Marketing & Communications",
    "Entrepreneurship",
    "Nonprofit & Social Impact",
  ];
  // Default / HS / early college — broader exploration
  return [
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
}


function ToggleChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
        selected
          ? "bg-primary text-primary-foreground border-primary shadow-elevated"
          : "bg-card text-foreground border-border hover:border-primary/30 hover:bg-muted"
      }`}
    >
      <CheckCircle2 className={`w-4 h-4 shrink-0 transition-opacity ${selected ? "opacity-100" : "opacity-0 w-0 gap-0"}`} />
      <span>{label}</span>
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

function StageCard({ stage, selected, onClick }: { stage: StageOption; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
        selected
          ? "border-primary bg-primary/5 shadow-elevated"
          : "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
        selected ? "border-primary bg-primary" : "border-border"
      }`}>
        {selected && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground text-sm">{stage.label}</h4>
        <p className="text-muted-foreground text-xs mt-0.5">{stage.description}</p>
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
    stage: "" as string,
    levelDetails: [] as string[],
    whyUsing: [] as string[],
    careerInterests: [] as string[],
    schoolName: "",
    intendedMajor: "",
    yearsExperience: "",
    currentField: "",
  });

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  const toggleArrayItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item];

  const canProceed = () => {
    switch (step) {
      case 0: return profile.educationLevel !== "";
      case 1: return profile.stage !== "";
      case 2: return profile.levelDetails.length > 0;
      case 3: return profile.whyUsing.length > 0;
      case 4: return profile.careerInterests.length > 0;
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
          grade_year: profile.stage,
          school_name: profile.schoolName || null,
          interests: profile.whyUsing,
          career_interests: profile.careerInterests,
          long_term_goals: profile.whyUsing,
          favorite_subjects: profile.levelDetails,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      // Save to localStorage for roadmap and other pages
      localStorage.setItem("pathwise-profile", JSON.stringify({
        educationLevel: profile.educationLevel,
        interests: profile.careerInterests,
        favoriteSubjects: profile.levelDetails,
        careerInterests: profile.careerInterests,
        gpaRange: "",
        budgetConcern: "",
        location: "",
        longTermGoals: profile.whyUsing,
        intendedMajor: profile.intendedMajor,
        yearsExperience: profile.yearsExperience,
        currentField: profile.currentField,
      }));

      // Save stage for roadmap auto-generation
      localStorage.setItem("pathwise-selected-stage", profile.stage);

      toast({ title: "You're all set!", description: "Generating your personalized roadmap..." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const progress = ((step + 1) / steps.length) * 100;
  const detailOptions = levelDetailOptions[profile.educationLevel] || [];
  const availableStages = getStageOptionsForLevel(profile.educationLevel);

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
                        onClick={() => setProfile({ ...profile, educationLevel: card.value, levelDetails: [], stage: "" })}
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

              {/* Step 2: Specific Stage */}
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-7 h-7 text-primary" />
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                      Where exactly are you right now?
                    </h2>
                  </div>
                  <p className="text-muted-foreground mb-8">
                    This determines your personalized roadmap — we'll build time-sensitive milestones starting from this point.
                  </p>

                  <div className="grid gap-3">
                    {availableStages.map((stage) => (
                      <StageCard
                        key={stage.id}
                        stage={stage}
                        selected={profile.stage === stage.id}
                        onClick={() => setProfile({ ...profile, stage: stage.id, whyUsing: [], careerInterests: [] })}
                      />
                    ))}
                  </div>

                  {/* Conditional follow-up fields */}
                  {profile.stage && profile.educationLevel === "College" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Intended or declared major (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Computer Science, Biology, Undeclared..."
                        value={profile.intendedMajor}
                        onChange={(e) => setProfile({ ...profile, intendedMajor: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </motion.div>
                  )}

                  {profile.stage && profile.educationLevel === "Professional" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Years of experience
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["< 1 year", "1–3 years", "3–5 years", "5–10 years", "10+ years"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setProfile({ ...profile, yearsExperience: opt })}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                                profile.yearsExperience === opt
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-card text-foreground border-border hover:border-primary/30"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Current or target field (optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Software Engineering, Marketing, Healthcare..."
                          value={profile.currentField}
                          onChange={(e) => setProfile({ ...profile, currentField: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 3: Level-specific details */}
              {step === 2 && (
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

              {/* Step 4: Why are you here */}
              {step === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Lightbulb className="w-7 h-7 text-primary" />
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Why are you using Pathwise?</h2>
                  </div>
                  <p className="text-muted-foreground mb-8">Select all that apply — this helps us give better recommendations.</p>
                  <div className="flex flex-wrap gap-3">
                    {getWhyOptions(profile.stage).map((opt) => (
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

              {/* Step 5: Career interests */}
              {step === 4 && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-7 h-7 text-primary" />
                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Careers you want to explore</h2>
                  </div>
                  <p className="text-muted-foreground mb-8">Pick the fields you're curious about — we'll build your roadmap around these.</p>
                  <div className="flex flex-wrap gap-3">
                    {getCareerOptions(profile.stage).map((opt) => (
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
