import React, { useState, useEffect } from 'react';
import { useMovies } from '../context/MovieContext';
import { X, Save, Edit3 } from 'lucide-react';

export const EditMovieModal = () => {
  const { editingMovie, setEditingMovie, updateMovie } = useMovies();

  const [formData, setFormData] = useState({
    title: '',
    director: '',
    releaseYear: 2024,
    genres: 'Action',
    imdbRating: 8.0,
    runtime: '2h 00m',
    posterUrl: '',
    description: ''
  });

  useEffect(() => {
    if (editingMovie) {
      setFormData({
        title: editingMovie.title || '',
        director: editingMovie.director || '',
        releaseYear: editingMovie.releaseYear || 2024,
        genres: Array.isArray(editingMovie.genres) ? editingMovie.genres.join(', ') : (editingMovie.genres || ''),
        imdbRating: editingMovie.imdbRating || 8.0,
        runtime: editingMovie.runtime || '',
        posterUrl: editingMovie.posterUrl || '',
        description: editingMovie.description || ''
      });
    }
  }, [editingMovie]);

  if (!editingMovie) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const movieId = editingMovie.id || editingMovie._id;
    updateMovie(movieId, {
      ...formData,
      releaseYear: Number(formData.releaseYear),
      imdbRating: Number(formData.imdbRating),
      genres: formData.genres.split(',').map(g => g.trim()).filter(Boolean)
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto"
      onClick={() => setEditingMovie(null)}
    >
      <div
        className="bg-white border-2 border-gray-400 max-w-xl w-full p-6 shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-300">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Edit Movie Details</h3>
          </div>
          <button
            onClick={() => setEditingMovie(null)}
            className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 border border-gray-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Movie Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-1.5 bg-white border border-gray-400 text-sm text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Director</label>
              <input
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
                required
                className="w-full px-3 py-1.5 bg-white border border-gray-400 text-sm text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Release Year</label>
              <input
                type="number"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                required
                className="w-full px-3 py-1.5 bg-white border border-gray-400 text-sm text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rating (1.0 - 10.0)</label>
              <input
                type="number"
                step="0.1"
                name="imdbRating"
                value={formData.imdbRating}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full px-3 py-1.5 bg-white border border-gray-400 text-sm text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Runtime</label>
              <input
                type="text"
                name="runtime"
                value={formData.runtime}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-white border border-gray-400 text-sm text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Genres (comma separated)</label>
            <input
              type="text"
              name="genres"
              value={formData.genres}
              onChange={handleChange}
              placeholder="e.g. Action, Sci-Fi"
              className="w-full px-3 py-1.5 bg-white border border-gray-400 text-sm text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Poster URL</label>
            <input
              type="url"
              name="posterUrl"
              value={formData.posterUrl}
              onChange={handleChange}
              className="w-full px-3 py-1.5 bg-white border border-gray-400 text-sm text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Plot Summary</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-1.5 bg-white border border-gray-400 text-sm text-gray-900 focus:outline-none focus:border-blue-600"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-gray-300 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setEditingMovie(null)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-400 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white border border-blue-800 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
