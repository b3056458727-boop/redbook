import React, { useState } from 'react';
import { InputData, Purpose } from '../types';
import { TITLE_LIMIT, CONTENT_LIMIT, PURPOSE_OPTIONS } from '../constants';
import { ArrowRight, Sparkles } from 'lucide-react';

interface InputFormProps {
  initialData?: InputData;
  onSubmit: (data: InputData) => void;
  isLoading: boolean;
  remainingCredits: number;
}

const InputForm: React.FC<InputFormProps> = ({ initialData, onSubmit, isLoading, remainingCredits }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [purpose, setPurpose] = useState<Purpose>(initialData?.purpose || Purpose.GROWTH);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title, content, purpose });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-8 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🎯 小红薯种草笔记宝</h2>
        <p className="text-gray-500 text-sm">让每篇笔记都更有吸引力</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            标题 <span className="text-brand-primary">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入你的标题（例如：我用这个方法3个月瘦了10斤）"
              maxLength={TITLE_LIMIT}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-light transition-all outline-none"
              disabled={isLoading}
            />
            <span className="absolute right-3 top-3 text-xs text-gray-400">
              {title.length}/{TITLE_LIMIT}
            </span>
          </div>
        </div>

        {/* Content Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            正文 <span className="text-brand-primary">*</span>
          </label>
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="粘贴你的正文内容..."
              maxLength={CONTENT_LIMIT}
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-light transition-all outline-none resize-none"
              disabled={isLoading}
            />
            <span className="absolute right-3 bottom-3 text-xs text-gray-400">
              {content.length}/{CONTENT_LIMIT}
            </span>
          </div>
        </div>

        {/* Purpose Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">创作目的</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PURPOSE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPurpose(opt.value)}
                className={`relative p-4 rounded-xl border text-left transition-all ${
                  purpose === opt.value
                    ? 'border-brand-primary bg-brand-light/20 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                disabled={isLoading}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{opt.icon}</span>
                  <span className={`font-medium ${purpose === opt.value ? 'text-brand-primary' : 'text-gray-700'}`}>
                    {opt.label}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{opt.desc}</p>
                {purpose === opt.value && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-primary"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !title.trim() || !content.trim() || remainingCredits <= 0}
            className={`w-full py-4 rounded-full font-bold text-white text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg ${
              isLoading || remainingCredits <= 0
                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                : 'bg-brand-primary hover:bg-brand-dark shadow-brand-primary/30'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>AI正在分析...</span>
              </>
            ) : remainingCredits <= 0 ? (
              <span>今日次数已用完</span>
            ) : (
              <>
                <Sparkles size={20} />
                <span>开始诊断</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
          <div className="mt-4 flex justify-between items-center text-xs text-gray-400 px-2">
            <span>💎 今日剩余次数：{remainingCredits}次</span>
            <span>AI 模型提供智能支持</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputForm;