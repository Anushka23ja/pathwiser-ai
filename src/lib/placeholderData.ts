import { RoadmapData, UserProfile } from "./types";

const careerFieldMap: Record<string, { majors: string[]; careers: { title: string; salary: string; growth: string }[] }> = {
  "Software & Tech": {
    majors: ["Computer Science", "Software Engineering", "Data Science"],
    careers: [
      { title: "Software Engineer", salary: "$120K–$180K", growth: "25%" },
      { title: "Data Scientist", salary: "$110K–$160K", growth: "36%" },
      { title: "AI/ML Engineer", salary: "$130K–$200K", growth: "40%" },
    ],
  },
  "Healthcare & Medicine": {
    majors: ["Biology (Pre-Med)", "Nursing", "Public Health"],
    careers: [
      { title: "Physician", salary: "$200K–$350K", growth: "3%" },
      { title: "Nurse Practitioner", salary: "$110K–$150K", growth: "46%" },
      { title: "Public Health Director", salary: "$90K–$140K", growth: "17%" },
    ],
  },
  "Business & Finance": {
    majors: ["Finance", "Business Administration", "Economics"],
    careers: [
      { title: "Financial Analyst", salary: "$85K–$130K", growth: "9%" },
      { title: "Management Consultant", salary: "$100K–$170K", growth: "14%" },
      { title: "Product Manager", salary: "$110K–$160K", growth: "20%" },
    ],
  },
  "Engineering": {
    majors: ["Mechanical Engineering", "Electrical Engineering", "Civil Engineering"],
    careers: [
      { title: "Mechanical Engineer", salary: "$90K–$140K", growth: "7%" },
      { title: "Electrical Engineer", salary: "$95K–$145K", growth: "9%" },
      { title: "Civil Engineer", salary: "$85K–$130K", growth: "8%" },
    ],
  },
  "Education & Teaching": {
    majors: ["Education", "Curriculum & Instruction", "Special Education"],
    careers: [
      { title: "Teacher", salary: "$50K–$80K", growth: "5%" },
      { title: "School Counselor", salary: "$60K–$90K", growth: "10%" },
      { title: "Education Administrator", salary: "$80K–$120K", growth: "8%" },
    ],
  },
  "Creative & Design": {
    majors: ["Graphic Design", "Fine Arts", "UX/UI Design"],
    careers: [
      { title: "UX Designer", salary: "$80K–$130K", growth: "16%" },
      { title: "Art Director", salary: "$90K–$150K", growth: "11%" },
      { title: "Animator", salary: "$60K–$100K", growth: "12%" },
    ],
  },
  "Law & Policy": {
    majors: ["Political Science", "Pre-Law", "Public Policy"],
    careers: [
      { title: "Lawyer", salary: "$100K–$200K", growth: "10%" },
      { title: "Policy Analyst", salary: "$70K–$110K", growth: "6%" },
      { title: "Paralegal", salary: "$50K–$75K", growth: "12%" },
    ],
  },
  "Science & Research": {
    majors: ["Biology", "Chemistry", "Physics"],
    careers: [
      { title: "Research Scientist", salary: "$80K–$130K", growth: "8%" },
      { title: "Lab Director", salary: "$100K–$160K", growth: "5%" },
      { title: "Biostatistician", salary: "$90K–$140K", growth: "30%" },
    ],
  },
  "Trades & Skilled Labor": {
    majors: ["Trade Certification", "Apprenticeship Program", "Technical Training"],
    careers: [
      { title: "Electrician", salary: "$55K–$100K", growth: "9%" },
      { title: "Plumber", salary: "$50K–$90K", growth: "5%" },
      { title: "HVAC Technician", salary: "$50K–$85K", growth: "13%" },
    ],
  },
  "Marketing & Communications": {
    majors: ["Marketing", "Communications", "Public Relations"],
    careers: [
      { title: "Marketing Manager", salary: "$80K–$140K", growth: "10%" },
      { title: "Content Strategist", salary: "$70K–$110K", growth: "12%" },
      { title: "Social Media Director", salary: "$65K–$100K", growth: "15%" },
    ],
  },
  "Social Work & Counseling": {
    majors: ["Social Work", "Psychology", "Counseling"],
    careers: [
      { title: "Social Worker", salary: "$50K–$80K", growth: "12%" },
      { title: "Counselor", salary: "$55K–$85K", growth: "22%" },
      { title: "Clinical Psychologist", salary: "$85K–$130K", growth: "14%" },
    ],
  },
  "Entrepreneurship": {
    majors: ["Business Administration", "Entrepreneurship", "Innovation & Design"],
    careers: [
      { title: "Startup Founder", salary: "Varies", growth: "N/A" },
      { title: "Business Development", salary: "$80K–$140K", growth: "15%" },
      { title: "Venture Capital Analyst", salary: "$90K–$150K", growth: "12%" },
    ],
  },
};

