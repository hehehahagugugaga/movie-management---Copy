import React from 'react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from './MovieCard';
import { MoviesTable } from './MoviesTable';
import { GENRES_LIST } from '../data/mockMovies';
import { Search, Filter, ArrowUpDown, LayoutGrid, Table, X } from 'lucide-react';

export const MoviesCatalog = () => {
  const {
    movies,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode
  } = useMovies();

  // 1. Filter movies by search query
  const filtered = movies.filter(movie => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (movie.director && movie.director.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (movie.cast && movie.cast.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesGenre =
      selectedGenre === 'All' ||
      (movie.genres && movie.genres.includes(selectedGenre));

    return matchesSearch && matchesGenre;
  });

  // 2. Sort filtered movies
  const sortedMovies = [...filtered].sort((a, b) => {
    if (sortBy === 'rating-desc') return (Number(b.imdbRating) || 0) - (Number(a.imdbRating) || 0);
    if (sortBy === 'rating-asc') return (Number(a.imdbRating) || 0) - (Number(b.imdbRating) || 0);
    if (sortBy === 'year-desc') return (Number(b.releaseYear) || 0) - (Number(a.releaseYear) || 0);
    if (sortBy === 'year-asc') return (Number(a.releaseYear) || 0) - (Number(b.releaseYear) || 0);
    if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
    return 0;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSortBy('rating-desc');
  };

  return (
    <div className="space-y-6">
      {/* Controls & Filter Header */}
      <div className="bg-white p-4 border border-gray-300 shadow-sm space-y-4">

        {/* Row 1: Search bar, Sort & View Mode */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, director, or actor..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-gray-400 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="flex items-center space-x-1.5 bg-white border border-gray-400 px-2.5 py-1.5 text-xs text-gray-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-gray-500 font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-gray-900 text-xs focus:outline-none cursor-pointer"
              >
                <option value="rating-desc">Rating (High to Low)</option>
                <option value="rating-asc">Rating (Low to High)</option>
                <option value="year-desc">Year (Newest First)</option>
                <option value="year-asc">Year (Oldest First)</option>
                <option value="title-asc">Title (A - Z)</option>
              </select>
            </div>

            {/* View Mode Toggle: Grid vs Table */}
            <div className="flex border border-gray-400">
              <button
                onClick={() => setViewMode('grid')}
                title="Grid Cards View"
                className={`p-1.5 text-xs transition ${viewMode === 'grid' ? 'bg-blue-600 text-white font-bold' : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                title="Table List View"
                className={`p-1.5 text-xs transition ${viewMode === 'table' ? 'bg-blue-600 text-white font-bold' : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Genre Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-gray-600 flex items-center space-x-1 mr-1 text-[11px] font-bold uppercase tracking-wider">
            <Filter className="w-3 h-3 text-gray-500" />
            <span>Genre:</span>
          </span>
          {GENRES_LIST.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 whitespace-nowrap transition text-xs font-semibold border ${isSelected
                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-600 px-1">
        <p>
          Showing <span className="font-bold text-gray-900">{sortedMovies.length}</span> of {movies.length} movies
          {selectedGenre !== 'All' && ` in "${selectedGenre}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>

        {(searchQuery || selectedGenre !== 'All' || sortBy !== 'rating-desc') && (
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Movie Content */}
      {sortedMovies.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 p-12 text-center space-y-3">
          <p className="text-base font-bold text-gray-700">No movies match your search</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try a different search term or reset the genre filter.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition border border-blue-800"
          >
            Show All Movies
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {sortedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <MoviesTable moviesList={sortedMovies} />
      )}
    </div>
  );
};
