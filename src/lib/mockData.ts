import { UserProfile } from "./types";

export interface School {
  id: string;
  name: string;
  type: "University" | "Community College" | "Trade School";
  location: string;
  acceptanceRate: string;
  avgTuition: string;
  topPrograms: string[];
  matchReason: string;
  matchScore: number;
  website: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  roles: string[];
  matchReason: string;
  website: string;
}

export interface NetworkingTemplate {
  id: string;
  title: string;
  context: string;
  template: string;
  tips: string[];
}

const schoolsByField: Record<string, School[]> = {
  "Software & Tech": [
    { id: "1", name: "Georgia Institute of Technology", type: "University", location: "Atlanta, GA", acceptanceRate: "17%", avgTuition: "$12,682/yr (in-state)", topPrograms: ["Computer Science", "Software Engineering", "Data Science"], matchReason: "Top 10 CS program with strong industry partnerships and co-op programs.", matchScore: 95, website: "gatech.edu" },
    { id: "2", name: "University of Washington", type: "University", location: "Seattle, WA", acceptanceRate: "48%", avgTuition: "$11,745/yr (in-state)", topPrograms: ["Computer Science", "Informatics", "Data Science"], matchReason: "Located in a major tech hub with direct pipelines to Amazon, Microsoft, and Google.", matchScore: 92, website: "uw.edu" },
    { id: "3", name: "Bellevue College", type: "Community College", location: "Bellevue, WA", acceptanceRate: "Open", avgTuition: "$4,200/yr", topPrograms: ["Computer Science Transfer", "Web Development", "Cybersecurity"], matchReason: "Affordable entry point with guaranteed transfer agreements to UW and WSU.", matchScore: 85, website: "bellevuecollege.edu" },
    { id: "4", name: "Carnegie Mellon University", type: "University", location: "Pittsburgh, PA", acceptanceRate: "11%", avgTuition: "$59,864/yr", topPrograms: ["Computer Science", "AI", "Human-Computer Interaction"], matchReason: "World-renowned CS program with cutting-edge AI research opportunities.", matchScore: 97, website: "cmu.edu" },
    { id: "5", name: "Cal Poly San Luis Obispo", type: "University", location: "San Luis Obispo, CA", acceptanceRate: "28%", avgTuition: "$9,948/yr (in-state)", topPrograms: ["Software Engineering", "Computer Science", "Computer Engineering"], matchReason: "Learn by doing philosophy with strong hands-on project curriculum.", matchScore: 88, website: "calpoly.edu" },
  ],
  "Healthcare & Medicine": [
    { id: "6", name: "Johns Hopkins University", type: "University", location: "Baltimore, MD", acceptanceRate: "7%", avgTuition: "$60,480/yr", topPrograms: ["Pre-Med", "Public Health", "Biomedical Engineering"], matchReason: "Top-ranked medical school with unmatched clinical research opportunities.", matchScore: 98, website: "jhu.edu" },
    { id: "7", name: "University of Michigan", type: "University", location: "Ann Arbor, MI", acceptanceRate: "18%", avgTuition: "$16,178/yr (in-state)", topPrograms: ["Nursing", "Public Health", "Biology"], matchReason: "Excellent pre-med advising and early clinical exposure programs.", matchScore: 93, website: "umich.edu" },
    { id: "8", name: "Community College of Denver", type: "Community College", location: "Denver, CO", acceptanceRate: "Open", avgTuition: "$4,500/yr", topPrograms: ["Nursing (ADN)", "Medical Assisting", "Health Information Technology"], matchReason: "Fast-track nursing program with hospital clinical partnerships.", matchScore: 82, website: "ccd.edu" },
  ],
  "Business & Finance": [
    { id: "9", name: "University of Pennsylvania (Wharton)", type: "University", location: "Philadelphia, PA", acceptanceRate: "6%", avgTuition: "$63,452/yr", topPrograms: ["Finance", "Business Analytics", "Entrepreneurship"], matchReason: "World's top business school with unparalleled alumni network.", matchScore: 99, website: "wharton.upenn.edu" },
    { id: "10", name: "Indiana University Bloomington", type: "University", location: "Bloomington, IN", acceptanceRate: "80%", avgTuition: "$10,948/yr (in-state)", topPrograms: ["Finance", "Accounting", "Marketing"], matchReason: "Kelley School of Business ranks top 10 with strong career placement.", matchScore: 89, website: "indiana.edu" },
    { id: "11", name: "Baruch College (CUNY)", type: "University", location: "New York, NY", acceptanceRate: "45%", avgTuition: "$7,472/yr (in-state)", topPrograms: ["Finance", "Accounting", "Business Administration"], matchReason: "Affordable business education in NYC with Wall Street access.", matchScore: 87, website: "baruch.cuny.edu" },
  ],
  "Engineering": [
    { id: "12", name: "MIT", type: "University", location: "Cambridge, MA", acceptanceRate: "4%", avgTuition: "$57,590/yr", topPrograms: ["Mechanical Engineering", "Electrical Engineering", "Aerospace"], matchReason: "World's top engineering school with groundbreaking research labs.", matchScore: 99, website: "mit.edu" },
    { id: "13", name: "Purdue University", type: "University", location: "West Lafayette, IN", acceptanceRate: "53%", avgTuition: "$9,992/yr (in-state)", topPrograms: ["Mechanical Engineering", "Civil Engineering", "Electrical Engineering"], matchReason: "Highly ranked engineering with affordable in-state tuition and strong co-op.", matchScore: 91, website: "purdue.edu" },
  ],
  "Creative & Design": [
    { id: "14", name: "Rhode Island School of Design", type: "University", location: "Providence, RI", acceptanceRate: "20%", avgTuition: "$56,435/yr", topPrograms: ["Graphic Design", "Industrial Design", "Illustration"], matchReason: "Premier design school with Brown University cross-enrollment.", matchScore: 96, website: "risd.edu" },
    { id: "15", name: "Savannah College of Art and Design", type: "University", location: "Savannah, GA", acceptanceRate: "75%", avgTuition: "$38,075/yr", topPrograms: ["UX Design", "Motion Design", "Graphic Design"], matchReason: "Industry-focused curriculum with strong job placement rates.", matchScore: 88, website: "scad.edu" },
  ],
};