// Detail-specific tips that get injected into the roadmap
const detailTips: Record<string, { activities: string[]; altPath?: { title: string; description: string } }> = {
  "Running Start / Dual Enrollment": {
    activities: [
      "Enroll in Running Start or dual enrollment to earn free college credits",
      "Meet with your high school counselor to map Running Start courses to degree requirements",
      "Connect with Running Start advisors at your local community college",
    ],
    altPath: { title: "Running Start Fast-Track", description: "Complete your Associate's degree while finishing high school — enter university as a junior and save 2 years of tuition." },
  },
  "First-Generation College Student": {
    activities: [
      "Apply to first-gen support programs (TRIO, Upward Bound, QuestBridge)",
      "Seek first-gen scholarships — many colleges offer dedicated funding",
      "Connect with first-gen mentors and student organizations on campus",
    ],
    altPath: { title: "First-Gen Support Networks", description: "Leverage programs specifically designed for first-generation students — from application help to on-campus mentorship and financial aid." },
  },
  "AP / IB Courses": {
    activities: [
      "Take AP/IB exams to earn college credit and strengthen your application",
      "Focus on AP/IB subjects aligned with your intended major",
      "Use AP/IB scores to place out of introductory college courses",
    ],
  },
  "College Prep & Applications": {
    activities: [
      "Start SAT/ACT prep early — aim for your target school's score range",
      "Draft and revise college essays with teachers or counselors",
      "Research and apply for scholarships well before deadlines",
    ],
  },
  "Trade / Vocational Path": {
    activities: [
      "Research apprenticeship programs in your area of interest",
      "Visit trade schools and attend open houses",
      "Look into union-sponsored training programs with paid apprenticeships",
    ],
    altPath: { title: "Skilled Trades Fast-Track", description: "Enter a paid apprenticeship or trade program — earn while you learn, with no student debt and high demand in the job market." },
  },
  "Financial Aid & Scholarships": {
    activities: [
      "File FAFSA as early as possible each year",
      "Research state-specific grants and institutional scholarships",
      "Apply to at least 10 scholarships — cast a wide net",
    ],
  },
  "Thinking of Switching Majors": {
    activities: [
      "Talk to your academic advisor about switching without losing credits",
      "Take exploratory courses in your new area of interest",
      "Connect with students in the major you're considering",
    ],
  },
  "Transfer Student": {
    activities: [
      "Research transfer agreements between your current and target schools",
      "Maintain a strong GPA — transfer admission is competitive",
      "Visit target campuses and meet with transfer admission counselors",
    ],
  },
  "Graduate School Prep": {
    activities: [
      "Start GRE/GMAT/MCAT/LSAT prep based on your target program",
      "Build relationships with professors for strong recommendation letters",
      "Gain research or professional experience relevant to your grad program",
    ],
  },
  "Internship & Co-op Search": {
    activities: [
      "Apply to internships 6 months before the start date",
      "Build your LinkedIn profile and portfolio",
      "Attend career fairs and networking events on campus",
    ],
  },
  "Career Switch": {
    activities: [
      "Identify transferable skills from your current role",
      "Take online courses or earn certificates in your target field",
      "Network with professionals who've made similar transitions",
    ],
    altPath: { title: "Career Pivot Program", description: "Use your existing experience as a foundation — many career switchers leverage transferable skills to enter new fields faster than fresh graduates." },
  },
  "Certifications & Upskilling": {
    activities: [
      "Research the most valued certifications in your target field",
      "Set a 3–6 month timeline to complete your first certification",
      "Look for employer-sponsored certification programs",
    ],
  },
  "Bootcamp or Accelerated Program": {
    activities: [
      "Compare bootcamps by job placement rate, not just price",
      "Look for income share agreement (ISA) options to reduce upfront cost",
      "Build portfolio projects during the program for job applications",
    ],
    altPath: { title: "Intensive Bootcamp", description: "Complete a 12–24 week intensive program — many offer career coaching and job placement guarantees to help you land a role fast." },
  },
  "Leadership & Management": {
    activities: [
      "Seek stretch assignments and cross-functional projects at work",
      "Consider an MBA or leadership certificate program",
      "Find a mentor in a leadership role you aspire to",
    ],
  },
};

