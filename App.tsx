import React, { useState, useEffect } from 'react';
import { AppState, Question, StudentInfo, LeaderboardEntry } from './types';
import { generateQuizFromImage } from './services/geminiService';
import UploadSection from './components/UploadSection';
import StudentEntrySection from './components/StudentEntrySection';
import QuizSection from './components/QuizSection';
import ResultSection from './components/ResultSection';
import TeacherLoginSection from './components/TeacherLoginSection';
import LandingSection from './components/LandingSection';

// Keys for localStorage
const STORAGE_KEY_QUIZ = 'ai_tutor_active_quiz';
const STORAGE_KEY_LEADERBOARD = 'ai_tutor_leaderboard';

// Helper function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Helper function to randomize questions order and their options
const randomizeQuiz = (questions: Question[]): Question[] => {
  // 1. Shuffle the order of questions
  // Create a deep-ish copy to ensure we don't mutate references in original array
  const shuffledQuestions = shuffleArray(questions.map(q => ({...q})));

  // 2. Shuffle options within each question and update correctIndex
  return shuffledQuestions.map((q) => {
    const originalOptions = q.options;
    const correctText = originalOptions[q.correctIndex];
    
    // Shuffle the options
    const shuffledOptions = shuffleArray([...originalOptions]);
    
    // Find the new index of the correct answer
    const newCorrectIndex = shuffledOptions.indexOf(correctText);

    return {
      ...q,
      options: shuffledOptions,
      correctIndex: newCorrectIndex,
    };
  });
};

