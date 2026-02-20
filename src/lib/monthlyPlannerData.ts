export interface MonthAction {
  id: string;
  title: string;
  description: string;
  category: "academics" | "testing" | "applications" | "financial" | "career" | "skills";
  urgent?: boolean;
}

export interface MonthPlan {
  month: string;
  actions: MonthAction[];
}

export interface YearPlan {
  year: string;
  label: string;
  phase: string;
  description: string;
  months: MonthPlan[];
}

export interface StageOption {
  id: string;
  label: string;
  group: string;
  description: string;
  phaseTag: string;
}

export const stageOptions: StageOption[] = [
  { id: "9th", label: "9th Grade", group: "High School", description: "Explore interests and build foundations early", phaseTag: "Preparation" },
  { id: "10th", label: "10th Grade", group: "High School", description: "Deepen coursework rigor and start test prep", phaseTag: "Preparation" },
  { id: "11th", label: "11th Grade", group: "High School", description: "Take standardized tests and research colleges", phaseTag: "Application" },
  { id: "12th", label: "12th Grade", group: "High School", description: "Submit applications and finalize decisions", phaseTag: "Application" },
  { id: "rs-1", label: "Running Start Year 1", group: "Running Start", description: "Earn college credits while in high school", phaseTag: "Skill-Building" },
  { id: "rs-2", label: "Running Start Year 2", group: "Running Start", description: "Complete associate degree and transfer prep", phaseTag: "Application" },
  { id: "col-fresh", label: "College Freshman", group: "College", description: "Explore majors and build campus network", phaseTag: "Preparation" },
  { id: "col-soph", label: "College Sophomore", group: "College", description: "Declare major and seek first internship", phaseTag: "Skill-Building" },
  { id: "col-junior", label: "College Junior", group: "College", description: "Prioritize internships and grad school prep", phaseTag: "Skill-Building" },
  { id: "col-senior", label: "College Senior", group: "College", description: "Launch career or apply to graduate programs", phaseTag: "Career Launch" },
  { id: "gap-year", label: "Gap Year", group: "Other", description: "Explore, work, or volunteer before next step", phaseTag: "Preparation" },
  { id: "masters", label: "Master's Applicant", group: "Other", description: "Prepare exams, SOP, and recommendations", phaseTag: "Application" },
  { id: "early-pro", label: "Early Professional", group: "Other", description: "Build career, upskill, and grow network", phaseTag: "Career Launch" },
];

const categoryLabels: Record<string, string> = {
  academics: "📚 Academics",
  testing: "📝 Testing",
  applications: "📨 Applications",
  financial: "💰 Financial Aid",
  career: "💼 Career Prep",
  skills: "🛠 Skills",
};

export { categoryLabels };

const phaseColors: Record<string, string> = {
  Preparation: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Application: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  "Skill-Building": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  "Career Launch": "bg-purple-500/10 text-purple-700 dark:text-purple-300",
};

export { phaseColors };

export function generateMonthlyPlan(stageId: string, interests: string[]): YearPlan[] {
  const field = interests[0] || "your field";

  switch (stageId) {
    case "9th": return gen9th(field);
    case "10th": return gen10th(field);
    case "11th": return gen11th(field);
    case "12th": return gen12th(field);
    case "rs-1": return genRS1(field);
    case "rs-2": return genRS2(field);
    case "col-fresh": return genColFresh(field);
    case "col-soph": return genColSoph(field);
    case "col-junior": return genColJunior(field);
    case "col-senior": return genColSenior(field);
    case "gap-year": return genGapYear(field);
    case "masters": return genMasters(field);
    case "early-pro": return genEarlyPro(field);
    default: return gen11th(field);
  }
}

