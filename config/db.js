import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Movie } from '../models/Movie.js';
import { INITIAL_MOVIES } from '../src/data/mockMovies.js';

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movie_management';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3500, // Timeout fast if local mongod is not started yet
    });

    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} | db: ${conn.connection.name}`);

    // Seed database if empty
    try {
      const count = await Movie.countDocuments();
      if (count === 0) {
        console.log('[MongoDB] Empty movie collection detected. Seeding initial demo movies...');
        const sanitizedMovies = INITIAL_MOVIES.map(({ id, ...m }) => m);
        await Movie.insertMany(sanitizedMovies);
        console.log(`[MongoDB] Successfully seeded ${sanitizedMovies.length} movies into MongoDB.`);
      }
    } catch (seedErr) {
      console.warn('[MongoDB] Note on seeding:', seedErr.message);
    }

    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Connection notice: ${error.message}`);
    console.warn(`[MongoDB] Server is running with memory fallback. To connect to MongoDB, ensure MongoDB is running or set MONGODB_URI in .env`);
    return false;
  }
};

export const getDBStatus = () => {
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return {
    connected: stateCode === 1,
    statusText: states[stateCode] || 'Unknown',
    readyState: stateCode,
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null,
    uri: process.env.MONGODB_URI ? 'Configured in .env' : 'mongodb://127.0.0.1:27017/movie_management'
  };
};
