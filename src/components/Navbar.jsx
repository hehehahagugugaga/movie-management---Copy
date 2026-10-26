import React from 'react';
import { useMovies } from '../context/MovieContext';
import { Film, PlusSquare, Bookmark, Database, Info, RotateCcw, Key } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const {
    watchlist,
    resetToDefaults,
    omdbKey,
    setIsOmdbModalOpen,
    dbStatus
  } = useMovies();

  const navItems = [
    { id: 'catalog', label: 'Movie Catalog', icon: Film },
    { id: 'add', label: 'Add Movie', icon: PlusSquare },
    { id: 'watchlist', label: `Watchlist (${watchlist.length})`, icon: Bookmark },
    { id: 'records', label: 'Database Records', icon: Database },
    { id: 'about', label: 'Project Info', icon: Info },
  ];

  return (
    <header className="bg-white border-b-2 border-gray-300 sticky top-0 z-30 shadow-sm">
      {/* Top Banner with App Branding & Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">

        {/* Project Branding */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
          <div className="w-10 h-10 bg-blue-600 flex items-center justify-center text-white border border-blue-700">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">Movie Management System</h1>
              <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 border border-gray-300">
                React & Node.js
              </span>
            </div>
            <p className="text-xs text-gray-500">Department of Computer Science & Engineering</p>
          </div>
        </div>

        {/* MongoDB Badge, OMDb API Button & Reset Button */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">

          {/* MongoDB Status Badge */}
          <div
            title={dbStatus?.connected ? `MongoDB Database Connected (${dbStatus.host || 'localhost'})` : `MongoDB Status: ${dbStatus?.statusText || 'Offline'} (Operating with memory cache)`}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold border transition ${dbStatus?.connected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
          >
            <Database className={`w-3.5 h-3.5 ${dbStatus?.connected ? 'text-emerald-600' : 'text-amber-600'}`} />
            <span>{dbStatus?.connected ? 'MongoDB: Connected' : 'MongoDB: Local Mode'}</span>
          </div>

          {/* OMDb Posters API Badge */}
          <button
            onClick={() => setIsOmdbModalOpen(true)}
            title="Configure OMDb API for original posters"
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold border transition ${omdbKey
                ? 'bg-blue-50 text-blue-800 border-blue-400 hover:bg-blue-100'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
          >
            <Key className="w-3.5 h-3.5 text-blue-600" />
            <span>{omdbKey ? 'OMDb API: Active' : 'OMDb API: Set Key'}</span>
          </button>


          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset movie database back to default demo records?')) {
                resetToDefaults();
              }
            }}
            title="Reset to default movies data"
            className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 border border-gray-300 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset DB</span>
          </button>
        </div>
      </div>

      {/* Main Tab Bar Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto border-t border-gray-200 space-x-1 bg-white">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition ${isActive
                  ? 'border-blue-600 text-blue-700 bg-blue-50/60 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