// ─── 9th Grade ────────────────────────────────────────────
function gen9th(field: string): YearPlan[] {
  return [
    {
      year: "9th Grade", label: "Exploration", phase: "Preparation",
      description: "Discover your interests, build strong habits, and explore extracurriculars early.",
      months: [
        { month: "August–September", actions: [
          { id: "9-1", title: "Set GPA goals for freshman year", description: "Aim for a strong foundation — colleges look at all 4 years.", category: "academics" },
          { id: "9-2", title: "Join 2–3 clubs or activities", description: "Try a mix of academic, athletic, and creative options.", category: "career" },
          { id: "9-3", title: "Create a 4-year course plan with your counselor", description: "Map out AP/honors tracks early for maximum rigor.", category: "academics" },
        ]},
        { month: "October–November", actions: [
          { id: "9-4", title: "Explore career interest areas", description: `Research careers in ${field} — shadow professionals or watch day-in-the-life videos.`, category: "career" },
          { id: "9-5", title: "Start a reading or learning habit", description: "Read one book or take one free online course per month.", category: "skills" },
        ]},
        { month: "December–January", actions: [
          { id: "9-6", title: "Reflect on first semester grades", description: "Identify strengths and weaknesses. Seek tutoring if needed.", category: "academics" },
          { id: "9-7", title: "Research summer programs", description: "Look into free or low-cost summer camps, programs, and workshops.", category: "career" },
        ]},
        { month: "February–March", actions: [
          { id: "9-8", title: "Attend school career day or job shadow", description: "Get exposure to real professionals in fields you're curious about.", category: "career" },
          { id: "9-9", title: "Start a personal project or hobby", description: `Build something small related to ${field} — a blog, app, experiment, or portfolio piece.`, category: "skills" },
        ]},
        { month: "April–May", actions: [
          { id: "9-10", title: "Finish strong academically", description: "Final exams matter — maintain or improve your GPA.", category: "academics" },
          { id: "9-11", title: "Apply to summer programs", description: "Submit applications to enrichment programs, volunteer orgs, or pre-college camps.", category: "applications" },
        ]},
        { month: "June–July", actions: [
          { id: "9-12", title: "Participate in a summer activity", description: "Attend camp, volunteer, take a course, or work a part-time job.", category: "career" },
          { id: "9-13", title: "Plan sophomore year course rigor", description: "Select honors/pre-AP courses to stay on an advanced track.", category: "academics" },
        ]},
      ],
    },
    {
      year: "Looking Ahead", label: "Long-Term Prep", phase: "Preparation",
      description: "Keep building toward a strong application over the next 3 years.",
      months: [
        { month: "Sophomore–Junior Preview", actions: [
          { id: "9-14", title: "Plan to take PSAT sophomore year", description: "Early practice for SAT and National Merit Scholarship qualification.", category: "testing" },
          { id: "9-15", title: "Aim for leadership roles by junior year", description: "Work toward officer positions in clubs you join now.", category: "career" },
          { id: "9-16", title: "Begin a scholarship tracker", description: "Start listing scholarships with eligibility requirements and deadlines.", category: "financial" },
        ]},
      ],
    },
  ];
}

// ─── 10th Grade ───────────────────────────────────────────
function gen10th(field: string): YearPlan[] {
  return [
    {
      year: "10th Grade", label: "Deepening Focus", phase: "Preparation",
      description: "Increase academic rigor, take the PSAT, and narrow your interests.",
      months: [
        { month: "August–September", actions: [
          { id: "10-1", title: "Enroll in honors/pre-AP courses", description: "Demonstrate academic rigor to future colleges.", category: "academics" },
          { id: "10-2", title: "Take on a leadership role in one activity", description: "Move from member to leader — this strengthens applications.", category: "career" },
        ]},
        { month: "October", actions: [
          { id: "10-3", title: "Take the PSAT", description: "Practice for SAT and qualify for National Merit in 11th grade.", category: "testing", urgent: true },
          { id: "10-4", title: "Start a college wish list", description: "Research 10–15 schools based on major, location, and culture.", category: "applications" },
        ]},
        { month: "November–December", actions: [
          { id: "10-5", title: "Deepen your personal project", description: `Expand your ${field} project — enter a competition or publish it.`, category: "skills" },
          { id: "10-6", title: "Maintain GPA above 3.5+", description: "Sophomore grades are critical for your cumulative GPA.", category: "academics" },
        ]},
        { month: "January–February", actions: [
          { id: "10-7", title: "Begin SAT/ACT prep", description: "Start light prep with practice tests to identify weak areas.", category: "testing" },
          { id: "10-8", title: "Research AP courses for junior year", description: "Plan which AP classes to take based on your intended major.", category: "academics" },
        ]},
        { month: "March–April", actions: [
          { id: "10-9", title: "Apply for summer internships or programs", description: "Target programs for rising juniors — many have early deadlines.", category: "career" },
          { id: "10-10", title: "Attend a college information session", description: "Start getting familiar with the admissions process.", category: "applications" },
        ]},
        { month: "May–July", actions: [
          { id: "10-11", title: "Complete sophomore year strong", description: "Finish exams and secure your GPA.", category: "academics" },
          { id: "10-12", title: "Pursue a meaningful summer experience", description: "Internship, research, volunteer work, or a rigorous program.", category: "career" },
        ]},
      ],
    },
  ];
}

