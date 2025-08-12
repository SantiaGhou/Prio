import { AIResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export class AIService {
  async analyzeItem(text: string, type: 'task' | 'appointment' | 'note'): Promise<AIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, type }),
      });

      if (!response.ok) {
        throw new Error('Erro na análise da IA');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao conectar com IA:', error);
      
      // Fallback local
      return this.fallbackAnalysis(text, type);
    }
  }

  private fallbackAnalysis(text: string, type: 'task' | 'appointment' | 'note'): AIResponse {
    const lowerText = text.toLowerCase();
    
    const priority = this.analyzePriority(lowerText);
    const urgency = this.analyzeUrgency(lowerText);
    const impact = this.analyzeImpact(lowerText);
    const category = this.detectCategory(lowerText, type);
    const improvedText = text.charAt(0).toUpperCase() + text.slice(1);
    const tip = this.generateFallbackTip(category);

    return {
      priority,
      urgency,
      impact,
      improvedText,
      tip,
      category
    };
  }

  private detectCategory(text: string, type: 'task' | 'appointment' | 'note'): string {
    if (type === 'note') return 'Anotações';
    if (type === 'appointment') return 'Reunião';
    
    const categories = ['Trabalho', 'Estudos', 'Saúde', 'Família', 'Academia'];
    for (const cat of categories) {
      if (text.includes(cat.toLowerCase())) return cat;
    }
    return 'Pessoal';
  }

  private analyzePriority(text: string): 'baixa' | 'média' | 'alta' {
    const highPriority = ['urgente', 'importante', 'crítico', 'prioridade', 'deadline'];
    const mediumPriority = ['moderado', 'médio', 'normal'];
    
    if (highPriority.some(word => text.includes(word))) return 'alta';
    if (mediumPriority.some(word => text.includes(word))) return 'média';
    return 'baixa';
  }

  private analyzeUrgency(text: string): 'baixa' | 'média' | 'alta' {
    const urgent = ['hoje', 'agora', 'imediato', 'urgente', 'rápido'];
    const medium = ['amanhã', 'esta semana', 'breve'];
    
    if (urgent.some(word => text.includes(word))) return 'alta';
    if (medium.some(word => text.includes(word))) return 'média';
    return 'baixa';
  }

  private analyzeImpact(text: string): 'baixo' | 'médio' | 'alto' {
    const highImpact = ['projeto', 'apresentação', 'cliente', 'entrega', 'exame'];
    const mediumImpact = ['reunião', 'tarefa', 'atividade'];
    
    if (highImpact.some(word => text.includes(word))) return 'alto';
    if (mediumImpact.some(word => text.includes(word))) return 'médio';
    return 'baixo';
  }

  private generateFallbackTip(category: string): string {
    const tips = {
      'Trabalho': 'Elimine distrações e defina metas claras.',
      'Estudos': 'Use a técnica Pomodoro: 25min foco + 5min pausa.',
      'Academia': 'Faça aquecimento e mantenha-se hidratado.',
      'Reunião': 'Prepare uma agenda clara com pontos principais.',
      'Anotações': 'Organize suas ideias de forma clara e estruturada.'
    };
    
    return tips[category as keyof typeof tips] || [
      'Mantenha o foco no objetivo principal',
    ][0];
  }
}

export const aiService = new AIService();