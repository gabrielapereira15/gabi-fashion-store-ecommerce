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
        },
        /**
         * Optional photo: either an absolute URL, or a path to one of the
         * images bundled with the client. When it is empty the client falls
         * back to /images/<productId>.webp, which is how the seeded pieces
         * find their photos.
         */
        image: {
            type: String,
            trim: true,
            default: '',
            validate: {
                validator: (value) =>
                    value === '' || /^(https?:\/\/|\/)/.test(value),
                message: 'Image must be an absolute URL or a path starting with /'
            }
        }
    },
    { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