const companiesByField: Record<string, Company[]> = {
  "Software & Tech": [
    { id: "1", name: "Google", industry: "Technology", size: "180,000+", location: "Mountain View, CA (Remote available)", roles: ["Software Engineer", "Data Scientist", "Product Manager", "UX Researcher"], matchReason: "Industry leader with strong internship programs and career development.", website: "google.com/careers" },
    { id: "2", name: "Microsoft", industry: "Technology", size: "220,000+", location: "Redmond, WA (Hybrid)", roles: ["Software Engineer", "Cloud Architect", "AI Engineer", "Program Manager"], matchReason: "Offers extensive new grad programs and mentorship opportunities.", website: "careers.microsoft.com" },
    { id: "3", name: "Stripe", industry: "Fintech", size: "8,000+", location: "San Francisco, CA (Remote)", roles: ["Backend Engineer", "Full-Stack Engineer", "Infrastructure Engineer"], matchReason: "Fast-growing fintech with strong engineering culture and impact.", website: "stripe.com/jobs" },
    { id: "4", name: "Figma", industry: "Design Tools", size: "1,500+", location: "San Francisco, CA (Remote)", roles: ["Frontend Engineer", "Design Engineer", "Product Designer"], matchReason: "Innovative product company at the intersection of design and engineering.", website: "figma.com/careers" },
  ],
  "Healthcare & Medicine": [
    { id: "5", name: "Mayo Clinic", industry: "Healthcare", size: "76,000+", location: "Rochester, MN", roles: ["Physician", "Nurse Practitioner", "Research Scientist", "Health IT"], matchReason: "Top-ranked hospital with world-class residency and research programs.", website: "jobs.mayoclinic.org" },
    { id: "6", name: "UnitedHealth Group", industry: "Health Insurance", size: "400,000+", location: "Minnetonka, MN (Hybrid)", roles: ["Data Analyst", "Clinical Director", "Health Policy Analyst"], matchReason: "Largest healthcare company with diverse career paths.", website: "careers.unitedhealthgroup.com" },
  ],
  "Business & Finance": [
    { id: "7", name: "Goldman Sachs", industry: "Investment Banking", size: "45,000+", location: "New York, NY", roles: ["Financial Analyst", "Investment Banker", "Asset Manager"], matchReason: "Prestigious firm with top-tier training and analyst programs.", website: "goldmansachs.com/careers" },
    { id: "8", name: "McKinsey & Company", industry: "Consulting", size: "45,000+", location: "Global", roles: ["Business Analyst", "Management Consultant", "Data Scientist"], matchReason: "World's leading consulting firm with accelerated career growth.", website: "mckinsey.com/careers" },
    { id: "9", name: "Deloitte", industry: "Professional Services", size: "415,000+", location: "Global", roles: ["Consultant", "Auditor", "Risk Analyst", "Tax Advisor"], matchReason: "Big Four firm with broad industry exposure and structured programs.", website: "deloitte.com/careers" },
  ],
  "Engineering": [
    { id: "10", name: "SpaceX", industry: "Aerospace", size: "13,000+", location: "Hawthorne, CA", roles: ["Mechanical Engineer", "Propulsion Engineer", "Avionics Engineer"], matchReason: "Cutting-edge aerospace work with mission-driven culture.", website: "spacex.com/careers" },
    { id: "11", name: "Tesla", industry: "Automotive/Energy", size: "130,000+", location: "Austin, TX", roles: ["Mechanical Engineer", "Electrical Engineer", "Manufacturing Engineer"], matchReason: "Innovating at the intersection of engineering and sustainability.", website: "tesla.com/careers" },
  ],
  "Creative & Design": [
    { id: "12", name: "Apple", industry: "Technology", size: "160,000+", location: "Cupertino, CA", roles: ["Product Designer", "UX Designer", "Visual Designer", "Motion Designer"], matchReason: "Design-first company with world-class product teams.", website: "apple.com/careers" },
    { id: "13", name: "Airbnb", industry: "Travel Tech", size: "6,000+", location: "San Francisco, CA (Remote)", roles: ["Product Designer", "Brand Designer", "Design Researcher"], matchReason: "Known for exceptional design culture and remote-first policy.", website: "airbnb.com/careers" },
  ],
};

