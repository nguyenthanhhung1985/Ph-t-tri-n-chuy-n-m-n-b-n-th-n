export interface Question {
  id: number;
  text: string;
  options: string[]; // Array of 4 strings (A, B, C, D)
  correctIndex: number; // 0-3
  explanation: string;
}

export interface QuizData {
  questions: Question[];
}

export interface StudentInfo {
  name: string;
  className: string;
  school: string;
}

export interface LeaderboardEntry {
  id: string;
  rank?: number;
  name: string;
  score: number; // 0-10
  timeSeconds: number;
  isCurrentUser?: boolean;
}

export enum AppState {
  IDLE = 'IDLE', // Teacher uploading
  ANALYZING = 'ANALYZING', // Processing image
  WAITING_FOR_STUDENT = 'WAITING_FOR_STUDENT', // Student entering info
  QUIZ = 'QUIZ', // Student taking quiz
  RESULTS = 'RESULTS', // Showing results
}