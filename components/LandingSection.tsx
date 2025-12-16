import React from 'react';

interface LandingSectionProps {
  onTeacherSelect: () => void;
  onStudentSelect: () => void;
  hasActiveQuiz: boolean;
}

const LandingSection: React.FC<LandingSectionProps> = ({ onTeacherSelect, onStudentSelect, hasActiveQuiz }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 mt-10">
      <div className="text-center mb-12">
        <div className="inline-block p-4 rounded-2xl bg-blue-50 mb-4">
             <span className="text-5xl font-black text-blue-600">π</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Chào mừng đến với <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI Tutor</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Nền tảng kiểm tra kiến thức toán học thông minh. Vui lòng chọn vai trò của bạn để tiếp tục.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Student Card */}
        <button
          onClick={onStudentSelect}
          className={`relative group overflow-hidden rounded-2xl p-8 text-left transition-all duration-300 border-2 ${
            hasActiveQuiz 
              ? "bg-white border-green-100 hover:border-green-500 hover:shadow-xl cursor-pointer" 
              : "bg-gray-50 border-gray-200 cursor-not-allowed opacity-80"
          }`}
        >
          <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${hasActiveQuiz ? "text-green-600" : "text-gray-400"}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
             </svg>
          </div>

          <div className="relative z-10">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 ${
                hasActiveQuiz ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-500"
            }`}>
              Dành cho học sinh
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Vào Thi Ngay</h2>
            <p className="text-gray-600 mb-6">
              Nhập thông tin cá nhân và bắt đầu làm bài kiểm tra trắc nghiệm.
            </p>
            
            {hasActiveQuiz ? (
              <span className="inline-flex items-center font-bold text-green-600 group-hover:translate-x-1 transition-transform">
                Bắt đầu
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            ) : (
               <span className="inline-flex items-center font-medium text-gray-400">
                Chưa có đề thi nào
               </span>
            )}
          </div>
        </button>

        {/* Teacher Card */}
        <button
          onClick={onTeacherSelect}
          className="relative group overflow-hidden bg-white border-2 border-blue-100 rounded-2xl p-8 text-left hover:border-blue-500 hover:shadow-xl transition-all duration-300"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
             </svg>
          </div>

          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide mb-4">
              Dành cho giáo viên
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tạo Đề Mới</h2>
            <p className="text-gray-600 mb-6">
              Đăng nhập, tải lên hình ảnh đề bài và quản lý phiên làm việc.
            </p>
            <span className="inline-flex items-center font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              Đăng nhập
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </span>
          </div>
        </button>
      </div>
      
      {!hasActiveQuiz && (
        <div className="mt-8 text-center">
            <p className="text-amber-600 bg-amber-50 inline-block px-4 py-2 rounded-lg text-sm border border-amber-200">
                ⚠️ Hiện tại chưa có đề thi. Vui lòng đăng nhập với vai trò Giáo viên để tạo đề mới.
            </p>
        </div>
      )}
    </div>
  );
};

export default LandingSection;