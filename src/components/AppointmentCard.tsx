import React from 'react';
import { Appointment } from '../types';
import { CheckCircle2, Circle, Clock, AlertCircle, Lightbulb, Calendar } from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment;
  onToggle: (id: string) => void;
  onClick: (appointment: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onToggle, onClick }) => {
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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <div 
      className={`
        bg-gray-900 border border-gray-700 rounded-xl p-4 transition-all duration-200
        hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 cursor-pointer
        ${appointment.completed ? 'opacity-60' : ''}
      `}
      onClick={() => onClick(appointment)}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(appointment.id);
          }}
          className="mt-1 text-violet-400 hover:text-violet-300 transition-colors"
        >
          {appointment.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {appointment.category}
            </span>
            <div className={`text-xs px-2 py-1 rounded border ${getPriorityColor(appointment.priority)}`}>
              {appointment.priority}
            </div>
            {getUrgencyIcon(appointment.urgency)}
          </div>

          <h3 className={`font-medium mb-2 ${appointment.completed ? 'line-through text-gray-500' : 'text-white'}`}>
            {appointment.improvedText || appointment.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(appointment.startTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
            </div>
          </div>

          {appointment.description && (
            <p className="text-sm text-gray-400 mb-2">{appointment.description}</p>
          )}

          {appointment.aiTip && (
            <div className="flex items-start gap-2 bg-gray-800/50 rounded-lg p-2">
              <Lightbulb className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-300">{appointment.aiTip}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};