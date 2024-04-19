// adding the modules
const mongoose =  require('mongoose');
const Product = require('./Product');
const mongoDBUrl = require('./config');

// connect to the database
const uri = mongoDBUrl
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
    try {
      // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
      await mongoose.connect(uri, clientOptions);
      await mongoose.connection.db.admin().command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");

      // get data from the Products table
      const products = await Product.find().exec();
      console.log(products);
    } catch (error) {
        console.error("Error:", error);

    } finally {
      // Ensures that the client will close when you finish/error
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB.");
      process.exit();
    }
  }

  run().catch(console.dir);

/*
// CREATE SCRIPT
// retrieve the schema constructor from mongoose object
        const Schema = mongoose.Schema;

        // instantiate the schema
        let productSchema = new Schema({
            productName: String,
            productType: String,
            productColor: String,
            value: Number,
            productId: String
        });

        // create the product model (class)
        let Product = mongoose.model("product", productSchema);

        // make the product
        let product1 = new Product({
            productName: "Louise Sweatshirt",
            productType: "Cozy sweatshirt",
            productColor: "Yellow",
            value: 250.00,
            productId: "suit1"
        });

        // make the product
        let product2 = new Product({
            productName: "Maria Sweatshirt",
            productType: "Cozy sweatshirt",
            productColor: "White",
            value: 220.00,
            productId: "suit2"
        });

        // make the product
        let product3 = new Product({
            productName: "Checkered Blazer",
            productType: "Blazer",
            productColor: "Checkered",
            value: 320.00,
            productId: "suit3"
        });

        // make the product
        let product4 = new Product({
            productName: "Melina Sweatshirt",
            productType: "Cozy sweatshirt",
            productColor: "White/Black",
            value: 120.00,
            productId: "suit4"
        });

        // make the product
        let product5 = new Product({
            productName: "Jennifer Sunglasses",
            productType: "Sunglasses",
            productColor: "Black",
            value: 75.00,
            productId: "suit5"
        });

        // make the product
        let product6 = new Product({
            productName: "Laura Set",
            productType: "Cropped/Skirt Set",
            productColor: "Black/Sand",
            value: 275.00,
            productId: "suit6"
        });

        // make the product
        let product7 = new Product({
            productName: "Kristen Sunglasses",
            productType: "Sunglasses",
            productColor: "Black/Silver",
            value: 55.00,
            productId: "suit7"
        });

        // make the product
        let product8 = new Product({
            productName: "Liana Jeans",
            productType: "Jeans",
            productColor: "Blac",
            value: 175.00,
            productId: "suit8"
        });

        // make the product
        let product9 = new Product({
            productName: "Frech Hat",
            productType: "Hat",
            productColor: "Black",
            value: 99.00,
            productId: "suit9"
        });

        // make the product
        let product10 = new Product({
            productName: "Gabi Long Blazer",
            productType: "Blazer",
            productColor: "Straw",
            value: 230.00,
            productId: "suit10"
        });

        // make the product
        let product11 = new Product({
            productName: "Sophia Dress",
            productType: "Dress",
            productColor: "Checkered",
            value: 280.00,
            productId: "suit11"
        });

        // make the product
        let product12 = new Product({
            productName: "Black Pink Dress",
            productType: "Dress",
            productColor: "Pink",
            value: 320.00,
            productId: "suit12"
        });

        // CREATE
        // save, disconnect and exit the node process
        await product1.save();
        await product2.save();
        await product3.save();
        await product4.save();
        await product5.save();
        await product6.save();
        await product7.save();
        await product8.save();
        await product9.save();
        await product10.save();
        await product11.save();
        await product12.save();

        // execute the query
        const products = await Product.find().exec();
        console.log(products);
*/