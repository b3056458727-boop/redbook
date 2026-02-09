import React, { useState } from 'react';
import { GenerationResult, FormData } from '../types';
import { ArrowLeft, Share2, Heart, Star, MessageCircle, Copy, Check, MoreHorizontal } from 'lucide-react';

interface ResultDisplayProps {
  result: GenerationResult;
  inputData: FormData;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, inputData, onReset }) => {
  const [activePlan, setActivePlan] = useState<'planA' | 'planB'>('planA');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const currentContent = result[activePlan];

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAll = () => {
    const fullText = `${currentContent.title}\n\n${currentContent.content}\n\n${currentContent.tags.join(' ')}`;
    handleCopy(fullText, 'all');
  };

  return (
    <div className="flex flex-col items-center animate-fade-in w-full pb-10">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 px-4">
        <button 
          onClick={onReset}
          className="flex items-center text-gray-500 hover:text-brand-primary transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-1" />
          返回修改
        </button>
        <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-100">
          <button
            onClick={() => setActivePlan('planA')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              activePlan === 'planA' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            方案 A: 核心策略
          </button>
          <button
            onClick={() => setActivePlan('planB')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              activePlan === 'planB' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            方案 B: 风格策略
          </button>
        </div>
      </div>

      {/* Phone Mockup */}
      <div className="relative w-full max-w-[420px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-900 overflow-hidden aspect-[9/19.5]">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-gray-900 rounded-b-2xl z-20"></div>

        {/* Status Bar Area (Mock) */}
        <div className="h-12 bg-white w-full"></div>

        {/* App Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-white sticky top-0 z-10">
          <ArrowLeft size={24} className="text-gray-800" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-200 to-pink-200 p-[1px]">
               <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                 <span className="text-xs">🍠</span>
               </div>
            </div>
            <span className="text-sm font-semibold text-gray-700">我的小红书</span>
            <button className="text-xs text-brand-primary border border-brand-primary px-3 py-1 rounded-full font-medium">
              关注
            </button>
          </div>
          <Share2 size={24} className="text-gray-800" />
        </div>

        {/* Content Area - Scrollable */}
        <div className="h-[calc(100%-140px)] overflow-y-auto no-scrollbar bg-white">
            {/* Image Carousel */}
            <div className="w-full aspect-[3/4] bg-gray-50 relative group">
                {inputData.images && inputData.images.length > 0 ? (
                    <img 
                        src={inputData.images[0].preview} 
                        alt="Product" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                            <span className="text-4xl">📷</span>
                        </div>
                        <p className="font-medium">No Image</p>
                    </div>
                )}
                {/* Dots indicator */}
                {inputData.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {inputData.images.map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/50'}`}></div>
                        ))}
                    </div>
                )}
            </div>

            {/* Note Content */}
            <div className="p-4 pb-20">
                <h1 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                    {currentContent.title}
                </h1>
                <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap space-y-4">
                    {currentContent.content}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {currentContent.tags.map((tag, i) => (
                        <span key={i} className="text-blue-600 text-sm">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="mt-6 text-xs text-gray-400">
                    发布于 上海
                </div>
            </div>
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between z-10 rounded-b-[2.5rem]">
            <div className="flex items-center gap-1 bg-gray-100 px-4 py-2 rounded-full text-gray-400 text-sm flex-1 mr-4">
                <span className="text-gray-400">说点什么...</span>
            </div>
            <div className="flex items-center gap-5 text-gray-700">
                <div className="flex flex-col items-center">
                    <Heart size={24} />
                    <span className="text-[10px] mt-0.5">0</span>
                </div>
                <div className="flex flex-col items-center">
                    <Star size={24} />
                    <span className="text-[10px] mt-0.5">0</span>
                </div>
                <div className="flex flex-col items-center">
                    <MessageCircle size={24} />
                    <span className="text-[10px] mt-0.5">0</span>
                </div>
            </div>
        </div>
      </div>

      {/* Action Buttons Below */}
      <div className="w-full max-w-[420px] mt-8 space-y-3">
          <div className="grid grid-cols-2 gap-3">
              <button 
                  onClick={() => handleCopy(currentContent.title, 'title')}
                  className="flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                  {copiedField === 'title' ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
                  {copiedField === 'title' ? '已复制' : '复制标题'}
              </button>
              <button 
                  onClick={() => handleCopy(`${currentContent.content}\n${currentContent.tags.join(' ')}`, 'content')}
                  className="flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                  {copiedField === 'content' ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
                  {copiedField === 'content' ? '已复制' : '复制正文'}
              </button>
          </div>
          <button 
              onClick={handleCopyAll}
              className={`w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                copiedField === 'all' ? 'bg-green-600' : 'bg-gray-900 hover:bg-black'
              }`}
          >
              {copiedField === 'all' ? (
                  <>
                    <Check size={20} />
                    <span>复制成功</span>
                  </>
              ) : (
                  <>
                    <Copy size={20} />
                    <span>一键复制全部</span>
                  </>
              )}
          </button>
      </div>
    </div>
  );
};

export default ResultDisplay;