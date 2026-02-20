export type ExploreCategory =
  | "education-programs"
  | "career-fields"
  | "exams-applications"
  | "internships"
  | "graduate-school"
  | "certifications"
  | "networking";

export type AudienceLevel = "high-school" | "college" | "professional" | "all";

export interface ExploreTopic {
  id: string;
  title: string;
  category: ExploreCategory;
  audience: AudienceLevel[];
  overview: string;
  pros: string[];
  cons: string[];
  eligibility: string[];
  timeline: string[];
  nextSteps: string[];
  tags: string[];
}

export const categoryMeta: Record<ExploreCategory, { label: string; emoji: string; description: string }> = {
  "education-programs": { label: "Education Programs", emoji: "🎓", description: "Academic pathways from dual enrollment to graduate degrees." },
  "career-fields": { label: "Career Fields", emoji: "💼", description: "Industries, roles, and emerging sectors to explore." },
  "exams-applications": { label: "Exams & Applications", emoji: "📝", description: "Standardized tests, application timelines, and strategies." },
  "internships": { label: "Internships & Experience", emoji: "🚀", description: "Hands-on opportunities to build real-world skills." },
  "graduate-school": { label: "Graduate School", emoji: "📚", description: "Master's, PhD, and professional degree pathways." },
  "certifications": { label: "Certifications & Upskilling", emoji: "🛠", description: "Industry credentials and accelerated learning programs." },
  "networking": { label: "Networking & Mentorship", emoji: "🤝", description: "Building professional relationships and finding mentors." },
};