export function generatePlaceholderRoadmap(profile: UserProfile): RoadmapData {
  const primaryField = profile.interests[0] || profile.careerInterests[0] || "Software & Tech";
  const fieldData = careerFieldMap[primaryField] || careerFieldMap["Software & Tech"];

  const allMajors = new Set<string>();
  const allCareers: { title: string; salary: string; growth: string }[] = [];

  for (const field of profile.interests.length > 0 ? profile.interests : profile.careerInterests) {
    const data = careerFieldMap[field];
    if (data) {
      data.majors.forEach((m) => allMajors.add(m));
      allCareers.push(...data.careers);
    }
  }

  if (allMajors.size === 0) fieldData.majors.forEach((m) => allMajors.add(m));
  if (allCareers.length === 0) allCareers.push(...fieldData.careers);

  const timelineByLevel: Record<string, { year: string; title: string; description: string }[]> = {
    "High School": [
      { year: "Now", title: "Explore & Discover", description: "Take challenging courses in your interest areas. Join clubs, volunteer, and explore what excites you." },
      { year: "Next Year", title: "Build Your Profile", description: "Start SAT/ACT prep, attend college info sessions. Seek job shadowing or internships in your fields of interest." },
      { year: "Application Year", title: "Apply & Decide", description: "Apply to colleges that match your career goals. Write compelling essays and secure scholarships." },
      { year: "After Graduation", title: "Launch Your Path", description: "Begin college or alternative path with a clear direction and relevant extracurriculars." },
    ],
    "College": [
      { year: "This Semester", title: "Declare & Focus", description: "Confirm your major based on your career interests. Meet with academic advisors and map your remaining courses." },
      { year: "Next Semester", title: "Gain Experience", description: "Apply for internships, research positions, or co-ops. Build skills through real-world projects." },
      { year: "Final Year", title: "Prepare to Launch", description: "Network actively, attend career fairs, and begin job applications or grad school prep." },
      { year: "Post-Graduation", title: "Career Entry", description: "Start your career, consider certifications, or apply to graduate programs for advancement." },
    ],
    "Professional": [
      { year: "Month 1–3", title: "Assess & Plan", description: "Evaluate your current skills vs. your target career. Identify gaps and research programs, certifications, or degrees." },
      { year: "Month 3–6", title: "Skill Up", description: "Enroll in courses, bootcamps, or certifications. Start building a portfolio or gaining relevant experience." },
      { year: "Month 6–12", title: "Transition", description: "Apply for roles in your target field, leverage your network, and update your professional brand." },
      { year: "Year 2+", title: "Grow & Advance", description: "Establish yourself in your new path. Seek promotions, mentorship, and continued learning opportunities." },
    ],
  };

  const baseExtracurriculars: Record<string, string[]> = {
    "High School": [
      "Join relevant clubs and student organizations",
      "Volunteer in your community",
      "Take AP or dual-enrollment courses",
      "Attend college campus tours",
      "Start a personal project or blog",
    ],
    "College": [
      "Secure internships every summer",
      "Join professional student organizations",
      "Attend career fairs and networking events",
      "Work on capstone or research projects",
      "Build an online portfolio or LinkedIn presence",
    ],
    "Professional": [
      "Get industry certifications",
      "Attend conferences and workshops",
      "Find a mentor in your target field",
      "Freelance or volunteer for experience",
      "Join professional associations",
    ],
  };

  // Build enriched activities from level details
  const levelDetails = profile.favoriteSubjects || [];
  const extraActivities: string[] = [];
  const extraAltPaths: { title: string; description: string }[] = [];

  for (const detail of levelDetails) {
    const tips = detailTips[detail];
    if (tips) {
      extraActivities.push(...tips.activities);
      if (tips.altPath) extraAltPaths.push(tips.altPath);
    }
  }

  const baseActivities = baseExtracurriculars[profile.educationLevel] || baseExtracurriculars["College"];
  const combinedActivities = [...extraActivities, ...baseActivities];
  // Deduplicate and limit
  const uniqueActivities = [...new Set(combinedActivities)].slice(0, 8);

  const defaultAltPaths = [
    { title: "Bootcamp or Certificate", description: "Fast-track into your field with an intensive program. Great if you want hands-on skills quickly." },
    { title: "Gap Year / Experience First", description: "Work, travel, or volunteer first to gain clarity. Many successful people took non-linear paths." },
  ];

  const allAltPaths = extraAltPaths.length > 0
    ? [...extraAltPaths.slice(0, 2), ...defaultAltPaths.slice(0, 2 - extraAltPaths.length)].slice(0, 3)
    : defaultAltPaths;

  const fieldsStr = (profile.interests.length > 0 ? profile.interests : profile.careerInterests).join(" and ");
  const detailStr = levelDetails.length > 0 ? ` With your focus on ${levelDetails.slice(0, 2).join(" and ").toLowerCase()}, we've tailored recommendations to match.` : "";

  return {
    recommendedMajors: Array.from(allMajors).slice(0, 5),
    possibleCareers: allCareers.slice(0, 5),
    timeline: timelineByLevel[profile.educationLevel] || timelineByLevel["College"],
    extracurriculars: uniqueActivities,
    alternativePaths: allAltPaths,
    summary: `As a ${profile.educationLevel.toLowerCase()} student interested in ${fieldsStr}, we've built a roadmap focused on ${fieldData.majors[0]} and related fields.${detailStr} Your path includes actionable steps, career options with salary data, and activities to help you stand out.`,
  };
}

