import React, { useState } from 'react';
import { Note } from '../types';
import { NoteCard } from './NoteCard';
import { AddNoteModal } from './AddNoteModal';
import { Plus, Filter, Search } from 'lucide-react';

interface NotesViewProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditNote: (id: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onAddNote,
  onEditNote
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');

  const categories = ['todas', ...Array.from(new Set(notes.map(note => note.category)))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'todas' || note.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const priorityOrder = { 'alta': 3, 'média': 2, 'baixa': 1 };
    const aPriority = priorityOrder[a.priority];
    const bPriority = priorityOrder[b.priority];
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleNoteClick = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingNote) {
      onEditNote(editingNote.id, noteData);
    } else {
      onAddNote(noteData);
    }
    setEditingNote(undefined);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingNote(undefined);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Anotações Inteligentes</h1>
        <p className="text-gray-400">
          {notes.length} anotações • Organize suas ideias e insights
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Anotação
        </button>

        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar anotações..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-3 py-2 text-white placeholder-gray-400 focus:border-violet-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-violet-500 focus:outline-none"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'todas' ? 'Todas' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              {searchTerm || categoryFilter !== 'todas' 
                ? 'Nenhuma anotação encontrada' 
                : 'Nenhuma anotação ainda'
              }
            </div>
            <p className="text-gray-600 text-sm">
              {searchTerm || categoryFilter !== 'todas'
                ? 'Tente ajustar os filtros de busca'
                : 'Adicione sua primeira anotação!'
              }
            </p>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={handleNoteClick}
            />
          ))
        )}
      </div>

      <AddNoteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAdd={handleModalSubmit}
        editNote={editingNote}
      />
    </div>
  );
};