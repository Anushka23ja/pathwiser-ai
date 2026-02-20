import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, MapPin, Users, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/types";
import { getCompaniesForProfile, Company } from "@/lib/mockData";
import DashboardLayout from "@/components/DashboardLayout";

function getProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem("pathwise-profile");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function CompanyCard({ company, index }: { company: Company; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
      <Card className="border-border/50 hover:shadow-[var(--shadow-elevated)] transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-foreground">{company.name}</h3>
              <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs">{company.industry}</Badge>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{company.location}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{company.size}</span>
              </div>
              <p className="text-sm text-foreground/80 mt-3">{company.matchReason}</p>

              {expanded && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-2">Relevant Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {company.roles.map((r) => <Badge key={r} variant="outline" className="text-xs">{r}</Badge>)}
                  </div>
                </motion.div>
              )}

              <div className="flex items-center gap-2 mt-3">
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setExpanded(!expanded)}>
                  {expanded ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                  {expanded ? "Less" : "View Roles"}
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-primary" asChild>
                  <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />Careers Page
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

export default function CompaniesPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate("/profile-setup"); return; }
    setCompanies(getCompaniesForProfile(p));
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">Aligned Companies</h1>
          <p className="text-muted-foreground text-sm">Companies that match your career goals and interests.</p>
        </div>
        <div className="space-y-4">
          {companies.map((c, i) => <CompanyCard key={c.id} company={c} index={i} />)}
        </div>
      </div>
    </DashboardLayout>
  );
}
