const express = require("express");
const { addProduct, getProducts, updateProduct, deleteProduct } = require("../controller/productController");
const router = express.Router();

router.post("/addProduct", addProduct);
router.get("/getProducts", getProducts);
router.post("/updateProduct/:productId", updateProduct);
router.post("/deleteProduct/:productId", deleteProduct);

module.exports = router;
