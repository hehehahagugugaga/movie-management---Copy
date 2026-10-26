import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import { Star, Bookmark, Check, Edit2, Trash2, Info } from 'lucide-react';

export const MoviesTable = ({ moviesList }) => {
  const { watchlist, toggleWatchlist, setSelectedMovie, setEditingMovie, deleteMovie } = useMovies();
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleDeleteClick = (e, movie) => {
    e.stopPropagation();
    const movieId = movie.id || movie._id;
    if (deleteConfirmId === movieId) {
      deleteMovie(movieId);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(movieId);
      setTimeout(() => setDeleteConfirmId(null), 4000);
    }
  };

  return (
    <div className="bg-white border border-gray-300 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-800">
          <thead className="bg-gray-100 text-xs font-bold uppercase text-gray-700 border-b-2 border-gray-300 tracking-wider">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Poster</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Director</th>
              <th className="py-3 px-4">Year</th>
              <th className="py-3 px-4">Genre</th>
              <th className="py-3 px-4 text-center">Rating</th>
              <th className="py-3 px-4 text-center">Reviews</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {moviesList.map((movie, index) => {
              const movieId = movie.id || movie._id;
              const isSaved = watchlist.includes(movieId);
              const isConfirming = deleteConfirmId === movieId;

              return (
                <tr
                  key={movieId}
                  className="hover:bg-blue-50/40 transition cursor-pointer"
                  onClick={() => setSelectedMovie(movie)}
                >
                  {/* Row index */}
                  <td className="py-3 px-4 text-xs text-gray-500 font-mono">
                    {index + 1}
                  </td>

                  {/* Thumbnail */}
                  <td className="py-3 px-4">
                    <img
                      src={movie.posterUrl || 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg'}
                      alt={movie.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-14 object-cover shadow-sm border border-gray-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg';
                      }}
                    />
                  </td>

                  {/* Title & Runtime */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-900">{movie.title}</div>
                    <div className="text-xs text-gray-500">{movie.runtime || 'N/A'}</div>
                  </td>

                  {/* Director */}
                  <td className="py-3 px-4 text-gray-700 text-xs">
                    {movie.director || 'N/A'}
                  </td>

                  {/* Release Year */}
                  <td className="py-3 px-4 text-xs font-mono text-gray-700">
                    {movie.releaseYear}
                  </td>

                  {/* Genre */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {movie.genres?.slice(0, 2).map((g, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium bg-gray-100 px-1.5 py-0.5 text-gray-700 border border-gray-300"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{Number(movie.imdbRating).toFixed(1)}</span>
                    </span>
                  </td>

                  {/* Reviews Count */}
                  <td className="py-3 px-4 text-center text-xs text-gray-600 font-semibold">
                    {movie.reviews ? movie.reviews.length : 0}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center space-x-1.5">
                      {/* Details */}
                      <button
                        onClick={() => setSelectedMovie(movie)}
                        title="View Movie Details"
                        className="p-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-300 transition"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>

                      {/* Watchlist toggle */}
                      <button
                        onClick={() => toggleWatchlist(movieId)}
                        title={isSaved ? 'In Watchlist' : 'Add to Watchlist'}
                        className={`p-1.5 border transition ${isSaved
                            ? 'bg-purple-600 text-white border-purple-700'
                            : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
                          }`}
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => setEditingMovie(movie)}
                        title="Edit Record"
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete (Always accessible with inline confirm) */}
                      <button
                        onClick={(e) => handleDeleteClick(e, movie)}
                        title={isConfirming ? 'Click again to permanently delete' : 'Delete Record'}
                        className={`p-1.5 text-xs font-bold border transition flex items-center space-x-1 ${isConfirming
                            ? 'bg-red-600 text-white border-red-700 animate-pulse px-2'
                            : 'bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-300'
                          }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {isConfirming && <span>Delete?</span>}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
