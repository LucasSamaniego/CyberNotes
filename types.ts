export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export enum AIActionType {
  SUMMARIZE = 'SUMMARIZE',
  EXPAND = 'EXPAND',
  FIX_GRAMMAR = 'FIX_GRAMMAR',
  CYBERPUNK_STYLE = 'CYBERPUNK_STYLE'
}

export interface AIResponse {
  text: string;
}
