import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { generateContent } from './services/geminiService';
import { FormData, GenerationResult } from './types';
import { Settings, X } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [inputData, setInputData] = useState<FormData | null>(null);
  const [resultData, setResultData] = useState<GenerationResult | null>(null);
  
  // Brand Context State (Global settings)
  const [brandContext, setBrandContext] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleGenerate = async (data: FormData) => {
    setIsLoading(true);
    setInputData(data);
    try {
      const result = await generateContent(data);
      setResultData(result);
      setStep('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert("生成失败，请检查 API Key 设置或重试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('input');
    setResultData(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-gray-800 font-sans relative">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-18 items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF2442] to-[#FF4D6A] rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                <span className="text-white text-xl font-bold">📖</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-gray-900 tracking-tight leading-none">小红书营销大师</span>
                <span className="text-xs text-gray-500 mt-1 font-medium">AI 驱动的爆款内容生成引擎</span>
              </div>
            </div>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-400 hover:text-[#FF2442] hover:bg-[#FF2442]/5 rounded-full transition-all"
              title="设置品牌背景"
            >
              <Settings size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in px-4">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-6 shadow-2xl transform transition-all scale-100 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Settings size={20} className="text-[#FF2442]" />
                企业/品牌背景设置
              </h2>
              <button 
                onClick={() => setShowSettings(false)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
             <div className="space-y-4">
               <label className="block text-gray-600 font-medium text-sm">
                 在此输入通用的品牌或企业背景信息（选填），生成时将自动带入。
               </label>
               <textarea
                  value={brandContext}
                  onChange={(e) => setBrandContext(e.target.value)}
                  placeholder="请输入企业简介、核心产品、目标人群等信息..."
                  className="w-full h-48 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:border-[#FF2442] focus:ring-1 focus:ring-[#FF2442] outline-none resize-none text-gray-700 placeholder-gray-400"
                />
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full py-3.5 bg-[#FF2442] hover:bg-[#FF2442]/90 text-white rounded-full font-bold text-lg shadow-lg shadow-[#FF2442]/20 transition-all active:scale-[0.98]"
                >
                  保存设置
                </button>
             </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {step === 'input' ? (
          <InputForm 
            onSubmit={handleGenerate} 
            isLoading={isLoading}
            brandContext={brandContext}
          />
        ) : (
          resultData && inputData && (
            <ResultDisplay 
              result={resultData} 
              inputData={inputData}
              onReset={handleReset} 
            />
          )
        )}
      </main>

      <footer className="text-center text-gray-400 text-xs py-8">
        <p>© 2024 小红书营销大师 | Powered by Gemini 3.0</p>
      </footer>
    </div>
  );
};

export default App;