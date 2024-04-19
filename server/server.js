// Require express, mongoose, cors
const express = require("express");
const mongoose =  require('mongoose');
const cors = require('cors');

// Require Product Model 
const Product = require('./Product');

// Require config file
const mongoDBUrl = require('./config');

// Instantiate the express object
const app = express();

// Path
const path = require('path')

// Server port
const HTTP_PORT = process.env.PORT || 8080

// Connect to database
const uri = mongoDBUrl
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => {
    console.log('Connected to MongoDB.');
});

// Setup the public static folder, cors and express json
app.use(express.static('public'));
app.use(cors());
app.use(express.json());

// GET Route Index
app.get('/', (req, resp) => {
    resp.send("Hello, Gabi Fashion Store - Test!");
});

// GET Route Products
app.get('/products', async (req, resp) => {
    try {
        const products = await Product.find();
        resp.json(products);
    } catch (error) {
        resp.status(500).json({error: error.message});
    }
});

// Start the web server
app.listen(8080, () => console.log("server listening on http://localhost:" + HTTP_PORT));