export const exploreTopics: ExploreTopic[] = [
  // ── Education Programs ──
  {
    id: "running-start",
    title: "Running Start / Dual Enrollment",
    category: "education-programs",
    audience: ["high-school"],
    overview: "Earn free college credits while still in high school by taking classes at a local community college. Running Start (WA) and similar dual-enrollment programs let you graduate with both a high school diploma and an Associate's degree.",
    pros: ["Tuition-free college credits", "Graduate with an Associate's degree", "Enter university as a junior", "Smaller class sizes than university", "Early exposure to college-level work"],
    cons: ["Less time for traditional high school activities", "Must be self-motivated", "Limited course selection at some colleges", "May miss high school social experiences", "Transportation can be challenging"],
    eligibility: ["Must be a high school junior or senior (some states allow sophomores)", "Minimum GPA requirement varies by state (often 2.0+)", "Must pass college placement tests in some programs"],
    timeline: ["Spring of sophomore year: Research programs and attend info sessions", "February–March: Apply to the program and community college", "April: Meet with advisors to plan course schedule", "August: Begin college courses alongside high school"],
    nextSteps: ["Talk to your high school counselor about eligibility", "Visit your local community college admissions office", "Compare program requirements in your state", "Map out which college courses transfer to your target university"],
    tags: ["free credits", "associate degree", "high school", "college prep"],
  },
  {
    id: "ap-courses",
    title: "AP (Advanced Placement) Courses",
    category: "education-programs",
    audience: ["high-school"],
    overview: "College-level courses offered in high school, culminating in a standardized exam. Scoring 3+ (out of 5) can earn college credit, saving time and money. AP classes also demonstrate academic rigor to college admissions.",
    pros: ["Earn college credit if you score well", "Strengthen college applications", "Weighted GPA boost at most schools", "Wide variety of subjects available", "Nationally recognized and standardized"],
    cons: ["Heavy workload and study demands", "Exam-focused — one test determines credit", "Not all colleges accept all AP scores", "Can increase stress levels significantly", "Some subjects have low pass rates"],
    eligibility: ["Open to any high school student (varies by school)", "Some schools require teacher recommendation or prerequisite grades", "Self-study is possible for motivated students"],
    timeline: ["September: Enroll in AP classes for the school year", "October–April: Coursework, study, and practice exams", "May: Take AP exams (scored 1–5)", "July: Scores released — send to colleges"],
    nextSteps: ["Review which AP exams your target colleges accept", "Choose APs aligned with your intended major", "Use AP Classroom and past exams for practice", "Consider self-studying for additional AP exams"],
    tags: ["college credit", "exams", "high school", "academics"],
  },
  {
    id: "community-college-transfer",
    title: "Community College → University Transfer",
    category: "education-programs",
    audience: ["high-school", "college"],
    overview: "Start at a community college for 2 years, then transfer to a 4-year university to complete your bachelor's degree. This path saves significant money and provides a smoother academic transition.",
    pros: ["Save 50–70% on tuition for the first two years", "Smaller classes and more support", "Guaranteed transfer agreements with many universities", "Build a stronger GPA before transferring", "Explore interests before committing to a major"],
    cons: ["May feel disconnected from university culture initially", "Some credits may not transfer", "Limited extracurricular and research opportunities", "Social adjustment when transferring", "Fewer networking opportunities early on"],
    eligibility: ["Open enrollment at most community colleges", "Transfer requirements vary by university (typically 2.5–3.5 GPA)", "Must complete specific prerequisite courses"],
    timeline: ["Year 1–2: Complete general education and prerequisites at CC", "Fall of Year 2: Apply to transfer universities (Oct–Feb deadlines)", "Spring of Year 2: Accept offer and plan course transition", "Year 3–4: Complete bachelor's degree at university"],
    nextSteps: ["Research transfer agreements (e.g., TAG in California, DTA in Washington)", "Meet with a transfer advisor at your community college", "Track your transferable credits carefully", "Visit target universities and attend transfer events"],
    tags: ["transfer", "affordable", "community college", "bachelor's degree"],
  },
  {
    id: "trade-vocational",
    title: "Trade & Vocational Programs",
    category: "education-programs",
    audience: ["high-school", "professional"],
    overview: "Focused training programs (6 months–2 years) that prepare you for specific skilled trades like electrician, plumber, welder, HVAC, or healthcare technician. Many include paid apprenticeships.",
    pros: ["Earn while you learn through apprenticeships", "No student debt in many programs", "High demand and job security", "Shorter time to employment", "Strong earning potential ($50K–$100K+)"],
    cons: ["Physically demanding work in some trades", "Less flexibility to switch careers", "May face social stigma (unfairly)", "Geographic limitations for some trades", "Limited advancement without additional training"],
    eligibility: ["High school diploma or GED typically required", "Some programs accept students at 16+", "Physical fitness requirements for certain trades", "Background check may be required"],
    timeline: ["Month 1: Research trades and attend open houses", "Month 2–3: Apply to programs or apprenticeships", "Year 1–2: Complete training (classroom + hands-on)", "Post-graduation: Pass licensing exams and begin career"],
    nextSteps: ["Visit local trade schools and union halls", "Attend a skilled trades career fair", "Talk to professionals in trades you're considering", "Compare programs by job placement rate and cost"],
    tags: ["trades", "apprenticeship", "vocational", "earn while learning"],
  },

  // ── Career Fields ──
  {
    id: "software-engineering",
    title: "Software Engineering",
    category: "career-fields",
    audience: ["high-school", "college", "professional"],
    overview: "Design, build, and maintain software systems — from mobile apps to cloud infrastructure. One of the most in-demand and well-compensated career paths, with opportunities in virtually every industry.",
    pros: ["Median salary $120K–$200K+ at top companies", "Remote-friendly with flexible work options", "Massive job market across all industries", "Creative problem-solving every day", "Clear growth path from junior to staff/principal"],
    cons: ["Rapid technology changes require constant learning", "Can involve long hours during crunch periods", "Sedentary work with screen fatigue", "Competitive entry at top-tier companies", "Imposter syndrome is common, especially early on"],
    eligibility: ["CS degree preferred but not always required", "Strong portfolio and GitHub projects can substitute", "Bootcamp graduates increasingly hired", "Self-taught developers welcome at many companies"],
    timeline: ["Year 1–2: Learn fundamentals (data structures, algorithms, one language deeply)", "Year 2–3: Build projects, contribute to open source, internships", "Year 3–4: Target internships at mid/large companies", "Post-grad: Entry-level SWE role → mid-level in 2–3 years"],
    nextSteps: ["Pick a language (Python, JavaScript, or Java) and learn it deeply", "Complete a project-based course (freeCodeCamp, The Odin Project)", "Build 2–3 portfolio projects and push to GitHub", "Practice coding interviews on LeetCode or HackerRank"],
    tags: ["software", "coding", "tech", "developer", "programming"],
  },
  {
    id: "data-science",
    title: "Data Science & Analytics",
    category: "career-fields",
    audience: ["college", "professional"],
    overview: "Extract insights from data using statistics, programming, and machine learning. Data scientists help companies make evidence-based decisions. Roles range from analyst to ML engineer to research scientist.",
    pros: ["High demand across finance, healthcare, tech, and government", "Median salary $100K–$160K", "Intellectually stimulating and varied work", "Growing field with expanding opportunities", "Blend of technical and business skills"],
    cons: ["Requires strong math/statistics foundation", "Data cleaning is 60–80% of the work", "Tooling and frameworks change rapidly", "Can be isolating without cross-functional collaboration", "Entry-level roles are increasingly competitive"],
    eligibility: ["Degree in CS, statistics, math, or related field preferred", "Python and SQL proficiency expected", "Understanding of statistics and probability", "Portfolio of data projects demonstrates capability"],
    timeline: ["Year 1–2: Build foundation in statistics, Python, and SQL", "Year 2–3: Learn ML fundamentals (scikit-learn, pandas, visualization)", "Year 3–4: Complete data-focused internships or Kaggle competitions", "Post-grad: Analyst → Data Scientist → Senior/Lead roles"],
    nextSteps: ["Learn Python for data analysis (pandas, matplotlib, numpy)", "Take a statistics course (Khan Academy or MIT OpenCourseWare)", "Complete 2–3 projects on real datasets (Kaggle)", "Build a portfolio blog explaining your analyses"],
    tags: ["data science", "analytics", "machine learning", "statistics", "Python"],
  },
  {
    id: "ux-design",
    title: "UX/UI Design",
    category: "career-fields",
    audience: ["college", "professional"],
    overview: "Design intuitive, accessible, and delightful user experiences for digital products. UX designers research user needs, prototype solutions, and collaborate with engineers to ship products millions of people use.",
    pros: ["Creative and empathy-driven work", "Median salary $90K–$140K", "High demand across tech, healthcare, finance", "No CS degree required — portfolio matters most", "Remote-friendly with global opportunities"],
    cons: ["Subjective feedback can be frustrating", "Stakeholder pushback on design decisions", "Constantly advocating for user needs", "Tools and trends shift frequently", "Junior market is competitive"],
    eligibility: ["No specific degree required — portfolio is key", "Bootcamps and self-study paths are viable", "Understanding of human psychology is valuable", "Proficiency in Figma, Sketch, or similar tools"],
    timeline: ["Month 1–3: Learn design fundamentals and tools (Figma)", "Month 3–6: Complete a UX course or bootcamp", "Month 6–9: Build 3–4 case studies for your portfolio", "Month 9–12: Apply for junior UX roles or freelance projects"],
    nextSteps: ["Start the Google UX Design Certificate on Coursera", "Learn Figma through hands-on redesign exercises", "Read 'Don't Make Me Think' and 'The Design of Everyday Things'", "Join design communities (Dribbble, Behance, ADPList)"],
    tags: ["UX", "UI", "design", "product design", "Figma"],
  },
  {
    id: "healthcare-careers",
    title: "Healthcare & Allied Health",
    category: "career-fields",
    audience: ["high-school", "college"],
    overview: "Beyond physicians, healthcare offers diverse roles: nursing, physician assistants, physical therapists, medical technologists, public health specialists, and more. Many paths offer strong job security and meaningful impact.",
    pros: ["Job security — healthcare is recession-resistant", "Meaningful, purpose-driven work", "Wide range of education levels and roles", "Competitive salaries with growth potential", "Opportunities everywhere — urban and rural"],
    cons: ["Emotionally and physically demanding", "Burnout rates are high in many roles", "Shift work and irregular hours common", "Extensive education for some paths (MD, PA, PT)", "Exposure to illness and high-stress situations"],
    eligibility: ["Varies by role: CNA (weeks), RN (2–4 years), PA/MD (6–11+ years)", "Strong science foundation (biology, chemistry, anatomy)", "Clinical volunteer experience recommended", "Certifications and licensure required for most roles"],
    timeline: ["High school: Take AP Biology/Chemistry, volunteer at hospitals", "College: Complete pre-requisites for your target role", "Post-grad: Licensing exams and clinical rotations", "Career: Specialize, advance to leadership, or pivot within healthcare"],
    nextSteps: ["Shadow 2–3 different healthcare professionals", "Research the education requirements for roles that interest you", "Volunteer or get certified as a CNA for early clinical experience", "Compare salary, lifestyle, and advancement across healthcare paths"],
    tags: ["healthcare", "nursing", "physician assistant", "public health", "medical"],
  },
  {
    id: "mlops-devrel",
    title: "Emerging Tech Roles (MLOps, DevRel, Platform Eng)",
    category: "career-fields",
    audience: ["college", "professional"],
    overview: "Newer, rapidly growing roles at the intersection of engineering and other domains. MLOps engineers manage ML model lifecycle. Developer Relations (DevRel) bridges engineering and community. Platform engineers build internal developer tools.",
    pros: ["Less competition than traditional SWE roles", "Salaries often match or exceed standard engineering ($130K–$180K+)", "Growing demand as companies mature their tech stacks", "Unique blend of technical and soft skills", "Early career entry means faster advancement"],
    cons: ["Roles are still being defined at many companies", "Fewer established career ladders", "May require breadth across multiple domains", "Smaller job market compared to traditional roles", "Can be hard to explain to non-tech people"],
    eligibility: ["Strong engineering fundamentals required", "MLOps: ML knowledge + DevOps/infra skills", "DevRel: Engineering background + communication/content skills", "Platform Eng: Backend engineering + systems thinking"],
    timeline: ["Year 1–2: Build strong engineering fundamentals", "Year 2–3: Specialize — pick MLOps, DevRel, or Platform Eng", "Year 3–4: Build projects or content in your niche", "Year 4+: Target companies actively hiring for these roles"],
    nextSteps: ["Explore job descriptions for these roles on LinkedIn", "Build a project in your area of interest (ML pipeline, dev tool, tech blog)", "Join communities like MLOps Community, DevRel Collective", "Attend conferences and meetups focused on your niche"],
    tags: ["MLOps", "DevRel", "platform engineering", "emerging roles", "niche tech"],
  },
  {
    id: "business-finance",
    title: "Business, Finance & Consulting",
    category: "career-fields",
    audience: ["college", "professional"],
    overview: "Careers spanning investment banking, management consulting, corporate finance, accounting, and entrepreneurship. These roles drive business strategy, manage capital, and solve complex organizational challenges.",
    pros: ["High earning potential (especially banking/consulting)", "Transferable skills across industries", "Clear career progression and prestige", "Develops strong analytical and leadership skills", "Global opportunities and travel"],
    cons: ["Long hours (60–80+ hrs/week in banking/consulting)", "High-pressure, competitive culture", "Work-life balance is challenging early on", "Requires networking-heavy job search", "Some roles are cyclical with economic downturns"],
    eligibility: ["Business, economics, or finance degree preferred", "Strong analytical and quantitative skills", "Internship experience highly valued", "CFA, CPA, or MBA can accelerate advancement"],
    timeline: ["Sophomore year: Join finance/consulting clubs, begin networking", "Junior year: Apply for summer internships (deadlines Aug–Jan)", "Senior year: Convert internship to full-time or recruit broadly", "Year 2–5: Specialize, pursue MBA or CFA if desired"],
    nextSteps: ["Join your university's finance or consulting club", "Prepare for case interviews (consulting) or technical interviews (banking)", "Network with alumni in your target firms", "Read 'Breaking Into Wall Street' or 'Case In Point' for prep"],
    tags: ["finance", "consulting", "banking", "business", "MBA"],
  },

  // ── Exams & Applications ──
  {
    id: "sat-act",
    title: "SAT & ACT Preparation",
    category: "exams-applications",
    audience: ["high-school"],
    overview: "Standardized tests used for college admissions. The SAT focuses on evidence-based reading/writing and math. The ACT includes English, math, reading, science, and an optional essay. Many colleges are now test-optional.",
    pros: ["Strong scores can earn merit scholarships", "Demonstrates academic readiness to colleges", "Widely accepted across all US colleges", "Practice materials are free and abundant", "Can be retaken to improve scores"],
    cons: ["Test anxiety can affect performance", "Doesn't measure all forms of intelligence", "Prep courses can be expensive", "Some students perform better on one test vs. the other", "Increasing number of test-optional schools"],
    eligibility: ["Open to all high school students", "Most students take it junior or senior year", "No prerequisites — just register and prepare"],
    timeline: ["August–September (Junior Year): Begin structured SAT/ACT prep", "October: Take PSAT/NMSQT for National Merit qualification", "December–January: Take first official SAT or ACT", "March–June: Retake if needed to improve scores", "Fall of Senior Year: Send final scores to colleges"],
    nextSteps: ["Take a free practice test for both SAT and ACT to compare", "Use Khan Academy (SAT) or ACT Academy for free prep", "Set a target score based on your college list", "Register for your first test 2–3 months in advance"],
    tags: ["SAT", "ACT", "standardized testing", "college admissions"],
  },
  {
    id: "fafsa-financial-aid",
    title: "FAFSA & Financial Aid",
    category: "exams-applications",
    audience: ["high-school", "college"],
    overview: "The Free Application for Federal Student Aid (FAFSA) determines your eligibility for federal grants, loans, and work-study. It opens October 1 each year and is required by most colleges for financial aid.",
    pros: ["Access to free money (Pell Grants, state grants)", "Required for most institutional scholarships", "Determines work-study eligibility", "Free to submit", "Can reveal aid you didn't know you qualified for"],
    cons: ["Complex form requiring tax and financial data", "Must be renewed every year", "Expected Family Contribution may feel unfair", "Deadlines vary by state and school", "Doesn't cover all costs for many families"],
    eligibility: ["US citizen or eligible non-citizen", "Must have a Social Security number", "Must be enrolled or accepted in an eligible program", "Males 18–25 must be registered with Selective Service"],
    timeline: ["October 1: FAFSA opens — submit as early as possible", "November–February: Priority deadlines for most states and schools", "March–April: Financial aid award letters arrive", "May 1: College decision deadline — compare aid packages"],
    nextSteps: ["Create an FSA ID for yourself and a parent at studentaid.gov", "Gather tax returns, W-2s, and bank statements", "Submit FAFSA as close to October 1 as possible", "Compare financial aid packages across schools"],
    tags: ["FAFSA", "financial aid", "grants", "scholarships"],
  },
  {
    id: "college-essays",
    title: "College Application Essays",
    category: "exams-applications",
    audience: ["high-school"],
    overview: "Personal statements and supplemental essays are a critical component of college applications. They reveal your personality, values, and unique perspective beyond grades and test scores.",
    pros: ["Opportunity to stand out from other applicants", "Show personality beyond academics", "Can compensate for weaker areas of application", "Helps admissions understand your story", "Develops valuable writing skills"],
    cons: ["Time-intensive writing and revision process", "Subjective evaluation by readers", "Can be stressful finding the right topic", "Each school may require different supplementals", "Quality varies significantly without feedback"],
    eligibility: ["Required for most 4-year college applications", "Common App essay (250–650 words) + school-specific supplements", "No prerequisites — start brainstorming early"],
    timeline: ["April–May (Junior Year): Begin brainstorming topics", "June–July: Write first drafts of Common App essay", "August: Revise with feedback from teachers/counselors", "September–November: Write supplemental essays for each school", "December–January: Final polish and submit"],
    nextSteps: ["Read successful essay examples on CollegeVine or AdmissionsHero", "Brainstorm 5–10 personal stories or experiences", "Get feedback from at least 2 trusted readers", "Start with your Common App essay — it's used everywhere"],
    tags: ["essays", "personal statement", "college applications", "writing"],
  },

  // ── Internships ──
  {
    id: "tech-internships",
    title: "Tech Industry Internships",
    category: "internships",
    audience: ["college", "high-school"],
    overview: "Paid summer internships at technology companies (10–12 weeks). Major companies like Google, Microsoft, and Amazon offer structured programs with mentorship, projects, and potential return offers.",
    pros: ["High pay ($7K–$12K/month at top companies)", "Real-world project experience", "Mentorship from senior engineers", "Strong pipeline to full-time offers", "Build professional network early"],
    cons: ["Extremely competitive (2–5% acceptance rates at top firms)", "Requires strong technical interview skills", "Relocation may be required", "Application timelines start very early (Aug–Oct)", "Can be overwhelming for first-timers"],
    eligibility: ["Enrolled in a CS/Engineering degree program", "Freshman–senior year (some have specific year requirements)", "Strong coding skills and data structures knowledge", "Legal authorization to work in the US"],
    timeline: ["August–September: Applications open at major companies", "October–November: First round interviews begin", "December–February: Final round interviews and offers", "May–August: Internship period (10–12 weeks)"],
    nextSteps: ["Practice coding problems on LeetCode (aim for 100+ problems)", "Build 2–3 portfolio projects on GitHub", "Prepare a polished resume using STAR format", "Apply to 30+ companies — don't just target FAANG"],
    tags: ["tech", "software engineering", "FAANG", "summer internship"],
  },
  {
    id: "research-opportunities",
    title: "Undergraduate Research",
    category: "internships",
    audience: ["college"],
    overview: "Work alongside professors on original research projects in your field. Can be during the academic year or summer (REU programs). Essential for graduate school applications and intellectual growth.",
    pros: ["Deep dive into a subject you're passionate about", "Strengthen graduate school applications significantly", "Published research looks exceptional on resumes", "Build close mentorship with professors", "Develop critical thinking and analytical skills"],
    cons: ["Often unpaid or low stipend", "Time-intensive commitment", "Results aren't guaranteed", "Can be tedious and frustrating at times", "May require specific prerequisite courses"],
    eligibility: ["Enrolled as an undergraduate (usually sophomore+)", "Strong grades in relevant coursework", "Some programs (REUs) are competitive with formal applications", "Curiosity and persistence are the most important qualifications"],
    timeline: ["October–February: Apply to summer REU programs (NSF-funded)", "Anytime: Approach professors at your university about joining their lab", "Spring: Begin research assistantship for fall semester", "Summer: Full-time research (8–10 weeks for REUs)"],
    nextSteps: ["Identify 3–5 professors whose research interests you", "Email professors with a brief, specific introduction", "Apply to NSF REU programs at nsf.gov", "Read recent papers from labs you're interested in"],
    tags: ["research", "undergraduate", "REU", "grad school prep"],
  },
  {
    id: "fellowship-programs",
    title: "Fellowships & Scholarships",
    category: "internships",
    audience: ["college", "professional"],
    overview: "Competitive awards providing funding, mentorship, and unique experiences. Ranges from undergraduate scholarships (Goldwater, Udall) to post-grad fellowships (Fulbright, Rhodes, Marshall).",
    pros: ["Substantial funding (often full tuition or living stipends)", "Prestigious recognition on your resume", "Access to exclusive networks and alumni communities", "Unique experiences (international travel, research)", "Strong support for graduate school or career launch"],
    cons: ["Extremely competitive (often <5% acceptance)", "Time-intensive application process", "May require specific citizenship or institution", "Some have geographic or field restrictions", "Application requires months of preparation"],
    eligibility: ["Varies widely by fellowship — check each program", "Most require US citizenship or permanent residency", "Strong academic record and leadership experience", "Faculty or employer recommendations typically needed"],
    timeline: ["January–March: Research available fellowships and eligibility", "April–June: Draft personal statements and gather recommendations", "August–October: Submit applications (most fall deadlines)", "March–April: Notification of results"],
    nextSteps: ["Visit your university's fellowship advising office", "Start a spreadsheet of fellowship deadlines and requirements", "Read winning essays and applications for guidance", "Begin drafting your personal statement 3+ months before deadline"],
    tags: ["fellowships", "scholarships", "Fulbright", "funding"],
  },

  // ── Graduate School ──
  {
    id: "masters-degree",
    title: "Master's Degree Programs",
    category: "graduate-school",
    audience: ["college", "professional"],
    overview: "A 1–2 year advanced degree that deepens expertise in a specific field. Required for certain careers (social work, counseling) and valuable for career advancement in business (MBA), engineering, education, and more.",
    pros: ["Higher earning potential (20–30% salary premium)", "Required for many advanced positions", "Deeper expertise and specialization", "Networking with experienced professionals", "Career pivoting opportunity"],
    cons: ["Significant cost ($30K–$120K+ depending on program)", "1–2 years of lost income", "Not always necessary for career advancement", "Can lead to overqualification for some roles", "Student loan burden"],
    eligibility: ["Bachelor's degree required", "GRE/GMAT scores (increasingly optional)", "Letters of recommendation (typically 2–3)", "Statement of purpose and resume", "Minimum GPA (usually 3.0+)"],
    timeline: ["12–18 months before: Research programs and prepare for GRE/GMAT", "9–12 months before: Take standardized tests", "6–9 months before: Write essays, gather recommendations", "Fall–Winter: Submit applications (deadlines vary)", "Spring: Compare offers and financial aid packages"],
    nextSteps: ["Determine if a master's is necessary for your career goals", "Research program rankings and alumni outcomes", "Connect with current students and alumni", "Calculate ROI: compare cost vs. expected salary increase"],
    tags: ["masters", "MBA", "graduate school", "career advancement"],
  },
  {
    id: "gre-gmat-prep",
    title: "GRE & GMAT Preparation",
    category: "graduate-school",
    audience: ["college", "professional"],
    overview: "Standardized tests for graduate school admission. GRE is accepted broadly (humanities, sciences, engineering). GMAT is primarily for business schools. Many programs are now test-optional.",
    pros: ["Strong scores can offset a lower GPA", "Merit scholarship opportunities", "Demonstrates quantitative and verbal abilities", "Valid for 5 years — take it early", "Free and low-cost prep resources available"],
    cons: ["Expensive registration ($205–$275)", "Prep takes 2–4 months of dedicated study", "Test anxiety can impact performance", "Increasingly optional at many programs", "Doesn't predict graduate school success well"],
    eligibility: ["Anyone can register — no prerequisites", "Typically taken junior/senior year of college or while working", "Computer-based test available year-round at testing centers"],
    timeline: ["4–6 months before: Take a diagnostic practice test", "3–4 months before: Begin structured study plan", "1 month before: Focus on practice tests and weak areas", "Test day: Arrive early, bring required ID and confirmation", "After: Send scores to target programs"],
    nextSteps: ["Take a free diagnostic test (ETS for GRE, GMAC for GMAT)", "Use Magoosh, Manhattan Prep, or free Khan Academy resources", "Set a target score based on your program's averages", "Schedule your test at least 2 months before application deadlines"],
    tags: ["GRE", "GMAT", "grad school", "test prep"],
  },
  {
    id: "medical-school-path",
    title: "Medical School (MD/DO) Pathway",
    category: "graduate-school",
    audience: ["college", "high-school"],
    overview: "Becoming a physician requires 4 years of undergraduate pre-med coursework, the MCAT exam, 4 years of medical school, and 3–7 years of residency. It's the longest but among the most rewarding career paths.",
    pros: ["Highest-paid profession with deep human impact", "Job security and stability", "Intellectual challenge and lifelong learning", "Diverse specialization options", "Respected and trusted profession"],
    cons: ["11+ years of training post–high school", "Average medical school debt: $200K+", "Intense workload and burnout risk", "Delayed earning potential vs. peers", "Highly competitive admissions (40% acceptance rate)"],
    eligibility: ["Bachelor's degree with pre-med prerequisites (Bio, Chem, Orgo, Physics, Biochem)", "MCAT score (typically 510+ for competitive programs)", "Clinical experience (volunteering, shadowing, scribing)", "Research experience (strongly recommended)", "Strong letters of recommendation"],
    timeline: ["Freshman–Sophomore Year: Complete pre-med prerequisites, begin shadowing", "Junior Year: Take MCAT (Jan–June), begin clinical volunteering", "Senior Year: Apply through AMCAS/AACOMAS (May–October)", "Gap Year (optional): Gain additional experience", "Medical School: 4 years (2 preclinical + 2 clinical rotations)"],
    nextSteps: ["Meet with your pre-med advisor to plan coursework", "Begin shadowing physicians in specialties that interest you", "Join a pre-med student organization", "Start MCAT prep at least 6 months before your test date"],
    tags: ["medical school", "MCAT", "pre-med", "physician", "residency"],
  },

  // ── Certifications ──
  {
    id: "tech-certifications",
    title: "Tech Industry Certifications",
    category: "certifications",
    audience: ["college", "professional"],
    overview: "Industry-recognized credentials that validate specific technical skills. Popular certifications include AWS, Google Cloud, CompTIA, and various programming certifications. Can be completed in weeks to months.",
    pros: ["Earn 10–25% higher salary with relevant certs", "Faster than a degree program", "Employer-recognized and valued", "Self-paced online learning available", "Can be earned while working"],
    cons: ["Need to be renewed periodically", "Cost $150–$500+ per certification exam", "Don't replace degree requirements for some roles", "Studying while working is challenging", "Some certs become outdated quickly"],
    eligibility: ["No formal prerequisites for most entry-level certs", "Some advanced certs require experience or prior certifications", "Basic computer literacy and domain knowledge recommended"],
    timeline: ["Week 1–2: Research which certification aligns with your career goals", "Month 1–2: Study using official guides and practice exams", "Month 2–3: Take practice tests and review weak areas", "Month 3: Schedule and pass the certification exam"],
    nextSteps: ["Identify the most valued certifications in your target field", "Check if your employer offers certification reimbursement", "Start with foundational certs (AWS CCP, CompTIA A+, Google Analytics)", "Join study groups and use platforms like A Cloud Guru or Coursera"],
    tags: ["AWS", "cloud", "CompTIA", "professional development"],
  },
  {
    id: "bootcamp-programs",
    title: "Coding Bootcamps & Accelerators",
    category: "certifications",
    audience: ["college", "professional"],
    overview: "Intensive 12–24 week programs teaching job-ready coding skills. Covers full-stack web development, data science, or UX design. Many offer career coaching, job placement support, and income share agreements.",
    pros: ["Job-ready skills in 3–6 months", "Career coaching and job placement support", "Income share agreements reduce upfront cost", "Project-based, practical curriculum", "Strong alumni networks"],
    cons: ["Costs $10K–$20K+ upfront (or ISA)", "Extremely intensive pace", "Not equivalent to a CS degree for all employers", "Quality varies significantly between programs", "Dropout rates can be high"],
    eligibility: ["No degree required for most programs", "Basic computer literacy recommended", "Some require a coding challenge or interview", "Full-time programs require 40–60 hours/week commitment"],
    timeline: ["Month 1: Research programs (compare by job placement rate, not price)", "Month 2: Apply and complete coding challenges", "Months 3–6: Complete the bootcamp program", "Months 6–8: Job search with career support"],
    nextSteps: ["Compare bootcamps on Course Report and SwitchUp", "Attend free intro workshops from programs you're considering", "Talk to alumni about their experience and job outcomes", "Consider part-time programs if you can't leave your current job"],
    tags: ["bootcamp", "coding", "career change", "accelerated learning"],
  },
  {
    id: "career-pivoting",
    title: "Career Pivoting Strategies",
    category: "certifications",
    audience: ["professional"],
    overview: "Transitioning to a new career field by leveraging transferable skills, acquiring new credentials, and strategically networking. Career pivots are increasingly common — the average person changes careers 3–7 times.",
    pros: ["Renewed passion and motivation", "Potential for higher earnings", "Leverage existing transferable skills", "Broader perspective from diverse experience", "Growing acceptance of non-linear careers"],
    cons: ["Temporary income reduction during transition", "Starting at entry level in new field", "Imposter syndrome and self-doubt", "Requires significant time investment", "May need additional education or training"],
    eligibility: ["Anyone looking to change career direction", "Self-assessment of transferable skills is essential", "Willingness to invest time in learning and networking", "Financial runway of 3–12 months recommended"],
    timeline: ["Month 1: Self-assessment — identify transferable skills and target roles", "Month 2–3: Research target field, talk to people in it", "Month 3–6: Acquire new skills (courses, certifications, projects)", "Month 6–9: Build portfolio, rebrand online presence, network actively", "Month 9–12: Apply strategically, targeting transition-friendly companies"],
    nextSteps: ["Take a career assessment (Myers-Briggs, StrengthsFinder, O*NET)", "Identify 5 people who made a similar pivot and reach out", "Start a side project in your target field", "Update your LinkedIn headline and summary for your new direction"],
    tags: ["career change", "pivot", "transferable skills", "professional development"],
  },

  // ── Networking ──
  {
    id: "linkedin-strategy",
    title: "LinkedIn Networking Strategy",
    category: "networking",
    audience: ["high-school", "college", "professional"],
    overview: "Build a professional online presence and strategically connect with industry professionals. LinkedIn is the #1 platform for professional networking, job searching, and personal branding.",
    pros: ["Access to millions of professionals across every industry", "Free to use with powerful features", "Showcases your experience and achievements", "Recruiters actively search for candidates", "Content sharing builds thought leadership"],
    cons: ["Can feel awkward or self-promotional", "Low response rates on cold outreach", "Time-consuming to maintain effectively", "Algorithm changes affect content visibility", "Premium features require paid subscription"],
    eligibility: ["Anyone can create a profile", "Best to start building in high school or early college", "No minimum experience required"],
    timeline: ["Week 1: Create and optimize your profile (photo, headline, summary)", "Week 2: Connect with classmates, professors, and professionals you know", "Week 3: Begin engaging with content — like, comment, and share", "Monthly: Send 5–10 personalized connection requests to target professionals", "Quarterly: Publish a post or article showcasing your work"],
    nextSteps: ["Upload a professional headshot (clear background, good lighting)", "Write a compelling headline that describes your aspirations", "Add all relevant experiences, projects, and skills", "Start with warm connections before cold outreach"],
    tags: ["LinkedIn", "professional network", "personal branding", "job search"],
  },
  {
    id: "informational-interviews",
    title: "Informational Interviews",
    category: "networking",
    audience: ["college", "professional"],
    overview: "Short, informal conversations with professionals to learn about their career path, industry, and advice. Not a job interview — it's a learning opportunity that builds relationships and provides insider knowledge.",
    pros: ["Learn insider knowledge about careers and companies", "Build genuine professional relationships", "Low-pressure way to network", "Can lead to referrals and opportunities", "Helps clarify your own career direction"],
    cons: ["Requires courage to reach out to strangers", "Some people won't respond", "Need to prepare thoughtful questions", "Time-consuming to schedule and follow up", "Must be genuine — not a disguised job ask"],
    eligibility: ["Anyone can request an informational interview", "Best approach: warm introductions through mutual connections", "Cold outreach works too — personalize every message"],
    timeline: ["Week 1: Identify 10 professionals you'd like to talk to", "Week 2: Send personalized outreach messages", "Week 3–4: Conduct 2–3 informational interviews", "After each: Send thank-you notes within 24 hours", "Monthly: Maintain relationships with periodic check-ins"],
    nextSteps: ["Prepare 5–7 specific questions about their career path", "Practice your own elevator pitch (30 seconds about yourself)", "Always offer something in return — even gratitude counts", "Follow up with a LinkedIn connection and thank-you message"],
    tags: ["networking", "career advice", "mentorship", "outreach"],
  },
  {
    id: "mentorship-programs",
    title: "Finding & Working with Mentors",
    category: "networking",
    audience: ["high-school", "college", "professional"],
    overview: "A mentor provides guidance, feedback, and support based on their own experience. Great mentors can accelerate your career by years. Mentorship can be formal (through programs) or informal (organic relationships).",
    pros: ["Accelerated career growth and learning", "Access to their network and opportunities", "Honest feedback on your performance and plans", "Emotional support during challenges", "Learn from their mistakes so you don't repeat them"],
    cons: ["Good mentors are hard to find", "Requires initiative and follow-through from you", "Mentor's advice may not always apply to your situation", "Can create dependency if boundaries aren't set", "Formal programs may feel forced"],
    eligibility: ["Anyone seeking career or academic guidance", "Best when you have specific questions or goals", "Must be willing to put in the effort to maintain the relationship"],
    timeline: ["Month 1: Identify 3–5 potential mentors in your field", "Month 2: Reach out and build initial rapport", "Month 3: Establish regular meeting cadence (bi-weekly or monthly)", "Ongoing: Come prepared with specific questions and updates", "Annually: Evaluate the relationship and express gratitude"],
    nextSteps: ["Look for mentors through alumni networks, professional orgs, or at work", "Don't ask \"Will you be my mentor?\" — build the relationship first", "Come to every meeting prepared with updates and questions", "Be a mentor to someone else — it deepens your own learning"],
    tags: ["mentorship", "career growth", "guidance", "professional relationships"],
  },
];

export function getRelevantTopicIds(educationLevel: string): Set<string> {
  const normalized = educationLevel.toLowerCase().trim();
  let audience: AudienceLevel = "all";

  if (normalized.includes("high school") || normalized.includes("highschool") || normalized.includes("9th") || normalized.includes("10th") || normalized.includes("11th") || normalized.includes("12th") || normalized.includes("freshman") || normalized.includes("sophomore") || normalized.includes("junior") || normalized.includes("senior")) {
    audience = "high-school";
  } else if (normalized.includes("college") || normalized.includes("university") || normalized.includes("undergraduate") || normalized.includes("bachelor") || normalized.includes("associate")) {
    audience = "college";
  } else if (normalized.includes("professional") || normalized.includes("working") || normalized.includes("career") || normalized.includes("master") || normalized.includes("graduate") || normalized.includes("phd") || normalized.includes("mba")) {
    audience = "professional";
  }

  return new Set(
    exploreTopics
      .filter(t => t.audience.includes(audience) || t.audience.includes("all"))
      .map(t => t.id)
  );
}
