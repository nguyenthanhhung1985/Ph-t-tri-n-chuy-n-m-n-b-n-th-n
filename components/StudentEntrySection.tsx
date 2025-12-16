import React, { useState } from 'react';
import { StudentInfo } from '../types';

interface StudentEntrySectionProps {
  onStartQuiz: (info: StudentInfo) => void;
}

const StudentEntrySection: React.FC<StudentEntrySectionProps> = ({ onStartQuiz }) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [school, setSchool] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập họ và tên.");
      return;
    }
    onStartQuiz({
      name: name.trim(),
      className: className.trim(),
      school: school.trim()
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 mt-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-2 inline-block">
            Góc Học Sinh
          </span>
          <h2 className="text-2xl font-bold text-gray-800">Thông Tin Người Làm Bài</h2>
          <p className="text-gray-500 text-sm mt-1">Vui lòng nhập thông tin để bắt đầu.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="12A1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trường</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="THPT Chuyên..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition hover:-translate-y-0.5 hover:shadow-xl mt-4"
          >
            Bắt Đầu Làm Bài
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentEntrySection;