// ─── 11th Grade ───────────────────────────────────────────
function gen11th(field: string): YearPlan[] {
  return [
    {
      year: "11th Grade", label: "Foundation Building", phase: "Application",
      description: "The most critical year — standardized tests, college research, and essay prep.",
      months: [
        { month: "August", actions: [
          { id: "j-aug-1", title: "Begin intensive SAT/ACT prep", description: "Enroll in a prep course or commit to a structured self-study plan.", category: "testing", urgent: true },
          { id: "j-aug-2", title: "Join 2 extracurricular clubs", description: "Seek leadership positions in activities aligned with your interests.", category: "career" },
        ]},
        { month: "September", actions: [
          { id: "j-sep-1", title: "Research 10–15 target colleges", description: "Create a spreadsheet comparing programs, tuition, acceptance rates, and deadlines.", category: "applications" },
          { id: "j-sep-2", title: "Start a portfolio project", description: `Begin a project related to ${field} to showcase in applications.`, category: "skills" },
        ]},
        { month: "October", actions: [
          { id: "j-oct-1", title: "Take the PSAT/NMSQT", description: "Qualify for National Merit Scholarships and benchmark your score.", category: "testing", urgent: true },
          { id: "j-oct-2", title: "Attend a college fair", description: "Meet admissions reps and collect materials from target schools.", category: "applications" },
        ]},
        { month: "November", actions: [
          { id: "j-nov-1", title: "Request teacher recommendations", description: "Ask 2 teachers who know you well — give them time to write.", category: "applications" },
          { id: "j-nov-2", title: "Begin scholarship research", description: "Create a list of 15+ scholarships with deadlines and requirements.", category: "financial" },
        ]},
        { month: "December", actions: [
          { id: "j-dec-1", title: "Take first SAT/ACT attempt", description: "Take your first official test to establish a baseline score.", category: "testing", urgent: true },
          { id: "j-dec-2", title: "Finalize spring course selections", description: "Choose rigorous courses that align with your intended major.", category: "academics" },
        ]},
        { month: "January", actions: [
          { id: "j-jan-1", title: "Complete FAFSA (opens Oct 1)", description: "Submit FAFSA as early as possible for maximum aid.", category: "financial", urgent: true },
          { id: "j-jan-2", title: "Apply to summer programs", description: "Research and apply to internships, camps, or pre-college programs.", category: "career" },
        ]},
        { month: "February–March", actions: [
          { id: "j-feb-1", title: "Schedule and visit campuses", description: "Tour your top 3–5 schools during spring break.", category: "applications" },
          { id: "j-mar-1", title: "Retake SAT/ACT if needed", description: "Retake to improve your score if below your target range.", category: "testing" },
        ]},
        { month: "April–May", actions: [
          { id: "j-apr-1", title: "Start drafting college essays", description: "Begin brainstorming and writing personal statement drafts.", category: "applications" },
          { id: "j-may-1", title: "Take AP exams", description: "Prepare for and complete any AP exams to earn college credit.", category: "testing", urgent: true },
          { id: "j-may-2", title: "Build your LinkedIn profile", description: "Create a professional profile highlighting your activities and goals.", category: "career" },
        ]},
      ],
    },
  ];
}

