import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ChevronDown, ChevronUp, CheckCircle2, XCircle,
  Clock, ArrowRight, Sparkles, Filter, X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/lib/types";
import {
  ExploreCategory, ExploreTopic, categoryMeta, exploreTopics, getRelevantTopicIds,
} from "@/lib/exploreData";
import DashboardLayout from "@/components/DashboardLayout";

function getProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem("pathwise-profile");
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

const allCategories = Object.keys(categoryMeta) as ExploreCategory[];

function TopicCard({ topic, isRelevant }: { topic: ExploreTopic; isRelevant: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={`premium-card overflow-hidden transition-all duration-200 ${isRelevant ? "ring-1 ring-primary/20" : ""}`}>
      <CardContent className="p-0">
        <button className="w-full text-left p-5 sm:p-6" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center shrink-0 text-lg">
              {categoryMeta[topic.category].emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-display font-bold text-foreground text-base sm:text-lg leading-tight">{topic.title}</h3>
                {isRelevant && (
                  <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> For you
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="outline" className="text-[10px]">{categoryMeta[topic.category].label}</Badge>
                {topic.audience.map(a => (
                  <span key={a} className="text-[10px] text-muted-foreground capitalize">{a.replace("-", " ")}</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{topic.overview}</p>
            </div>
            <div className="shrink-0 mt-1">
              {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </div>
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 sm:px-6 pb-6 space-y-6 border-t border-border/40 pt-5">
                {/* Overview */}
                <div>
                  <h4 className="section-label mb-2">Overview</h4>
                  <p className="text-sm text-foreground/85 leading-relaxed">{topic.overview}</p>
                </div>

                {/* Pros & Cons */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="section-label flex items-center gap-1.5 text-accent">
                      <CheckCircle2 className="w-3 h-3" /> Pros
                    </h4>
                    <ul className="space-y-1.5">
                      {topic.pros.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="section-label flex items-center gap-1.5 text-destructive">
                      <XCircle className="w-3 h-3" /> Cons
                    </h4>
                    <ul className="space-y-1.5">
                      {topic.cons.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                          <div className="w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0 mt-1.5" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Eligibility */}
                <div>
                  <h4 className="section-label mb-2">Eligibility</h4>
                  <ul className="space-y-1.5">
                    {topic.eligibility.map((e, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="section-label mb-3 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Timeline
                  </h4>
                  <div className="space-y-2">
                    {topic.timeline.map((t, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                            {i + 1}
                          </div>
                          {i < topic.timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1 min-h-[8px]" />}
                        </div>
                        <p className="text-sm text-foreground/80 pb-2">{t}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-primary/5 rounded-xl p-4">
                  <h4 className="section-label mb-2 flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3" /> Recommended Next Steps
                  </h4>
                  <ul className="space-y-2">
                    {topic.nextSteps.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/85 font-medium">
                        <span className="text-primary font-bold text-xs mt-0.5">{i + 1}.</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {topic.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ExploreCategory | "all">("all");
  const [showRelevantFirst, setShowRelevantFirst] = useState(true);

  useEffect(() => {
    const p = getProfile();
    if (!p) { navigate("/profile-setup"); return; }
    setProfile(p);
  }, [navigate]);

  const relevantIds = useMemo(
    () => (profile ? getRelevantTopicIds(profile.educationLevel) : new Set<string>()),
    [profile]
  );

  const filtered = useMemo(() => {
    let topics = exploreTopics;

    // Category filter
    if (activeCategory !== "all") {
      topics = topics.filter(t => t.category === activeCategory);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      topics = topics.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.overview.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Sort: relevant first
    if (showRelevantFirst) {
      topics = [...topics].sort((a, b) => {
        const aRel = relevantIds.has(a.id) ? 0 : 1;
        const bRel = relevantIds.has(b.id) ? 0 : 1;
        return aRel - bRel;
      });
    }

    return topics;
  }, [search, activeCategory, showRelevantFirst, relevantIds]);

  if (!profile) return null;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight mb-1">Explore</h1>
          <p className="text-muted-foreground text-sm max-w-lg">
            Discover academic programs, career paths, and opportunities. Topics personalized for your {profile.educationLevel.toLowerCase()} journey are highlighted.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics, programs, certifications..."
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              All Topics
            </button>
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {categoryMeta[cat].emoji} {categoryMeta[cat].label}
              </button>
            ))}
          </div>

          {/* Relevance Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{filtered.length} topic{filtered.length !== 1 ? "s" : ""}</span>
            <button
              onClick={() => setShowRelevantFirst(!showRelevantFirst)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Sparkles className={`w-3 h-3 ${showRelevantFirst ? "text-primary" : ""}`} />
              {showRelevantFirst ? "Personalized order" : "Default order"}
            </button>
          </div>
        </motion.div>

        {/* Category Description */}
        {activeCategory !== "all" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <span className="text-2xl">{categoryMeta[activeCategory].emoji}</span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{categoryMeta[activeCategory].label}</h3>
              <p className="text-xs text-muted-foreground">{categoryMeta[activeCategory].description}</p>
            </div>
          </motion.div>
        )}

        {/* Topic Cards */}
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((topic, i) => (
              <motion.div key={topic.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                <TopicCard topic={topic} isRelevant={relevantIds.has(topic.id)} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16">
              <Search className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
              <h3 className="font-display font-semibold text-foreground mb-1">No topics found</h3>
              <p className="text-sm text-muted-foreground">Try a different search term or clear filters.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => { setSearch(""); setActiveCategory("all"); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
