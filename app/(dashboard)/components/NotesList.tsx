'use client';

import { useState } from 'react';

interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  author: { email: string };
}

interface NotesListProps {
  notes: Note[];
  onNoteDeleted: (noteId: string) => void;
}

export default function NotesList({ notes, onNoteDeleted }: NotesListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setDeletingId(noteId);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        onNoteDeleted(noteId);
      } else {
        alert('Failed to delete note');
      }
    } catch (error) {
      alert('Failed to delete note');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (notes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No notes yet. Create your first note!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div key={note.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{note.title}</h3>
            <button
              onClick={() => handleDelete(note.id)}
              disabled={deletingId === note.id}
              className="text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              {deletingId === note.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
          
          {note.content && (
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{note.content}</p>
          )}
          
          <div className="text-sm text-gray-500">
            <p>Created by: {note.author.email}</p>
            <p>Created at: {formatDate(note.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}