'use client';

import { useEffect, useState } from 'react';
import NoteForm from './components/NoteForm';
import NotesList from './components/NotesList';

interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  author: { email: string };
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/notes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setNotes(data.data);
      } else {
        setError('Failed to fetch notes');
      }
    } catch (err) {
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNoteCreated = () => {
    fetchNotes(); // Refresh the list
  };

  const handleNoteDeleted = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Notes</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <NotesList 
              notes={notes} 
              onNoteDeleted={handleNoteDeleted}
            />
          </div>
          <div>
            <NoteForm onNoteCreated={handleNoteCreated} />
          </div>
        </div>
      </div>
    </div>
  );
}