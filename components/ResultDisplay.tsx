import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ArrowLeft, Copy, Check, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface ResultDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onReset }) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52C41A';
    if (score >= 60) return '#FAAD14';
    return '#FF4D4F';
  };

  const scoreData = [
    { name: 'Score', value: result.score },
    { name: 'Remaining', value: 100 - result.score },
  ];

  const radarData = [
    { subject: '标题吸引力', A: result.scoreBreakdown.title, fullMark: 30 },
    { subject: '开篇设计', A: result.scoreBreakdown.opening, fullMark: 25 },
    { subject: '内容结构', A: result.scoreBreakdown.structure, fullMark: 25 },
    { subject: '互动设计', A: result.scoreBreakdown.engagement, fullMark: 20 },
  ];

  const handleCopy = (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in">
      <button 
        onClick={onReset}
        className="flex items-center text-gray-500 hover:text-brand-primary transition-colors font-medium mb-4"
      >
        <ArrowLeft size={18} className="mr-1" />
        返回继续诊断
      </button>

      {/* Header Score Card */}
      <div className="bg-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="text-brand-primary" />
            爆款指数
          </h2>
          <p className="text-gray-500 mt-2">
            {result.score >= 80 ? '太棒了！这篇笔记很有爆款潜质！' : 
             result.score >= 60 ? '还不错，优化一下更有机会！' : 
             '内容还有较大提升空间，加油！'}
          </p>
        </div>
        
        {/* Score Charts */}
        <div className="flex items-center gap-4 h-40">
           {/* Radar Chart for breakdown */}
           <div className="w-40 h-40">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                 <PolarGrid stroke="#eee" />
                 <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#666' }} />
                 <PolarRadiusAxis angle={30} domain={[0, 30]} tick={false} axisLine={false} />
                 <Radar name="Score" dataKey="A" stroke="#FF2442" fill="#FF2442" fillOpacity={0.4} />
               </RadarChart>
             </ResponsiveContainer>
           </div>

           {/* Donut Chart for total score */}
          <div className="w-32 h-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={55}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell key="cell-0" fill={getScoreColor(result.score)} />
                  <Cell key="cell-1" fill="#f3f3f3" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: getScoreColor(result.score) }}>
                {result.score}
              </span>
              <span className="text-xs text-gray-400">总分</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problems & Suggestions Column */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Major Problems */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="text-orange-500" size={20} />
                    主要问题
                </h3>
                <ul className="space-y-2">
                    {result.problems.map((problem, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"></span>
                            {problem}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Optimization Suggestions */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Check className="text-brand-primary" size={20} />
                    优化建议
                </h3>
                <div className="space-y-6">
                    {result.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-brand-light text-brand-primary px-2 py-0.5 rounded text-xs font-semibold">
                                    {suggestion.type === 'title' ? '标题' : 
                                     suggestion.type === 'opening' ? '开篇' : 
                                     suggestion.type === 'structure' ? '结构' : '互动'}
                                </span>
                                {suggestion.priority === 'high' && (
                                    <span className="text-xs text-red-500 font-medium">✨ 强烈推荐</span>
                                )}
                            </div>
                            
                            {/* Compare Original vs Optimized if available */}
                            {suggestion.original && suggestion.optimized && (
                                <div className="space-y-3 bg-gray-50 rounded-xl p-4 mb-3">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">❌ 原文</p>
                                        <p className="text-sm text-gray-600 line-through decoration-gray-400">{suggestion.original}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-brand-primary mb-1">✅ 建议改写</p>
                                        <ul className="space-y-2">
                                            {suggestion.optimized.map((opt, i) => (
                                                <li key={i} className="text-sm text-gray-900 font-medium bg-white p-2 rounded border border-gray-100 shadow-sm">
                                                    {opt}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {suggestion.suggestion && (
                                <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-lg border-l-4 border-brand-primary mb-2">
                                    {suggestion.suggestion}
                                </p>
                            )}

                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                💡 <span className="italic">{suggestion.reason}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Full Optimized Text Column */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg border-2 border-brand-light overflow-hidden sticky top-6">
                <div className="bg-brand-light/30 px-6 py-4 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">📝 完整优化版</h3>
                    <button
                        onClick={() => handleCopy(result.optimizedFullText, setCopiedText)}
                        className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all ${
                            copiedText ? 'bg-green-100 text-green-600' : 'bg-brand-primary text-white hover:bg-brand-dark'
                        }`}
                    >
                        {copiedText ? <Check size={12} /> : <Copy size={12} />}
                        {copiedText ? '已复制' : '复制全文'}
                    </button>
                </div>
                
                <div className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                        {result.optimizedFullText}
                    </pre>
                </div>

                {/* Hashtags Section */}
                {result.hashtags && result.hashtags.length > 0 && (
                    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-gray-500">推荐标签</span>
                            <button
                                onClick={() => handleCopy(result.hashtags.join(' '), setCopiedTags)}
                                className="text-brand-primary text-xs hover:underline"
                            >
                                {copiedTags ? '已复制' : '复制标签'}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {result.hashtags.map((tag, idx) => (
                                <span key={idx} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <button 
                onClick={onReset}
                className="w-full mt-6 py-3 bg-white border border-brand-primary text-brand-primary rounded-full font-bold shadow-sm hover:bg-brand-light transition-colors flex items-center justify-center gap-2"
            >
                <RefreshCw size={18} />
                再诊断一篇
            </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;