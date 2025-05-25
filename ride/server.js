import http from 'http';
import  app  from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const server = http.createServer(app);

const connectDb = async () => {
    // Simulating database connection
    const dbUrl = process.env.MONGO_URI;
    if (!dbUrl) {
        throw new Error('Database URL is not defined in environment variables');
    }

    const res =  await mongoose.connect(dbUrl)
    if (res.connection.readyState !== 1) {
        throw new Error('Failed to connect to the database');
    }
  console.log('Database connected');
}

server.listen(3003, () => {
    connectDb().catch(err => {
        console.error('Database connection error:', err);
        process.exit(1); // Exit the process if database connection fails
    });
  console.log('Server is running on http://localhost:3003');
});