// ─── 12th Grade ───────────────────────────────────────────
function gen12th(field: string): YearPlan[] {
  return [
    {
      year: "12th Grade — Fall", label: "Application Season", phase: "Application",
      description: "Submit applications, finalize essays, and secure financial aid.",
      months: [
        { month: "August", actions: [
          { id: "12-1", title: "Finalize your college list (reach/match/safety)", description: "Confirm 8–12 schools with balanced tiers.", category: "applications", urgent: true },
          { id: "12-2", title: "Polish personal statement", description: "Revise essays with feedback from teachers and counselors.", category: "applications", urgent: true },
        ]},
        { month: "September", actions: [
          { id: "12-3", title: "Begin Early Decision/Action applications", description: "Start filling out apps for early deadlines (Nov 1–15).", category: "applications", urgent: true },
          { id: "12-4", title: "Submit scholarship applications", description: "Apply to at least 5 scholarships this month.", category: "financial" },
        ]},
        { month: "October", actions: [
          { id: "12-5", title: "Submit FAFSA and CSS Profile", description: "Complete all financial aid applications as soon as they open.", category: "financial", urgent: true },
          { id: "12-6", title: "Send final SAT/ACT scores", description: "Submit your best scores to all target schools.", category: "testing" },
        ]},
        { month: "November", actions: [
          { id: "12-7", title: "Submit Early Decision applications", description: "All early apps due by Nov 1–15. Double-check everything.", category: "applications", urgent: true },
          { id: "12-8", title: "Complete supplemental essays", description: "Write school-specific essays for remaining applications.", category: "applications" },
        ]},
        { month: "December", actions: [
          { id: "12-9", title: "Submit Regular Decision apps", description: "Complete all remaining applications by Jan 1.", category: "applications", urgent: true },
          { id: "12-10", title: "Apply to more scholarships", description: "Continue applying to scholarships with spring deadlines.", category: "financial" },
        ]},
      ],
    },
    {
      year: "12th Grade — Spring", label: "Decisions & Launch", phase: "Career Launch",
      description: "Evaluate offers, commit to a school, and prepare for college.",
      months: [
        { month: "January–February", actions: [
          { id: "12-11", title: "Verify all materials received", description: "Check portals for every school to ensure completeness.", category: "applications" },
          { id: "12-12", title: "Research housing and orientation", description: "Look into dorms, meal plans, and student organizations at top choices.", category: "career" },
        ]},
        { month: "March", actions: [
          { id: "12-13", title: "Review admission decisions", description: "Decisions arrive — compare offers carefully.", category: "applications" },
          { id: "12-14", title: "Attend admitted students events", description: "Visit campuses for accepted students days if possible.", category: "applications" },
        ]},
        { month: "April", actions: [
          { id: "12-15", title: "Compare financial aid packages", description: "Evaluate total cost of attendance — negotiate if needed.", category: "financial", urgent: true },
          { id: "12-16", title: "Commit by May 1 deadline", description: "Submit enrollment deposit to your chosen school.", category: "applications", urgent: true },
        ]},
        { month: "May–June", actions: [
          { id: "12-17", title: "Take final AP exams", description: "Complete AP exams for potential college credit.", category: "testing" },
          { id: "12-18", title: "Complete housing and orientation forms", description: "Register for orientation, submit housing preferences, connect with roommates.", category: "career" },
          { id: "12-19", title: "Graduate and celebrate!", description: "You've earned it. Enjoy your accomplishment.", category: "career" },
        ]},
      ],
    },
  ];
}

// ─── Running Start Year 1 ─────────────────────────────────
function genRS1(field: string): YearPlan[] {
  return [
    {
      year: "Running Start Year 1", label: "Dual Enrollment", phase: "Skill-Building",
      description: "Earn college credits while still in high school — balance both worlds.",
      months: [
        { month: "August–September", actions: [
          { id: "rs1-1", title: "Meet with your college and HS counselor", description: "Map courses that satisfy both HS graduation and college transfer requirements.", category: "academics", urgent: true },
          { id: "rs1-2", title: "Choose transferable general education courses", description: "Prioritize English, math, and science courses that transfer widely.", category: "academics" },
          { id: "rs1-3", title: "Set up campus study habits", description: "Learn the college library, tutoring center, and office hours schedule.", category: "skills" },
        ]},
        { month: "October–November", actions: [
          { id: "rs1-4", title: "Explore major-aligned electives", description: `Take an intro course in ${field} to test your interest.`, category: "academics" },
          { id: "rs1-5", title: "Research associate degree requirements", description: "Understand what you need to earn your AA/AS alongside HS diploma.", category: "applications" },
        ]},
        { month: "December–January", actions: [
          { id: "rs1-6", title: "Complete first quarter/semester strong", description: "College GPA starts now — these grades matter for transfer.", category: "academics", urgent: true },
          { id: "rs1-7", title: "Begin researching 4-year transfer schools", description: "Identify universities with strong programs in your field.", category: "applications" },
        ]},
        { month: "February–March", actions: [
          { id: "rs1-8", title: "Apply for summer opportunities", description: "Look for internships, volunteer work, or continued coursework.", category: "career" },
          { id: "rs1-9", title: "Connect with college student organizations", description: "Join clubs at the college campus for networking and experience.", category: "career" },
        ]},
        { month: "April–June", actions: [
          { id: "rs1-10", title: "Plan Year 2 course schedule", description: "Prioritize remaining gen-ed and major prerequisites.", category: "academics" },
          { id: "rs1-11", title: "Pursue a summer experience", description: "Internship, job, or continued coursework to build your resume.", category: "career" },
        ]},
      ],
    },
  ];
}

