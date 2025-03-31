const Bid = require("../database/bidSchema");

// Place or Update a bid
exports.placeBid = async (req, res) => {
    try {
        const { buyerId, bidAmount } = req.body;
        const { productId } = req.params;

        // Check if the user has already placed a bid
        const existingBid = await Bid.findOne({ productId, buyerId });

        if (existingBid) {
            // Update the existing bid amount
            existingBid.bidAmount = bidAmount;
            await existingBid.save();
            return res.status(200).json({ message: "Bid updated successfully", bid: existingBid });
        }

        // Create a new bid
        const bid = new Bid({ productId, buyerId, bidAmount });
        await bid.save();
        res.status(201).json({ message: "Bid placed successfully", bid });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all bids for a product
exports.getBids = async (req, res) => {
    try {
        const bids = await Bid.find({ productId: req.params.productId });
        res.status(200).json(bids);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Cancel a bid
exports.cancelBid = async (req, res) => {
    try {
        const { buyerId } = req.body;
        const { productId } = req.params;

        const deletedBid = await Bid.findOneAndDelete({ productId, buyerId });

        if (!deletedBid) {
            return res.status(404).json({ message: "Bid not found" });
        }

        res.status(200).json({ message: "Bid canceled successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.acceptBid = async (req, res) => {
    try {
        await Bid.updateMany({ productId: req.body.productId }, { status: "Rejected" }); // Reject all other bids
        await Bid.findByIdAndUpdate(req.params.bidId, { status: "Accepted" });
        res.status(200).json({ message: "Bid accepted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

