import { RoadmapData, UserProfile } from "./types";

export function generatePlaceholderRoadmap(profile: UserProfile): RoadmapData {
  const interestMap: Record<string, { majors: string[]; careers: { title: string; salary: string; growth: string }[] }> = {
    "Science & Technology": {
      majors: ["Computer Science", "Data Science", "Biomedical Engineering"],
      careers: [
        { title: "Software Engineer", salary: "$120K–$180K", growth: "25%" },
        { title: "Data Scientist", salary: "$110K–$160K", growth: "36%" },
        { title: "AI/ML Engineer", salary: "$130K–$200K", growth: "40%" },
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
    "Arts & Humanities": {
      majors: ["Communications", "Psychology", "English Literature"],
      careers: [
        { title: "UX Designer", salary: "$80K–$130K", growth: "16%" },
        { title: "Content Strategist", salary: "$70K–$110K", growth: "12%" },
        { title: "Clinical Psychologist", salary: "$85K–$130K", growth: "14%" },
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
  };

  const primary = profile.interests[0] || "Science & Technology";
  const data = interestMap[primary] || interestMap["Science & Technology"];

  const timelineByLevel: Record<string, { year: string; title: string; description: string }[]> = {
    "High School": [
      { year: "Year 1", title: "Explore & Foundation", description: "Take AP/honors courses in your interest areas. Join relevant clubs and explore extracurriculars." },
      { year: "Year 2", title: "Build & Prepare", description: "Start SAT/ACT prep, attend college info sessions, and seek mentorship or job shadowing." },
      { year: "Year 3", title: "Apply & Transition", description: "Apply to colleges, finalize your personal statement, and secure scholarships." },
      { year: "Year 4", title: "Launch Undergrad", description: "Begin your freshman year with a clear major path and join relevant organizations." },
    ],
    "Running Start": [
      { year: "Year 1", title: "Dual Enrollment", description: "Complete general requirements while earning college credits alongside high school diploma." },
      { year: "Year 2", title: "Transfer Prep", description: "Focus on major prerequisites and build your transfer application portfolio." },
      { year: "Year 3", title: "University Entry", description: "Transfer to a 4-year university as a junior with significant credits completed." },
      { year: "Year 4", title: "Graduation & Career", description: "Complete your bachelor's degree and begin career or graduate school applications." },
    ],
    "Undergraduate": [
      { year: "Year 1", title: "Specialize", description: "Declare your major, take advanced coursework, and secure internships." },
      { year: "Year 2", title: "Experience", description: "Complete internships, research projects, or co-ops in your field." },
      { year: "Year 3", title: "Career Launch", description: "Apply for jobs or graduate programs. Build your professional network." },
    ],
    "Master's Degree": [
      { year: "Year 1", title: "Advanced Study", description: "Complete core graduate coursework and begin thesis or capstone research." },
      { year: "Year 2", title: "Thesis & Career", description: "Finish your thesis, attend conferences, and secure your first senior role." },
    ],
  };

  return {
    recommendedMajors: data.majors,
    possibleCareers: data.careers,
    timeline: timelineByLevel[profile.educationLevel] || timelineByLevel["Undergraduate"],
    extracurriculars: [
      "Industry-specific internships",
      "Student organizations & leadership roles",
      "Research assistant positions",
      "Hackathons or case competitions",
      "Volunteer work in related fields",
    ],
    alternativePaths: [
      { title: "Bootcamp Fast-Track", description: "Skip or supplement traditional education with an intensive coding or professional bootcamp for faster career entry." },
      { title: "Gap Year Experience", description: "Take a structured gap year with internships, travel, or volunteer work to gain clarity and real-world experience." },
    ],
    summary: `Based on your interest in ${primary} and ${profile.educationLevel} level, we recommend focusing on ${data.majors[0]} as your primary pathway. This aligns with your goals of ${profile.longTermGoals.join(", ").toLowerCase()}.`,
  };
}

export function generateChatResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("running start")) {
    return "Running Start is an excellent option! It lets you earn college credits while still in high school, saving both time and money. You'll take classes at a community college (tuition-free in many states) and can transfer those credits to a 4-year university. It's especially great if you're motivated, want to get ahead, or are considering a specific career path early. The key trade-off is less time for traditional high school activities.";
  }
  if (q.includes("major") || q.includes("psychology") || q.includes("business")) {
    return "If you're interested in both psychology and business, consider majors like Industrial-Organizational Psychology, Behavioral Economics, or Marketing with a Psychology minor. These combine human behavior insights with business applications. Career options include UX Research, HR Management, Consumer Insights, or Management Consulting. Many top companies value this interdisciplinary skillset!";
  }
  if (q.includes("medical") || q.includes("med school")) {
    return "Preparing for medical school is a multi-year journey. Start with strong pre-med prerequisites (Biology, Chemistry, Organic Chemistry, Physics, Biochemistry). Maintain a high GPA (3.5+), get clinical experience through volunteering or shadowing, conduct research, and prepare for the MCAT. Consider joining pre-med clubs and seek mentorship from current medical students or physicians.";
  }
  return "That's a great question! Based on current education trends, I'd recommend exploring multiple pathways and talking to professionals in your field of interest. Consider factors like program accreditation, career placement rates, scholarship opportunities, and long-term earning potential. Would you like me to dive deeper into any specific aspect?";
}
