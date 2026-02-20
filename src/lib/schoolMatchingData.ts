import { School } from "./mockData";

// ── Academic Profile for School Matching ──
export interface AcademicProfile {
  gpa: number;                    // 0.0–4.0
  intendedMajor: string;
  courseworkRigor: ("AP" | "IB" | "Dual Enrollment" | "Honors" | "Standard")[];
  extracurricularFocus: string[];
  targetLocation: string;         // "Anywhere" | state/region
  budgetPreference: "low" | "moderate" | "flexible";
  testScores?: { sat?: number; act?: number };
}

export type SchoolTier = "reach" | "target" | "safety";

export interface EnhancedSchool extends School {
  tier: SchoolTier;
  matchReasons: { label: string; detail: string; strength: "strong" | "moderate" | "weak" }[];
  academicFit: number;   // 0–100
  majorStrength: number; // 0–100
  costAlignment: number; // 0–100
}

// ── Simulated transcript parsing ──
export interface ParsedTranscript {
  estimatedGpa: number;
  detectedCourses: { name: string; level: "AP" | "IB" | "Honors" | "Standard"; grade: string }[];
  rigorLevel: ("AP" | "IB" | "Dual Enrollment" | "Honors" | "Standard")[];
  suggestedMajors: string[];
}

export function simulateTranscriptParse(fileName: string): ParsedTranscript {
  // Mock parsing — architecture ready for real AI-based document processing
  return {
    estimatedGpa: 3.7,
    detectedCourses: [
      { name: "AP Computer Science A", level: "AP", grade: "A" },
      { name: "AP Calculus BC", level: "AP", grade: "A-" },
      { name: "AP Physics C", level: "AP", grade: "B+" },
      { name: "Honors English Literature", level: "Honors", grade: "A" },
      { name: "AP Statistics", level: "AP", grade: "A" },
      { name: "IB Biology HL", level: "IB", grade: "A-" },
    ],
    rigorLevel: ["AP", "IB", "Honors"],
    suggestedMajors: ["Computer Science", "Data Science", "Engineering"],
  };
}

// ── Extended school database with richer metadata ──
interface SchoolEntry {
  id: string;
  name: string;
  type: "University" | "Community College" | "Trade School";
  location: string;
  state: string;
  acceptanceRate: number; // decimal 0–1
  avgTuition: string;
  tuitionBucket: "low" | "moderate" | "high";
  topPrograms: string[];
  strongMajors: string[];
  avgGpaAdmitted: number;
  avgSatAdmitted: number;
  website: string;
  description: string;
}