// ─── Running Start Year 2 ─────────────────────────────────
function genRS2(field: string): YearPlan[] {
  return [
    {
      year: "Running Start Year 2", label: "Transfer Prep", phase: "Application",
      description: "Complete your associate degree and prepare for university transfer.",
      months: [
        { month: "August–September", actions: [
          { id: "rs2-1", title: "Confirm remaining degree requirements", description: "Meet with your advisor to ensure you'll complete your AA/AS on time.", category: "academics", urgent: true },
          { id: "rs2-2", title: "Research transfer admission requirements", description: "Each university has specific prereqs — check them now.", category: "applications", urgent: true },
        ]},
        { month: "October–November", actions: [
          { id: "rs2-3", title: "Begin transfer applications", description: "Many universities have fall/winter deadlines for transfer students.", category: "applications", urgent: true },
          { id: "rs2-4", title: "Request recommendation letters", description: "Ask professors who know your work well.", category: "applications" },
          { id: "rs2-5", title: "Submit FAFSA for next year", description: "Ensure financial aid follows you to your new school.", category: "financial", urgent: true },
        ]},
        { month: "December–January", actions: [
          { id: "rs2-6", title: "Complete and submit all transfer apps", description: "Double-check essays, transcripts, and supplementals.", category: "applications", urgent: true },
          { id: "rs2-7", title: "Apply for transfer scholarships", description: "Many schools offer merit aid specifically for transfer students.", category: "financial" },
        ]},
        { month: "February–March", actions: [
          { id: "rs2-8", title: "Follow up on application status", description: "Check portals and respond to any requests for additional info.", category: "applications" },
          { id: "rs2-9", title: "Visit admitted campuses", description: "Tour schools that have accepted you to compare options.", category: "applications" },
        ]},
        { month: "April–June", actions: [
          { id: "rs2-10", title: "Accept offer and complete enrollment", description: "Submit deposit, register for orientation, and plan housing.", category: "applications", urgent: true },
          { id: "rs2-11", title: "Complete your associate degree", description: "Finish final courses and earn your AA/AS.", category: "academics", urgent: true },
          { id: "rs2-12", title: "Prepare for university transition", description: "Connect with future classmates and research campus resources.", category: "career" },
        ]},
      ],
    },
  ];
}

// ─── College Freshman ─────────────────────────────────────
function genColFresh(field: string): YearPlan[] {
  return [
    {
      year: "Freshman Year", label: "Explore & Build", phase: "Preparation",
      description: "Explore majors, build your network, and establish strong academic habits.",
      months: [
        { month: "August–September", actions: [
          { id: "cf-1", title: "Attend orientation and meet your advisor", description: "Understand degree requirements and campus resources.", category: "academics" },
          { id: "cf-2", title: "Join 2–3 student organizations", description: "Attend club fairs — try academic, social, and professional orgs.", category: "career" },
          { id: "cf-3", title: "Set up study routines", description: "Identify study spots, form study groups, and manage your schedule.", category: "skills" },
        ]},
        { month: "October–November", actions: [
          { id: "cf-4", title: "Explore 2–3 potential majors", description: `Take intro courses in ${field} and related areas to compare.`, category: "academics" },
          { id: "cf-5", title: "Attend career center workshops", description: "Learn resume writing, networking basics, and career exploration.", category: "career" },
          { id: "cf-6", title: "Apply for spring scholarships", description: "Many internal scholarships have November deadlines.", category: "financial" },
        ]},
        { month: "December–January", actions: [
          { id: "cf-7", title: "Complete first semester with strong GPA", description: "Aim for 3.5+ to keep graduate school and scholarship options open.", category: "academics" },
          { id: "cf-8", title: "Research summer opportunities", description: "Look into REUs, internships, and volunteer programs for freshmen.", category: "career" },
        ]},
        { month: "February–March", actions: [
          { id: "cf-9", title: "Connect with professors during office hours", description: "Build relationships early — professors become mentors and recommenders.", category: "academics" },
          { id: "cf-10", title: "Apply for summer positions", description: "Submit applications for internships, research, or campus jobs.", category: "career" },
        ]},
        { month: "April–May", actions: [
          { id: "cf-11", title: "Renew FAFSA for next year", description: "Submit early for maximum aid.", category: "financial" },
          { id: "cf-12", title: "Plan sophomore courses", description: "Start taking courses in your likely major to stay on track.", category: "academics" },
          { id: "cf-13", title: "Reflect and adjust goals", description: "What worked? What didn't? Set intentions for Year 2.", category: "skills" },
        ]},
      ],
    },
  ];
}

