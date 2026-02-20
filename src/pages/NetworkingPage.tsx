import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Copy, Check, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { networkingTemplates } from "@/lib/mockData";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "@/hooks/use-toast";

function TemplateCard({ template, index }: { template: typeof networkingTemplates[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyTemplate = () => {
    navigator.clipboard.writeText(template.template);
    setCopied(true);
    toast({ title: "Copied!", description: "Template copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
      <Card className="border-border/50 hover:shadow-[var(--shadow-elevated)] transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-foreground">{template.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{template.context}</p>

              {expanded && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground/90 whitespace-pre-wrap font-mono leading-relaxed border border-border/50">
                    {template.template}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-accent" /> Tips
                    </h4>
                    <ul className="space-y-1.5">
                      {template.tips.map((tip) => (
                        <li key={tip} className="text-xs text-muted-foreground flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center gap-2 mt-3">
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setExpanded(!expanded)}>
                  {expanded ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                  {expanded ? "Collapse" : "View Template"}
                </Button>
                {expanded && (
                  <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={copyTemplate}>
                    {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function NetworkingPage() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">Networking Guide</h1>
          <p className="text-muted-foreground text-sm">Professional outreach templates and tips for building your network on LinkedIn and beyond.</p>
        </div>
        <div className="space-y-4">
          {networkingTemplates.map((t, i) => <TemplateCard key={t.id} template={t} index={i} />)}
        </div>
      </div>
    </DashboardLayout>
  );
}
