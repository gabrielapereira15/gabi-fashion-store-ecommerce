require('dotenv').config();

const createApp = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 8080;

async function start() {
    await connectDB();

    createApp().listen(PORT, () => {
        console.log(`API listening on http://localhost:${PORT}`);
    });
}

start();
