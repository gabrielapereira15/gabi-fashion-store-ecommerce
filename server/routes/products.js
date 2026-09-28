const express = require('express');
const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/** GET /api/products — list every product, newest first. */
router.get(
    '/',
    asyncHandler(async (req, resp) => {
        const products = await Product.find().sort({ createdAt: -1 });
        resp.json(products);
    })
);

/** GET /api/products/:productId — fetch a single product. */
router.get(
    '/:productId',
    asyncHandler(async (req, resp) => {
        const product = await Product.findOne({
            productId: req.params.productId.toLowerCase()
        });

        if (!product) {
            return resp.status(404).json({ error: 'Product not found' });
        }

        resp.json(product);
    })
);

/** POST /api/products — create a product. */
router.post(
    '/',
    asyncHandler(async (req, resp) => {
        const { productId, productName, productType, productColor, value, description, image } =
            req.body;

        const product = await Product.create({
            productId,
            productName,
            productType,
            productColor,
            value,
            description,
            image
        });

        resp.status(201).json(product);
    })
);

/** PUT /api/products/:productId — update a product. productId itself is immutable. */
router.put(
    '/:productId',
    asyncHandler(async (req, resp) => {
        const { productName, productType, productColor, value, description, image } = req.body;

        const product = await Product.findOneAndUpdate(
            { productId: req.params.productId.toLowerCase() },
            { productName, productType, productColor, value, description, image },
            // Mongoose 6+ strips undefined keys, so omitted fields keep their value.
            { new: true, runValidators: true }
        );

        if (!product) {
            return resp.status(404).json({ error: 'Product not found' });
        }

        resp.json(product);
    })
);

/** DELETE /api/products/:productId — remove a product. */
router.delete(
    '/:productId',
    asyncHandler(async (req, resp) => {
        const product = await Product.findOneAndDelete({
            productId: req.params.productId.toLowerCase()
        });

        if (!product) {
            return resp.status(404).json({ error: 'Product not found' });
        }

        resp.json({ message: 'Product deleted successfully', productId: product.productId });
    })
);

module.exports = router;
