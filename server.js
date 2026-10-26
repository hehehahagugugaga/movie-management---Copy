import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB, getDBStatus } from './config/db.js';
import { Movie } from './models/Movie.js';
import { INITIAL_MOVIES } from './src/data/mockMovies.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const publicDir = path.resolve(__dirname, 'public');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(publicDir));

// Fallback in-memory store in case MongoDB is offline
let memoryMovies = [...INITIAL_MOVIES];

// Attempt MongoDB Connection
await connectDB();

// ============================================================================
// API Endpoints
// ============================================================================

// 1. Health & Database Status
app.get('/api/health', async (req, res) => {
  const dbStatus = getDBStatus();
  let count = memoryMovies.length;
  if (dbStatus.connected) {
    try {
      count = await Movie.countDocuments();
    } catch (e) {
      count = memoryMovies.length;
    }
  }

  res.json({
    status: 'OK',
    service: 'Movie Management System API',
    runtime: 'Node.js & Express',
    database: {
      type: 'MongoDB',
      ...dbStatus,
      totalMovies: count
    },
    timestamp: new Date().toISOString()
  });
});

// 2. GET All Movies
app.get('/api/movies', async (req, res) => {
  const dbStatus = getDBStatus();
  if (dbStatus.connected) {
    try {
      const movies = await Movie.find().sort({ createdAt: -1 });
      return res.json(movies);
    } catch (err) {
      console.error('[API] Error fetching from MongoDB:', err);
    }
  }
  res.json(memoryMovies);
});

// 3. GET Movie By ID
app.get('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  const dbStatus = getDBStatus();

  if (dbStatus.connected) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const movie = await Movie.findById(id);
        if (movie) return res.json(movie);
      }
    } catch (err) {
      console.error('[API] Error finding movie in MongoDB:', err);
    }
  }

  const found = memoryMovies.find(m => String(m.id || m._id) === String(id));
  if (!found) return res.status(404).json({ error: 'Movie not found' });
  res.json(found);
});

// 4. POST Create Movie
app.post('/api/movies', async (req, res) => {
  const moviePayload = {
    ...req.body,
    releaseYear: Number(req.body.releaseYear) || new Date().getFullYear(),
    imdbRating: Number(req.body.imdbRating) || 8.0,
    genres: Array.isArray(req.body.genres)
      ? req.body.genres
      : typeof req.body.genres === 'string'
        ? req.body.genres.split(',').map(g => g.trim()).filter(Boolean)
        : ['Drama'],
    reviews: req.body.reviews || []
  };

  const dbStatus = getDBStatus();
  if (dbStatus.connected) {
    try {
      const createdMovie = new Movie(moviePayload);
      const saved = await createdMovie.save();
      return res.status(201).json(saved);
    } catch (err) {
      console.error('[API] MongoDB save error:', err);
      return res.status(400).json({ error: err.message });
    }
  }

  // In-memory fallback
  const fallbackMovie = {
    id: `m-${Date.now()}`,
    ...moviePayload
  };
  memoryMovies.unshift(fallbackMovie);
  res.status(201).json(fallbackMovie);
});

// 5. PUT Update Movie
app.put('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  const dbStatus = getDBStatus();

  if (dbStatus.connected && mongoose.Types.ObjectId.isValid(id)) {
    try {
      const updated = await Movie.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      });
      if (updated) return res.json(updated);
    } catch (err) {
      console.error('[API] MongoDB update error:', err);
      return res.status(400).json({ error: err.message });
    }
  }

  // In-memory fallback
  const idx = memoryMovies.findIndex(m => String(m.id || m._id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Movie not found' });

  memoryMovies[idx] = {
    ...memoryMovies[idx],
    ...req.body
  };
  res.json(memoryMovies[idx]);
});

