import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import { X, Star, Calendar, Clock, User, Bookmark, Check, MessageSquare, Send, Trash2, Edit2 } from 'lucide-react';

export const MovieDetailsModal = () => {
  const {
    selectedMovie,
    setSelectedMovie,
    watchlist,
    toggleWatchlist,
    addReview,
    deleteMovie,
    setEditingMovie
  } = useMovies();

  // Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [ratingValue, setRatingValue] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!selectedMovie) return null;

  const movieId = selectedMovie.id || selectedMovie._id;
  const isSaved = watchlist.includes(movieId);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setReviewError('Please enter a short comment.');
      return;
    }

    addReview(movieId, {
      user: reviewerName.trim() || 'Anonymous Student',
      rating: Number(ratingValue),
      comment: commentText.trim()
    });

    setCommentText('');
    setReviewError('');
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    deleteMovie(movieId);
    setSelectedMovie(null);
  };

  const handleEdit = () => {
    setEditingMovie(selectedMovie);
    setSelectedMovie(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto"
      onClick={() => setSelectedMovie(null)}
    >
      <div
        className="bg-white border-2 border-gray-400 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedMovie(null)}
          className="absolute top-4 right-4 z-10 p-1 bg-white text-gray-600 hover:text-black hover:bg-gray-200 border border-gray-400 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Poster & Quick Info */}
        <div className="flex flex-col sm:flex-row gap-5 p-6 bg-gray-50 border-b border-gray-300">
          <img
            src={selectedMovie.posterUrl || 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg'}
            alt={selectedMovie.title}
            referrerPolicy="no-referrer"
            className="w-full sm:w-44 h-60 object-cover shadow-sm border border-gray-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg';
            }}
          />

          <div className="flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedMovie.genres?.map((g, i) => (
                  <span
                    key={i}
                    className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-300 px-2 py-0.5"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {selectedMovie.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2 font-medium">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{selectedMovie.releaseYear}</span>
                </span>
                {selectedMovie.runtime && (
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{selectedMovie.runtime}</span>
                  </span>
                )}
                {selectedMovie.director && (
                  <span className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>Dir: {selectedMovie.director}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Rating Box & Watchlist Toggle */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-400 px-3 py-1.5 text-amber-800 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{Number(selectedMovie.imdbRating).toFixed(1)} / 10</span>
              </div>

              <button
                onClick={() => toggleWatchlist(movieId)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold border transition ${isSaved
                    ? 'bg-purple-600 text-white border-purple-700'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-400'
                  }`}
              >
                {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                <span>{isSaved ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Plot Summary</h4>
            <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 p-4 border border-gray-300">
              {selectedMovie.description}
            </p>
          </div>

          {/* Cast Details */}
          {selectedMovie.cast && selectedMovie.cast.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Cast</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMovie.cast.map((actor, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 text-gray-800 px-2.5 py-1 border border-gray-300 font-medium"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* User Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-gray-300">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Student Reviews ({selectedMovie.reviews ? selectedMovie.reviews.length : 0})</span>
              </h4>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 border border-gray-300 space-y-3">
              <p className="text-xs font-bold text-gray-700 uppercase">Write a Review & Score:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Your Name (e.g. Student)"
                  className="px-3 py-1.5 bg-white border border-gray-400 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600"
                />

                {/* Rating selection (1 to 5 stars) */}
                <div className="flex items-center space-x-2 bg-white border border-gray-400 px-3 py-1.5">
                  <span className="text-xs text-gray-600 font-medium">Score:</span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRatingValue(star)}
                        className="text-amber-500 focus:outline-none"
                      >
                        <Star
                          className={`w-4 h-4 ${star <= ratingValue ? 'fill-amber-400 text-amber-500' : 'text-gray-300'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-700">({ratingValue}/5)</span>
                </div>
              </div>

              <div>
                <textarea
                  rows="2"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your comments about this film..."
                  className="w-full px-3 py-1.5 bg-white border border-gray-400 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600"
                ></textarea>
                {reviewError && <p className="text-xs text-red-600 font-medium mt-1">{reviewError}</p>}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold border border-blue-800 transition flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Review</span>
                </button>
              </div>
            </form>

            {/* Existing Reviews List */}
            {(!selectedMovie.reviews || selectedMovie.reviews.length === 0) ? (
              <p className="text-xs text-gray-500 italic text-center py-2">
                No reviews recorded yet for this title.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {selectedMovie.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3 bg-white border border-gray-300 text-xs space-y-1 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{rev.user}</span>
                      <div className="flex items-center space-x-1 text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span className="font-bold">{rev.rating}</span>
                        {rev.date && <span className="text-gray-400 text-[10px] ml-1">({rev.date})</span>}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-normal">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer with Edit, Delete & Close actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold border border-gray-400 transition flex items-center space-x-1"
            >
              <Edit2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Edit Movie</span>
            </button>

            <button
              onClick={handleDelete}
              className={`px-3 py-1.5 text-xs font-bold border transition flex items-center space-x-1 ${confirmDelete
                  ? 'bg-red-600 text-white border-red-700 animate-pulse'
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-300'
                }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{confirmDelete ? 'Confirm Delete?' : 'Delete Movie'}</span>
            </button>
          </div>

          <button
            onClick={() => setSelectedMovie(null)}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold border border-gray-400 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
