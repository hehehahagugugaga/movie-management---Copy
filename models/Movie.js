import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: String, default: 'Anonymous Student' },
  rating: { type: Number, required: true, min: 1, max: 10 },
  comment: { type: String, default: '' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { _id: true, timestamps: true });

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  synopsis: { type: String, default: '' },
  releaseYear: { type: Number, required: true },
  runtime: { type: String, default: '2h 00m' },
  durationMinutes: { type: Number, default: 120 },
  imdbRating: { type: Number, default: 8.0 },
  director: { type: String, default: '' },
  cast: { type: [String], default: [] },
  language: { type: String, default: 'English' },
  genres: { type: [String], default: ['Drama'] },
  posterUrl: { type: String, default: '' },
  reviews: [reviewSchema]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

// Sync description and synopsis
movieSchema.pre('save', function (next) {
  if (!this.description && this.synopsis) this.description = this.synopsis;
  if (!this.synopsis && this.description) this.synopsis = this.description;
  next();
});

export const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