export const networkingTemplates: NetworkingTemplate[] = [
  {
    id: "1",
    title: "Cold Outreach to a Professional",
    context: "Reaching out to someone you don't know in your target field",
    template: `Hi [Name],

I'm a [your education level] student at [your school] interested in [their field/company]. I came across your profile and was impressed by your work in [specific area].

I'd love to learn more about your career path and any advice you'd have for someone starting out. Would you be open to a brief 15-minute call or coffee chat?

Thank you for your time!

Best,
[Your Name]`,
    tips: [
      "Personalize every message — mention something specific about their work",
      "Keep it under 150 words",
      "Ask for a specific, small commitment (15-min call)",
      "Follow up once after 5-7 days if no response",
    ],
  },
  {
    id: "2",
    title: "Informational Interview Request",
    context: "Asking for career insights from someone in your target role",
    template: `Hi [Name],

I'm currently exploring careers in [field] and noticed your experience as a [their role] at [company]. Your career trajectory is exactly what I'm aspiring toward.

I'm particularly curious about [specific question about their role/path]. Would you have 15-20 minutes for a quick informational interview? I'd really value your perspective.

Thanks so much!

[Your Name]`,
    tips: [
      "Research their background thoroughly before reaching out",
      "Prepare 3-5 specific questions beforehand",
      "Send a thank-you message within 24 hours",
      "Offer to help them in return if possible",
    ],
  },
  {
    id: "3",
    title: "Post-Career Fair Follow-Up",
    context: "Following up after meeting someone at a career fair or event",
    template: `Hi [Name],

It was great meeting you at [event name] yesterday! I really enjoyed our conversation about [specific topic you discussed].

As I mentioned, I'm a [your year] student studying [your major], and I'm very interested in the [specific role/program] at [their company]. I'd love to continue our conversation and learn more about next steps.

I've attached my resume for your reference. Thank you again for your time!

Best,
[Your Name]`,
    tips: [
      "Send within 24-48 hours of the event",
      "Reference something specific from your conversation",
      "Attach your resume or portfolio link",
      "Connect with them on LinkedIn with a personalized note",
    ],
  },
  {
    id: "4",
    title: "Alumni Connection Request",
    context: "Reaching out to alumni from your school",
    template: `Hi [Name],

I'm a fellow [school name] alum (Class of [year]) currently studying [major/working in field]. I noticed we share a connection through [school/program/club].

I'm exploring opportunities in [their field] and would love to hear about your experience transitioning from [school] to [their company/role]. Any advice you could share would be incredibly helpful.

Would you be open to a quick chat? I'd be happy to work around your schedule.

Go [school mascot]!

[Your Name]`,
    tips: [
      "Lead with the shared school connection",
      "Mention specific shared experiences (clubs, professors, programs)",
      "Alumni are often willing to help — don't be shy",
      "Use your school's alumni network platform if available",
    ],
  },
];

export function getSchoolsForProfile(profile: UserProfile): School[] {
  const allSchools: School[] = [];
  const fields = profile.interests.length > 0 ? profile.interests : profile.careerInterests;
  
  for (const field of fields) {
    const schools = schoolsByField[field];
    if (schools) allSchools.push(...schools);
  }
  
  if (allSchools.length === 0) {
    allSchools.push(...(schoolsByField["Software & Tech"] || []));
  }
  
  // Deduplicate by id
  const seen = new Set<string>();
  return allSchools.filter(s => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  }).sort((a, b) => b.matchScore - a.matchScore);
}

export function getCompaniesForProfile(profile: UserProfile): Company[] {
  const allCompanies: Company[] = [];
  const fields = profile.interests.length > 0 ? profile.interests : profile.careerInterests;
  
  for (const field of fields) {
    const companies = companiesByField[field];
    if (companies) allCompanies.push(...companies);
  }
  
  if (allCompanies.length === 0) {
    allCompanies.push(...(companiesByField["Software & Tech"] || []));
  }
  
  const seen = new Set<string>();
  return allCompanies.filter(c => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}
