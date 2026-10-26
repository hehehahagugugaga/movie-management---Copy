import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import { GENRES_LIST } from '../data/mockMovies';
import { PlusSquare, Sparkles, CheckCircle, Search, Film, Key } from 'lucide-react';

export const AddMovieForm = ({ onMovieAdded }) => {
  const { addMovie, fetchOmdbMovie, omdbKey, setIsOmdbModalOpen } = useMovies();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    releaseYear: new Date().getFullYear(),
    primaryGenre: 'Action',
    otherGenres: '',
    imdbRating: 8.0,
    runtime: '2h 15m',
    posterUrl: '',
    description: ''
  });

  // OMDb Search State
  const [apiSearchTitle, setApiSearchTitle] = useState('');
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [apiSearchError, setApiSearchError] = useState('');
  const [apiSearchSuccess, setApiSearchSuccess] = useState('');

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Auto-fetching from OMDb API
  const handleOmdbSearch = async (e) => {
    e.preventDefault();
    if (!apiSearchTitle.trim()) {
      setApiSearchError('Please enter a movie title to search.');
      return;
    }

    if (!omdbKey) {
      setApiSearchError('OMDb API Key not set yet. Click "Configure API Key" to set your free key, or type details manually.');
      setIsOmdbModalOpen(true);
      return;
    }

    setIsSearchingApi(true);
    setApiSearchError('');
    setApiSearchSuccess('');

    try {
      const data = await fetchOmdbMovie(apiSearchTitle.trim());

      const genres = data.genres || ['Action'];
      const primary = genres[0] || 'Action';
      const others = genres.slice(1).join(', ');

      setFormData({
        title: data.title || '',
        director: data.director || '',
        releaseYear: data.releaseYear || new Date().getFullYear(),
        primaryGenre: GENRES_LIST.includes(primary) ? primary : 'Action',
        otherGenres: others,
        imdbRating: data.imdbRating || 8.0,
        runtime: data.runtime || '2h 00m',
        posterUrl: data.posterUrl || '',
        description: data.description || ''
      });

      setApiSearchSuccess(`Fetched details and original poster for "${data.title}"!`);
      setErrors({});
    } catch (err) {
      setApiSearchError(err.message || 'Movie not found in OMDb.');
    } finally {
      setIsSearchingApi(false);
    }
  };

  const samplePresets = [
    {
      title: 'Pulp Fiction',
      director: 'Quentin Tarantino',
      releaseYear: 1994,
      primaryGenre: 'Crime',
      otherGenres: 'Drama',
      imdbRating: 8.9,
      runtime: '2h 34m',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGc@._V1_SX300.jpg',
      description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.'
    },
    {
      title: 'Gladiator',
      director: 'Ridley Scott',
      releaseYear: 2000,
      primaryGenre: 'Action',
      otherGenres: 'Adventure, Drama',
      imdbRating: 8.5,
      runtime: '2h 35m',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BYWQ4YmNjYjEtOWE1Zi00Y2U4LWI4NTAtMTU0MjkxNWQ1ZmJiXkEyXkFqcGc@._V1_SX300.jpg',
      description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.'
    }
  ];

  const handleFillSample = () => {
    const randomPreset = samplePresets[Math.floor(Math.random() * samplePresets.length)];
    setFormData(randomPreset);
    setErrors({});
    setApiSearchSuccess('Loaded sample preset movie with official poster!');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Movie title is required';
    if (!formData.director.trim()) errs.director = 'Director name is required';
    if (!formData.releaseYear || formData.releaseYear < 1900 || formData.releaseYear > 2035) {
      errs.releaseYear = 'Enter a valid year (1900-2035)';
    }
    if (!formData.imdbRating || formData.imdbRating < 1 || formData.imdbRating > 10) {
      errs.imdbRating = 'Rating must be between 1.0 and 10.0';
    }
    if (!formData.description.trim()) errs.description = 'Movie synopsis is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const genreList = [
      formData.primaryGenre,
      ...formData.otherGenres.split(',').map(g => g.trim()).filter(Boolean)
    ];

    addMovie({
      title: formData.title.trim(),
      director: formData.director.trim(),
      releaseYear: Number(formData.releaseYear),
      genres: Array.from(new Set(genreList)),
      imdbRating: Number(formData.imdbRating),
      runtime: formData.runtime.trim() || 'N/A',
      posterUrl: formData.posterUrl.trim() || 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
      description: formData.description.trim()
    });

    setSuccessMsg(`"${formData.title}" was added successfully to database!`);
    setTimeout(() => setSuccessMsg(''), 4000);

    setFormData({
      title: '',
      director: '',
      releaseYear: new Date().getFullYear(),
      primaryGenre: 'Action',
      otherGenres: '',
      imdbRating: 8.0,
      runtime: '2h 15m',
      posterUrl: '',
      description: ''
    });

    setApiSearchTitle('');
    setApiSearchSuccess('');

    if (onMovieAdded) onMovieAdded();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* OMDb API Auto-Fetch Search Header Box */}
      <div className="bg-white p-5 border-2 border-blue-300 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Film className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900 uppercase">
              Auto-Fetch Original Movie Poster & Details via OMDb API
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsOmdbModalOpen(true)}
            className="text-xs text-blue-700 font-bold hover:underline flex items-center space-x-1"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{omdbKey ? 'API Key Configured ✓' : 'Configure Free API Key'}</span>
          </button>
        </div>

        <p className="text-xs text-gray-600">
          Enter any movie title below to automatically fetch its official theatrical poster, synopsis, director, release year, and IMDb rating from the OMDb database.
        </p>

        <form onSubmit={handleOmdbSearch} className="flex flex-col sm:flex-row gap-2 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={apiSearchTitle}
              onChange={(e) => setApiSearchTitle(e.target.value)}
              placeholder="e.g. The Batman, Dune, The Godfather, Avatar..."
              className="w-full px-3 py-2 bg-white border border-gray-400 text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={isSearchingApi}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white border border-blue-800 text-xs font-bold transition flex items-center justify-center space-x-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isSearchingApi ? 'Fetching...' : 'Fetch from OMDb API'}</span>
          </button>
        </form>

        {apiSearchError && (
          <p className="text-xs text-red-600 font-semibold mt-1">
            ⚠️ {apiSearchError}
          </p>
        )}

        {apiSearchSuccess && (
          <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center space-x-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{apiSearchSuccess}</span>
          </p>
        )}
      </div>

      {/* Manual Form Header */}
      <div className="bg-white p-5 border border-gray-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <PlusSquare className="w-5 h-5 text-blue-600" />
            <span>Movie Record Form</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Review or manually edit the fields before saving to the database.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillSample}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-400 text-xs font-bold transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Load Sample Movie</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-400 flex items-center space-x-3 text-emerald-800 text-sm font-medium">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white p-6 border border-gray-300 shadow-sm space-y-5">

        {/* Live Poster Preview (If poster URL is present) */}
        {formData.posterUrl && (
          <div className="p-3 bg-gray-50 border border-gray-300 flex items-center space-x-4">
            <img
              src={formData.posterUrl}
              alt="Poster Preview"
              className="w-16 h-24 object-cover border border-gray-400 shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg';
              }}
            />
            <div className="text-xs text-gray-700 space-y-0.5">
              <p className="font-bold text-gray-900">Original Poster Preview Attached ✓</p>
              <p className="text-gray-500 font-mono text-[11px] truncate max-w-md">{formData.posterUrl}</p>
              <p className="text-emerald-700 text-[11px] font-semibold">Official high-resolution poster will be saved to movie record.</p>
            </div>
          </div>
        )}

        {/* Row 1: Title & Director */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Movie Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Inception"
              className={`w-full px-3.5 py-2 bg-white border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition ${errors.title ? 'border-red-600' : 'border-gray-400'
                }`}
            />
            {errors.title && <p className="text-xs text-red-600 font-medium mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Director Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              placeholder="e.g. Christopher Nolan"
              className={`w-full px-3.5 py-2 bg-white border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition ${errors.director ? 'border-red-600' : 'border-gray-400'
                }`}
            />
            {errors.director && <p className="text-xs text-red-600 font-medium mt-1">{errors.director}</p>}
          </div>
        </div>

        {/* Row 2: Release Year, Initial Rating, Runtime */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Release Year <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleChange}
              min="1900"
              max="2035"
              className={`w-full px-3.5 py-2 bg-white border text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition ${errors.releaseYear ? 'border-red-600' : 'border-gray-400'
                }`}
            />
            {errors.releaseYear && <p className="text-xs text-red-600 font-medium mt-1">{errors.releaseYear}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              IMDb Rating (1.0 - 10.0) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              name="imdbRating"
              value={formData.imdbRating}
              onChange={handleChange}
              min="1"
              max="10"
              className={`w-full px-3.5 py-2 bg-white border text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition ${errors.imdbRating ? 'border-red-600' : 'border-gray-400'
                }`}
            />
            {errors.imdbRating && <p className="text-xs text-red-600 font-medium mt-1">{errors.imdbRating}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Runtime / Duration
            </label>
            <input
              type="text"
              name="runtime"
              value={formData.runtime}
              onChange={handleChange}
              placeholder="e.g. 2h 15m"
              className="w-full px-3.5 py-2 bg-white border border-gray-400 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition"
            />
          </div>
        </div>

        {/* Row 3: Primary Genre & Other Genres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Primary Genre <span className="text-red-600">*</span>
            </label>
            <select
              name="primaryGenre"
              value={formData.primaryGenre}
              onChange={handleChange}
              className="w-full px-3.5 py-2 bg-white border border-gray-400 text-sm text-gray-900 focus:outline-none focus:border-blue-600 transition cursor-pointer"
            >
              {GENRES_LIST.filter(g => g !== 'All').map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              Additional Genres (comma separated)
            </label>
            <input
              type="text"
              name="otherGenres"
              value={formData.otherGenres}
              onChange={handleChange}
              placeholder="e.g. Thriller, Mystery"
              className="w-full px-3.5 py-2 bg-white border border-gray-400 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition"
            />
          </div>
        </div>

        {/* Row 4: Poster Image URL */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Original Poster Image URL
          </label>
          <input
            type="url"
            name="posterUrl"
            value={formData.posterUrl}
            onChange={handleChange}
            placeholder="https://m.media-amazon.com/images/..."
            className="w-full px-3.5 py-2 bg-white border border-gray-400 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition font-mono text-xs"
          />
        </div>

        {/* Row 5: Synopsis / Description */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Movie Synopsis / Plot Summary <span className="text-red-600">*</span>
          </label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a brief plot summary of the movie..."
            className={`w-full px-3.5 py-2 bg-white border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition ${errors.description ? 'border-red-600' : 'border-gray-400'
              }`}
          ></textarea>
          {errors.description && <p className="text-xs text-red-600 font-medium mt-1">{errors.description}</p>}
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: '',
                director: '',
                releaseYear: new Date().getFullYear(),
                primaryGenre: 'Action',
                otherGenres: '',
                imdbRating: 8.0,
                runtime: '2h 15m',
                posterUrl: '',
                description: ''
              });
              setErrors({});
              setApiSearchTitle('');
              setApiSearchSuccess('');
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-400 text-xs font-bold transition"
          >
            Clear Form
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white border border-blue-800 text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
          >
            <PlusSquare className="w-4 h-4" />
            <span>Add Movie to Database</span>
          </button>
        </div>

      </form>
    </div>
  );
};
