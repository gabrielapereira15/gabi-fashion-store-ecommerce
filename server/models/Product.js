const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: [true, 'Product id is required'],
            unique: true,
            trim: true,
            lowercase: true
        },
        productName: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true
        },
        productType: {
            type: String,
            required: [true, 'Product type is required'],
            trim: true
        },
        productColor: {
            type: String,
            required: [true, 'Product color is required'],
            trim: true
        },
        // Price in dollars. The client converts to cents before summing
        // totals so floating point drift never reaches the UI.
        value: {
            type: Number,
            required: [true, 'Product value is required'],
            min: [0, 'Product value cannot be negative']
        },
        description: {
            type: String,
            trim: true,
            default: ''
        }
    },
    { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
