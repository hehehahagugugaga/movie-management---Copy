import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import { Film, X, Key, CheckCircle, ExternalLink, RefreshCw, Search, Image as ImageIcon } from 'lucide-react';

export const OmdbApiModal = () => {
  const {
    isOmdbModalOpen,
    setIsOmdbModalOpen,
    omdbKey,
    saveOmdbKey,
    fetchOmdbMovie,
    syncAllPosters
  } = useMovies();

  const [inputKey, setInputKey] = useState(omdbKey || '');
  const [testTitle, setTestTitle] = useState('Inception');
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState('');

  if (!isOmdbModalOpen) return null;

  const handleSaveKey = (e) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    saveOmdbKey(inputKey.trim());
  };

  const handleTestSearch = async (e) => {
    e.preventDefault();
    if (!testTitle.trim()) return;
    setTestLoading(true);
    setTestError('');
    setTestResult(null);

    try {
      const data = await fetchOmdbMovie(testTitle.trim(), inputKey.trim() || omdbKey);
      setTestResult(data);
    } catch (err) {
      setTestError(err.message);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto"
      onClick={() => setIsOmdbModalOpen(false)}
    >
      <div
        className="bg-white border-2 border-gray-400 max-w-2xl w-full p-6 shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-gray-300">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-800 border border-blue-300 flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">OMDb Movie Posters API Configuration</h3>
              <p className="text-xs text-gray-500">Fetch original high-resolution theatrical posters & metadata</p>
            </div>
          </div>

          <button
            onClick={() => setIsOmdbModalOpen(false)}
            className="p-1 text-gray-500 hover:text-black hover:bg-gray-100 border border-gray-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step-by-Step Instructions on Where to Get Free API Key */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-bold flex items-center space-x-1 text-sm">
              <span>🔑 Where and how to get your FREE OMDb API Key (takes 30 seconds):</span>
            </p>
            <a
              href="https://www.omdbapi.com/apikey.aspx"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs border border-blue-800 transition"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
            <li>Visit <a href="https://www.omdbapi.com/apikey.aspx" target="_blank" rel="noreferrer" className="underline font-bold">omdbapi.com/apikey.aspx</a>.</li>
            <li>Select <strong>FREE (1,000 daily requests)</strong>.</li>
            <li>Enter your Email, Name, and select "Student / Education Project".</li>
            <li>Click <strong>Submit</strong>, check your email inbox, and click the verification link.</li>
            <li>Copy your 8-character API key (e.g. <code className="bg-white px-1 border border-blue-300 font-mono">b1c2d3e4</code>) and paste it below.</li>
          </ol>
        </div>

        {/* API Key Form */}
        <form onSubmit={handleSaveKey} className="mt-4 space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase">
            OMDb API Key
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Paste your 8-character key here (e.g. a1b2c3d4)"
              className="flex-1 px-3 py-2 bg-white border border-gray-400 text-xs text-gray-900 font-mono focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold border border-blue-800 transition flex items-center space-x-1"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Save Key</span>
            </button>
          </div>

          {omdbKey && (
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1 mt-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active Key Configured: <code className="bg-gray-100 px-1 border border-gray-300 font-mono">{omdbKey.slice(0, 3)}****</code></span>
            </p>
          )}
        </form>

        {/* Live Test Search Tool */}
        <div className="mt-5 p-4 border border-gray-300 bg-gray-50 space-y-3">
          <p className="text-xs font-bold text-gray-800 uppercase flex items-center space-x-1">
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>Test Fetching Official Poster from OMDb:</span>
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
              placeholder="Enter movie title (e.g. Oppenheimer, The Batman)"
              className="flex-1 px-3 py-1.5 bg-white border border-gray-400 text-xs text-gray-900 focus:outline-none focus:border-blue-600"
            />
            <button
              onClick={handleTestSearch}
              disabled={testLoading}
              className="px-3 py-1.5 bg-gray-800 hover:bg-black text-white text-xs font-bold border border-black transition"
            >
              {testLoading ? 'Searching...' : 'Search OMDb'}
            </button>
          </div>

          {testError && (
            <p className="text-xs text-red-600 font-medium">
              Error: {testError}
            </p>
          )}

          {testResult && (
            <div className="p-3 bg-white border border-gray-300 flex flex-col sm:flex-row gap-3">
              {testResult.posterUrl ? (
                <img
                  src={testResult.posterUrl}
                  alt={testResult.title}
                  className="w-24 h-36 object-cover border border-gray-300 shadow-sm"
                />
              ) : (
                <div className="w-24 h-36 bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 text-[10px] text-center p-1">
                  No Poster Available
                </div>
              )}
              <div className="text-xs text-gray-700 space-y-1 flex-1">
                <p className="font-bold text-sm text-gray-900">{testResult.title} ({testResult.releaseYear})</p>
                <p><span className="font-semibold text-gray-900">Director:</span> {testResult.director}</p>
                <p><span className="font-semibold text-gray-900">Genres:</span> {testResult.genres?.join(', ')}</p>
                <p><span className="font-semibold text-gray-900">Rating:</span> ⭐ {testResult.imdbRating} / 10</p>
                <p className="text-gray-600 line-clamp-2 mt-1">{testResult.description}</p>
                <p className="text-[11px] text-emerald-700 font-semibold pt-1">
                  ✓ Original high-res poster URL fetched successfully!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sync All Existing Movies Button */}
        <div className="mt-4 pt-3 border-t border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => syncAllPosters(inputKey || omdbKey)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-400 text-xs font-bold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync All Existing Movies to Official Posters</span>
          </button>

          <button
            onClick={() => setIsOmdbModalOpen(false)}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold border border-gray-400 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
