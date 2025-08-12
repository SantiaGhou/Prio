import React from 'react';
import { Task } from '../types';
import { CheckCircle2, Circle, Clock, AlertCircle, Lightbulb } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onClick: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onClick }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'text-red-400 border-red-400/30';
      case 'média': return 'text-yellow-400 border-yellow-400/30';
      default: return 'text-green-400 border-green-400/30';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'alta': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'média': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-green-400" />;
    }
  };

  return (
    <div 
      className={`
        bg-gray-900 border border-gray-700 rounded-xl p-4 transition-all duration-200
        hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 cursor-pointer
        ${task.completed ? 'opacity-60' : ''}
      `}
      onClick={() => onClick(task)}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          className="mt-1 text-violet-400 hover:text-violet-300 transition-colors"
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {task.category}
            </span>
            <div className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </div>
            {getUrgencyIcon(task.urgency)}
          </div>

          <h3 className={`font-medium mb-1 ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
            {task.improvedText || task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-gray-400 mb-2">{task.description}</p>
          )}

          {task.aiTip && (
            <div className="flex items-start gap-2 bg-gray-800/50 rounded-lg p-2">
              <Lightbulb className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-300">{task.aiTip}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};