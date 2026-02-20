import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, TrendingUp, DollarSign, GraduationCap, ChevronDown, ChevronUp,
  Sparkles, Zap, Shuffle, ArrowRight, Clock, X, Layers, BookOpen, Search,
  Gem, Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserProfile } from "@/lib/types";
import { CareerRole, getCareersForProfile } from "@/lib/careerData";
import { InterdisciplinaryRole, availableFields, getInterdisciplinaryRoles } from "@/lib/interdisciplinaryData";
import DashboardLayout from "@/components/DashboardLayout";

function getProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem("pathwise-profile");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

const categoryConfig = {
  popular: { label: "Popular Roles", icon: Briefcase, description: "Well-established careers with proven demand and clear pathways." },
  emerging: { label: "Emerging & Niche", icon: Sparkles, description: "Fast-growing roles at the frontier of industry — lesser-known but high potential." },
  hybrid: { label: "Hybrid & Non-Traditional", icon: Shuffle, description: "Roles that blend multiple disciplines. Great for interdisciplinary thinkers." },
};

// Mainstream roles = popular category
const isMainstream = (role: CareerRole) => role.category === "popular";

// ── Field Selector ──
function FieldSelector({ selected, onChange }: { selected: string[]; onChange: (f: string[]) => void }) {
  return (
    <Card className="premium-card overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground text-sm">Combine Your Interests</h3>
            <p className="text-xs text-muted-foreground">Select 2+ fields to discover interdisciplinary roles tailored to your unique combination</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {availableFields.map(field => {
            const active = selected.includes(field);
            return (
              <button
                key={field}
                onClick={() => onChange(active ? selected.filter(f => f !== field) : [...selected, field])}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {field}
              </button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/40">
            <span className="text-xs text-muted-foreground">Selected:</span>
            {selected.map(f => (
              <Badge key={f} className="text-[10px] bg-primary/10 text-primary border-primary/20 gap-1">
                {f}
                <button onClick={() => onChange(selected.filter(x => x !== f))} className="ml-0.5 hover:text-primary/80">
                  <X className="w-2.5 h-2.5" />
                </button>
              </Badge>
            ))}
            <button onClick={() => onChange([])} className="text-[10px] text-muted-foreground hover:text-foreground ml-auto">
              Clear all
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Interdisciplinary Role Card ──
function InterdisciplinaryCard({ role }: { role: InterdisciplinaryRole }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="premium-card overflow-hidden border-primary/10">
      <CardContent className="p-0">
        <button className="w-full text-left p-5 flex items-start gap-4" onClick={() => setExpanded(!expanded)}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0 mt-0.5">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-semibold text-foreground">{role.title}</h3>
              <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Interdisciplinary
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{role.whyRelevant}</p>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-foreground font-medium">
                <DollarSign className="w-3 h-3 text-accent" />{role.salaryRange}
              </span>
              <span className="flex items-center gap-1 text-xs text-accent font-medium">
                <TrendingUp className="w-3 h-3" />{role.growthRate} growth
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <GraduationCap className="w-3 h-3" />{role.education}
              </span>
            </div>
          </div>
          <div className="shrink-0 mt-1">
            {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-4 border-t border-border/40 pt-4">
                <div>
                  <h4 className="section-label mb-2 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Day-to-Day</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">{role.dayToDay}</p>
                </div>
                <div>
                  <h4 className="section-label mb-2 flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> Recommended Majors</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.recommendedMajors.map(m => (
                      <Badge key={m} className="text-xs bg-accent/10 text-accent border-accent/20">{m}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="section-label mb-2 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map(s => (
                      <Badge key={s} variant="secondary" className="text-xs font-normal">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="section-label mb-2">Fields Combined</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.fields.map(f => (
                      <span key={f} className="text-xs text-primary bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">{f}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="section-label mb-2 flex items-center gap-1.5"><ArrowRight className="w-3 h-3" /> Related Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.relatedRoles.map(r => (
                      <span key={r} className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg">{r}</span>
                    ))}
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

// ── Skills Roadmap Visual ──
function SkillsRoadmap({ skills }: { skills: string[] }) {
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const perLevel = Math.ceil(skills.length / 3);
  return (
    <div className="space-y-2">
      {levels.map((level, li) => {
        const levelSkills = skills.slice(li * perLevel, (li + 1) * perLevel);
        if (levelSkills.length === 0) return null;
        return (
          <div key={level} className="flex items-start gap-3">
            <span className={`text-[10px] font-semibold uppercase tracking-wider w-20 shrink-0 pt-1 ${
              li === 0 ? "text-accent" : li === 1 ? "text-primary" : "text-destructive"
            }`}>{level}</span>
            <div className="flex flex-wrap gap-1.5">
              {levelSkills.map(s => (
                <Badge key={s} variant="secondary" className="text-xs font-normal">{s}</Badge>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Standard Role Card (Enhanced) ──
function RoleCard({ role, userInterests }: { role: CareerRole; userInterests: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const mainstream = isMainstream(role);

  return (
    <Card className="premium-card-hover overflow-hidden">
      <CardContent className="p-0">
        <button className="w-full text-left p-4 sm:p-5 flex items-start gap-3 sm:gap-4" onClick={() => setExpanded(!expanded)}>
          <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-semibold text-foreground">{role.title}</h3>
              <Badge variant="outline" className="text-[10px]">{role.field}</Badge>
              {mainstream ? (
                <Badge className="text-[9px] bg-muted text-muted-foreground border-border gap-0.5">
                  <Users className="w-2.5 h-2.5" /> Mainstream
                </Badge>
              ) : (
                <Badge className="text-[9px] bg-accent/10 text-accent border-accent/20 gap-0.5">
                  <Gem className="w-2.5 h-2.5" /> Hidden Gem
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{role.description}</p>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-foreground font-medium">
                <DollarSign className="w-3 h-3 text-accent" />{role.salaryRange}
              </span>
              <span className="flex items-center gap-1 text-xs text-accent font-medium">
                <TrendingUp className="w-3 h-3" />{role.growthRate} growth
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <GraduationCap className="w-3 h-3" />{role.education}
              </span>
            </div>
          </div>
          <div className="shrink-0 mt-1">
            {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-4 border-t border-border/40 pt-4">
                <div>
                  <h4 className="section-label mb-2 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Day-to-Day</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">{role.dayToDay}</p>
                </div>
                <div>
                  <h4 className="section-label mb-2 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Skills Roadmap</h4>
                  <SkillsRoadmap skills={role.skills} />
                </div>
                <div>
                  <h4 className="section-label mb-2 flex items-center gap-1.5"><ArrowRight className="w-3 h-3" /> Alternative Paths</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.relatedRoles.map(r => <span key={r} className="text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg">{r}</span>)}
                  </div>
                </div>
                {/* Personalized note */}
                {userInterests.length > 0 && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/15">
                    <p className="text-xs text-foreground flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Why this fits you:</strong> Your interest in {userInterests[0]} aligns well with {role.title}'s core skills. This could be a strong match for your profile.
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export default function CareersPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [careers, setCareers] = useState<ReturnType<typeof getCareersForProfile> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("popular");

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate("/profile-setup"); return; }
    setProfile(p);
    const interests = p.careerInterests?.length > 0 ? p.careerInterests : p.interests;
    setCareers(getCareersForProfile(interests));
    const seedFields = interests
      .map(i => availableFields.find(f => f.toLowerCase().includes(i.toLowerCase().replace("software & tech", "computer science").replace("healthcare & medicine", "healthcare").replace("business & finance", "business").replace("creative & design", "design"))))
      .filter(Boolean) as string[];
    if (seedFields.length > 0) setSelectedFields(seedFields.slice(0, 3));
  }, [navigate]);

  const interdisciplinaryRoles = useMemo(
    () => getInterdisciplinaryRoles(selectedFields),
    [selectedFields]
  );

  const dynamicCareers = useMemo(() => {
    if (selectedFields.length === 0 && careers) return careers;
    const fieldMap: Record<string, string> = {
      "Computer Science": "Software & Tech", "Business": "Business & Finance", "Finance": "Business & Finance",
      "Healthcare": "Healthcare & Medicine", "Biology": "Healthcare & Medicine", "Design": "Creative & Design",
      "Art": "Creative & Design", "Engineering": "Engineering", "Education": "Education & Teaching",
      "Law": "Law & Policy", "Policy": "Law & Policy", "Psychology": "Social Work & Counseling",
    };
    const mappedInterests = selectedFields.map(f => fieldMap[f] || f).filter((v, i, a) => a.indexOf(v) === i);
    return getCareersForProfile(mappedInterests.length > 0 ? mappedInterests : ["Software & Tech"]);
  }, [selectedFields, careers]);

  if (!profile) return null;

  const userInterests = profile.careerInterests?.length > 0 ? profile.careerInterests : profile.interests;

  // Filter by search
  const filterRoles = (roles: CareerRole[]) => {
    if (!searchQuery.trim()) return roles;
    const q = searchQuery.toLowerCase();
    return roles.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.field.toLowerCase().includes(q) ||
      r.skills.some(s => s.toLowerCase().includes(q)) ||
      r.description.toLowerCase().includes(q)
    );
  };

  const sections = {
    popular: filterRoles(dynamicCareers?.popular || []),
    emerging: filterRoles(dynamicCareers?.emerging || []),
    hybrid: filterRoles(dynamicCareers?.hybrid || []),
  };

  const filteredInterdisciplinary = searchQuery.trim()
    ? interdisciplinaryRoles.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : interdisciplinaryRoles;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight mb-1">Career Explorer</h1>
          <p className="text-muted-foreground text-sm max-w-lg">
            Select multiple fields to discover interdisciplinary roles, or explore curated career paths below.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search careers by title, skill, or field..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-card border-border/50"
            />
          </div>
        </motion.div>

        {/* Multi-field selector */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <FieldSelector selected={selectedFields} onChange={setSelectedFields} />
        </motion.div>

        {/* Interdisciplinary Matches */}
        {filteredInterdisciplinary.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-display font-bold text-foreground uppercase tracking-wide">
                Interdisciplinary Matches
              </h2>
              <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">{filteredInterdisciplinary.length} roles</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4 -mt-2">
              Unique roles that combine {selectedFields.join(" + ")} — these are where cross-field knowledge creates the most value.
            </p>
            <div className="space-y-3">
              {filteredInterdisciplinary.map((role, i) => (
                <motion.div key={role.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                  <InterdisciplinaryCard role={role} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tabbed career sections */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl overflow-x-auto flex-nowrap">
              <TabsTrigger value="popular" className="gap-1 sm:gap-1.5 text-xs data-[state=active]:shadow-sm rounded-lg shrink-0 min-h-[44px]">
                <Briefcase className="w-3.5 h-3.5" /> Popular
                <Badge variant="secondary" className="text-[9px] ml-0.5 sm:ml-1">{sections.popular.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="emerging" className="gap-1 sm:gap-1.5 text-xs data-[state=active]:shadow-sm rounded-lg shrink-0 min-h-[44px]">
                <Sparkles className="w-3.5 h-3.5" /> Emerging
                <Badge variant="secondary" className="text-[9px] ml-0.5 sm:ml-1">{sections.emerging.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="hybrid" className="gap-1 sm:gap-1.5 text-xs data-[state=active]:shadow-sm rounded-lg shrink-0 min-h-[44px]">
                <Shuffle className="w-3.5 h-3.5" /> Hybrid
                <Badge variant="secondary" className="text-[9px] ml-0.5 sm:ml-1">{sections.hybrid.length}</Badge>
              </TabsTrigger>
            </TabsList>

            {(["popular", "emerging", "hybrid"] as const).map(key => (
              <TabsContent key={key} value={key} className="mt-4">
                <p className="text-xs text-muted-foreground mb-4">{categoryConfig[key].description}</p>
                <div className="space-y-3">
                  {sections[key].map((role, i) => (
                    <motion.div key={role.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <RoleCard role={role} userInterests={userInterests} />
                    </motion.div>
                  ))}
                  {sections[key].length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No careers match your search.</p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