const App: React.FC = () => {
  // Initial state is now LANDING to allow role selection
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  
  // questions state holds the *current* student's randomized version
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // originalQuestions holds the "master" copy
  // INITIALIZATION: Try to load from localStorage first
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUIZ);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load quiz from storage", error);
      return [];
    }
  });
  
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({ name: '', className: '', school: '' });
  
  // Leaderboard persistence
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEADERBOARD);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load leaderboard from storage", error);
      return [];
    }
  });
  
  const [currentResultId, setCurrentResultId] = useState<string>("");

  // Handler for successful login
  const handleTeacherLoginSuccess = () => {
    setAppState(AppState.IDLE);
  };

  // Phase 1: Teacher uploads image
  const handleImageSelected = async (base64: string, mimeType: string) => {
    setAppState(AppState.ANALYZING);
    try {
      const generatedQuestions = await generateQuizFromImage(base64, mimeType);
      const questionsWithIds = generatedQuestions.map((q, idx) => ({ ...q, id: idx }));
      
      // Save to State AND LocalStorage
      setOriginalQuestions(questionsWithIds);
      localStorage.setItem(STORAGE_KEY_QUIZ, JSON.stringify(questionsWithIds));
      
      // Reset leaderboard for new quiz
      setLeaderboard([]);
      localStorage.removeItem(STORAGE_KEY_LEADERBOARD);

      // Initialize randomized questions for immediate use (optional, usually handled in start)
      setQuestions(questionsWithIds); 
      
      // Move to student phase directly after creation
      setAppState(AppState.WAITING_FOR_STUDENT);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tạo đề. Vui lòng thử lại với ảnh rõ nét hơn.");
      setAppState(AppState.IDLE);
    }
  };

  // Feature: Teacher wants to test the current quiz
  const handleTeacherTestQuiz = () => {
    if (originalQuestions.length === 0) return;
    
    // Setup dummy info for teacher
    const teacherInfo = { name: 'Giáo Viên (Test)', className: '', school: '' };
    setStudentInfo(teacherInfo);
    
    // Randomize quiz same as student flow
    setQuestions(randomizeQuiz(originalQuestions));
    
    setAppState(AppState.QUIZ);
  };

  // Phase 2: Student enters info -> Start Quiz
  const handleStudentStart = (info: StudentInfo) => {
    setStudentInfo(info);
    
    // CRITICAL: Randomize the quiz structure for this specific student session
    // Always use originalQuestions as the source to ensure a fresh, clean shuffle
    if (originalQuestions.length > 0) {
      setQuestions(randomizeQuiz(originalQuestions));
    }

    setAppState(AppState.QUIZ);
  };

  // Phase 3: Quiz Finish
  const handleQuizFinish = (answers: Record<number, number>, duration: number) => {
    setUserAnswers(answers);
    setTimeSpent(duration);

    // Calculate Score immediately
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    // Add to Leaderboard
    const resultId = Date.now().toString();
    const newEntry: LeaderboardEntry = {
      id: resultId,
      name: studentInfo.name,
      score: correctCount,
      timeSeconds: duration,
    };

    setCurrentResultId(resultId);
    
    // Update State and Storage for Leaderboard
    setLeaderboard(prev => {
      const updated = [...prev, newEntry];
      localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(updated));
      return updated;
    });
    
    setAppState(AppState.RESULTS);
  };

  // Option A: Next Student (Same Quiz but will be re-shuffled in handleStudentStart)
  const handleNextStudent = () => {
    // Reset student specific data but KEEP leaderboard and originalQuestions
    setUserAnswers({});
    setTimeSpent(0);
    setStudentInfo({ name: '', className: '', school: '' });
    // Go back to student entry
    setAppState(AppState.WAITING_FOR_STUDENT);
  };

  // Option B: New Quiz (Teacher Action)
  // This destroys current quiz and goes to login
  const handleNewQuiz = () => {
    if (confirm("Hành động này sẽ XÓA VĨNH VIỄN đề thi hiện tại và bảng xếp hạng để tạo đề mới. Bạn có chắc chắn?")) {
      // Clear Storage
      localStorage.removeItem(STORAGE_KEY_QUIZ);
      localStorage.removeItem(STORAGE_KEY_LEADERBOARD);

      // Clear State
      setQuestions([]);
      setOriginalQuestions([]);
      setLeaderboard([]); 
      setUserAnswers({});
      setTimeSpent(0);
      setStudentInfo({ name: '', className: '', school: '' });
      
      setAppState(AppState.TEACHER_LOGIN);
    }
  };

  // Option C: Exit / Home
  // Returns to Landing Page but PRESERVES the current quiz (if any)
  // So other students can enter without teacher login
  const handleExit = () => {
    if (confirm("Về màn hình chính? Kết quả làm bài hiện tại sẽ không được lưu (nếu chưa nộp). Đề thi vẫn sẽ được giữ lại.")) {
      // Clear CURRENT user progress
      setUserAnswers({});
      setTimeSpent(0);
      setStudentInfo({ name: '', className: '', school: '' });
      // Go to Landing
      setAppState(AppState.LANDING);
    }
  };

  // Landing Page Handlers
  const handleLandingTeacherSelect = () => {
    setAppState(AppState.TEACHER_LOGIN);
  };

  const handleLandingStudentSelect = () => {
    if (originalQuestions.length === 0) {
      alert("Hiện tại chưa có đề thi nào. Vui lòng nhờ giáo viên tạo đề mới.");
      return;
    }
    setAppState(AppState.WAITING_FOR_STUDENT);
  };

  const getProgressState = () => {
     if (appState === AppState.LANDING || appState === AppState.TEACHER_LOGIN) return 0;
     if (appState === AppState.IDLE || appState === AppState.ANALYZING) return 1;
     if (appState === AppState.WAITING_FOR_STUDENT) return 2;
     if (appState === AppState.QUIZ) return 3;
     if (appState === AppState.RESULTS) return 4;
     return 1;
  };

  const currentStep = getProgressState();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navigation / Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => appState !== AppState.QUIZ && handleExit()}>
              <span className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                   <span className="text-white font-bold text-lg">π</span>
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  AI NHANH HƠN AI
                </h1>
              </span>
            </div>
            
            {/* Show progress steps only when in active flow */}
            {currentStep > 0 && (
              <div className="hidden md:flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentStep === 1 ? 'bg-blue-100 text-blue-800' : 'text-gray-400'}`}>1. Giáo viên tạo đề</span>
                  <span className="text-gray-300">→</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentStep === 2 ? 'bg-blue-100 text-blue-800' : 'text-gray-400'}`}>2. Nhập thông tin</span>
                  <span className="text-gray-300">→</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentStep === 3 ? 'bg-blue-100 text-blue-800' : 'text-gray-400'}`}>3. Làm bài</span>
                  <span className="text-gray-300">→</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentStep === 4 ? 'bg-blue-100 text-blue-800' : 'text-gray-400'}`}>4. Kết quả</span>
              </div>
            )}
            
            {/* Show simple Home button if on Landing or Login */}
            {currentStep === 0 && appState !== AppState.LANDING && (
                <button onClick={() => setAppState(AppState.LANDING)} className="text-sm text-gray-500 hover:text-blue-600">
                    ← Quay lại
                </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="py-10">
        {appState === AppState.LANDING && (
          <LandingSection 
            onTeacherSelect={handleLandingTeacherSelect}
            onStudentSelect={handleLandingStudentSelect}
            hasActiveQuiz={originalQuestions.length > 0}
          />
        )}

        {appState === AppState.TEACHER_LOGIN && (
          <TeacherLoginSection onLoginSuccess={handleTeacherLoginSuccess} />
        )}

        {appState === AppState.IDLE && (
          <UploadSection 
            onImageSelected={handleImageSelected} 
            isLoading={false} 
            hasActiveQuiz={originalQuestions.length > 0}
            onTestQuiz={handleTeacherTestQuiz}
          />
        )}
        
        {appState === AppState.ANALYZING && (
           <UploadSection 
             onImageSelected={() => {}} 
             isLoading={true} 
           />
        )}

        {appState === AppState.WAITING_FOR_STUDENT && (
           <StudentEntrySection onStartQuiz={handleStudentStart} />
        )}

        {appState === AppState.QUIZ && (
          <QuizSection 
            questions={questions} 
            onFinish={handleQuizFinish} 
            onExit={handleExit}
          />
        )}

        {appState === AppState.RESULTS && (
          <ResultSection 
            questions={questions} 
            userAnswers={userAnswers} 
            timeSpent={timeSpent} 
            onNextStudent={handleNextStudent}
            onNewQuiz={handleNewQuiz}
            onExit={handleExit}
            studentInfo={studentInfo}
            leaderboardData={leaderboard}
            currentResultId={currentResultId}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2024 AI NHANH HƠN AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;