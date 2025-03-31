const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    count:Number,
    sellerId: String, // Store seller's user ID
    priceHistory: [{ price: Number, updatedAt: Date }],
    status: { type: String, default: "Available" } // Available, Sold, Pending
});

module.exports = mongoose.model("Product", productSchema);
