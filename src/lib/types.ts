export interface UserProfile {
  educationLevel: string;
  interests: string[];
  favoriteSubjects: string[];
  careerInterests: string[];
  gpaRange: string;
  budgetConcern: string;
  location: string;
  longTermGoals: string[];
}

export interface RoadmapData {
  recommendedMajors: string[];
  possibleCareers: { title: string; salary: string; growth: string }[];
  timeline: { year: string; title: string; description: string }[];
  extracurriculars: string[];
  alternativePaths: { title: string; description: string }[];
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
