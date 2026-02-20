import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/types";

const steps = [
  { id: "education", title: "Education Level" },
  { id: "interests", title: "Interests" },
  { id: "subjects", title: "Subjects" },
  { id: "careers", title: "Careers" },
  { id: "details", title: "Details" },
  { id: "goals", title: "Goals" },
];

const educationLevels = ["High School", "Running Start", "Undergraduate", "Master's Degree"];
const interestOptions = ["Science & Technology", "Business & Finance", "Arts & Humanities", "Healthcare & Medicine", "Engineering", "Social Sciences", "Education", "Law & Policy"];
const subjectOptions = ["Mathematics", "Biology", "Chemistry", "Physics", "English", "History", "Computer Science", "Psychology", "Economics", "Art & Design"];
const careerOptions = ["Software Engineer", "Doctor/Physician", "Business Analyst", "Teacher", "Data Scientist", "Designer", "Lawyer", "Nurse", "Entrepreneur", "Researcher"];
const gpaRanges = ["4.0", "3.5–3.9", "3.0–3.4", "2.5–2.9", "Below 2.5", "Not sure"];
const budgetOptions = ["No concerns", "Some concerns", "Major concern", "Need full scholarship"];
const goalOptions = ["High salary", "Making an impact", "Work-life balance", "Entrepreneurship", "Creative expression", "Not sure yet"];

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

function SingleSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <ToggleChip key={opt} label={opt} selected={value === opt} onClick={() => onChange(opt)} />
      ))}
    </div>
  );
}

function MultiSelect({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <ToggleChip key={opt} label={opt} selected={value.includes(opt)} onClick={() => toggle(opt)} />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    educationLevel: "",
    interests: [],
    favoriteSubjects: [],
    careerInterests: [],
    gpaRange: "",
    budgetConcern: "",
    location: "",
    longTermGoals: [],
  });

  const canProceed = () => {
    switch (step) {
      case 0: return profile.educationLevel !== "";
      case 1: return profile.interests.length > 0;
      case 2: return profile.favoriteSubjects.length > 0;
      case 3: return profile.careerInterests.length > 0;
      case 4: return profile.gpaRange !== "" && profile.budgetConcern !== "";
      case 5: return profile.longTermGoals.length > 0;
      default: return false;
    }
  };

  const handleSubmit = () => {
    localStorage.setItem("pathwise-profile", JSON.stringify(profile));
    navigate("/roadmap");
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <nav className="border-b border-border px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/")} className="font-display text-xl font-bold text-foreground tracking-tight">
            Path<span className="text-primary">wise</span>
          </button>
          <span className="text-sm text-muted-foreground">
            Step {step + 1} of {steps.length}
          </span>
        </div>
      </nav>

      {/* Progress */}
      <div className="w-full bg-muted h-1.5">
        <motion.div
          className="h-full gradient-cta rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Content */}
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
              {step === 0 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">What's your current education level?</h2>
                  <p className="text-muted-foreground mb-8">This helps us tailor your pathway recommendations.</p>
                  <SingleSelect options={educationLevels} value={profile.educationLevel} onChange={(v) => setProfile({ ...profile, educationLevel: v })} />
                </div>
              )}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">What areas interest you?</h2>
                  <p className="text-muted-foreground mb-8">Select all that apply — we'll find the overlap.</p>
                  <MultiSelect options={interestOptions} value={profile.interests} onChange={(v) => setProfile({ ...profile, interests: v })} />
                </div>
              )}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">What are your favorite subjects?</h2>
                  <p className="text-muted-foreground mb-8">Pick the subjects you enjoy or excel in.</p>
                  <MultiSelect options={subjectOptions} value={profile.favoriteSubjects} onChange={(v) => setProfile({ ...profile, favoriteSubjects: v })} />
                </div>
              )}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">Any career paths you're considering?</h2>
                  <p className="text-muted-foreground mb-8">No pressure — these can change. Select what appeals to you now.</p>
                  <MultiSelect options={careerOptions} value={profile.careerInterests} onChange={(v) => setProfile({ ...profile, careerInterests: v })} />
                </div>
              )}
              {step === 4 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">Tell us a bit more</h2>
                  <p className="text-muted-foreground mb-8">This helps us refine your roadmap.</p>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">GPA Range</label>
                      <SingleSelect options={gpaRanges} value={profile.gpaRange} onChange={(v) => setProfile({ ...profile, gpaRange: v })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">Budget Concerns</label>
                      <SingleSelect options={budgetOptions} value={profile.budgetConcern} onChange={(v) => setProfile({ ...profile, budgetConcern: v })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">State / Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Washington, California..."
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}
              {step === 5 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">What matters most to you long-term?</h2>
                  <p className="text-muted-foreground mb-8">Select your top priorities for your future career.</p>
                  <MultiSelect options={goalOptions} value={profile.longTermGoals} onChange={(v) => setProfile({ ...profile, longTermGoals: v })} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <Button
              variant="outline"
              onClick={() => (step > 0 ? setStep(step - 1) : navigate("/"))}
              className="border-border hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button
                className="gradient-cta text-primary-foreground border-0 hover:opacity-90 transition-opacity"
                disabled={!canProceed()}
                onClick={() => setStep(step + 1)}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="gradient-cta text-primary-foreground border-0 hover:opacity-90 transition-opacity"
                disabled={!canProceed()}
                onClick={handleSubmit}
              >
                Generate My Roadmap
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
