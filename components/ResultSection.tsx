import React, { useMemo } from 'react';
import { Question, LeaderboardEntry, StudentInfo } from '../types';
import Leaderboard from './Leaderboard';
import MathText from './MathText';

interface ResultSectionProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  timeSpent: number;
  onNextStudent: () => void;
  onNewQuiz: () => void;
  onExit: () => void;
  studentInfo: StudentInfo;
  leaderboardData: LeaderboardEntry[];
  currentResultId: string;
}

const ResultSection: React.FC<ResultSectionProps> = ({ 
  questions, 
  userAnswers, 
  timeSpent, 
  onNextStudent, 
  onNewQuiz, 
  onExit,
  studentInfo,
  leaderboardData,
  currentResultId
}) => {
  
  // Calculate current score for display
  const score = useMemo(() => {
    let correctCount = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    return correctCount;
  }, [questions, userAnswers]);

  // Sort and process leaderboard
  const sortedLeaderboard = useMemo(() => {
    // Create a copy to sort
    const entries = [...leaderboardData];
    
    // Sort by Score DESC, then Time ASC
    entries.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timeSeconds - b.timeSeconds;
    });

    // Map to include isCurrentUser flag based on ID
    return entries.map(entry => ({
      ...entry,
      isCurrentUser: entry.id === currentResultId
    }));
  }, [leaderboardData, currentResultId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      {/* Summary Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-t-8 border-blue-500 relative">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Kết Quả Bài Làm</h1>
        
        <div className="mb-6 inline-block bg-blue-50 px-6 py-2 rounded-lg">
             <h2 className="text-xl font-bold text-blue-800">{studentInfo.name}</h2>
             {(studentInfo.className || studentInfo.school) && (
               <p className="text-sm text-blue-600 mt-1">
                 {studentInfo.className && `Lớp: ${studentInfo.className}`} 
                 {studentInfo.className && studentInfo.school && " | "} 
                 {studentInfo.school && `Trường: ${studentInfo.school}`}
               </p>
             )}
        </div>

        <p className="text-gray-500 mb-6">Hoàn thành trong {formatTime(timeSpent)}</p>
        
        <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="text-center">
                <div className="text-6xl font-extrabold text-blue-600 mb-1">{score}</div>
                <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Điểm Số</div>
            </div>
             <div className="h-16 w-px bg-gray-200"></div>
            <div className="text-center">
                <div className="text-6xl font-extrabold text-gray-700 mb-1">10</div>
                <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Tổng Câu</div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
            <button 
                onClick={onNextStudent}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center min-w-[200px]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Học Sinh Khác
            </button>

            <button 
                onClick={onExit}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center min-w-[200px]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Thoát
            </button>

            <button 
                onClick={onNewQuiz}
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-full shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center min-w-[200px]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Tạo Đề Mới (GV)
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detailed Answers - Spans 2 cols */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Đáp Án Chi Tiết
            </h2>
            
            <div className="space-y-4">
                {questions.map((q, idx) => {
                    const userAnswer = userAnswers[q.id];
                    const isCorrect = userAnswer === q.correctIndex;
                    return (
                        <div key={q.id} className={`bg-white rounded-xl shadow border-l-4 p-5 ${isCorrect ? "border-green-500" : "border-red-500"}`}>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-lg text-gray-800">
                                    Câu {idx + 1}: <MathText text={q.text} />
                                </h3>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {isCorrect ? "Đúng" : "Sai"}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                {q.options.map((opt, optIdx) => {
                                    let optionClass = "p-2 rounded border text-sm ";
                                    if (optIdx === q.correctIndex) {
                                        optionClass += "bg-green-50 border-green-300 text-green-800 font-medium";
                                    } else if (optIdx === userAnswer && !isCorrect) {
                                        optionClass += "bg-red-50 border-red-300 text-red-800";
                                    } else {
                                        optionClass += "bg-white border-gray-200 text-gray-500";
                                    }
                                    
                                    return (
                                        <div key={optIdx} className={optionClass}>
                                            <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span> 
                                            <MathText text={opt} />
                                            {optIdx === q.correctIndex && <span className="ml-2">✓</span>}
                                            {optIdx === userAnswer && !isCorrect && <span className="ml-2">✗</span>}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                                <span className="font-bold">Giải thích: </span> <MathText text={q.explanation} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

        {/* Leaderboard - Spans 1 col */}
        <div className="lg:col-span-1">
            <div className="sticky top-4">
                <Leaderboard entries={sortedLeaderboard} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSection;