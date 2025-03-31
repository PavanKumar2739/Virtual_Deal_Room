const express = require("express");
const { placeBid, getBids, cancelBid, acceptBid } = require("../controller/bidController");
const { capitalize } = require("@mui/material");
const router = express.Router();

router.post("/placeBid/:productId", placeBid);
router.get("/getBids/:productId", getBids);
router.post("/delete/:productId", cancelBid);
router.post("/accept/:productId", acceptBid);

module.exports = router;
