import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_MOVIES } from '../data/mockMovies';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  // 1. Movie catalog state (synced with backend / MongoDB + LocalStorage fallback)
  const [movies, setMovies] = useState(() => {
    try {
      const saved = localStorage.getItem('cs_movie_db');
      if (saved) {
        return JSON.parse(saved);
      }
      return INITIAL_MOVIES;
    } catch (e) {
      return INITIAL_MOVIES;
    }
  });

  // 2. Database & Server Health State
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    statusText: 'Checking...',
    totalMovies: 0
  });

  // 3. Watchlist state (array of movie IDs)
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('cs_watchlist');
      return saved ? JSON.parse(saved) : ['m-1', 'm-3'];
    } catch (e) {
      return ['m-1', 'm-3'];
    }
  });


  // 5. OMDb API Key & Modal State
  const [omdbKey, setOmdbKey] = useState(() => {
    return localStorage.getItem('cs_omdb_key') || '';
  });
  const [isOmdbModalOpen, setIsOmdbModalOpen] = useState(false);

  // 6. Search, Filter & View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // 7. Active modal states & Toast notifications
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [notification, setNotification] = useState(null);

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Sync state with LocalStorage as offline backup
  useEffect(() => {
    localStorage.setItem('cs_movie_db', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('cs_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);


  useEffect(() => {
    if (omdbKey) {
      localStorage.setItem('cs_omdb_key', omdbKey);
    }
  }, [omdbKey]);

  // Initial fetch from Node + MongoDB API
  const refreshMoviesFromBackend = async () => {
    try {
      // Check health & DB status
      const healthRes = await fetch('/api/health');
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setDbStatus(healthData.database || { connected: false });
      }

      // Fetch movies
      const res = await fetch('/api/movies');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setMovies(data);
          localStorage.setItem('cs_movie_db', JSON.stringify(data));
        }
      }
    } catch (err) {
      console.warn('[Context] Backend API unavailable, utilizing local storage cache.');
    }
  };

  useEffect(() => {
    refreshMoviesFromBackend();
  }, []);

  // Save / Update OMDb API Key
  const saveOmdbKey = (newKey) => {
    const trimmed = (newKey || '').trim();
    setOmdbKey(trimmed);
    localStorage.setItem('cs_omdb_key', trimmed);
    notify('OMDb API Key saved successfully!');
  };

  // Helper to fetch details and original poster directly from OMDb API (Client-side)
  const fetchOmdbMovie = async (title, customKey = '') => {
    const keyToUse = customKey || omdbKey;
    if (!keyToUse) {
      throw new Error('OMDb API Key is required. Please set your key in OMDb API settings.');
    }

    const res = await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(keyToUse)}&t=${encodeURIComponent(title)}&plot=full`);
    const data = await res.json();

    if (data.Response === 'False') {
      throw new Error(data.Error || 'Movie not found on OMDb');
    }

    return {
      title: data.Title,
      director: data.Director && data.Director !== 'N/A' ? data.Director : '',
      releaseYear: parseInt(data.Year) || new Date().getFullYear(),
      genres: data.Genre && data.Genre !== 'N/A' ? data.Genre.split(', ') : ['Drama'],
      imdbRating: data.imdbRating && data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : 8.0,
      runtime: data.Runtime && data.Runtime !== 'N/A' ? data.Runtime : 'N/A',
      posterUrl: data.Poster && data.Poster !== 'N/A' ? data.Poster : '',
      description: data.Plot && data.Plot !== 'N/A' ? data.Plot : '',
      cast: data.Actors && data.Actors !== 'N/A' ? data.Actors.split(', ') : []
    };
  };

  // Bulk sync all existing movies to official OMDb posters directly in React
  const syncAllPosters = async (customKey = '') => {
    const keyToUse = customKey || omdbKey;
    if (!keyToUse) {
      notify('Please configure an OMDb API key first', 'error');
      return;
    }

    try {
      notify('Syncing movie posters with OMDb API...');
      let updatedCount = 0;
      const updatedList = [];

      for (const movie of movies) {
        try {
          const res = await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(keyToUse)}&t=${encodeURIComponent(movie.title)}`);
          const data = await res.json();
          if (data.Response !== 'False' && data.Poster && data.Poster !== 'N/A') {
            const updatedMovie = {
              ...movie,
              posterUrl: data.Poster,
              imdbRating: data.imdbRating && data.imdbRating !== 'N/A' ? parseFloat(data.imdbRating) : movie.imdbRating
            };
            updatedList.push(updatedMovie);
            updatedCount++;

            // Update in backend as well
            const mId = movie._id || movie.id;
            fetch(`/api/movies/${mId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ posterUrl: data.Poster })
            }).catch(() => {});

          } else {
            updatedList.push(movie);
          }
        } catch (e) {
          updatedList.push(movie);
        }
      }

      setMovies(updatedList);
      notify(`Updated ${updatedCount} movie posters from OMDb!`);
    } catch (e) {
      notify('Failed to sync posters', 'error');
    }
  };

  // ==========================================================================
  // CRUD Operations with MongoDB Backend Integration
  // ==========================================================================

  // CREATE
  const addMovie = async (movieData) => {
    const payload = {
      ...movieData,
      releaseYear: Number(movieData.releaseYear) || new Date().getFullYear(),
      imdbRating: Number(movieData.imdbRating) || 8.0,
      genres: Array.isArray(movieData.genres)
        ? movieData.genres
        : typeof movieData.genres === 'string'
          ? movieData.genres.split(',').map(g => g.trim()).filter(Boolean)
          : ['Drama'],
      reviews: []
    };

    try {
      const res = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        setMovies(prev => [saved, ...prev]);
        notify(`"${saved.title}" saved to MongoDB!`);
        return;
      }
    } catch (err) {
      console.warn('[Context] Backend unavailable, saved locally:', err);
    }

    // Local fallback
    const localNewMovie = {
      ...payload,
      id: `m-${Date.now()}`
    };
    setMovies(prev => [localNewMovie, ...prev]);
    notify(`"${localNewMovie.title}" added to catalog!`);
  };

  // UPDATE
  const updateMovie = async (id, updatedData) => {
    try {
      const res = await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const updated = await res.json();
        setMovies(prev => prev.map(m => (String(m._id || m.id) === String(id) ? updated : m)));
        setEditingMovie(null);
        notify('Movie updated successfully in MongoDB!');
        return;
      }
    } catch (err) {
      console.warn('[Context] Backend unavailable, updating locally:', err);
    }

    // Local fallback
    setMovies(prev =>
      prev.map(movie => {
        if (String(movie.id || movie._id) === String(id)) {
          return {
            ...movie,
            ...updatedData,
            releaseYear: Number(updatedData.releaseYear) || movie.releaseYear,
            imdbRating: Number(updatedData.imdbRating) || movie.imdbRating,
            genres: Array.isArray(updatedData.genres)
              ? updatedData.genres
              : typeof updatedData.genres === 'string'
                ? updatedData.genres.split(',').map(g => g.trim()).filter(Boolean)
                : movie.genres
          };
        }
        return movie;
      })
    );
    setEditingMovie(null);
    notify('Movie updated successfully!');
  };

  // DELETE
  const deleteMovie = async (targetId) => {
    if (!targetId) return;
    const idStr = String(targetId);
    const target = movies.find(m => String(m.id || m._id) === idStr);
    const title = target ? target.title : 'Movie';

    try {
      await fetch(`/api/movies/${idStr}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('[Context] Backend delete error:', err);
    }

    setMovies(prev => prev.filter(m => String(m.id || m._id) !== idStr));
    setWatchlist(prev => prev.filter(mId => String(mId) !== idStr));

    if (selectedMovie && String(selectedMovie.id || selectedMovie._id) === idStr) {
      setSelectedMovie(null);
    }
    notify(`"${title}" deleted from database.`);
  };

  // WATCHLIST
  const toggleWatchlist = (movieId) => {
    const isInWatchlist = watchlist.includes(movieId);
    if (isInWatchlist) {
      setWatchlist(prev => prev.filter(id => id !== movieId));
      notify('Removed from your watchlist.');
    } else {
      setWatchlist(prev => [...prev, movieId]);
      notify('Added to your watchlist!');
    }
  };

  // REVIEWS
  const addReview = async (movieId, reviewObj) => {
    try {
      const res = await fetch(`/api/movies/${movieId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewObj)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.updatedMovie) {
          setMovies(prev => prev.map(m => String(m._id || m.id) === String(movieId) ? data.updatedMovie : m));
          if (String(selectedMovie?._id || selectedMovie?.id) === String(movieId)) {
            setSelectedMovie(data.updatedMovie);
          }
          notify('Review recorded in MongoDB!');
          return;
        }
      }
    } catch (err) {
      console.warn('[Context] Backend review error:', err);
    }

    // Local fallback
    setMovies(prev =>
      prev.map(movie => {
        if (String(movie.id || movie._id) === String(movieId)) {
          const newReview = {
            id: `r-${Date.now()}`,
            user: reviewObj.user || 'Anonymous Student',
            rating: Number(reviewObj.rating) || 5,
            comment: reviewObj.comment || '',
            date: new Date().toISOString().split('T')[0]
          };
          const updatedReviews = [newReview, ...(movie.reviews || [])];
          const avg = (
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
          ).toFixed(1);

          const updated = {
            ...movie,
            reviews: updatedReviews,
            imdbRating: Number(avg)
          };
          if (String(selectedMovie?.id || selectedMovie?._id) === String(movieId)) {
            setSelectedMovie(updated);
          }
          return updated;
        }
        return movie;
      })
    );
    notify('Review posted successfully!');
  };

  // RESET TO DEFAULT / SEED
  const resetToDefaults = async () => {
    try {
      const res = await fetch('/api/movies/seed', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.movies) {
          setMovies(data.movies);
          setWatchlist(['m-1', 'm-3']);
          notify('MongoDB database re-seeded with demo records.');
          return;
        }
      }
    } catch (err) {
      console.warn('[Context] Backend seed error:', err);
    }

    setMovies(INITIAL_MOVIES);
    setWatchlist(['m-1', 'm-3']);
    notify('Catalog reset to initial demo movies.');
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        watchlist,
        dbStatus,
        refreshMoviesFromBackend,
        omdbKey,
        saveOmdbKey,
        fetchOmdbMovie,
        syncAllPosters,
        isOmdbModalOpen,
        setIsOmdbModalOpen,
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        selectedMovie,
        setSelectedMovie,
        editingMovie,
        setEditingMovie,
        notification,
        addMovie,
        updateMovie,
        deleteMovie,
        toggleWatchlist,
        addReview,
        resetToDefaults
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};
