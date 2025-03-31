const Product = require("../database/productSchema");

// Add a new product
exports.addProduct = async (req, res) => {
    try {
        const { price, ...rest } = req.body;
        
          if (price ) {
            const priceHistory = [{ price, updatedAt: new Date() }];
            rest.priceHistory = priceHistory;
            rest.price = price;
        }
       // console.log(prod);
        const product = new Product(rest);

        await product.save();
        res.status(201).json({ message: "Product added successfully", product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update product (only seller can update)
exports.updateProduct = async (req, res) => {
    try {
        const { price, ...rest } = req.body; // Extract price from request

        // Fetch existing product
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Store price in history if it's updated
        if (price && price !== product.price) {
            product.priceHistory.push({ price, updatedAt: new Date() });
        }

        // Update the product
        Object.assign(product, { price }); // Assign new values
        await product.save();

        res.status(200).json({ message: "Product updated", updatedProduct: product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.productId);
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