// 6. DELETE Movie
app.delete('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  const dbStatus = getDBStatus();

  if (dbStatus.connected && mongoose.Types.ObjectId.isValid(id)) {
    try {
      const deleted = await Movie.findByIdAndDelete(id);
      if (deleted) {
        return res.json({ message: 'Movie deleted successfully from MongoDB', id });
      }
    } catch (err) {
      console.error('[API] MongoDB delete error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  const initialLen = memoryMovies.length;
  memoryMovies = memoryMovies.filter(m => String(m.id || m._id) !== String(id));
  if (memoryMovies.length === initialLen) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  res.json({ message: 'Movie deleted successfully', id });
});

// 7. POST Add Review to Movie
app.post('/api/movies/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { user, rating, comment } = req.body;

  const newReview = {
    user: user || 'Anonymous Student',
    rating: Number(rating) || 5,
    comment: comment || '',
    date: new Date().toISOString().split('T')[0]
  };

  const dbStatus = getDBStatus();
  if (dbStatus.connected && mongoose.Types.ObjectId.isValid(id)) {
    try {
      const movie = await Movie.findById(id);
      if (!movie) return res.status(404).json({ error: 'Movie not found' });

      movie.reviews.unshift(newReview);
      // recalculate rating
      const sum = movie.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
      movie.imdbRating = Number((sum / movie.reviews.length).toFixed(1));
      await movie.save();

      return res.status(201).json({
        review: newReview,
        updatedMovie: movie
      });
    } catch (err) {
      console.error('[API] MongoDB review error:', err);
      return res.status(400).json({ error: err.message });
    }
  }

  // In-memory fallback
  const movie = memoryMovies.find(m => String(m.id || m._id) === String(id));
  if (!movie) return res.status(404).json({ error: 'Movie not found' });

  movie.reviews = movie.reviews || [];
  movie.reviews.unshift({ id: `r-${Date.now()}`, ...newReview });
  const sum = movie.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  movie.imdbRating = Number((sum / movie.reviews.length).toFixed(1));

  res.status(201).json({
    review: newReview,
    updatedMovie: movie
  });
});

// 8. POST Seed / Reset Database
app.post('/api/movies/seed', async (req, res) => {
  const dbStatus = getDBStatus();
  if (dbStatus.connected) {
    try {
      await Movie.deleteMany({});
      const sanitized = INITIAL_MOVIES.map(({ id, ...m }) => m);
      const inserted = await Movie.insertMany(sanitized);
      return res.json({
        message: 'MongoDB database reset and re-seeded successfully',
        count: inserted.length,
        movies: inserted
      });
    } catch (err) {
      console.error('[API] MongoDB seed error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  memoryMovies = [...INITIAL_MOVIES];
  res.json({
    message: 'Memory database reset to default demo records',
    count: memoryMovies.length,
    movies: memoryMovies
  });
});

// 9. GET Stats
app.get('/api/stats', async (req, res) => {
  const dbStatus = getDBStatus();
  let list = memoryMovies;

  if (dbStatus.connected) {
    try {
      list = await Movie.find();
    } catch (e) {
      list = memoryMovies;
    }
  }

  const total = list.length;
  const avgRating = total > 0
    ? (list.reduce((acc, m) => acc + (Number(m.imdbRating) || 0), 0) / total).toFixed(1)
    : '0.0';
  const totalReviews = list.reduce((acc, m) => acc + (m.reviews ? m.reviews.length : 0), 0);

  res.json({
    totalMovies: total,
    averageRating: avgRating,
    totalReviews,
    database: dbStatus
  });
});

// Fallback to React index.html for client-side navigation
app.use((req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  Movie Management System (React + Node.js + MongoDB)`);
  console.log(`  Server running at:  http://localhost:${PORT}`);
  console.log(`  Health & DB Status: http://localhost:${PORT}/api/health`);
  console.log(`  Movies Endpoint:    http://localhost:${PORT}/api/movies`);
  console.log(`  Stats Endpoint:     http://localhost:${PORT}/api/stats`);
  console.log(`======================================================\n`);
});
