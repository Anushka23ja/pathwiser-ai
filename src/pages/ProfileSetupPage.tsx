import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Building2, Briefcase, Target, Lightbulb, Sparkles, MapPin, Loader2 } from "lucide-react";
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
    description: "Exploring what comes next",
  },
  {
    value: "College",
    icon: Building2,
    title: "College Student",
    description: "Currently enrolled in college",
  },
  {
    value: "Professional",
    icon: Briefcase,
    title: "Working Professional",
    description: "Advancing or switching careers",
  },
];

// Hardcoded fallbacks in case AI fails
const fallbackDetailOptions: Record<string, { label: string; description: string }[]> = {
  "High School": [
    { label: "College Prep & Applications", description: "I need help with college applications, essays, and scholarships" },
    { label: "Trade / Vocational Path", description: "I'm interested in trade school, apprenticeships, or certifications" },
    { label: "Financial Aid & Scholarships", description: "I need guidance on how to pay for higher education" },
    { label: "Early Career Exploration", description: "I want to explore careers through internships or job shadowing" },
  ],
  "College": [
    { label: "Thinking of Switching Majors", description: "My current major might not be the right fit" },
    { label: "Graduate School Prep", description: "I want to prepare for a master's, PhD, or professional degree" },
    { label: "Internship & Co-op Search", description: "I want to land internships or co-ops in my field" },
    { label: "Career Fair & Networking", description: "I need help preparing for career fairs" },
  ],
  "Professional": [
    { label: "Career Switch", description: "I want to transition into a completely different field" },
    { label: "Certifications & Upskilling", description: "I want to earn certifications to advance or pivot" },
    { label: "Leadership & Management", description: "I want to move into a leadership or management role" },
    { label: "Freelance / Side Business", description: "I'm exploring freelancing or starting a side business" },
  ],
};

const fallbackWhyByLevel: Record<string, string[]> = {
  "High School": [
    "Explore career options",
    "Prep for college apps",
    "Find scholarships",
    "Build my resume early",
    "Discover my strengths",
    "Plan extracurriculars",
    "Learn about trade paths",
    "Get ahead academically",
  ],
  "College": [
    "Choose the right major",
    "Land internships",
    "Prep for grad school",
    "Build professional network",
    "Explore career pivots",
    "Improve my GPA strategy",
    "Find research opportunities",
    "Plan post-graduation life",
  ],
  "Professional": [
    "Switch careers entirely",
    "Earn new certifications",
    "Move into leadership",
    "Start a side business",
    "Negotiate higher salary",
    "Find mentorship opportunities",
    "Go back to school",
    "Build a personal brand",
  ],
};

const fallbackCareersByLevel: Record<string, string[]> = {
  "High School": [
    "Software & Tech", "Healthcare", "Engineering", "Creative & Design",
    "Business", "Trades & Skilled Labor", "Science & Research", "Education",
    "Media & Film", "Law & Government", "Environmental Science", "Psychology",
  ],
  "College": [
    "Software Engineering", "Data Science", "Healthcare & Medicine", "Finance & Consulting",
    "Engineering", "UX/Product Design", "Research & Academia", "Marketing & Media",
    "Law", "Education", "Environmental Science", "Psychology & Counseling",
    "Government & Policy", "Entrepreneurship",
  ],
  "Professional": [
    "Tech & Software", "Product Management", "Data & Analytics", "Healthcare Leadership",
    "Finance & Investing", "Consulting", "Entrepreneurship", "Creative Direction",
    "Education & Training", "Legal", "Government & Public Service", "Trades & Skilled Labor",
    "Nonprofit & Social Impact", "Media & Communications",
  ],
};

function getStageOptionsForLevel(level: string): StageOption[] {
  switch (level) {
    case "High School":
      return stageOptions.filter(s => s.group === "High School" || s.id === "rs-1" || s.id === "rs-2" || s.id === "gap-year");
    case "College":
      return stageOptions.filter(s => s.group === "College" || s.id === "masters" || s.id === "gap-year" || s.id === "new-grad");
    case "Professional":
      return stageOptions.filter(s => s.id === "early-pro" || s.id === "masters" || s.id === "gap-year");
    default:
      return [];
  }
}

