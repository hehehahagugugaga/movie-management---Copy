import React from 'react';
import { Code, Database, CheckCircle, BookOpen, Layers, Award, Film } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

export const ProjectInfoView = () => {
  const { omdbKey, setIsOmdbModalOpen } = useMovies();

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Project Banner Card */}
      <div className="bg-white p-6 border-2 border-gray-300 shadow-sm space-y-3">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-700 border border-blue-300">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Movie Management System (React Application)</h2>
            <p className="text-xs text-blue-700 font-semibold">
              Academic Course Project • Department of Computer Science & Engineering
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed pt-2 border-t border-gray-200">
          A self-contained Single Page Application (SPA) built purely in <strong>React 19</strong> to demonstrate modern web engineering concepts,
          component-driven frontend architecture, dynamic state synchronization, client-side persistence via LocalStorage, and direct movie poster API integration.
        </p>
      </div>

      {/* Movie API Status Banner */}
      <div className="p-4 border-2 bg-blue-50 border-blue-300 text-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Film className="w-5 h-5 flex-shrink-0 text-blue-700" />
          <div>
            <p className="font-bold text-xs uppercase tracking-wider">
              Movie Posters API: {omdbKey ? 'OMDb API Key Configured ✓' : 'OMDb API Key Optional'}
            </p>
            <p className="text-xs mt-0.5 text-blue-800">
              {omdbKey
                ? 'Original theatrical posters and metadata are fetched live from OMDb API.'
                : 'Configure your free OMDb API key to auto-fetch official posters & movie plot details.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOmdbModalOpen(true)}
          className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white border border-blue-800 transition whitespace-nowrap"
        >
          {omdbKey ? 'Manage API Key' : 'Configure Free Key'}
        </button>
      </div>

      {/* Tech Stack & Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 border border-gray-300 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm">
            <Code className="w-4 h-4" />
            <span>Frontend (React 19)</span>
          </div>
          <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
            <li>React 19 (Functional Components)</li>
            <li>React Hooks (useState, useEffect, useContext)</li>
            <li>Context API for state management</li>
            <li>Tailwind CSS (Beginner White Theme)</li>
            <li>Non-rounded 0px sharp borders</li>
          </ul>
        </div>

        <div className="bg-white p-5 border border-gray-300 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>Client Storage</span>
          </div>
          <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
            <li>HTML5 LocalStorage API</li>
            <li>Zero external database setup needed</li>
            <li>Persistent across browser reloads</li>
            <li>One-click JSON & CSV data export</li>
          </ul>
        </div>

        <div className="bg-white p-5 border border-gray-300 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm">
            <Layers className="w-4 h-4" />
            <span>External API</span>
          </div>
          <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
            <li>OMDb API (The Open Movie Database)</li>
            <li>Official cinema posters CDN</li>
            <li>Direct client-side HTTPS fetch</li>
            <li>Auto-populate movie form feature</li>
          </ul>
        </div>
      </div>

      {/* Implemented Features Checklist */}
      <div className="bg-white p-6 border border-gray-300 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-600" />
          <span>Implemented Requirements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
          <div className="flex items-start space-x-2 bg-gray-50 p-2.5 border border-gray-300">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">Complete CRUD Operations</p>
              <p className="text-gray-500 text-[11px]">Create, Read, Update, and Delete movies with clean form validation.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2 bg-gray-50 p-2.5 border border-gray-300">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">Multi-Criteria Search & Filter</p>
              <p className="text-gray-500 text-[11px]">Real-time search by title/director/actor, genre filter chips, and sorting.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2 bg-gray-50 p-2.5 border border-gray-300">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">Official Posters & Movie API Integration</p>
              <p className="text-gray-500 text-[11px]">Auto-fetch movie metadata and official theatrical posters via OMDb API.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2 bg-gray-50 p-2.5 border border-gray-300">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">Review & Rating Recalculation</p>
              <p className="text-gray-500 text-[11px]">Interactive user reviews that dynamically recalculate the movie's average score.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2 bg-gray-50 p-2.5 border border-gray-300">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">Watchlist Management</p>
              <p className="text-gray-500 text-[11px]">Bookmark favorite movies and track watched/unwatched status.</p>
            </div>
          </div>


        </div>
      </div>

      {/* Student Project Meta Information */}
      <div className="bg-white p-6 border border-gray-300 shadow-sm flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-4">
        <div>
          <p className="font-bold text-gray-900 text-sm">Course: CS301 Web Technologies</p>
          <p className="text-gray-500 mt-0.5">Academic Session 2025–2026 • 3rd Year B.Tech / B.E.</p>
        </div>
        <div className="text-center sm:text-right">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 border border-blue-300 font-mono text-[11px] font-bold">
            Status: Submission Ready (Pure React)
          </span>
        </div>
      </div>

    </div>
  );
};
