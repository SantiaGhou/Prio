export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'baixa' | 'média' | 'alta';
  urgency: 'baixa' | 'média' | 'alta';
  impact: 'baixo' | 'médio' | 'alto';
  category: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  aiTip?: string;
  improvedText?: string;
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  priority: 'baixa' | 'média' | 'alta';
  urgency: 'baixa' | 'média' | 'alta';
  category: string;
  completed: boolean;
  createdAt: Date;
  aiTip?: string;
  improvedText?: string;
}

export interface AIResponse {
  priority: 'baixa' | 'média' | 'alta';
  urgency: 'baixa' | 'média' | 'alta';
  impact: 'baixo' | 'médio' | 'alto';
  improvedText: string;
  tip: string;
  category: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'baixa' | 'média' | 'alta';
  createdAt: Date;
  updatedAt: Date;
  aiTip?: string;
  improvedText?: string;
}