export interface NoteContent {
  title: string;
  content: string;
  tags: string[];
}

export interface GenerationResult {
  planA: NoteContent;
  planB: NoteContent;
}

export interface FormData {
  brandContext: string;
  images: { file: File; preview: string }[];
  goal: string;
  tone: string;
  hasDraft: boolean;
  draftContent: string;
  extraPoints: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  data: FormData;
  result: GenerationResult;
}