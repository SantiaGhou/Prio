import React, { useState } from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { AddTaskModal } from './AddTaskModal';
import { Plus, Filter } from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onEditTask: (id: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onEditTask
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filter, setFilter] = useState<'todas' | 'pendentes' | 'concluídas'>('todas');

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pendentes': return !task.completed;
      case 'concluídas': return task.completed;
      default: return true;
    }
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const priorityOrder = { 'alta': 3, 'média': 2, 'baixa': 1 };
    const urgencyOrder = { 'alta': 3, 'média': 2, 'baixa': 1 };
    
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    const aUrgency = urgencyOrder[a.urgency];
    const bUrgency = urgencyOrder[b.urgency];
    
    return bUrgency - aUrgency;
  });

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      onEditTask(editingTask.id, taskData);
    } else {
      onAddTask(taskData);
    }
    setEditingTask(undefined);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const pendingTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Tarefas Inteligentes</h1>
        <p className="text-gray-400">
          {pendingTasks} pendentes • {completedTasks} concluídas
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Tarefa
        </button>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-violet-500 focus:outline-none"
          >
            <option value="todas">Todas</option>
            <option value="pendentes">Pendentes</option>
            <option value="concluídas">Concluídas</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              {filter === 'todas' ? 'Nenhuma tarefa ainda' : `Nenhuma tarefa ${filter}`}
            </div>
            <p className="text-gray-600 text-sm">
              {filter === 'todas' ? 'Adicione sua primeira tarefa!' : 'Tente outro filtro'}
            </p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onClick={handleTaskClick}
            />
          ))
        )}
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAdd={handleModalSubmit}
        editTask={editingTask}
      />
    </div>
  );
};