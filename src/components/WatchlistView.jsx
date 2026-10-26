import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from './MovieCard';
import { Bookmark, Film, CheckSquare } from 'lucide-react';

export const WatchlistView = ({ onBrowseMovies }) => {
  const { movies, watchlist } = useMovies();
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'watched' | 'plan'
  const [watchedList, setWatchedList] = useState(() => {
    try {
      const saved = localStorage.getItem('cs_watched_movies');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleWatched = (movieId) => {
    const updated = watchedList.includes(movieId)
      ? watchedList.filter(id => id !== movieId)
      : [...watchedList, movieId];
    setWatchedList(updated);
    localStorage.setItem('cs_watched_movies', JSON.stringify(updated));
  };

  const watchlistMovies = movies.filter(m => watchlist.includes(m.id));

  const filteredMovies = watchlistMovies.filter(m => {
    if (filterMode === 'watched') return watchedList.includes(m.id);
    if (filterMode === 'plan') return !watchedList.includes(m.id);
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Watchlist Header */}
      <div className="bg-white p-6 border border-gray-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">My Movie Watchlist</h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
              {watchlistMovies.length} {watchlistMovies.length === 1 ? 'Movie' : 'Movies'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Keep track of movies you plan to watch or have marked as completed.
          </p>
        </div>

        {/* Filter sub-tabs */}
        {watchlistMovies.length > 0 && (
          <div className="flex items-center space-x-1 border border-gray-300 p-1 text-xs bg-white">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 transition font-bold ${filterMode === 'all' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              All ({watchlistMovies.length})
            </button>
            <button
              onClick={() => setFilterMode('plan')}
              className={`px-3 py-1 transition font-bold ${filterMode === 'plan' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              To Watch ({watchlistMovies.filter(m => !watchedList.includes(m.id)).length})
            </button>
            <button
              onClick={() => setFilterMode('watched')}
              className={`px-3 py-1 transition font-bold ${filterMode === 'watched' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              Watched ({watchlistMovies.filter(m => watchedList.includes(m.id)).length})
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {watchlistMovies.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 p-12 text-center space-y-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Your watchlist is currently empty</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              Explore the movie catalog and click the "Watchlist" button on any movie card to save it here.
            </p>
          </div>
          <button
            onClick={onBrowseMovies}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold border border-blue-800 shadow-sm transition inline-flex items-center space-x-1.5"
          >
            <Film className="w-4 h-4" />
            <span>Browse Movie Catalog</span>
          </button>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="bg-white border border-gray-300 p-8 text-center text-gray-500 text-xs">
          No movies found in this tab filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredMovies.map((movie) => {
            const isWatched = watchedList.includes(movie.id);
            return (
              <div key={movie.id} className="relative group">
                <MovieCard movie={movie} />

                {/* Watched Status Overlay Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatched(movie.id);
                    }}
                    className={`flex items-center space-x-1 px-2 py-0.5 text-xs font-bold shadow-sm border transition ${isWatched
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-400'
                      }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>{isWatched ? 'Watched' : 'Mark Watched'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
