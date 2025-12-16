import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.INTEGER },
      text: { type: Type.STRING, description: "Nội dung câu hỏi toán học bằng tiếng Việt. Công thức toán phải dùng LaTeX trong dấu $." },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Danh sách 4 lựa chọn trả lời (A, B, C, D). Công thức toán phải dùng LaTeX trong dấu $."
      },
      correctIndex: { type: Type.INTEGER, description: "Chỉ số của đáp án đúng (0-3)" },
      explanation: { type: Type.STRING, description: "Giải thích chi tiết tại sao đáp án này đúng bằng tiếng Việt. Công thức toán phải dùng LaTeX trong dấu $." }
    },
    required: ["id", "text", "options", "correctIndex", "explanation"],
  }
};

export const generateQuizFromImage = async (base64Image: string, mimeType: string): Promise<Question[]> => {
  try {
    const prompt = `
      Bạn là một gia sư toán học chuyên nghiệp.
      Nhiệm vụ: Phân tích hình ảnh đề toán được cung cấp và tạo ra một bộ đề trắc nghiệm hoàn chỉnh gồm 10 câu hỏi.

      HƯỚNG DẪN XỬ LÝ:
      1. **Trích xuất chính xác**: Nếu trong ảnh có sẵn các câu hỏi hoặc bài tập, hãy ưu tiên trích xuất nội dung của chúng làm câu hỏi cho bài kiểm tra.
      2. **Giữ nguyên công thức**: Khi trích xuất từ ảnh, hãy **GIỮ NGUYÊN TUYỆT ĐỐI** các công thức toán học, số liệu, biểu thức và ký hiệu y hệt như trong ảnh. Không được tự ý làm tròn hay thay đổi đề bài gốc.
      3. **Tạo thêm (nếu thiếu)**: Nếu ảnh không đủ 10 câu hỏi, hãy tự sáng tạo thêm các câu hỏi mới có **cùng dạng, cùng chủ đề và cùng độ khó** với bài toán trong ảnh để đảm bảo tổng cộng có đủ 10 câu.
      
      YÊU CẦU ĐỊNH DẠNG:
      1. Ngôn ngữ: Tiếng Việt.
      2. Số lượng: Trả về đúng 10 câu hỏi.
      3. Trắc nghiệm: Mỗi câu phải có 4 phương án lựa chọn (A, B, C, D).
      4. **LaTeX**: TẤT CẢ các công thức toán, biểu thức, biến số (x, y, n...), phân số, số mũ... PHẢI được viết dưới dạng mã **LaTeX** và đặt trong cặp dấu $ (ví dụ: $x^2 - 4x + 3 = 0$, $\\frac{a}{b}$, $\\sqrt{x}$).
      5. Giải thích: Cung cấp lời giải thích chi tiết, logic cho đáp án đúng.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.5, // Lower temperature to be more faithful to the image
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Không nhận được phản hồi từ AI.");
    }

    const questions: Question[] = JSON.parse(jsonText);
    return questions;

  } catch (error) {
    console.error("Lỗi khi tạo câu hỏi:", error);
    throw error;
  }
};
