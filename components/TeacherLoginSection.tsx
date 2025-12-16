import React, { useState } from 'react';

interface TeacherLoginSectionProps {
  onLoginSuccess: () => void;
}

const TeacherLoginSection: React.FC<TeacherLoginSectionProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456') {
      onLoginSuccess();
    } else {
      setError('Mật khẩu không đúng. Vui lòng thử lại.');
      setPassword('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 mt-10">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 px-8 py-6 text-center">
           <div className="mx-auto h-12 w-12 bg-white rounded-lg flex items-center justify-center mb-3">
              <span className="text-blue-600 font-bold text-2xl">π</span>
           </div>
           <h2 className="text-2xl font-bold text-white">Góc Giáo Viên</h2>
           <p className="text-blue-100 text-sm mt-1">Hệ thống quản lý đề thi AI</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu truy cập
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-lg"
                placeholder="••••••"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition hover:-translate-y-0.5 hover:shadow-xl flex justify-center items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Đăng Nhập
            </button>
          </form>
        </div>
        <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400">Chỉ dành cho giáo viên và quản trị viên.</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLoginSection;