const mongoose = require('mongoose');

/**
 * Connects to MongoDB using MONGO_URI from the environment.
 * Exits the process on failure so the app never runs half-wired.
 */
async function connectDB() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error(
            'Missing MONGO_URI. Copy server/.env.example to server/.env and set your connection string.'
        );
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log(`Connected to MongoDB (${mongoose.connection.name}).`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }

    mongoose.connection.on('error', (error) => {
        console.error('MongoDB runtime error:', error.message);
    });
}

module.exports = connectDB;
