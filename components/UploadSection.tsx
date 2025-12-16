import React, { useState } from 'react';

interface UploadSectionProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onImageSelected, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Vui lòng chỉ tải lên file ảnh.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g., "data:image/jpeg;base64,")
      const base64Content = base64String.split(',')[1];
      onImageSelected(base64Content, file.type);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-2 inline-block">
          Góc Giáo Viên
        </span>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
          Tạo Đề Kiểm Tra AI
        </h1>
        <p className="text-gray-600 text-lg">
          Tải lên hình ảnh đề toán để hệ thống tự động tạo bài kiểm tra trắc nghiệm.
        </p>
      </div>

      <div
        className={`relative border-3 border-dashed rounded-2xl p-16 transition-all duration-300 ease-in-out text-center ${
          dragActive 
            ? "border-blue-500 bg-blue-50 scale-105" 
            : "border-gray-300 bg-white hover:bg-gray-50 shadow-sm"
        } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-blue-600 font-semibold text-lg animate-pulse">
                Đang phân tích đề bài và tạo câu hỏi...
              </p>
              <p className="text-sm text-gray-500 mt-2">Quá trình này có thể mất vài giây.</p>
            </div>
          ) : (
            <>
              <div className="bg-blue-100 p-6 rounded-full mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-700">
                  Kéo thả ảnh đề toán vào đây
                </p>
                <p className="text-gray-500 mt-1">hoặc</p>
              </div>
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl"
              >
                Chọn ảnh từ máy
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
