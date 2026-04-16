export interface PracticeQuestion {
  id: string;
  text: string;
  group: string;
  framework?: string;
  keyPoints?: string[];
  samples?: string[];
  /** legacy field from old cache — will be removed */
  answer?: string;
}

export interface PracticeQuestionGroup {
  label: string;
  questions: PracticeQuestion[];
}

export interface PracticeFeedback {
  corrected_version?: string;
  explanation?: string;
  better_alternatives?: string[];
}

export interface PracticeTurn {
  id: string;
  role: "user" | "coach";
  text: string;
  review?: PracticeFeedback;
}
