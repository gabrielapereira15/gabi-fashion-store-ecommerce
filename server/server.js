// Require express, mongoose, cors
const express = require("express");
const mongoose =  require('mongoose');
const cors = require('cors');

// Require Product and User Model 
const Product = require('./Product');
const User = require('./User');

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
mongoose.connect(uri.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
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

// GET Route to Retrieve Products
app.get('/products', async (req, resp) => {
    try {
        const products = await Product.find();
        resp.json(products);
    } catch (error) {
        resp.status(500).json({error: error.message});
    }
});

// POST Route to create products
app.post('/products', async (req, resp) => {
    try {
        const { productName, productType, productColor, value, productId } = req.body;

        const newProduct = new Product({
            productName,
            productType,
            productColor,
            value,
            productId
        });

        const savedProduct = await newProduct.save();

        // Return the newly created product as a response
        resp.status(201).json(savedProduct);
    } catch (error) {
        resp.status(500).json({ error: error.message });
    }
});

// PUT Route to update an existing product based on productId
app.put('/products/:productId', async (req, resp) => {
    try {
        // Extract the productId from the request parameters
        const productId = req.params.productId;

        // Extract updated product data from the request body, excluding productId
        const { productName, productType, productColor, value } = req.body;

        // Find the product by its productId in the database
        let product = await Product.findOne({ productId });

        // If the product doesn't exist, return a 404 error
        if (!product) {
            return resp.status(404).json({ error: 'Product not found' });
        }

        // Update the product with the new data (excluding productId)
        product.productName = productName || product.productName;
        product.productType = productType || product.productType;
        product.productColor = productColor || product.productColor;
        product.value = value || product.value;

        // Save the updated product to the database
        const updatedProduct = await product.save();

        // Return the updated product as a response
        resp.json(updatedProduct);
    } catch (error) {
        resp.status(500).json({ error: error.message });
    }
});

// DELETE Route to delete an existing product based on productId
app.delete('/products/:productId', async (req, resp) => {
    try {
        // Extract the productId from the request parameters
        const productId = req.params.productId;

        // Find the product by its productId in the database and delete it
        const deletedProduct = await Product.findOneAndDelete({ productId });

        // If the product doesn't exist, return a 404 error
        if (!deletedProduct) {
            return resp.status(404).json({ error: 'Product not found' });
        }

        // Return a success message
        resp.json({ message: 'Product deleted successfully' });
    } catch (error) {
        resp.status(500).json({ error: error.message });
    }
});

// GET Route to Retrieve Users
app.get('/users', async (req, resp) => {
    try {
        const users = await User.find();
        resp.json(users);
    } catch (error) {
        resp.status(500).json({error: error.message});
    }
});

// GET Route to Retrieve a specific user
app.get('/users/:emailId', async (req, resp) => {
    const emailId = req.params.email;
    try {
        const user = await User.findOne({emailId})
        // If the user doesn't exist, return a 404 error
        if (!user) {
            return resp.status(404).json({ error: 'User not found' });
        } else {
            resp.json(user);
        }
    } catch (error) {
        resp.status(500).json({error: error.message});
    }
});

// POST Route to create Users
app.post('/users', async (req, resp) => {
    try {
        const { name, address, phone, email, password } = req.body;

        const newUser = new User({
            name,
            address,
            phone,
            email,
            password
        });

        const savedUser = await newUser.save();

        // Return the newly created user as a response
        resp.status(201).json(savedUser);
    } catch (error) {
        resp.status(500).json({ error: error.message });
    }
});

// PUT Route to update an existing user based on email
app.put('/users/:emailId', async (req, resp) => {
    try {
        // Extract the email from the request parameters
        const emailId = req.params.email;

        // Extract updated email data from the request body
        const { name, address, phone, email, password } = req.body;

        // Find the user by its email in the database
        let user = await User.findOne({ email});

        // If the user doesn't exist, return a 404 error
        if (!user) {
            return resp.status(404).json({ error: 'User not found' });
        }

        // Update the user with the new data
        user.name = name || user.name;
        user.address = address || user.address;
        user.phone = phone || user.phone;
        user.email = email || user.email;
        user.password = password || user.password;

        // Save the updated user to the database
        const updatedUser = await user.save();

        // Return the updated product as a response
        resp.json(updatedUser);
    } catch (error) {
        resp.status(500).json({ error: error.message });
    }
});

// DELETE Route to delete an existing user based on email
app.delete('/users/:emailId', async (req, resp) => {
    try {
        // Extract the email from the request parameters
        const emailId = req.params.email

        // Find the user by its email in the database and delete it
        const deletedUser = await User.findOneAndDelete({ emailId });

        // If the user doesn't exist, return a 404 error
        if (!deletedUser) {
            return resp.status(404).json({ error: 'User not found' });
        }

        // Return a success message
        resp.json({ message: 'User deleted successfully' });
    } catch (error) {
        resp.status(500).json({ error: error.message });
    }
});

// Start the web server
app.listen(8080, () => console.log("server listening on http://localhost:" + HTTP_PORT));
