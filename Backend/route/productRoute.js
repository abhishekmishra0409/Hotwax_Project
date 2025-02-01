const express = require('express');
const {createProduct, getAllProducts, getProductById, updateProduct, deleteProduct} = require("../controller/productController");
const authenticateUser = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/',authenticateUser, createProduct);
router.get('/',authenticateUser, getAllProducts);
router.get('/:product_id',authenticateUser,getProductById);
router.put('/:product_id',authenticateUser, updateProduct);
router.delete('/:product_id',authenticateUser, deleteProduct);


module.exports = router;
