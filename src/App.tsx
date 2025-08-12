import React, { useState, useEffect } from 'react';
import { Task, Appointment, Note } from './types';
import { TasksView } from './components/TasksView';
import { AgendaView } from './components/AgendaView';
import { NotesView } from './components/NotesView';
import { storageService } from './services/storage';
import { Brain, CheckSquare, Calendar, FileText, Zap } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'agenda' | 'notes'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [loadedTasks, loadedAppointments, loadedNotes] = await Promise.all([
        storageService.loadTasks(),
        storageService.loadAppointments(),
        storageService.loadNotes()
      ]);
      
      setTasks(loadedTasks);
      setAppointments(loadedAppointments);
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const saveTasks = async (newTasks: Task[]) => {
    try {
      await storageService.saveTasks(newTasks);
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  };

  const saveAppointments = async (newAppointments: Appointment[]) => {
    try {
      await storageService.saveAppointments(newAppointments);
    } catch (error) {
      console.error('Erro ao salvar compromissos:', error);
    }
  };

  const saveNotes = async (newNotes: Note[]) => {
    try {
      await storageService.saveNotes(newNotes);
    } catch (error) {
      console.error('Erro ao salvar anotações:', error);
    }
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const handleToggleTask = (id: string) => {
    const newTasks = tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date() : undefined
          }
        : task
    );
    
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const handleEditTask = (id: string, taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTasks = tasks.map(task =>
      task.id === id 
        ? { ...task, ...taskData }
        : task
    );
    
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const handleAddAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    const newAppointments = [...appointments, newAppointment];
    setAppointments(newAppointments);
    saveAppointments(newAppointments);
  };

  const handleToggleAppointment = (id: string) => {
    const newAppointments = appointments.map(appointment => 
      appointment.id === id 
        ? { 
            ...appointment, 
            completed: !appointment.completed
          }
        : appointment
    );
    
    setAppointments(newAppointments);
    saveAppointments(newAppointments);
  };

  const handleEditAppointment = (id: string, appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointments = appointments.map(appointment =>
      appointment.id === id 
        ? { ...appointment, ...appointmentData }
        : appointment
    );
    
    setAppointments(newAppointments);
    saveAppointments(newAppointments);
  };

  const handleAddNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const newNotes = [...notes, newNote];
    setNotes(newNotes);
    saveNotes(newNotes);
  };

  const handleEditNote = (id: string, noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNotes = notes.map(note =>
      note.id === id 
        ? { ...note, ...noteData, updatedAt: new Date() }
        : note
    );
    
    setNotes(newNotes);
    saveNotes(newNotes);
  };

  const pendingTasks = tasks.filter(t => !t.completed).length;
  const todayAppointments = appointments.filter(a => {
    const today = new Date();
    const appointmentDate = new Date(a.startTime);
    return appointmentDate.toDateString() === today.toDateString() && !a.completed;
  }).length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-violet-600 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Prio</h1>
                <p className="text-xs text-gray-400">Agenda Inteligente</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-400" />
                <span className="text-gray-400">IA ativa</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-800 sticky top-0 bg-black z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2
                ${activeTab === 'tasks' 
                  ? 'text-violet-400 border-violet-500' 
                  : 'text-gray-400 border-transparent hover:text-white'
                }
              `}
            >
              <CheckSquare className="w-4 h-4" />
              Tarefas
              {pendingTasks > 0 && (
                <span className="bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingTasks}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('agenda')}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2
                ${activeTab === 'agenda' 
                  ? 'text-violet-400 border-violet-500' 
                  : 'text-gray-400 border-transparent hover:text-white'
                }
              `}
            >
              <Calendar className="w-4 h-4" />
              Agenda
              {todayAppointments > 0 && (
                <span className="bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {todayAppointments}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2
                ${activeTab === 'notes' 
                  ? 'text-violet-400 border-violet-500' 
                  : 'text-gray-400 border-transparent hover:text-white'
                }
              `}
            >
              <FileText className="w-4 h-4" />
              Anotações
              {notes.length > 0 && (
                <span className="bg-gray-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {notes.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        {activeTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
          />
        )}
        
        {activeTab === 'agenda' && (
          <AgendaView
            appointments={appointments}
            onToggleAppointment={handleToggleAppointment}
            onAddAppointment={handleAddAppointment}
            onEditAppointment={handleEditAppointment}
          />
        )}
        
        {activeTab === 'notes' && (
          <NotesView
            notes={notes}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
          />
        )}
      </main>
    </div>
  );
}

export default App;