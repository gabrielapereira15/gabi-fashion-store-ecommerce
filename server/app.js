const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const { notFound, errorHandler } = require('./middleware/errorHandler');

/** Builds the Express app. Kept separate from server.js so tests can mount it. */
function createApp() {
    const app = express();

    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

    app.use(
        cors({
            origin(origin, callback) {
                // No Origin header (curl, Postman, same-origin) is always allowed.
                if (!origin || allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }
                return callback(new Error(`Origin ${origin} is not allowed by CORS`));
            }
        })
    );

    app.use(express.json());
    app.use(express.static('public'));

    // Health check — the client pings this before falling back to demo data.
    app.get('/api/health', (req, resp) => {
        resp.json({ status: 'ok', service: 'gabi-fashion-store-api' });
    });

    app.use('/api/products', productRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/auth', authRoutes);

    app.use(notFound);
    app.use(errorHandler);

    return app;
}

module.exports = createApp;
