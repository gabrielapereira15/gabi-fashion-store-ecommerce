const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productType: {
        type: String,
        required: true
    },
    productColor: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    productId: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;