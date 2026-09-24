/**
 * Seeds the catalogue so a fresh clone has something to render.
 *
 *   npm run seed          upsert the catalogue, leave anything else alone
 *   npm run seed -- --fresh   drop every product first
 */
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const products = require('./data/products');

async function seed() {
    await connectDB();

    const fresh = process.argv.includes('--fresh');

    if (fresh) {
        const { deletedCount } = await Product.deleteMany({});
        console.log(`Removed ${deletedCount} existing product(s).`);
    }

    const result = await Product.bulkWrite(
        products.map((product) => ({
            updateOne: {
                filter: { productId: product.productId },
                update: { $set: product },
                upsert: true
            }
        }))
    );

    console.log(
        `Seeded catalogue: ${result.upsertedCount} inserted, ${result.modifiedCount} updated.`
    );

    await mongoose.connection.close();
    process.exit(0);
}

seed().catch(async (error) => {
    console.error('Seed failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
});
