import { GoogleGenAI } from "@google/genai";
import { InputData, AnalysisResult } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

export const analyzeContent = async (data: InputData): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set REACT_APP_GEMINI_API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    **输入信息：**
    - 标题：${data.title}
    - 正文：${data.content}
    - 创作目的：${data.purpose}
    
    请根据系统指令进行详细分析并以JSON格式返回。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(text) as AnalysisResult;
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};