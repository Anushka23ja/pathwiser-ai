import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, MapPin, ExternalLink, Award, DollarSign,
  ChevronDown, ChevronUp, Upload, SlidersHorizontal, Target,
  TrendingUp, ShieldCheck, CheckCircle2, XCircle, Sparkles, X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/types";
import {
  AcademicProfile, EnhancedSchool, SchoolTier, ParsedTranscript,
  matchSchools, defaultAcademicProfile, simulateTranscriptParse,
  availableMajors, availableExtracurriculars, usStates,
} from "@/lib/schoolMatchingData";
import DashboardLayout from "@/components/DashboardLayout";

function getProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem("pathwise-profile");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

const tierConfig: Record<SchoolTier, { label: string; icon: typeof Target; color: string; bg: string }> = {
  reach: { label: "Reach", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
  target: { label: "Target", icon: Target, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  safety: { label: "Safety", icon: ShieldCheck, color: "text-accent", bg: "bg-accent/10 border-accent/20" },
};

const strengthColor = { strong: "text-accent", moderate: "text-amber-500", weak: "text-destructive/70" };

// ── Academic Profile Form ──
function AcademicProfileForm({
  profile,
  onChange,
  onTranscriptUpload,
  parsedTranscript,
}: {
  profile: AcademicProfile;
  onChange: (p: AcademicProfile) => void;
  onTranscriptUpload: (file: File) => void;
  parsedTranscript: ParsedTranscript | null;
}) {
  const [showForm, setShowForm] = useState(false);

  const rigorOptions: AcademicProfile["courseworkRigor"][number][] = ["AP", "IB", "Dual Enrollment", "Honors", "Standard"];

  return (
    <Card className="premium-card overflow-hidden">
      <CardContent className="p-0">
        <button
          className="w-full text-left p-5 flex items-center justify-between"
          onClick={() => setShowForm(!showForm)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground text-sm">Personalize Your Matches</h3>
              <p className="text-xs text-muted-foreground">Enter academic details or upload a transcript for smarter recommendations</p>
            </div>
          </div>
          {showForm ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-6 space-y-5 border-t border-border/40 pt-5">
                {/* Transcript Upload */}
                <div>
                  <label className="section-label mb-2 flex items-center gap-1.5"><Upload className="w-3 h-3" /> Upload Transcript (Optional)</label>
                  <label className="flex items-center gap-3 p-4 border-2 border-dashed border-border/60 rounded-xl cursor-pointer hover:border-primary/40 transition-colors">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-foreground font-medium">Drop a transcript PDF or click to browse</p>
                      <p className="text-[10px] text-muted-foreground">We'll extract GPA, coursework, and suggest matches</p>
                    </div>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onTranscriptUpload(file);
                    }} />
                  </label>
                  {parsedTranscript && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
                      <p className="text-xs font-medium text-accent flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-3 h-3" /> Transcript parsed successfully
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-foreground/80">
                        <span>Estimated GPA: <strong>{parsedTranscript.estimatedGpa}</strong></span>
                        <span>Courses detected: <strong>{parsedTranscript.detectedCourses.length}</strong></span>
                        <span>Rigor: <strong>{parsedTranscript.rigorLevel.join(", ")}</strong></span>
                        <span>Suggested: <strong>{parsedTranscript.suggestedMajors[0]}</strong></span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* GPA */}
                <div>
                  <label className="section-label mb-2">GPA (0.0–4.0)</label>
                  <input
                    type="number"
                    min="0" max="4" step="0.1"
                    value={profile.gpa}
                    onChange={(e) => onChange({ ...profile, gpa: Math.min(4, Math.max(0, parseFloat(e.target.value) || 0)) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Intended Major */}
                <div>
                  <label className="section-label mb-2">Intended Major</label>
                  <select
                    value={profile.intendedMajor}
                    onChange={(e) => onChange({ ...profile, intendedMajor: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Select a major...</option>
                    {availableMajors.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Coursework Rigor */}
                <div>
                  <label className="section-label mb-2">Coursework Rigor (select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {rigorOptions.map(r => (
                      <button
                        key={r}
                        onClick={() => {
                          const has = profile.courseworkRigor.includes(r);
                          onChange({ ...profile, courseworkRigor: has ? profile.courseworkRigor.filter(x => x !== r) : [...profile.courseworkRigor, r] });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          profile.courseworkRigor.includes(r)
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extracurriculars */}
                <div>
                  <label className="section-label mb-2">Extracurricular Focus</label>
                  <div className="flex flex-wrap gap-2">
                    {availableExtracurriculars.map(ec => (
                      <button
                        key={ec}
                        onClick={() => {
                          const has = profile.extracurricularFocus.includes(ec);
                          onChange({ ...profile, extracurricularFocus: has ? profile.extracurricularFocus.filter(x => x !== ec) : [...profile.extracurricularFocus, ec] });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          profile.extracurricularFocus.includes(ec)
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {ec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location + Budget row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="section-label mb-2">Target Location</label>
                    <select
                      value={profile.targetLocation}
                      onChange={(e) => onChange({ ...profile, targetLocation: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {usStates.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="section-label mb-2">Budget Preference</label>
                    <select
                      value={profile.budgetPreference}
                      onChange={(e) => onChange({ ...profile, budgetPreference: e.target.value as AcademicProfile["budgetPreference"] })}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="low">Budget-conscious (under $15K/yr)</option>
                      <option value="moderate">Moderate (up to $40K/yr)</option>
                      <option value="flexible">Flexible / Financial aid expected</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// ── School Card ──
function SchoolCard({ school, index }: { school: EnhancedSchool; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const tier = tierConfig[school.tier];
  const TierIcon = tier.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.3) }}>
      <Card className="premium-card overflow-hidden">
        <CardContent className="p-0">
          <button className="w-full text-left p-5 sm:p-6" onClick={() => setExpanded(!expanded)}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-display font-bold text-foreground text-base">{school.name}</h3>
                      <Badge className={`text-[10px] ${tier.bg} ${tier.color} border gap-1`}>
                        <TierIcon className="w-2.5 h-2.5" /> {tier.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">{school.type}</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />{school.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold text-primary">{school.matchScore}%</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Match</div>
                  </div>
                </div>

                <p className="text-sm text-foreground/80 mt-2.5">{school.matchReason}</p>

                {/* Mini stats */}
                <div className="flex items-center gap-4 mt-3 flex-wrap text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Award className="w-3 h-3" />Acceptance: {school.acceptanceRate}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{school.avgTuition}</span>
                </div>
              </div>
              <div className="shrink-0 mt-1">
                {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </div>
            </div>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-5 sm:px-6 pb-6 space-y-5 border-t border-border/40 pt-5">
                  {/* Match Breakdown */}
                  <div>
                    <h4 className="section-label mb-3">Why This Match</h4>
                    <div className="space-y-2.5">
                      {school.matchReasons.map((r, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${strengthColor[r.strength]}`} />
                          <div>
                            <span className="text-xs font-semibold text-foreground">{r.label}: </span>
                            <span className="text-xs text-foreground/80">{r.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fit Scores */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Academic Fit", value: school.academicFit },
                      { label: "Major Strength", value: school.majorStrength },
                      { label: "Cost Alignment", value: school.costAlignment },
                    ].map(({ label, value }) => (
                      <div key={label} className="p-3 rounded-xl bg-muted/30 text-center">
                        <div className={`text-lg font-bold ${value >= 70 ? "text-accent" : value >= 45 ? "text-amber-500" : "text-destructive/70"}`}>
                          {value}%
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Programs */}
                  <div>
                    <h4 className="section-label mb-2">Top Programs</h4>
                    <div className="flex flex-wrap gap-2">
                      {school.topPrograms.map(p => (
                        <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Visit */}
                  <Button variant="outline" size="sm" className="text-xs" asChild>
                    <a href={`https://${school.website}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1.5" />Visit Website
                    </a>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SchoolsPage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [academicProfile, setAcademicProfile] = useState<AcademicProfile>(defaultAcademicProfile);
  const [parsedTranscript, setParsedTranscript] = useState<ParsedTranscript | null>(null);
  const [activeTier, setActiveTier] = useState<SchoolTier | "all">("all");

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate("/profile-setup"); return; }
    setUserProfile(p);
    // Seed academic profile from user profile
    const major = p.careerInterests?.[0] || p.interests?.[0] || "";
    setAcademicProfile(prev => ({ ...prev, intendedMajor: major, gpa: p.gpaRange === "3.5+" ? 3.7 : p.gpaRange === "3.0–3.5" ? 3.3 : p.gpaRange === "2.5–3.0" ? 2.8 : 3.5 }));
  }, [navigate]);

  const handleTranscriptUpload = useCallback((file: File) => {
    const result = simulateTranscriptParse(file.name);
    setParsedTranscript(result);
    setAcademicProfile(prev => ({
      ...prev,
      gpa: result.estimatedGpa,
      courseworkRigor: result.rigorLevel,
      intendedMajor: result.suggestedMajors[0] || prev.intendedMajor,
    }));
  }, []);

  const schools = useMemo(() => matchSchools(academicProfile), [academicProfile]);

  const filteredSchools = useMemo(() => {
    if (activeTier === "all") return schools;
    return schools.filter(s => s.tier === activeTier);
  }, [schools, activeTier]);

  const tierCounts = useMemo(() => ({
    reach: schools.filter(s => s.tier === "reach").length,
    target: schools.filter(s => s.tier === "target").length,
    safety: schools.filter(s => s.tier === "safety").length,
  }), [schools]);

  if (!userProfile) return null;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight mb-1">School Matcher</h1>
          <p className="text-muted-foreground text-sm max-w-lg">
            Personalized school recommendations categorized as Reach, Target, and Safety based on your academic profile.
          </p>
        </motion.div>

        {/* Academic Profile Form */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <AcademicProfileForm
            profile={academicProfile}
            onChange={setAcademicProfile}
            onTranscriptUpload={handleTranscriptUpload}
            parsedTranscript={parsedTranscript}
          />
        </motion.div>

        {/* Tier Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTier("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeTier === "all" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            All ({schools.length})
          </button>
          {(["reach", "target", "safety"] as SchoolTier[]).map(t => {
            const cfg = tierConfig[t];
            const TIcon = cfg.icon;
            return (
              <button
                key={t}
                onClick={() => setActiveTier(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTier === t ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                <TIcon className="w-3 h-3" /> {cfg.label} ({tierCounts[t]})
              </button>
            );
          })}
        </motion.div>

        {/* School Cards */}
        <div className="space-y-4">
          {filteredSchools.length > 0 ? (
            filteredSchools.map((school, i) => <SchoolCard key={school.id} school={school} index={i} />)
          ) : (
            <div className="text-center py-16">
              <GraduationCap className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
              <h3 className="font-display font-semibold text-foreground mb-1">No schools in this tier</h3>
              <p className="text-sm text-muted-foreground">Adjust your academic profile or view all tiers.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setActiveTier("all")}>View All</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
