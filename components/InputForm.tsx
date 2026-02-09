import React, { useState, useRef, useEffect } from 'react';
import { FormData } from '../types';
import { GOAL_OPTIONS, TONE_OPTIONS } from '../constants';
import { Upload, ChevronDown, Check, Sparkles } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  brandContext: string;
}

// Custom Select Component to match the screenshot style
const CustomSelect = ({ 
  label, 
  value, 
  options, 
  onChange, 
  disabled 
}: { 
  label: string; 
  value: string; 
  options: { value: string; label: string }[]; 
  onChange: (value: string) => void;
  disabled: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.label === value) || options[0];

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="block font-bold text-gray-800 text-lg">{label}</label>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-3.5 rounded-2xl border bg-white flex items-center justify-between cursor-pointer transition-all ${
          isOpen ? 'border-[#FF2442] ring-1 ring-[#FF2442]' : 'border-gray-200 hover:border-gray-300'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <span className="text-gray-800 font-medium">{selectedOption.label}</span>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up origin-top">
          {options.map((opt) => {
            const isSelected = opt.label === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.label);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                  isSelected 
                    ? 'bg-[#FF2442]/5 text-[#FF2442]' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className={`font-medium ${isSelected ? 'font-bold' : ''}`}>
                  {opt.label}
                </span>
                {isSelected && <Check size={18} className="text-[#FF2442]" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, brandContext }) => {
  const [formData, setFormData] = useState<Omit<FormData, 'brandContext'>>({
    images: [],
    goal: GOAL_OPTIONS[0].label,
    tone: TONE_OPTIONS[0].label,
    hasDraft: false,
    draftContent: '',
    extraPoints: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof Omit<FormData, 'brandContext'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file: File) => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles].slice(0, 9)
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Merge global brand context with form data
    const finalData: FormData = {
      ...formData,
      brandContext: brandContext
    };

    onSubmit(finalData);
  };

  // Validation: Images required, Extra points required
  const isValid = formData.images.length > 0 && formData.extraPoints.trim().length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Sparkles className="text-[#FF2442] fill-[#FF2442]" />
          <h1>营销文案生成器</h1>
        </div>
        <p className="text-gray-500">告诉 AI 你的产品是什么，一键生成双策略爆款笔记</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
        
        {/* Image Upload - Now Required */}
        <div className="space-y-3">
          <label className="block font-bold text-gray-800 text-lg">
            上传配图 <span className="text-[#FF2442] font-normal text-sm ml-1">(必填)</span>
          </label>
          <div className={`border-2 border-dashed rounded-2xl p-8 transition-colors bg-white ${
            formData.images.length === 0 ? 'border-[#FFB3C0] hover:bg-[#FFF1F3]/50' : 'border-[#FF2442] bg-[#FFF1F3]/10'
          }`}>
            {formData.images.length === 0 ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center cursor-pointer py-4"
              >
                <div className="w-16 h-16 bg-[#FFF1F3] rounded-full flex items-center justify-center mb-4 text-[#FF2442] shadow-sm animate-pulse-slow">
                  <Upload size={28} />
                </div>
                <p className="text-gray-800 font-bold text-lg">点击上传图片</p>
                <p className="text-gray-400 text-sm mt-1">支持 JPG, PNG (最多 9 张)</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-gray-100">
                    <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                {formData.images.length < 9 && (
                   <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#FF2442] hover:bg-[#FFF1F3] transition-all group"
                   >
                     <span className="text-3xl text-gray-300 group-hover:text-[#FF2442] transition-colors">+</span>
                   </div>
                )}
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/png, image/jpeg"
              multiple 
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* Custom Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <CustomSelect 
            label="营销目的"
            value={formData.goal}
            options={GOAL_OPTIONS}
            onChange={(val) => handleInputChange('goal', val)}
            disabled={isLoading}
          />
          
          <CustomSelect 
            label="语气风格"
            value={formData.tone}
            options={TONE_OPTIONS}
            onChange={(val) => handleInputChange('tone', val)}
            disabled={isLoading}
          />
        </div>

        {/* Draft Checkbox */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
              formData.hasDraft 
                ? 'bg-[#FF2442] border-[#FF2442] shadow-sm' 
                : 'border-gray-300 bg-white group-hover:border-[#FF2442]'
            }`}>
              {formData.hasDraft && <Check size={14} className="text-white" />}
            </div>
            <input 
              type="checkbox" 
              className="hidden"
              checked={formData.hasDraft}
              onChange={(e) => handleInputChange('hasDraft', e.target.checked)}
            />
            <span className="font-bold text-gray-800 text-lg">我已有初始草稿/想法 <span className="text-gray-400 font-normal text-sm ml-1">(可选)</span></span>
          </label>
          
          {formData.hasDraft && (
            <div className="mt-4 animate-fade-in">
              <textarea
                value={formData.draftContent}
                onChange={(e) => handleInputChange('draftContent', e.target.value)}
                placeholder="请输入你的初始想法或草稿..."
                className="w-full h-28 px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#FF2442] focus:ring-1 focus:ring-[#FF2442] outline-none resize-none text-gray-700 bg-gray-50/50"
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        {/* Key Points Supplement - Required */}
        <div className="space-y-3">
          <label className="block font-bold text-gray-800 text-lg">要点补充 <span className="text-[#FF2442] font-normal text-sm ml-1">(必填)</span></label>
          <input
            type="text"
            value={formData.extraPoints}
            onChange={(e) => handleInputChange('extraPoints', e.target.value)}
            placeholder="例如：本次活动打8折，限时3天..."
            className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-[#FF2442] focus:ring-1 focus:ring-[#FF2442] outline-none text-gray-700"
            disabled={isLoading}
          />
        </div>

      </form>

      {/* Submit Action */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || !isValid}
        className={`w-full py-4 rounded-full font-bold text-white text-xl flex items-center justify-center gap-2 transition-all shadow-lg transform ${
          isLoading || !isValid
            ? 'bg-gray-300 cursor-not-allowed shadow-none' 
            : 'bg-[#FF2442] hover:bg-[#FF2442]/90 shadow-[#FF2442]/30 active:scale-[0.99] hover:-translate-y-0.5'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>AI 正在生成双策略方案...</span>
          </>
        ) : (
          <>
            <Sparkles size={24} />
            <span>一键生成 (AB 方案)</span>
          </>
        )}
      </button>
    </div>
  );
};

export default InputForm;