function ToggleChip({ label, selected, onClick, stacked }: { label: string; selected: boolean; onClick: () => void; stacked?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
        stacked ? "w-full justify-start" : ""
      } ${
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

interface AIQuestions {
  situationOptions: { label: string; description: string }[];
  whyOptions: string[];
  careerOptions: string[];
}

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<AIQuestions | null>(null);
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

  // Fetch AI-generated questions when moving from step 1 (stage) to step 2
  const fetchAIQuestions = async () => {
    setLoadingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke("onboarding-ai", {
        body: {
          action: "generate_questions",
          context: {
            educationLevel: profile.educationLevel,
            stage: profile.stage,
            previousAnswers: {
              schoolName: profile.schoolName,
              intendedMajor: profile.intendedMajor,
              yearsExperience: profile.yearsExperience,
              currentField: profile.currentField,
              levelDetails: profile.levelDetails,
            },
          },
        },
      });

      if (error) throw error;
      if (data?.result) {
        setAiQuestions(data.result);
      }
    } catch (err) {
      console.error("AI questions error:", err);
      // Use fallbacks silently
      setAiQuestions(null);
    } finally {
      setLoadingAI(false);
    }
  };

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

  const handleNext = async () => {
    if (step === 1 && profile.stage) {
      // Trigger AI question generation when leaving stage step
      await fetchAIQuestions();
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Save profile to DB
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

      // Save to localStorage
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
      localStorage.setItem("pathwise-selected-stage", profile.stage);

      // Now generate AI roadmap
      toast({ title: "Profile saved!", description: "Our AI is building your personalized roadmap..." });

      try {
        const { data: roadmapData, error: roadmapError } = await supabase.functions.invoke("onboarding-ai", {
          body: {
            action: "generate_roadmap",
            context: {
              educationLevel: profile.educationLevel,
              stage: profile.stage,
              levelDetails: profile.levelDetails,
              whyUsing: profile.whyUsing,
              careerInterests: profile.careerInterests,
              schoolName: profile.schoolName,
              intendedMajor: profile.intendedMajor,
              yearsExperience: profile.yearsExperience,
              currentField: profile.currentField,
            },
          },
        });

        if (roadmapError) throw roadmapError;
        if (roadmapData?.result) {
          localStorage.setItem("pathwise-ai-roadmap", JSON.stringify(roadmapData.result));
        }
      } catch (aiErr) {
        console.error("AI roadmap generation failed:", aiErr);
        // Will fall back to static roadmap on roadmap page
      }

      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const progress = ((step + 1) / steps.length) * 100;
  const availableStages = getStageOptionsForLevel(profile.educationLevel);

  // Use AI questions or fallbacks
  const detailOptions = aiQuestions?.situationOptions || fallbackDetailOptions[profile.educationLevel] || [];
  const whyOptions = aiQuestions?.whyOptions || fallbackWhyByLevel[profile.educationLevel] || fallbackWhyByLevel["High School"];
  const careerOptions = aiQuestions?.careerOptions || fallbackCareersByLevel[profile.educationLevel] || fallbackCareersByLevel["High School"];

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <nav className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-foreground tracking-tight">
            Path<span className="text-primary">wise</span>
          </span>
          <span className="text-xs text-muted-foreground">
            {step + 1} / {steps.length}
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

      <div className="flex-1 flex flex-col justify-center px-4 py-4 sm:px-6 sm:py-8 overflow-y-auto">
        <div className="w-full max-w-lg mx-auto">
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
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-1">Which describes you?</h2>
                  <p className="text-muted-foreground text-sm mb-5">Pick one to personalize your experience.</p>

                  <div className="grid gap-3">
                    {levelCards.map((card) => (
                      <button
                        key={card.value}
                        type="button"
                        onClick={() => setProfile({ ...profile, educationLevel: card.value, levelDetails: [], stage: "", whyUsing: [], careerInterests: [] })}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                          profile.educationLevel === card.value
                            ? "border-primary bg-primary/5 shadow-elevated"
                            : "border-border bg-card hover:border-primary/30 hover:bg-muted/50"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          profile.educationLevel === card.value ? "gradient-cta" : "bg-muted"
                        }`}>
                          <card.icon className={`w-5 h-5 ${
                            profile.educationLevel === card.value ? "text-primary-foreground" : "text-muted-foreground"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-display font-semibold text-foreground text-sm">{card.title}</h3>
                            {profile.educationLevel === card.value && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                          </div>
                          <p className="text-muted-foreground text-xs">{card.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {profile.educationLevel && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {profile.educationLevel === "Professional" ? "Company or last school (optional)" : "School or college name (optional)"}
                      </label>
                      <input
                        type="text"
                        placeholder={
                          profile.educationLevel === "High School" ? "e.g. Lincoln High School"
                            : profile.educationLevel === "College" ? "e.g. University of Washington"
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
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">Where are you now?</h2>
                  </div>
                  <p className="text-muted-foreground text-sm mb-5">We'll build milestones from this point.</p>

                  <div className="grid gap-2.5">
                    {availableStages.map((stage) => (
                      <StageCard
                        key={stage.id}
                        stage={stage}
                        selected={profile.stage === stage.id}
                        onClick={() => setProfile({ ...profile, stage: stage.id, whyUsing: [], careerInterests: [], levelDetails: [] })}
                      />
                    ))}
                  </div>

                  {profile.stage && profile.educationLevel === "College" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6">
                      <label className="block text-sm font-medium text-foreground mb-2">Intended or declared major (optional)</label>
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
                        <label className="block text-sm font-medium text-foreground mb-2">Years of experience</label>
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
                        <label className="block text-sm font-medium text-foreground mb-2">Current or target field (optional)</label>
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

              {/* Step 3: AI-generated situation options */}
              {step === 2 && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-primary shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                      {profile.educationLevel === "High School" ? "Tell us about your path"
                        : profile.educationLevel === "College" ? "Where in your journey?"
                        : "What are you looking for?"}
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">Select all that apply.</p>
                  {loadingAI && (
                    <div className="flex items-center gap-2 text-primary text-xs mb-3">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>AI is personalizing your options...</span>
                    </div>
                  )}
                  {!loadingAI && aiQuestions && (
                    <p className="text-xs text-accent mb-3 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Personalized by AI
                    </p>
                  )}
                  <div className="grid gap-2.5">
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

              {/* Step 4: AI-generated why options */}
              {step === 3 && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="w-5 h-5 text-primary shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">Why use Pathwise?</h2>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">Select all that apply.</p>
                  {aiQuestions && (
                    <p className="text-xs text-accent mb-3 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Personalized for you
                    </p>
                  )}
                  <div className="flex flex-col gap-2">
                    {whyOptions.map((opt) => (
                      <ToggleChip
                        key={opt}
                        label={opt}
                        selected={profile.whyUsing.includes(opt)}
                        onClick={() => setProfile({ ...profile, whyUsing: toggleArrayItem(profile.whyUsing, opt) })}
                        stacked
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: AI-generated career options */}
              {step === 4 && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-5 h-5 text-primary shrink-0" />
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">Careers to explore</h2>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">Pick fields you're curious about.</p>
                  {aiQuestions && (
                    <p className="text-xs text-accent mb-3 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Curated for your answers
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {careerOptions.map((opt) => (
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

          <div className="flex justify-between items-center mt-6 sm:mt-10 pb-4">
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
                disabled={!canProceed() || loadingAI}
                onClick={handleNext}
              >
                {loadingAI ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    AI is thinking...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                className="gradient-cta text-primary-foreground border-0 hover:opacity-90"
                disabled={!canProceed() || saving}
                onClick={handleSubmit}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Building Roadmap...
                  </>
                ) : (
                  <>
                    Build My Roadmap
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
