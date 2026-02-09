import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FormData, GenerationResult } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Helper to convert file to base64
const fileToPart = (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateContent = async (data: FormData): Promise<GenerationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const textPrompt = `
    **输入信息：**
    1. **品牌/产品背景**：${data.brandContext}
    2. **营销目的**：${data.goal}
    3. **语气风格**：${data.tone}
    4. **是否有初始草稿**：${data.hasDraft ? '是' : '否'}
    ${data.hasDraft ? `- **初始草稿内容**：${data.draftContent}` : ''}
    5. **补充要点**：${data.extraPoints || '无'}
    
    请根据以上信息，结合系统指令，生成 Plan A 和 Plan B 两套文案。
  `;

  // Prepare contents array (Text + Images)
  const parts: any[] = [{ text: textPrompt }];
  
  if (data.images && data.images.length > 0) {
    // Only take up to 3 images to avoid payload limits if necessary, though Gemini handles more.
    // The prompt says "Max 9", but for API performance let's process the first few.
    const imagePromises = data.images.slice(0, 4).map(img => fileToPart(img.file));
    const imageParts = await Promise.all(imagePromises);
    parts.unshift(...imageParts); // Add images before text
  }

  const noteSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      content: { type: Type.STRING },
      tags: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ["title", "content", "tags"]
  };

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      planA: noteSchema,
      planB: noteSchema,
    },
    required: ["planA", "planB"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(text) as GenerationResult;
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};