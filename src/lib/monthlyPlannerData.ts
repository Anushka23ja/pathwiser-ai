export interface MonthAction {
  id: string;
  title: string;
  description: string;
  category: "academics" | "testing" | "applications" | "financial" | "career" | "skills";
  completed?: boolean;
}

export interface MonthPlan {
  month: string;
  actions: MonthAction[];
}

export interface YearPlan {
  year: string;
  label: string;
  description: string;
  months: MonthPlan[];
}

const categoryLabels: Record<string, string> = {
  academics: "📚 Academics",
  testing: "📝 Testing",
  applications: "📨 Applications",
  financial: "💰 Financial Aid",
  career: "💼 Career Prep",
  skills: "🛠 Skills",
};

export { categoryLabels };

export function generateMonthlyPlan(educationLevel: string, interests: string[]): YearPlan[] {
  const field = interests[0] || "Software & Tech";

  if (educationLevel === "High School") {
    return [
      {
        year: "Junior Year", label: "Foundation Building", description: "Build your academic profile and start exploring options.",
        months: [
          { month: "August", actions: [
            { id: "j-aug-1", title: "Begin SAT/ACT prep course", description: "Enroll in a prep course or start self-study with official practice tests.", category: "testing" },
            { id: "j-aug-2", title: "Join 2 extracurricular clubs", description: "Choose activities aligned with your career interests.", category: "career" },
          ]},
          { month: "September", actions: [
            { id: "j-sep-1", title: "Research 10 target colleges", description: "Create a spreadsheet comparing programs, tuition, and deadlines.", category: "applications" },
            { id: "j-sep-2", title: "Start a personal project", description: `Begin a project related to ${field} to build your portfolio.`, category: "skills" },
          ]},
          { month: "October", actions: [
            { id: "j-oct-1", title: "Take the PSAT/NMSQT", description: "Qualify for National Merit Scholarships and benchmark your score.", category: "testing" },
            { id: "j-oct-2", title: "Attend college fair", description: "Meet admissions reps and collect materials from target schools.", category: "applications" },
          ]},
          { month: "November", actions: [
            { id: "j-nov-1", title: "Request teacher recommendations", description: "Ask 2 teachers who know you well for recommendation letters.", category: "applications" },
            { id: "j-nov-2", title: "Begin scholarship research", description: "Create a list of 15+ scholarships with deadlines and requirements.", category: "financial" },
          ]},
          { month: "December", actions: [
            { id: "j-dec-1", title: "Take first SAT/ACT attempt", description: "Take your first official test to establish a baseline score.", category: "testing" },
            { id: "j-dec-2", title: "Finalize spring course selections", description: "Choose rigorous courses that align with your intended major.", category: "academics" },
          ]},
          { month: "January", actions: [
            { id: "j-jan-1", title: "Submit FAFSA (opens Oct 1)", description: "Complete FAFSA as early as possible for maximum aid.", category: "financial" },
            { id: "j-jan-2", title: "Apply to summer programs", description: "Research and apply to summer internships, camps, or pre-college programs.", category: "career" },
          ]},
          { month: "February", actions: [
            { id: "j-feb-1", title: "Schedule campus visits", description: "Plan visits to your top 3-5 schools during spring break.", category: "applications" },
            { id: "j-feb-2", title: "Apply for summer internships", description: "Submit applications to internship programs in your field of interest.", category: "career" },
          ]},
          { month: "March", actions: [
            { id: "j-mar-1", title: "Visit campuses during spring break", description: "Tour campuses, sit in on classes, and talk to current students.", category: "applications" },
            { id: "j-mar-2", title: "Take SAT/ACT again if needed", description: "Retake to improve your score if below target range.", category: "testing" },
          ]},
          { month: "April", actions: [
            { id: "j-apr-1", title: "Start drafting college essays", description: "Begin brainstorming and writing personal statement drafts.", category: "applications" },
            { id: "j-apr-2", title: "Apply to local scholarships", description: "Submit applications to community and school-specific scholarships.", category: "financial" },
          ]},
          { month: "May", actions: [
            { id: "j-may-1", title: "Take AP exams", description: "Prepare for and complete any AP exams to earn college credit.", category: "testing" },
            { id: "j-may-2", title: "Build your LinkedIn profile", description: "Create a professional profile highlighting your activities and goals.", category: "career" },
          ]},
        ],
      },
      {
        year: "Senior Year", label: "Applications & Launch", description: "Apply to schools, secure funding, and prepare for your next chapter.",
        months: [
          { month: "August", actions: [
            { id: "s-aug-1", title: "Finalize college application list", description: "Confirm your list of reach, match, and safety schools.", category: "applications" },
            { id: "s-aug-2", title: "Polish personal essays", description: "Revise essays with feedback from teachers and counselors.", category: "applications" },
          ]},
          { month: "September", actions: [
            { id: "s-sep-1", title: "Begin Early Decision/Action apps", description: "Start filling out applications for early admission deadlines.", category: "applications" },
            { id: "s-sep-2", title: "Continue scholarship applications", description: "Submit to at least 5 scholarships this month.", category: "financial" },
          ]},
          { month: "October", actions: [
            { id: "s-oct-1", title: "Submit FAFSA and CSS Profile", description: "Complete all financial aid applications as soon as they open.", category: "financial" },
            { id: "s-oct-2", title: "Send final SAT/ACT scores", description: "Submit your best scores to all target schools.", category: "testing" },
          ]},
          { month: "November", actions: [
            { id: "s-nov-1", title: "Submit Early Decision applications", description: "Complete and submit all early applications by Nov 1-15.", category: "applications" },
            { id: "s-nov-2", title: "Complete supplemental essays", description: "Write school-specific essays for remaining applications.", category: "applications" },
          ]},
          { month: "December", actions: [
            { id: "s-dec-1", title: "Submit Regular Decision apps", description: "Complete all remaining college applications by Jan 1.", category: "applications" },
            { id: "s-dec-2", title: "Apply to more scholarships", description: "Continue applying to scholarships with spring deadlines.", category: "financial" },
          ]},
          { month: "January–March", actions: [
            { id: "s-jan-1", title: "Complete remaining applications", description: "Submit any final applications and verify all materials received.", category: "applications" },
            { id: "s-jan-2", title: "Prepare for transition", description: "Research housing, meal plans, and student organizations at top schools.", category: "career" },
          ]},
          { month: "April", actions: [
            { id: "s-apr-1", title: "Compare financial aid packages", description: "Evaluate offers and negotiate if needed. Consider total cost.", category: "financial" },
            { id: "s-apr-2", title: "Make your decision by May 1", description: "Commit to your chosen school and submit enrollment deposit.", category: "applications" },
          ]},
          { month: "May–June", actions: [
            { id: "s-may-1", title: "Take final AP exams", description: "Complete AP exams for potential college credit.", category: "testing" },
            { id: "s-may-2", title: "Prepare for college orientation", description: "Complete housing forms, register for orientation, connect with roommates.", category: "career" },
          ]},
        ],
      },
    ];
  }

  if (educationLevel === "College") {
    return [
      {
        year: "This Academic Year", label: "Build & Explore", description: "Strengthen your major, gain experience, and build your network.",
        months: [
          { month: "August", actions: [
            { id: "c-aug-1", title: "Meet with academic advisor", description: "Plan courses aligned with your degree and career goals.", category: "academics" },
            { id: "c-aug-2", title: "Join professional student orgs", description: "Attend club fairs and join 2-3 relevant organizations.", category: "career" },
          ]},
          { month: "September", actions: [
            { id: "c-sep-1", title: "Apply for summer internships", description: "Top companies open applications 9 months early. Start now.", category: "career" },
            { id: "c-sep-2", title: "Start a portfolio project", description: `Build something substantial in ${field} for your resume.`, category: "skills" },
          ]},
          { month: "October", actions: [
            { id: "c-oct-1", title: "Attend career fair", description: "Bring resumes and practice your elevator pitch beforehand.", category: "career" },
            { id: "c-oct-2", title: "Complete mid-semester check", description: "Review grades and adjust study habits if needed.", category: "academics" },
          ]},
          { month: "November", actions: [
            { id: "c-nov-1", title: "Apply for research positions", description: "Reach out to professors about spring research opportunities.", category: "academics" },
            { id: "c-nov-2", title: "Renew FAFSA for next year", description: "Submit FAFSA early for maximum financial aid consideration.", category: "financial" },
          ]},
          { month: "December", actions: [
            { id: "c-dec-1", title: "Prepare for finals", description: "Create study schedules and attend office hours.", category: "academics" },
            { id: "c-dec-2", title: "Follow up on internship apps", description: "Check status of applications and prepare for interviews.", category: "career" },
          ]},
          { month: "January", actions: [
            { id: "c-jan-1", title: "Register for spring courses", description: "Select courses that advance your degree and develop new skills.", category: "academics" },
            { id: "c-jan-2", title: "Practice technical interviews", description: "Use LeetCode, mock interviews, or campus prep sessions.", category: "career" },
          ]},
          { month: "February", actions: [
            { id: "c-feb-1", title: "Apply for summer opportunities", description: "Submit remaining internship and fellowship applications.", category: "career" },
            { id: "c-feb-2", title: "Seek mentorship", description: "Find a professor or industry mentor to guide your path.", category: "career" },
          ]},
          { month: "March", actions: [
            { id: "c-mar-1", title: "Build portfolio website", description: "Create an online portfolio showcasing your best projects.", category: "skills" },
            { id: "c-mar-2", title: "Prepare for spring career events", description: "Update resume and LinkedIn for spring networking.", category: "career" },
          ]},
          { month: "April", actions: [
            { id: "c-apr-1", title: "Finalize summer plans", description: "Accept internship offer or plan alternative experience.", category: "career" },
            { id: "c-apr-2", title: "Apply for scholarships", description: "Submit applications for next year's funding.", category: "financial" },
          ]},
          { month: "May", actions: [
            { id: "c-may-1", title: "Complete final exams", description: "Finish strong and secure your GPA for applications.", category: "academics" },
            { id: "c-may-2", title: "Begin summer experience", description: "Start internship, research, or project work.", category: "career" },
          ]},
        ],
      },
    ];
  }

  // Professional
  return [
    {
      year: "Transition Year", label: "Assess, Build & Launch", description: "Evaluate your position, build new skills, and transition to your target field.",
      months: [
        { month: "Month 1", actions: [
          { id: "pro-1-1", title: "Skills gap assessment", description: "Compare your current skills with job requirements in your target field.", category: "career" },
          { id: "pro-1-2", title: "Research programs and certifications", description: "Identify the best courses, bootcamps, or degrees for your transition.", category: "academics" },
        ]},
        { month: "Month 2", actions: [
          { id: "pro-2-1", title: "Enroll in a course or program", description: "Start learning the core skills needed for your new career.", category: "skills" },
          { id: "pro-2-2", title: "Update LinkedIn and resume", description: "Reframe your experience to highlight transferable skills.", category: "career" },
        ]},
        { month: "Month 3–4", actions: [
          { id: "pro-3-1", title: "Build your first project", description: `Create a substantial portfolio project in ${field}.`, category: "skills" },
          { id: "pro-3-2", title: "Start networking in target field", description: "Attend meetups, join online communities, reach out to professionals.", category: "career" },
        ]},
        { month: "Month 5–6", actions: [
          { id: "pro-5-1", title: "Complete certification or program", description: "Finish your course and earn credentials.", category: "skills" },
          { id: "pro-5-2", title: "Begin job applications", description: "Apply to entry-level or transition-friendly roles.", category: "career" },
        ]},
        { month: "Month 7–9", actions: [
          { id: "pro-7-1", title: "Interview preparation", description: "Practice technical and behavioral interviews. Build case studies.", category: "career" },
          { id: "pro-7-2", title: "Freelance or volunteer", description: "Gain real experience through freelance projects or pro-bono work.", category: "skills" },
        ]},
        { month: "Month 10–12", actions: [
          { id: "pro-10-1", title: "Land your first role", description: "Accept an offer in your new field and begin onboarding.", category: "career" },
          { id: "pro-10-2", title: "Plan first-year growth", description: "Set goals for your first year — certifications, promotions, skills.", category: "career" },
        ]},
      ],
    },
  ];
}
