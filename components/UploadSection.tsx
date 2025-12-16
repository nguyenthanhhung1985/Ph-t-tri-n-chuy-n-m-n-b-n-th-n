import React, { useState } from 'react';

interface UploadSectionProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  isLoading: boolean;
  hasActiveQuiz?: boolean;
  onTestQuiz?: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ 
  onImageSelected, 
  isLoading, 
  hasActiveQuiz = false, 
  onTestQuiz 
}) => {
  const [dragActive, setDragActive] = useState(false);
  // If there is an active quiz, we start in "Dashboard" mode (isUploading = false).
  // If no quiz, we start in "Upload" mode (isUploading = true).
  const [isUploading, setIsUploading] = useState(!hasActiveQuiz);

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

  // If loading, force show the upload view structure (loading state)
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Đang Xử Lý
            </h1>
        </div>
        <div className="relative border-3 border-dashed border-gray-300 bg-white rounded-2xl p-16 text-center opacity-50 pointer-events-none">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-blue-600 font-semibold text-lg animate-pulse">
                Đang phân tích đề bài và tạo câu hỏi...
              </p>
              <p className="text-sm text-gray-500 mt-2">Quá trình này có thể mất vài giây.</p>
            </div>
        </div>
      </div>
    );
  }

  // Dashboard View (Active Quiz Exists)
  if (!isUploading && hasActiveQuiz) {
      return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <div className="text-center mb-10">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-2 inline-block">
                Góc Giáo Viên
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                Quản Lý Đề Thi
                </h1>
                <p className="text-gray-600">
                Hiện đang có một đề thi đang hoạt động.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                    onClick={onTestQuiz}
                    className="flex flex-col items-center justify-center p-8 bg-white border-2 border-blue-100 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all group"
                >
                    <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Làm Thử Đề Thi</h3>
                    <p className="text-sm text-gray-500 text-center">
                        Kiểm tra lại nội dung đề thi với tư cách là người làm bài.
                    </p>
                </button>

                <button 
                    onClick={() => setIsUploading(true)}
                    className="flex flex-col items-center justify-center p-8 bg-white border-2 border-gray-100 rounded-2xl hover:border-gray-400 hover:shadow-lg transition-all group"
                >
                    <div className="h-16 w-16 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-600 group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Tạo Đề Mới</h3>
                    <p className="text-sm text-gray-500 text-center">
                        Tải lên hình ảnh mới để thay thế đề thi hiện tại.
                    </p>
                </button>
            </div>
            
            <div className="mt-8 text-center">
                 <p className="text-sm text-gray-400">
                    Lưu ý: Tạo đề mới sẽ xóa kết quả xếp hạng hiện tại.
                 </p>
            </div>
        </div>
      );
  }

  // Upload View
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
        }`}
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
        </div>
        
        {hasActiveQuiz && (
            <button 
                onClick={() => setIsUploading(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                title="Quay lại"
            >
                ✕
            </button>
        )}
      </div>
    </div>
  );
};

export default UploadSection;