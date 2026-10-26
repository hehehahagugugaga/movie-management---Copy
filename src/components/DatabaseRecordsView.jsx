import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import { MoviesTable } from './MoviesTable';
import { Database, Plus, RotateCcw, Search, FileJson, FileSpreadsheet } from 'lucide-react';

export const DatabaseRecordsView = ({ onNavigateToAdd }) => {
  const { movies, resetToDefaults, dbStatus } = useMovies();
  const [tableSearch, setTableSearch] = useState('');

  // Filter records by table search
  const filteredRecords = movies.filter(m =>
    m.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
    (m.director && m.director.toLowerCase().includes(tableSearch.toLowerCase())) ||
    m.releaseYear.toString().includes(tableSearch) ||
    (m.genres && m.genres.some(g => g.toLowerCase().includes(tableSearch.toLowerCase())))
  );

  // Export database as JSON file
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(movies, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `movies_database_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export database as CSV file
  const handleExportCSV = () => {
    const headers = ["ID", "Title", "Director", "ReleaseYear", "Genres", "IMDbRating", "Runtime", "ReviewsCount"];
    const rows = movies.map(m => [
      `"${m.id || m._id}"`,
      `"${m.title.replace(/"/g, '""')}"`,
      `"${(m.director || '').replace(/"/g, '""')}"`,
      m.releaseYear,
      `"${(m.genres || []).join('; ')}"`,
      m.imdbRating,
      `"${m.runtime || ''}"`,
      m.reviews ? m.reviews.length : 0
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `movies_database_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 border border-gray-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Database Records Table</h2>
            <span className="text-xs bg-gray-100 text-gray-700 font-mono font-bold px-2 py-0.5 border border-gray-300">
              {movies.length} Records
            </span>
            <span className={`text-xs px-2 py-0.5 font-bold border ${dbStatus?.connected ? 'bg-emerald-50 text-emerald-800 border-emerald-400' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>
              {dbStatus?.connected ? 'MongoDB Live' : 'Memory / Local'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            MongoDB collection records with full CRUD capabilities, live REST API synchronization, and data export.
          </p>
        </div>

        {/* Action Buttons: Add Record, Export, Reset */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Record Shortcut */}
          <button
            onClick={onNavigateToAdd}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold border border-blue-800 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            title="Export all records as JSON file"
            className="flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-400 text-xs font-semibold transition"
          >
            <FileJson className="w-3.5 h-3.5 text-amber-600" />
            <span>Export JSON</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            title="Export all records as CSV spreadsheet"
            className="flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-400 text-xs font-semibold transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          {/* Reset DB */}
          <button
            onClick={() => {
              if (window.confirm('Reset database back to original initial records?')) {
                resetToDefaults();
              }
            }}
            className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset DB</span>
          </button>
        </div>
      </div>

      {/* Search Bar within Records View */}
      <div className="flex items-center justify-between gap-4 bg-white p-3 border border-gray-300 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            placeholder="Filter database rows by title, director, or genre..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-400 text-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-600 transition"
          />
        </div>

        <div className="text-xs text-gray-600">
          Showing <span className="font-bold text-gray-900">{filteredRecords.length}</span> of {movies.length} rows
        </div>
      </div>

      {/* Data Table */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white border border-gray-300 p-8 text-center text-gray-500 text-xs">
          No records match the filter criteria.
        </div>
      ) : (
        <MoviesTable moviesList={filteredRecords} />
      )}
    </div>
  );
};
