import React, { useState } from 'react';
import { AppState, Question, StudentInfo, LeaderboardEntry } from './types';
import { generateQuizFromImage } from './services/geminiService';
import UploadSection from './components/UploadSection';
import StudentEntrySection from './components/StudentEntrySection';
import QuizSection from './components/QuizSection';
import ResultSection from './components/ResultSection';

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
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  // questions state holds the *current* student's randomized version
  const [questions, setQuestions] = useState<Question[]>([]);
  // originalQuestions holds the "master" copy from the image analysis
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);
  
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({ name: '', className: '', school: '' });
  
  // State to manage the leaderboard across multiple students for the same quiz
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentResultId, setCurrentResultId] = useState<string>("");

  // Phase 1: Teacher uploads image
  const handleImageSelected = async (base64: string, mimeType: string) => {
    setAppState(AppState.ANALYZING);
    try {
      const generatedQuestions = await generateQuizFromImage(base64, mimeType);
      const questionsWithIds = generatedQuestions.map((q, idx) => ({ ...q, id: idx }));
      
      setOriginalQuestions(questionsWithIds); // Save the master copy
      setQuestions(questionsWithIds); // Initialize
      
      // Move to student phase
      setAppState(AppState.WAITING_FOR_STUDENT);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tạo đề. Vui lòng thử lại với ảnh rõ nét hơn.");
      setAppState(AppState.IDLE);
    }
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
    setLeaderboard(prev => [...prev, newEntry]);
    
    setAppState(AppState.RESULTS);
  };

  // Option A: Next Student (Same Quiz but will be re-shuffled in handleStudentStart)
  const handleNextStudent = () => {
    // Reset student specific data but KEEP leaderboard
    setUserAnswers({});
    setTimeSpent(0);
    setStudentInfo({ name: '', className: '', school: '' });
    // Go back to student entry
    setAppState(AppState.WAITING_FOR_STUDENT);
  };

  // Option B: New Quiz (Teacher uploads new image)
  const handleNewQuiz = () => {
    const password = window.prompt("Vui lòng nhập mật khẩu giáo viên để tạo đề mới:");
    if (password === null) return; // User cancelled
    if (password !== "123456") {
      alert("Mật khẩu không đúng!");
      return;
    }

    // Reset everything INCLUDING leaderboard and original questions
    setQuestions([]);
    setOriginalQuestions([]);
    setLeaderboard([]); // Clear leaderboard for new quiz
    setUserAnswers({});
    setTimeSpent(0);
    setStudentInfo({ name: '', className: '', school: '' });
    // Go back to upload
    setAppState(AppState.IDLE);
  };

  // Option C: Exit (Reset to start screen without password)
  const handleExit = () => {
    if (confirm("Bạn có chắc chắn muốn thoát về màn hình chính?")) {
      setQuestions([]);
      setOriginalQuestions([]);
      setLeaderboard([]); // Also clear leaderboard on exit
      setUserAnswers({});
      setTimeSpent(0);
      setStudentInfo({ name: '', className: '', school: '' });
      setAppState(AppState.IDLE);
    }
  };

  const getProgressState = () => {
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
            <div className="flex items-center">
              <span className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                   <span className="text-white font-bold text-lg">π</span>
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  AI NHANH HƠN AI
                </h1>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentStep === 1 ? 'bg-blue-100 text-blue-800' : 'text-gray-400'}`}>1. Giáo viên tạo đề</span>
                <span className="text-gray-300">→</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentStep === 2 ? 'bg-blue-100 text-blue-800' : 'text-gray-400'}`}>2. Nhập thông tin</span>
                <span className="text-gray-300">→</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentStep === 3 ? 'bg-blue-100 text-blue-800' : 'text-gray-400'}`}>3. Làm bài</span>
                <span className="text-gray-300">→</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentStep === 4 ? 'bg-blue-100 text-blue-800' : 'text-gray-400'}`}>4. Kết quả</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="py-10">
        {appState === AppState.IDLE && (
          <UploadSection onImageSelected={handleImageSelected} isLoading={false} />
        )}
        
        {appState === AppState.ANALYZING && (
           <UploadSection onImageSelected={() => {}} isLoading={true} />
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