import React, { useState } from 'react';
import { Appointment } from '../types';
import { AppointmentCard } from './AppointmentCard';
import { AddAppointmentModal } from './AddAppointmentModal';
import { Plus, Filter, Calendar } from 'lucide-react';

interface AgendaViewProps {
  appointments: Appointment[];
  onToggleAppointment: (id: string) => void;
  onAddAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  onEditAppointment: (id: string, appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  appointments,
  onToggleAppointment,
  onAddAppointment,
  onEditAppointment
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>();
  const [filter, setFilter] = useState<'todos' | 'pendentes' | 'concluídos'>('todos');

  const filteredAppointments = appointments.filter(appointment => {
    switch (filter) {
      case 'pendentes': return !appointment.completed;
      case 'concluídos': return appointment.completed;
      default: return true;
    }
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  const handleAppointmentClick = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    if (editingAppointment) {
      onEditAppointment(editingAppointment.id, appointmentData);
    } else {
      onAddAppointment(appointmentData);
    }
    setEditingAppointment(undefined);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAppointment(undefined);
  };

  const pendingAppointments = appointments.filter(a => !a.completed).length;
  const completedAppointments = appointments.filter(a => a.completed).length;

  const today = new Date();
  const todayAppointments = appointments.filter(a => {
    const appointmentDate = new Date(a.startTime);
    return appointmentDate.toDateString() === today.toDateString() && !a.completed;
  }).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Agenda Inteligente</h1>
        <p className="text-gray-400">
          {todayAppointments} hoje • {pendingAppointments} pendentes • {completedAppointments} concluídos
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Compromisso
        </button>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-violet-500 focus:outline-none"
          >
            <option value="todos">Todos</option>
            <option value="pendentes">Pendentes</option>
            <option value="concluídos">Concluídos</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {sortedAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">
              {filter === 'todos' ? 'Nenhum compromisso ainda' : `Nenhum compromisso ${filter}`}
            </div>
            <p className="text-gray-600 text-sm">
              {filter === 'todos' ? 'Adicione seu primeiro compromisso!' : 'Tente outro filtro'}
            </p>
          </div>
        ) : (
          sortedAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onToggle={onToggleAppointment}
              onClick={handleAppointmentClick}
            />
          ))
        )}
      </div>

      <AddAppointmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAdd={handleModalSubmit}
        editAppointment={editingAppointment}
      />
    </div>
  );
};