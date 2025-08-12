import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Note } from '../types';
import { aiService } from '../services/ai';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editNote?: Note;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  editNote
}) => {
  const [title, setTitle] = useState(editNote?.title || '');
  const [content, setContent] = useState(editNote?.content || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsAnalyzing(true);
    
    try {
      const aiResponse = await aiService.analyzeItem(title, 'note');
      
      const newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = {
        title: title.trim(),
        content: content.trim(),
        priority: aiResponse.priority,
        category: aiResponse.category,
        aiTip: aiResponse.tip,
        improvedText: aiResponse.improvedText
      };

      onAdd(newNote);
      setTitle('');
      setContent('');
      onClose();
    } catch (error) {
      console.error('Erro ao analisar anotação:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {editNote ? 'Editar Anotação' : 'Nova Anotação'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ideias para o projeto, Insights da reunião..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-violet-500 focus:outline-none transition-colors"
              required
              disabled={isAnalyzing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Conteúdo
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva suas anotações, ideias, insights..."
              rows={8}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-violet-500 focus:outline-none transition-colors resize-none"
              disabled={isAnalyzing}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-300 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              disabled={isAnalyzing}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isAnalyzing}
              className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                editNote ? 'Salvar' : 'Adicionar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};