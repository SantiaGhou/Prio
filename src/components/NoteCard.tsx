import React from 'react';
import { Note } from '../types';
import { FileText, Lightbulb, Edit3 } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onClick }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'text-red-400 border-red-400/30';
      case 'média': return 'text-yellow-400 border-yellow-400/30';
      default: return 'text-green-400 border-green-400/30';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className="bg-gray-900 border border-gray-700 rounded-xl p-4 transition-all duration-200 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 cursor-pointer group"
      onClick={() => onClick(note)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <FileText className="w-5 h-5 text-violet-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {note.category}
            </span>
            <div className={`text-xs px-2 py-1 rounded border ${getPriorityColor(note.priority)}`}>
              {note.priority}
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit3 className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <h3 className="font-medium text-white mb-2">
            {note.improvedText || note.title}
          </h3>

          {note.content && (
            <p className="text-sm text-gray-400 mb-3 line-clamp-3">
              {note.content}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Criado em {formatDate(note.createdAt)}</span>
            {note.updatedAt && note.updatedAt !== note.createdAt && (
              <span>Editado em {formatDate(note.updatedAt)}</span>
            )}
          </div>

          {note.aiTip && (
            <div className="flex items-start gap-2 bg-gray-800/50 rounded-lg p-2">
              <Lightbulb className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-300">{note.aiTip}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};