export function generateChatResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("running start") || q.includes("dual enrollment")) {
    return "Running Start / dual enrollment lets you earn college credits while in high school — often tuition-free. It saves time and money, and gives you a head start. The trade-off is less time for traditional high school activities. It's great if you're self-motivated and want to get ahead.";
  }
  if (q.includes("switch") || q.includes("change") || q.includes("career")) {
    return "Career switching is more common than you think! Start by identifying transferable skills from your current role. Research your target field — talk to people in it, take online courses, and consider certifications or a master's degree. Many bootcamps also offer career-change programs with job placement support.";
  }
  if (q.includes("major") || q.includes("what should i study")) {
    return "Choosing a major depends on your interests, career goals, and strengths. Think about what subjects energize you, what kind of work environment you want, and what skills are in demand. Don't stress too much — many successful people work in fields different from their major. The key is building transferable skills.";
  }
  if (q.includes("medical") || q.includes("med school") || q.includes("doctor")) {
    return "Medical school requires strong pre-med prerequisites (Biology, Chemistry, Organic Chemistry, Physics, Biochemistry), a competitive GPA (3.5+), MCAT prep, clinical experience, and research. It's a long road but incredibly rewarding. Start early with volunteering and shadowing physicians.";
  }
  if (q.includes("salary") || q.includes("money") || q.includes("pay")) {
    return "Salary depends on field, location, experience, and education level. Tech and healthcare tend to pay highest. But consider total compensation (benefits, work-life balance, growth potential). Use sites like Glassdoor, Levels.fyi, and BLS.gov for accurate salary data in your target field.";
  }
  return "Great question! I'd recommend researching specific programs and talking to professionals in your field of interest. Consider factors like program accreditation, career placement rates, scholarship opportunities, and long-term growth potential. Want me to dive deeper into any specific topic?";
}
