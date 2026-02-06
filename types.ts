export enum Purpose {
  GROWTH = '涨粉引流',
  CONVERSION = '商品转化',
  IP_BUILDING = '打造个人IP'
}

export interface SuggestionItem {
  type: string;
  priority: 'high' | 'medium' | 'low';
  original?: string;
  optimized?: string[];
  suggestion?: string;
  reason: string;
}

export interface ScoreBreakdown {
  title: number;
  opening: number;
  structure: number;
  engagement: number;
}

export interface AnalysisResult {
  score: number;
  scoreBreakdown: ScoreBreakdown;
  problems: string[];
  suggestions: SuggestionItem[];
  optimizedFullText: string;
  hashtags: string[];
}

export interface InputData {
  title: string;
  content: string;
  purpose: Purpose;
}

export interface HistoryItem extends InputData {
  id: string;
  timestamp: number;
  result: AnalysisResult;
}