import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, TrendingUp, DollarSign, GraduationCap, ChevronDown, ChevronUp,
  Sparkles, Zap, Shuffle, ArrowRight, Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/types";
import { CareerRole, getCareersForProfile } from "@/lib/careerData";
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

function RoleCard({ role }: { role: CareerRole }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="premium-card-hover overflow-hidden">
      <CardContent className="p-0">
        <button className="w-full text-left p-5 flex items-start gap-4" onClick={() => setExpanded(!expanded)}>
          <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 mt-0.5">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-semibold text-foreground">{role.title}</h3>
              <Badge variant="outline" className="text-[10px]">{role.field}</Badge>
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
                {/* Day-to-Day */}
                <div>
                  <h4 className="section-label mb-2 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Day-to-Day</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">{role.dayToDay}</p>
                </div>
                {/* Skills Roadmap */}
                <div>
                  <h4 className="section-label mb-2 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map(s => (
                      <Badge key={s} variant="secondary" className="text-xs font-normal">{s}</Badge>
                    ))}
                  </div>
                </div>
                {/* Related Roles */}
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

export default function CareersPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [careers, setCareers] = useState<ReturnType<typeof getCareersForProfile> | null>(null);

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate("/profile-setup"); return; }
    setProfile(p);
    const interests = p.careerInterests?.length > 0 ? p.careerInterests : p.interests;
    setCareers(getCareersForProfile(interests));
  }, [navigate]);

  if (!careers || !profile) return null;

  const sections = [
    { key: "popular" as const, ...categoryConfig.popular, roles: careers.popular },
    { key: "emerging" as const, ...categoryConfig.emerging, roles: careers.emerging },
    { key: "hybrid" as const, ...categoryConfig.hybrid, roles: careers.hybrid },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight mb-1">Career Explorer</h1>
          <p className="text-muted-foreground text-sm max-w-lg">
            Discover roles tailored to your interests in {(profile.careerInterests || profile.interests).join(", ")}. Expand any role for deep details.
          </p>
        </motion.div>

        {sections.map((section, si) => (
          section.roles.length > 0 && (
            <motion.div key={section.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}>
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-display font-bold text-foreground uppercase tracking-wide">{section.label}</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4 -mt-2">{section.description}</p>
              <div className="space-y-3">
                {section.roles.map((role, i) => (
                  <motion.div key={role.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 + i * 0.05 }}>
                    <RoleCard role={role} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        ))}
      </div>
    </DashboardLayout>
  );
}
