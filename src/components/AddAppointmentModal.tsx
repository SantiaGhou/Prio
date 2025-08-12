import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Appointment } from '../types';
import { aiService } from '../services/ai';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  editAppointment?: Appointment;
}

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  editAppointment
}) => {
  const [title, setTitle] = useState(editAppointment?.title || '');
  const [description, setDescription] = useState(editAppointment?.description || '');
  const [startTime, setStartTime] = useState(
    editAppointment ? new Date(editAppointment.startTime).toISOString().slice(0, 16) : ''
  );
  const [endTime, setEndTime] = useState(
    editAppointment ? new Date(editAppointment.endTime).toISOString().slice(0, 16) : ''
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime || !endTime) return;

    setIsAnalyzing(true);
    
    try {
      const aiResponse = await aiService.analyzeItem(title, 'appointment');
      
      const newAppointment: Omit<Appointment, 'id' | 'createdAt'> = {
        title: title.trim(),
        description: description.trim() || undefined,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        priority: aiResponse.priority,
        urgency: aiResponse.urgency,
        category: aiResponse.category,
        completed: editAppointment?.completed || false,
        aiTip: aiResponse.tip,
        improvedText: aiResponse.improvedText
      };

      onAdd(newAppointment);
      setTitle('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      onClose();
    } catch (error) {
      console.error('Erro ao analisar compromisso:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {editAppointment ? 'Editar Compromisso' : 'Novo Compromisso'}
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
              placeholder="Ex: Reunião com cliente"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-violet-500 focus:outline-none transition-colors"
              required
              disabled={isAnalyzing}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Início *
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-violet-500 focus:outline-none transition-colors"
                required
                disabled={isAnalyzing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fim *
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-violet-500 focus:outline-none transition-colors"
                required
                disabled={isAnalyzing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre o compromisso..."
              rows={3}
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
              disabled={!title.trim() || !startTime || !endTime || isAnalyzing}
              className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                editAppointment ? 'Salvar' : 'Adicionar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};