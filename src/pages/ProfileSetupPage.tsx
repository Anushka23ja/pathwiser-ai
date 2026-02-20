import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, School, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const steps = [
  { id: "school", title: "Your School", icon: School },
  { id: "academics", title: "Academics", icon: BookOpen },
  { id: "preferences", title: "Preferences", icon: Heart },
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

function SingleSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <ToggleChip key={opt} label={opt} selected={value === opt} onClick={() => onChange(opt)} />
      ))}
    </div>
  );
}

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    schoolName: "",
    educationLevel: "",
    gradeYear: "",
    favoriteSubjects: [] as string[],
    interests: [] as string[],
    careerInterests: [] as string[],
    gpaRange: "",
    budgetConcern: "",
    location: "",
    longTermGoals: [] as string[],
  });

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  const canProceed = () => {
    switch (step) {
      case 0: return profile.schoolName.trim() !== "" && profile.educationLevel !== "";
      case 1: return profile.interests.length > 0 && profile.favoriteSubjects.length > 0;
      case 2: return profile.longTermGoals.length > 0;
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
          school_name: profile.schoolName,
          education_level: profile.educationLevel,
          grade_year: profile.gradeYear,
          favorite_subjects: profile.favoriteSubjects,
          interests: profile.interests,
          career_interests: profile.careerInterests,
          gpa_range: profile.gpaRange,
          budget_concern: profile.budgetConcern,
          location: profile.location,
          long_term_goals: profile.longTermGoals,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      // Also store in localStorage for the roadmap page
      localStorage.setItem("pathwise-profile", JSON.stringify({
        educationLevel: profile.educationLevel,
        interests: profile.interests,
        favoriteSubjects: profile.favoriteSubjects,
        careerInterests: profile.careerInterests,
        gpaRange: profile.gpaRange,
        budgetConcern: profile.budgetConcern,
        location: profile.location,
        longTermGoals: profile.longTermGoals,
      }));

      toast({ title: "Profile saved!", description: "Let's generate your roadmap." });
      navigate("/roadmap");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            Path<span className="text-primary">wise</span>
          </span>
          <div className="flex items-center gap-4">
            {steps.map((s, i) => (
              <div key={s.id} className={`hidden sm:flex items-center gap-1.5 text-sm ${i <= step ? "text-primary font-medium" : "text-muted-foreground"}`}>
                <s.icon className="w-4 h-4" />
                {s.title}
                {i < steps.length - 1 && <span className="mx-2 text-border">→</span>}
              </div>
            ))}
          </div>
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
              {step === 0 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">Tell us about your school</h2>
                  <p className="text-muted-foreground mb-8">We'll use this to tailor your pathway.</p>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">School / College Name</label>
                      <input
                        type="text"
                        placeholder="e.g. University of Washington, Lincoln High School..."
                        value={profile.schoolName}
                        onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">Education Level</label>
                      <SingleSelect options={educationLevels} value={profile.educationLevel} onChange={(v) => setProfile({ ...profile, educationLevel: v })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Current Grade / Year</label>
                      <input
                        type="text"
                        placeholder="e.g. Junior, Sophomore, 11th Grade..."
                        value={profile.gradeYear}
                        onChange={(e) => setProfile({ ...profile, gradeYear: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">GPA Range</label>
                        <SingleSelect options={gpaRanges} value={profile.gpaRange} onChange={(v) => setProfile({ ...profile, gpaRange: v })} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Location / State</label>
                        <input
                          type="text"
                          placeholder="e.g. Washington"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">Your academic interests</h2>
                  <p className="text-muted-foreground mb-8">Select all that resonate with you.</p>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">Areas of Interest</label>
                      <MultiSelect options={interestOptions} value={profile.interests} onChange={(v) => setProfile({ ...profile, interests: v })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">Favorite Subjects</label>
                      <MultiSelect options={subjectOptions} value={profile.favoriteSubjects} onChange={(v) => setProfile({ ...profile, favoriteSubjects: v })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">Career Interests (optional)</label>
                      <MultiSelect options={careerOptions} value={profile.careerInterests} onChange={(v) => setProfile({ ...profile, careerInterests: v })} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">Your priorities & goals</h2>
                  <p className="text-muted-foreground mb-8">What matters most for your future?</p>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">Long-term Goals</label>
                      <MultiSelect options={goalOptions} value={profile.longTermGoals} onChange={(v) => setProfile({ ...profile, longTermGoals: v })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">Budget Concerns</label>
                      <SingleSelect options={budgetOptions} value={profile.budgetConcern} onChange={(v) => setProfile({ ...profile, budgetConcern: v })} />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

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
                {saving ? "Saving..." : "Generate My Roadmap"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
