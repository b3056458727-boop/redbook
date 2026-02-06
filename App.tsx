import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { analyzeContent } from './services/geminiService';
import { InputData, AnalysisResult } from './types';
import { FREE_DAILY_LIMIT } from './constants';

const App: React.FC = () => {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [inputData, setInputData] = useState<InputData | undefined>(undefined);
  const [resultData, setResultData] = useState<AnalysisResult | null>(null);
  const [remainingCredits, setRemainingCredits] = useState(FREE_DAILY_LIMIT);

  useEffect(() => {
    // Simple mock credit system persisting in session for MVP
    const savedCredits = sessionStorage.getItem('xhs_credits');
    if (savedCredits) {
      setRemainingCredits(parseInt(savedCredits, 10));
    }
  }, []);

  const handleAnalyze = async (data: InputData) => {
    if (remainingCredits <= 0) {
      alert("今日免费次数已用完");
      return;
    }

    setIsLoading(true);
    setInputData(data); // Save input to restore if needed

    try {
      const result = await analyzeContent(data);
      setResultData(result);
      setStep('result');
      
      // Deduct credit
      const newCredits = remainingCredits - 1;
      setRemainingCredits(newCredits);
      sessionStorage.setItem('xhs_credits', newCredits.toString());
      
    } catch (error) {
      console.error(error);
      alert("分析失败，请稍后重试。确保已配置API Key。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('input');
    setResultData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-gray-800 pb-10">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍠</span>
              <span className="font-bold text-xl text-brand-primary tracking-tight">小红薯笔记</span>
            </div>
            <div>
              {/* Placeholder for future user menu */}
              <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary text-xs font-bold">
                User
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'input' ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <InputForm 
              initialData={inputData} 
              onSubmit={handleAnalyze} 
              isLoading={isLoading}
              remainingCredits={remainingCredits}
            />
          </div>
        ) : (
          resultData && <ResultDisplay result={resultData} onReset={handleReset} />
        )}
      </main>

      {/* Simple Footer */}
      <footer className="text-center text-gray-400 text-xs py-6">
        <p>© 2024 小红薯种草笔记宝 | Powered by Gemini 3.0</p>
      </footer>
    </div>
  );
};

export default App;