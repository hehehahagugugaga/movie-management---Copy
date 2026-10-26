import React from 'react';
import { useMovies } from '../context/MovieContext';
import { Film, Star, BookmarkCheck, MessageSquare } from 'lucide-react';

export const StatsBar = () => {
  const { movies, watchlist } = useMovies();

  // Dynamic calculations
  const totalMovies = movies.length;
  const totalReviews = movies.reduce((acc, m) => acc + (m.reviews ? m.reviews.length : 0), 0);
  const avgRating = totalMovies > 0
    ? (movies.reduce((acc, m) => acc + (Number(m.imdbRating) || 0), 0) / totalMovies).toFixed(1)
    : '0.0';

  const stats = [
    {
      title: 'Total Movies',
      value: totalMovies,
      subtitle: 'In local database',
      icon: Film,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-gray-300'
    },
    {
      title: 'Average Rating',
      value: `${avgRating} / 10`,
      subtitle: 'Across all titles',
      icon: Star,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-gray-300'
    },
    {
      title: 'In Watchlist',
      value: watchlist.length,
      subtitle: 'Saved by user',
      icon: BookmarkCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-gray-300'
    },
    {
      title: 'Total Reviews',
      value: totalReviews,
      subtitle: 'User feedback',
      icon: MessageSquare,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-gray-300'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className={`p-4 bg-white border ${s.borderColor} flex items-center space-x-3 shadow-sm`}
          >
            <div className={`p-2.5 ${s.bgColor} ${s.color} border border-gray-200`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{s.title}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-400 hidden sm:block">{s.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