const schoolDatabase: SchoolEntry[] = [
  { id: "s1", name: "MIT", type: "University", location: "Cambridge, MA", state: "MA", acceptanceRate: 0.04, avgTuition: "$57,590/yr", tuitionBucket: "high", topPrograms: ["Computer Science", "AI", "Mechanical Engineering", "Physics"], strongMajors: ["Computer Science", "Engineering", "Mathematics", "Physics"], avgGpaAdmitted: 3.95, avgSatAdmitted: 1550, website: "mit.edu", description: "World's top engineering and science university with groundbreaking research." },
  { id: "s2", name: "Stanford University", type: "University", location: "Stanford, CA", state: "CA", acceptanceRate: 0.04, avgTuition: "$59,000/yr", tuitionBucket: "high", topPrograms: ["Computer Science", "Business", "Engineering"], strongMajors: ["Computer Science", "Engineering", "Business", "Data Science"], avgGpaAdmitted: 3.96, avgSatAdmitted: 1550, website: "stanford.edu", description: "Silicon Valley's premier university with unmatched startup culture." },
  { id: "s3", name: "Carnegie Mellon University", type: "University", location: "Pittsburgh, PA", state: "PA", acceptanceRate: 0.11, avgTuition: "$59,864/yr", tuitionBucket: "high", topPrograms: ["Computer Science", "AI", "Robotics", "HCI"], strongMajors: ["Computer Science", "AI", "Robotics", "Data Science", "Design"], avgGpaAdmitted: 3.9, avgSatAdmitted: 1530, website: "cmu.edu", description: "World-renowned CS and AI programs with cutting-edge research." },
  { id: "s4", name: "Georgia Institute of Technology", type: "University", location: "Atlanta, GA", state: "GA", acceptanceRate: 0.17, avgTuition: "$12,682/yr (in-state)", tuitionBucket: "low", topPrograms: ["Computer Science", "Engineering", "Data Science"], strongMajors: ["Computer Science", "Engineering", "Data Science", "Business"], avgGpaAdmitted: 3.85, avgSatAdmitted: 1480, website: "gatech.edu", description: "Top 10 CS program with exceptional value and industry partnerships." },
  { id: "s5", name: "University of Washington", type: "University", location: "Seattle, WA", state: "WA", acceptanceRate: 0.48, avgTuition: "$11,745/yr (in-state)", tuitionBucket: "low", topPrograms: ["Computer Science", "Informatics", "Medicine", "Engineering"], strongMajors: ["Computer Science", "Data Science", "Medicine", "Biology", "Business"], avgGpaAdmitted: 3.75, avgSatAdmitted: 1400, website: "uw.edu", description: "Located in a major tech hub with pipelines to Amazon, Microsoft, Google." },
  { id: "s6", name: "University of Michigan", type: "University", location: "Ann Arbor, MI", state: "MI", acceptanceRate: 0.18, avgTuition: "$16,178/yr (in-state)", tuitionBucket: "moderate", topPrograms: ["Engineering", "Business", "Pre-Med", "Public Health"], strongMajors: ["Engineering", "Business", "Biology", "Computer Science", "Nursing"], avgGpaAdmitted: 3.88, avgSatAdmitted: 1470, website: "umich.edu", description: "Excellent pre-med, engineering, and business programs with strong alumni network." },
  { id: "s7", name: "University of Texas at Austin", type: "University", location: "Austin, TX", state: "TX", acceptanceRate: 0.29, avgTuition: "$11,448/yr (in-state)", tuitionBucket: "low", topPrograms: ["Computer Science", "Engineering", "Business", "Communications"], strongMajors: ["Computer Science", "Engineering", "Business", "Data Science"], avgGpaAdmitted: 3.8, avgSatAdmitted: 1400, website: "utexas.edu", description: "Top public university in the growing Austin tech ecosystem." },
  { id: "s8", name: "Purdue University", type: "University", location: "West Lafayette, IN", state: "IN", acceptanceRate: 0.53, avgTuition: "$9,992/yr (in-state)", tuitionBucket: "low", topPrograms: ["Engineering", "Computer Science", "Agriculture"], strongMajors: ["Engineering", "Computer Science", "Mathematics"], avgGpaAdmitted: 3.7, avgSatAdmitted: 1350, website: "purdue.edu", description: "Highly ranked engineering with affordable tuition and strong co-op programs." },
  { id: "s9", name: "Cal Poly San Luis Obispo", type: "University", location: "San Luis Obispo, CA", state: "CA", acceptanceRate: 0.28, avgTuition: "$9,948/yr (in-state)", tuitionBucket: "low", topPrograms: ["Software Engineering", "Computer Science", "Architecture"], strongMajors: ["Engineering", "Computer Science", "Architecture", "Business"], avgGpaAdmitted: 3.8, avgSatAdmitted: 1380, website: "calpoly.edu", description: "Learn by doing philosophy with strong hands-on project curriculum." },
  { id: "s10", name: "Johns Hopkins University", type: "University", location: "Baltimore, MD", state: "MD", acceptanceRate: 0.07, avgTuition: "$60,480/yr", tuitionBucket: "high", topPrograms: ["Pre-Med", "Public Health", "Biomedical Engineering"], strongMajors: ["Biology", "Medicine", "Public Health", "Biomedical Engineering", "Nursing"], avgGpaAdmitted: 3.92, avgSatAdmitted: 1530, website: "jhu.edu", description: "Top-ranked medical school with unmatched clinical research." },
  { id: "s11", name: "University of Pennsylvania (Wharton)", type: "University", location: "Philadelphia, PA", state: "PA", acceptanceRate: 0.06, avgTuition: "$63,452/yr", tuitionBucket: "high", topPrograms: ["Finance", "Business", "Economics", "Nursing"], strongMajors: ["Business", "Finance", "Economics", "Nursing"], avgGpaAdmitted: 3.94, avgSatAdmitted: 1540, website: "wharton.upenn.edu", description: "World's top business school with unparalleled alumni network." },
  { id: "s12", name: "Indiana University Bloomington", type: "University", location: "Bloomington, IN", state: "IN", acceptanceRate: 0.80, avgTuition: "$10,948/yr (in-state)", tuitionBucket: "low", topPrograms: ["Finance", "Marketing", "Music", "Public Policy"], strongMajors: ["Business", "Finance", "Marketing", "Communications"], avgGpaAdmitted: 3.5, avgSatAdmitted: 1250, website: "indiana.edu", description: "Kelley School of Business ranks top 10 with strong career placement." },
  { id: "s13", name: "RISD (Rhode Island School of Design)", type: "University", location: "Providence, RI", state: "RI", acceptanceRate: 0.20, avgTuition: "$56,435/yr", tuitionBucket: "high", topPrograms: ["Graphic Design", "Industrial Design", "Illustration"], strongMajors: ["Design", "Fine Arts", "Architecture"], avgGpaAdmitted: 3.6, avgSatAdmitted: 1350, website: "risd.edu", description: "Premier design school with Brown University cross-enrollment." },
  { id: "s14", name: "Bellevue College", type: "Community College", location: "Bellevue, WA", state: "WA", acceptanceRate: 0.99, avgTuition: "$4,200/yr", tuitionBucket: "low", topPrograms: ["CS Transfer", "Web Development", "Cybersecurity", "Nursing"], strongMajors: ["Computer Science", "Business", "Nursing"], avgGpaAdmitted: 2.0, avgSatAdmitted: 0, website: "bellevuecollege.edu", description: "Affordable entry with guaranteed transfer agreements to UW and WSU." },
  { id: "s15", name: "Austin Community College", type: "Community College", location: "Austin, TX", state: "TX", acceptanceRate: 0.99, avgTuition: "$3,800/yr", tuitionBucket: "low", topPrograms: ["Engineering Transfer", "Business", "Healthcare"], strongMajors: ["Engineering", "Computer Science", "Business", "Nursing"], avgGpaAdmitted: 2.0, avgSatAdmitted: 0, website: "austincc.edu", description: "Strong transfer pathway to UT Austin with low tuition." },
  { id: "s16", name: "Baruch College (CUNY)", type: "University", location: "New York, NY", state: "NY", acceptanceRate: 0.45, avgTuition: "$7,472/yr (in-state)", tuitionBucket: "low", topPrograms: ["Finance", "Accounting", "Business"], strongMajors: ["Business", "Finance", "Accounting"], avgGpaAdmitted: 3.3, avgSatAdmitted: 1250, website: "baruch.cuny.edu", description: "Affordable business education in NYC with Wall Street access." },
  { id: "s17", name: "UC Berkeley", type: "University", location: "Berkeley, CA", state: "CA", acceptanceRate: 0.12, avgTuition: "$14,312/yr (in-state)", tuitionBucket: "moderate", topPrograms: ["Computer Science", "Engineering", "Business", "Biology"], strongMajors: ["Computer Science", "Engineering", "Business", "Biology", "Data Science"], avgGpaAdmitted: 3.92, avgSatAdmitted: 1510, website: "berkeley.edu", description: "Premier public university with world-class CS and engineering programs." },
  { id: "s18", name: "University of Illinois Urbana-Champaign", type: "University", location: "Champaign, IL", state: "IL", acceptanceRate: 0.45, avgTuition: "$16,000/yr (in-state)", tuitionBucket: "moderate", topPrograms: ["Computer Science", "Engineering", "Business"], strongMajors: ["Computer Science", "Engineering", "Business", "Mathematics"], avgGpaAdmitted: 3.75, avgSatAdmitted: 1400, website: "illinois.edu", description: "Top 5 CS program with excellent industry recruitment pipelines." },
  { id: "s19", name: "SAVANNAH College of Art and Design", type: "University", location: "Savannah, GA", state: "GA", acceptanceRate: 0.75, avgTuition: "$38,075/yr", tuitionBucket: "moderate", topPrograms: ["UX Design", "Motion Design", "Graphic Design"], strongMajors: ["Design", "Fine Arts", "Animation", "UX Design"], avgGpaAdmitted: 3.2, avgSatAdmitted: 1150, website: "scad.edu", description: "Industry-focused creative curriculum with strong job placement." },
  { id: "s20", name: "Virginia Tech", type: "University", location: "Blacksburg, VA", state: "VA", acceptanceRate: 0.57, avgTuition: "$13,691/yr (in-state)", tuitionBucket: "low", topPrograms: ["Engineering", "Architecture", "CS", "Agriculture"], strongMajors: ["Engineering", "Computer Science", "Architecture"], avgGpaAdmitted: 3.7, avgSatAdmitted: 1330, website: "vt.edu", description: "Strong engineering and CS programs with collaborative campus culture." },
];