// ─── College Sophomore ────────────────────────────────────
function genColSoph(field: string): YearPlan[] {
  return [
    {
      year: "Sophomore Year", label: "Declare & Build", phase: "Skill-Building",
      description: "Declare your major, land your first real internship, and build technical skills.",
      months: [
        { month: "August–September", actions: [
          { id: "cs-1", title: "Declare your major", description: "Meet with your advisor and officially declare — don't delay.", category: "academics", urgent: true },
          { id: "cs-2", title: "Apply for fall internships and research", description: "Many top companies recruit sophomores for summer roles now.", category: "career", urgent: true },
          { id: "cs-3", title: "Join a professional organization in your field", description: "IEEE, AIGA, AMA, etc. — build your professional network.", category: "career" },
        ]},
        { month: "October–November", actions: [
          { id: "cs-4", title: "Attend career fairs", description: "Bring updated resumes. Practice your 30-second pitch.", category: "career" },
          { id: "cs-5", title: "Start building a portfolio", description: `Create 2–3 substantial projects in ${field} for your resume.`, category: "skills" },
        ]},
        { month: "December–January", actions: [
          { id: "cs-6", title: "Complete fall courses with strong grades", description: "Maintain GPA for graduate school eligibility.", category: "academics" },
          { id: "cs-7", title: "Practice technical interviews", description: "Use LeetCode, case studies, or mock interviews depending on your field.", category: "career" },
        ]},
        { month: "February–March", actions: [
          { id: "cs-8", title: "Submit remaining summer internship apps", description: "Cast a wide net — apply to 15–20 positions.", category: "career" },
          { id: "cs-9", title: "Seek a faculty mentor", description: "Build a deeper relationship with a professor in your field.", category: "academics" },
        ]},
        { month: "April–May", actions: [
          { id: "cs-10", title: "Accept a summer opportunity", description: "Internship, research, or significant project experience.", category: "career", urgent: true },
          { id: "cs-11", title: "Plan junior year — consider study abroad or minors", description: "Junior year is pivotal; plan strategically.", category: "academics" },
        ]},
      ],
    },
  ];
}

// ─── College Junior ───────────────────────────────────────
function genColJunior(field: string): YearPlan[] {
  return [
    {
      year: "Junior Year", label: "Experience & Prepare", phase: "Skill-Building",
      description: "Prioritize internships, build leadership, and decide on grad school vs. career.",
      months: [
        { month: "August–September", actions: [
          { id: "cj-1", title: "Apply for top-tier summer internships", description: "FAANG, Big 4, research labs — top programs recruit in fall.", category: "career", urgent: true },
          { id: "cj-2", title: "Decide: grad school or job market?", description: "This decision shapes your junior year priorities.", category: "career", urgent: true },
          { id: "cj-3", title: "Take the GRE/GMAT/LSAT if considering grad school", description: "Start prep now for spring test dates.", category: "testing" },
        ]},
        { month: "October–November", actions: [
          { id: "cj-4", title: "Attend career fairs and networking events", description: "This is your most important recruiting season.", category: "career", urgent: true },
          { id: "cj-5", title: "Request recommendation letters early", description: "If applying to grad school, ask professors now.", category: "applications" },
          { id: "cj-6", title: "Research graduate programs", description: "Identify 8–12 programs and note their deadlines and requirements.", category: "applications" },
        ]},
        { month: "December–January", actions: [
          { id: "cj-7", title: "Secure a summer internship", description: "Accept an offer or continue applying — don't give up.", category: "career", urgent: true },
          { id: "cj-8", title: "Take graduate entrance exam", description: "Complete GRE/GMAT/LSAT and evaluate whether to retake.", category: "testing" },
        ]},
        { month: "February–March", actions: [
          { id: "cj-9", title: "Draft grad school personal statements", description: "Start writing SOPs and get feedback from mentors.", category: "applications" },
          { id: "cj-10", title: "Build a professional portfolio/website", description: "Showcase your best work — projects, research, and writing.", category: "skills" },
        ]},
        { month: "April–May", actions: [
          { id: "cj-11", title: "Complete junior year strong", description: "Final GPA matters for grad school and job applications.", category: "academics" },
          { id: "cj-12", title: "Plan senior year strategically", description: "Light course load? Thesis? Capstone? Plan for senior-year priorities.", category: "academics" },
        ]},
      ],
    },
  ];
}

