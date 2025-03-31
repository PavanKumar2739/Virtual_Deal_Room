const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
    productId: String,
    buyerId: String,
    bidAmount: Number,
    status: { type: String, default: "Pending" } // Pending, Accepted, Rejected
});

module.exports = mongoose.model("Bid", bidSchema);