// ── Major synonyms for matching ──
const majorSynonyms: Record<string, string[]> = {
  "Computer Science": ["CS", "Software Engineering", "Computer Engineering", "Informatics", "Software & Tech"],
  "Data Science": ["Data Analytics", "Machine Learning", "AI", "Statistics"],
  "Engineering": ["Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Aerospace", "Biomedical Engineering"],
  "Business": ["Finance", "Accounting", "Marketing", "Economics", "Entrepreneurship", "Business & Finance", "MBA"],
  "Biology": ["Pre-Med", "Biochemistry", "Neuroscience", "Healthcare & Medicine"],
  "Medicine": ["Pre-Med", "Nursing", "Public Health", "Healthcare & Medicine"],
  "Design": ["UX Design", "Graphic Design", "Industrial Design", "Creative & Design", "Fine Arts"],
  "Nursing": ["Healthcare & Medicine", "Public Health"],
  "Mathematics": ["Math", "Applied Math", "Statistics"],
  "Architecture": ["Urban Planning"],
  "Communications": ["Journalism", "Public Relations", "Marketing & Communications"],
  "Psychology": ["Social Work & Counseling", "Counseling"],
  "Law": ["Pre-Law", "Political Science", "Law & Policy"],
  "Education": ["Teaching", "Education & Teaching"],
};

