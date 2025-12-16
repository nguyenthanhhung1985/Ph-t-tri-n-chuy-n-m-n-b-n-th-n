import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import MathText from './MathText';

interface QuizSectionProps {
  questions: Question[];
  onFinish: (answers: Record<number, number>, duration: number) => void;
  onExit: () => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ questions, onFinish, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectOption = (optionIndex: number) => {
    const questionId = questions[currentQuestionIndex].id;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Check if all questions are answered (optional, but good UX)
    const unansweredCount = questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      if (!confirm(`Bạn còn ${unansweredCount} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài?`)) {
        return;
      }
    }
    onFinish(answers, elapsedTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((Object.keys(answers).length) / questions.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex justify-between items-center sticky top-4 z-10 border border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors flex items-center"
            title="Thoát bài làm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="hidden sm:inline">Thoát</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-lg font-bold text-sm">
              Câu {currentQuestionIndex + 1}/{questions.length}
            </span>
            <span className="text-gray-500 text-sm hidden md:inline-block">
              Đã làm: {Object.keys(answers).length}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Thời gian</span>
            <span className="text-xl font-mono font-bold text-gray-800">{formatTime(elapsedTime)}</span>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors text-sm sm:text-base flex items-center"
        >
          <span className="mr-1">Nộp Bài</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-6 md:p-8 flex-grow">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
            <MathText text={currentQuestion.text} />
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center group ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-4 border font-bold flex-shrink-0 ${
                     isSelected ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-500 border-gray-300 group-hover:border-blue-300"
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className={`text-lg ${isSelected ? "text-blue-900 font-medium" : "text-gray-700"}`}>
                    <MathText text={option} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${
              currentQuestionIndex === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Trước
          </button>

          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${
              currentQuestionIndex === questions.length - 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-blue-600 hover:bg-blue-50 hover:text-blue-800"
            }`}
          >
            Sau
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Quick Navigation Dots */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {questions.map((q, idx) => {
           const isAnswered = answers[q.id] !== undefined;
           const isCurrent = idx === currentQuestionIndex;
           return (
             <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                    isCurrent ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : ""
                } ${
                    isAnswered ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                }`}
             >
                {idx + 1}
             </button>
           )
        })}
      </div>
    </div>
  );
};

export default QuizSection;