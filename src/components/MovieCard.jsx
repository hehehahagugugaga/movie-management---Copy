import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import { Star, Clock, User, Bookmark, Check, Trash2, Edit2, Info } from 'lucide-react';

export const MovieCard = ({ movie }) => {
  const { watchlist, toggleWatchlist, setSelectedMovie, setEditingMovie, deleteMovie } = useMovies();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const movieId = movie.id || movie._id;
  const isSaved = watchlist.includes(movieId);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    deleteMovie(movieId);
    setConfirmDelete(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setEditingMovie(movie);
  };

  return (
    <div
      onClick={() => setSelectedMovie(movie)}
      className="bg-white border border-gray-300 hover:border-gray-600 shadow-sm hover:shadow transition cursor-pointer flex flex-col group"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] bg-gray-900 overflow-hidden border-b border-gray-200">
        <img
          src={movie.posterUrl || 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg'}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg';
          }}
        />

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-white text-gray-900 border border-gray-400 font-bold px-2 py-0.5 text-xs flex items-center space-x-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>{Number(movie.imdbRating).toFixed(1)}</span>
        </div>

        {/* Release Year Tag */}
        <div className="absolute bottom-2 left-2 bg-gray-900/90 text-white font-mono px-2 py-0.5 text-xs border border-gray-700">
          {movie.releaseYear}
        </div>
      </div>

      {/* Movie Details Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Genre Badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {movie.genres?.slice(0, 3).map((g, i) => (
              <span
                key={i}
                className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 border border-gray-300"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-1">
            {movie.title}
          </h3>

          {/* Director & Duration */}
          <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1 mb-2">
            <span className="flex items-center space-x-1">
              <User className="w-3 h-3 text-gray-400" />
              <span className="truncate max-w-[120px] font-medium">{movie.director || 'Unknown'}</span>
            </span>
            {movie.runtime && (
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span>{movie.runtime}</span>
              </span>
            )}
          </div>

          {/* Description snippet */}
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {movie.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-gray-200 flex items-center justify-between gap-1.5" onClick={(e) => e.stopPropagation()}>
          {/* Details / Reviews button */}
          <button
            onClick={() => setSelectedMovie(movie)}
            className="flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-400 text-xs font-semibold transition"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          {/* Watchlist Toggle */}
          <button
            onClick={() => toggleWatchlist(movieId)}
            title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
            className={`flex items-center justify-center space-x-1 py-1.5 px-2.5 text-xs font-semibold border transition ${isSaved
                ? 'bg-purple-600 text-white border-purple-700'
                : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
              }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-gray-500" />
                <span className="hidden sm:inline">Save</span>
              </>
            )}
          </button>

          {/* Edit Control */}
          <button
            onClick={handleEdit}
            title="Edit Movie"
            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Delete Control (Always visible with inline confirmation) */}
          <button
            onClick={handleDelete}
            title={confirmDelete ? 'Click again to permanently delete' : 'Delete Movie'}
            className={`p-1.5 text-xs font-bold border transition flex items-center space-x-1 ${confirmDelete
                ? 'bg-red-600 text-white border-red-700 animate-pulse px-2'
                : 'bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border-red-300'
              }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {confirmDelete && <span>Delete?</span>}
          </button>
        </div>
      </div>
    </div>
  );
};