function majorMatches(schoolMajors: string[], targetMajor: string): boolean {
  const target = targetMajor.toLowerCase();
  for (const sm of schoolMajors) {
    if (sm.toLowerCase().includes(target) || target.includes(sm.toLowerCase())) return true;
    const synonyms = majorSynonyms[sm] || [];
    if (synonyms.some(s => s.toLowerCase().includes(target) || target.includes(s.toLowerCase()))) return true;
  }
  // Reverse check
  for (const [key, syns] of Object.entries(majorSynonyms)) {
    if (syns.some(s => s.toLowerCase() === target || target.includes(s.toLowerCase()))) {
      if (schoolMajors.some(sm => sm.toLowerCase().includes(key.toLowerCase()))) return true;
    }
  }
  return false;
}

function determineTier(school: SchoolEntry, profile: AcademicProfile): SchoolTier {
  const gpaDiff = profile.gpa - school.avgGpaAdmitted;
  const rate = school.acceptanceRate;

  // Community colleges are always safety
  if (school.type === "Community College") return "safety";

  // Highly selective + GPA below average → reach
  if (rate < 0.15 && gpaDiff < 0.1) return "reach";
  if (rate < 0.15 && gpaDiff >= 0.1) return gpaDiff >= 0.2 ? "target" : "reach";

  // Moderately selective
  if (rate < 0.40) {
    if (gpaDiff < -0.15) return "reach";
    if (gpaDiff >= 0.1) return "safety";
    return "target";
  }

  // Less selective
  if (gpaDiff < -0.3) return "target";
  return "safety";
}