// ─── College Senior ───────────────────────────────────────
function genColSenior(field: string): YearPlan[] {
  return [
    {
      year: "Senior Year — Fall", label: "Applications & Interviews", phase: "Career Launch",
      description: "Apply to jobs or grad school, complete your capstone, and prepare to launch.",
      months: [
        { month: "August–September", actions: [
          { id: "sr-1", title: "Submit grad school applications", description: "Many programs have Dec–Jan deadlines. Start early.", category: "applications", urgent: true },
          { id: "sr-2", title: "Apply for full-time jobs", description: "Update resume, set up job alerts, and begin applying.", category: "career", urgent: true },
          { id: "sr-3", title: "Start capstone or thesis", description: "Get your project proposal approved and begin work.", category: "academics" },
        ]},
        { month: "October–November", actions: [
          { id: "sr-4", title: "Attend final career fairs", description: "Network aggressively — many companies fill roles in the fall.", category: "career", urgent: true },
          { id: "sr-5", title: "Complete grad school applications", description: "Submit all applications well before deadlines.", category: "applications", urgent: true },
          { id: "sr-6", title: "Practice interviews", description: "Mock interviews for jobs and/or grad school admissions.", category: "career" },
        ]},
        { month: "December", actions: [
          { id: "sr-7", title: "Follow up on all applications", description: "Check status, respond to interview requests promptly.", category: "career" },
          { id: "sr-8", title: "Complete fall coursework", description: "Finish strong — don't let senioritis derail your GPA.", category: "academics" },
        ]},
      ],
    },
    {
      year: "Senior Year — Spring", label: "Transition & Launch", phase: "Career Launch",
      description: "Finalize your next step and prepare for post-graduation life.",
      months: [
        { month: "January–February", actions: [
          { id: "sr-9", title: "Continue job search if needed", description: "Expand your search, attend spring career events.", category: "career" },
          { id: "sr-10", title: "Evaluate grad school acceptances", description: "Compare programs on funding, location, and research fit.", category: "applications" },
        ]},
        { month: "March–April", actions: [
          { id: "sr-11", title: "Accept an offer (job or grad school)", description: "Make your decision and confirm by the deadline.", category: "career", urgent: true },
          { id: "sr-12", title: "Complete capstone/thesis", description: "Finish and present your final project.", category: "academics", urgent: true },
        ]},
        { month: "May", actions: [
          { id: "sr-13", title: "Graduate!", description: "Complete final exams and celebrate your achievement.", category: "academics" },
          { id: "sr-14", title: "Prepare for transition", description: "Plan relocation, start date prep, or grad school onboarding.", category: "career" },
        ]},
      ],
    },
  ];
}

// ─── Gap Year ─────────────────────────────────────────────
function genGapYear(field: string): YearPlan[] {
  return [
    {
      year: "Gap Year", label: "Explore & Grow", phase: "Preparation",
      description: "Use this time intentionally — explore, work, and build skills before your next step.",
      months: [
        { month: "Month 1–2", actions: [
          { id: "gy-1", title: "Define your gap year goals", description: "What do you want to gain? Skills, experience, clarity, savings?", category: "career", urgent: true },
          { id: "gy-2", title: "Research structured gap year programs", description: "AmeriCorps, City Year, WWOOF, or travel programs with purpose.", category: "applications" },
          { id: "gy-3", title: "Set a budget and savings plan", description: "Track expenses and set aside funds for your next step.", category: "financial" },
        ]},
        { month: "Month 3–4", actions: [
          { id: "gy-4", title: "Begin your gap year activity", description: "Start work, travel, volunteering, or your chosen program.", category: "career" },
          { id: "gy-5", title: "Take an online course or certification", description: `Study ${field} through free platforms — Coursera, edX, Khan Academy.`, category: "skills" },
        ]},
        { month: "Month 5–6", actions: [
          { id: "gy-6", title: "Build a portfolio or journal", description: "Document what you're learning — this becomes application material.", category: "skills" },
          { id: "gy-7", title: "Begin college/job applications if applicable", description: "If applying to school, start essays and research programs.", category: "applications" },
        ]},
        { month: "Month 7–9", actions: [
          { id: "gy-8", title: "Submit applications", description: "Complete college, job, or program applications.", category: "applications", urgent: true },
          { id: "gy-9", title: "Submit FAFSA if applying to college", description: "Don't miss financial aid deadlines.", category: "financial", urgent: true },
        ]},
        { month: "Month 10–12", actions: [
          { id: "gy-10", title: "Reflect and finalize plans", description: "Evaluate offers and commit to your next step.", category: "career" },
          { id: "gy-11", title: "Prepare for transition", description: "Plan logistics for college, job start, or next program.", category: "career" },
        ]},
      ],
    },
  ];
}

