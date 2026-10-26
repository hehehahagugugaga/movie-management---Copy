import React, { useState } from 'react';
import { MovieProvider, useMovies } from './context/MovieContext';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { MoviesCatalog } from './components/MoviesCatalog';
import { AddMovieForm } from './components/AddMovieForm';
import { WatchlistView } from './components/WatchlistView';
import { DatabaseRecordsView } from './components/DatabaseRecordsView';
import { ProjectInfoView } from './components/ProjectInfoView';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { EditMovieModal } from './components/EditMovieModal';
import { OmdbApiModal } from './components/OmdbApiModal';
import { Film, CheckCircle } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'add' | 'watchlist' | 'records' | 'about'
  const { notification, setIsOmdbModalOpen } = useMovies();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Header Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Top Summary Stats Bar (shown on Catalog tab) */}
        {activeTab === 'catalog' && <StatsBar />}

        {/* Dynamic Tab Views */}
        {activeTab === 'catalog' && <MoviesCatalog />}

        {activeTab === 'add' && (
          <AddMovieForm onMovieAdded={() => setActiveTab('catalog')} />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistView onBrowseMovies={() => setActiveTab('catalog')} />
        )}

        {activeTab === 'records' && (
          <DatabaseRecordsView onNavigateToAdd={() => setActiveTab('add')} />
        )}

        {activeTab === 'about' && <ProjectInfoView />}
      </main>

      {/* Modals */}
      <MovieDetailsModal />
      <EditMovieModal />
      <OmdbApiModal />

      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-white border-2 border-gray-500 text-gray-900 px-4 py-3 shadow-xl flex items-center space-x-2 text-xs font-bold">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Clean Project Footer */}
      <footer className="w-full bg-white border-t-2 border-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 flex items-center justify-center text-white border border-blue-700">
              <Film className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-gray-900">Movie Management System</span>
            <span className="text-gray-400">|</span>
            <span>React Project</span>
          </div>

          <div className="flex items-center space-x-4 font-semibold">
            <button onClick={() => setActiveTab('catalog')} className="hover:text-blue-600 transition">Catalog</button>
            <button onClick={() => setActiveTab('add')} className="hover:text-blue-600 transition">Add Movie</button>
            <button onClick={() => setActiveTab('watchlist')} className="hover:text-blue-600 transition">Watchlist</button>
            <button onClick={() => setActiveTab('records')} className="hover:text-blue-600 transition">Database</button>
            <button onClick={() => setActiveTab('about')} className="hover:text-blue-600 transition">Project Info</button>
            <button
              onClick={() => setIsOmdbModalOpen(true)}
              className="text-blue-700 hover:underline font-bold"
            >
              OMDb API Config
            </button>
          </div>

          <p className="text-[11px] text-gray-500">
            Pure React 19 Application • LocalStorage Database • OMDb API
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <MovieProvider>
      <MainApp />
    </MovieProvider>
  );
}