export function matchSchools(profile: AcademicProfile): EnhancedSchool[] {
  const results: EnhancedSchool[] = [];

  for (const school of schoolDatabase) {
    // Major relevance
    const hasMajor = majorMatches(school.strongMajors, profile.intendedMajor);
    const majorStrength = hasMajor ? 85 + Math.floor(Math.random() * 15) : 30 + Math.floor(Math.random() * 25);

    // Academic fit
    const gpaDiff = profile.gpa - school.avgGpaAdmitted;
    const rigorBonus = profile.courseworkRigor.filter(r => r === "AP" || r === "IB").length * 3;
    const academicFit = Math.min(100, Math.max(20, 60 + gpaDiff * 40 + rigorBonus));

    // Cost alignment
    let costAlignment = 50;
    if (profile.budgetPreference === "low" && school.tuitionBucket === "low") costAlignment = 95;
    else if (profile.budgetPreference === "low" && school.tuitionBucket === "high") costAlignment = 25;
    else if (profile.budgetPreference === "flexible") costAlignment = 85;
    else if (profile.budgetPreference === "moderate" && school.tuitionBucket !== "high") costAlignment = 80;
    else costAlignment = 45;

    // Location
    const locationMatch = profile.targetLocation === "Anywhere" || school.state.toLowerCase() === profile.targetLocation.toLowerCase() || school.location.toLowerCase().includes(profile.targetLocation.toLowerCase());

    // Overall match score
    const matchScore = Math.round(majorStrength * 0.35 + academicFit * 0.30 + costAlignment * 0.20 + (locationMatch ? 15 : 5));

    // Build match reasons
    const reasons: EnhancedSchool["matchReasons"] = [];
    if (hasMajor) {
      reasons.push({ label: "Major Strength", detail: `Strong ${profile.intendedMajor} program ranked nationally.`, strength: majorStrength > 80 ? "strong" : "moderate" });
    } else {
      reasons.push({ label: "Major Availability", detail: `${profile.intendedMajor} may have limited offerings here.`, strength: "weak" });
    }

    if (academicFit > 70) {
      reasons.push({ label: "Academic Fit", detail: `Your GPA (${profile.gpa}) aligns well with admitted students (avg ${school.avgGpaAdmitted}).`, strength: "strong" });
    } else if (academicFit > 45) {
      reasons.push({ label: "Academic Fit", detail: `Your GPA (${profile.gpa}) is slightly below average admitted GPA (${school.avgGpaAdmitted}). Strong essays and rigor help.`, strength: "moderate" });
    } else {
      reasons.push({ label: "Academic Fit", detail: `Competitive admission — avg admitted GPA is ${school.avgGpaAdmitted}. Consider strengthening other parts of your application.`, strength: "weak" });
    }

    if (costAlignment > 70) {
      reasons.push({ label: "Cost Alignment", detail: `Tuition (${school.avgTuition}) fits your budget preference.`, strength: "strong" });
    } else {
      reasons.push({ label: "Cost Alignment", detail: `Tuition (${school.avgTuition}) may be above your budget. Explore financial aid.`, strength: "moderate" });
    }

    if (locationMatch && profile.targetLocation !== "Anywhere") {
      reasons.push({ label: "Location Match", detail: `Located in your preferred area: ${school.location}.`, strength: "strong" });
    }

    const tier = determineTier(school, profile);

    results.push({
      id: school.id,
      name: school.name,
      type: school.type,
      location: school.location,
      acceptanceRate: `${Math.round(school.acceptanceRate * 100)}%`,
      avgTuition: school.avgTuition,
      topPrograms: school.topPrograms,
      matchReason: school.description,
      matchScore,
      website: school.website,
      tier,
      matchReasons: reasons,
      academicFit: Math.round(academicFit),
      majorStrength,
      costAlignment,
    });
  }

  return results
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 15);
}

export const defaultAcademicProfile: AcademicProfile = {
  gpa: 3.5,
  intendedMajor: "",
  courseworkRigor: ["Standard"],
  extracurricularFocus: [],
  targetLocation: "Anywhere",
  budgetPreference: "moderate",
};

export const availableMajors = [
  "Computer Science", "Data Science", "Engineering", "Business", "Finance",
  "Biology", "Pre-Med", "Nursing", "Psychology", "Design", "Architecture",
  "Communications", "Education", "Law", "Mathematics", "Physics",
  "Chemistry", "Environmental Science", "Art", "Music",
];

export const availableExtracurriculars = [
  "STEM Clubs", "Sports", "Student Government", "Debate/Speech", "Music/Band",
  "Volunteer Work", "Research", "Robotics", "Theater/Drama", "Journalism",
  "Entrepreneurship Club", "Cultural Organizations", "Tutoring/Mentoring",
];

export const usStates = [
  "Anywhere", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI",
  "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND",
  "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA",
  "WA", "WV", "WI", "WY",
];