// ─── Master's Applicant ───────────────────────────────────
function genMasters(field: string): YearPlan[] {
  return [
    {
      year: "Application Year", label: "Exam Prep & Applications", phase: "Application",
      description: "Prepare entrance exams, secure recommendations, and submit strong applications.",
      months: [
        { month: "Month 1–2 (6–8 months before deadline)", actions: [
          { id: "ma-1", title: "Research 8–12 graduate programs", description: `Compare programs in ${field} by ranking, funding, faculty, and fit.`, category: "applications", urgent: true },
          { id: "ma-2", title: "Begin GRE/GMAT/LSAT prep", description: "Take a diagnostic test and create a 2–3 month study plan.", category: "testing", urgent: true },
          { id: "ma-3", title: "Identify 3 recommenders", description: "Professors or supervisors who can speak to your academic potential.", category: "applications" },
        ]},
        { month: "Month 3 (4–5 months before deadline)", actions: [
          { id: "ma-4", title: "Take entrance exam", description: "Complete GRE/GMAT/LSAT. Evaluate score and consider retake.", category: "testing", urgent: true },
          { id: "ma-5", title: "Request recommendation letters", description: "Give recommenders at least 6 weeks and provide talking points.", category: "applications", urgent: true },
        ]},
        { month: "Month 4 (3–4 months before deadline)", actions: [
          { id: "ma-6", title: "Draft Statement of Purpose", description: "Write a compelling SOP tailored to each program's strengths.", category: "applications", urgent: true },
          { id: "ma-7", title: "Update CV/resume for academic applications", description: "Include publications, research, presentations, and relevant experience.", category: "applications" },
        ]},
        { month: "Month 5 (1–2 months before deadline)", actions: [
          { id: "ma-8", title: "Finalize and submit applications", description: "Proofread everything. Submit before deadlines to avoid issues.", category: "applications", urgent: true },
          { id: "ma-9", title: "Submit FAFSA and fellowship applications", description: "Apply for NSF, Fulbright, or university-specific fellowships.", category: "financial", urgent: true },
        ]},
        { month: "Month 6–8 (post-submission)", actions: [
          { id: "ma-10", title: "Prepare for interviews", description: "Some programs conduct admissions interviews — practice responses.", category: "career" },
          { id: "ma-11", title: "Evaluate acceptances and funding offers", description: "Compare stipends, tuition waivers, and cost of living.", category: "financial" },
          { id: "ma-12", title: "Accept offer and plan transition", description: "Commit to your program and handle logistics.", category: "applications", urgent: true },
        ]},
      ],
    },
  ];
}

// ─── Early Professional ───────────────────────────────────
function genEarlyPro(field: string): YearPlan[] {
  return [
    {
      year: "Year 1–2", label: "Growth & Positioning", phase: "Career Launch",
      description: "Build expertise, grow your network, and position for advancement.",
      months: [
        { month: "Month 1–2", actions: [
          { id: "ep-1", title: "Set 1-year career goals", description: "Define what success looks like: promotion, skills, salary, or role change.", category: "career", urgent: true },
          { id: "ep-2", title: "Find a mentor in your organization", description: "Identify someone 5–10 years ahead who can guide your growth.", category: "career" },
        ]},
        { month: "Month 3–4", actions: [
          { id: "ep-3", title: "Pursue a professional certification", description: `Get certified in a high-value skill for ${field}.`, category: "skills" },
          { id: "ep-4", title: "Expand your professional network", description: "Attend industry meetups, conferences, or LinkedIn networking.", category: "career" },
        ]},
        { month: "Month 5–6", actions: [
          { id: "ep-5", title: "Request a performance review", description: "Get feedback and document your contributions for promotion.", category: "career" },
          { id: "ep-6", title: "Start a side project or blog", description: `Build thought leadership in ${field} with public work.`, category: "skills" },
        ]},
        { month: "Month 7–9", actions: [
          { id: "ep-7", title: "Evaluate your trajectory", description: "Are you growing? Consider whether to stay, pivot, or pursue further education.", category: "career" },
          { id: "ep-8", title: "Build financial stability", description: "Emergency fund, retirement contributions, student loan strategy.", category: "financial" },
        ]},
        { month: "Month 10–12", actions: [
          { id: "ep-9", title: "Negotiate raise or promotion", description: "Use your documented achievements to advocate for advancement.", category: "career", urgent: true },
          { id: "ep-10", title: "Plan Year 2 goals", description: "Set new targets: management track, specialization, or career change.", category: "career" },
        ]},
      ],
    },
  ];
}
