import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, MapPin, ExternalLink, Award, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/types";
import { getSchoolsForProfile, School } from "@/lib/mockData";
import DashboardLayout from "@/components/DashboardLayout";

function getProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem("pathwise-profile");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function SchoolCard({ school, index }: { school: School; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Card className="border-border/50 hover:shadow-[var(--shadow-elevated)] transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display font-semibold text-foreground">{school.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className="text-xs">{school.type}</Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />{school.location}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-accent">{school.matchScore}%</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Match</div>
                </div>
              </div>

              <p className="text-sm text-foreground/80 mt-3">{school.matchReason}</p>

              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3" />Acceptance: {school.acceptanceRate}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />{school.avgTuition}
                </span>
              </div>

              {expanded && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-2">Top Programs</h4>
                  <div className="flex flex-wrap gap-2">
                    {school.topPrograms.map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="flex items-center gap-2 mt-3">
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setExpanded(!expanded)}>
                  {expanded ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                  {expanded ? "Less" : "More Info"}
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-primary" asChild>
                  <a href={`https://${school.website}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />Visit
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SchoolsPage() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate("/profile-setup"); return; }
    setSchools(getSchoolsForProfile(p));
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">Recommended Schools</h1>
          <p className="text-muted-foreground text-sm">Schools matched to your interests, goals, and education level.</p>
        </div>
        <div className="space-y-4">
          {schools.map((s, i) => <SchoolCard key={s.id} school={s} index={i} />)}
        </div>
      </div>
    </DashboardLayout>
  );
}
