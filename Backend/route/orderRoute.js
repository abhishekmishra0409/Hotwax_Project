const express = require('express');
const authenticateUser = require('../middleware/authMiddleware');
const {createOrder, getOrderDetails, updateOrder, deleteOrder, addOrderItem, updateOrderItem, deleteOrderItem} = require("../controller/orderController");


const router = express.Router();

// Order Routes
router.post('/', authenticateUser,createOrder );
router.get('/:order_id', authenticateUser,getOrderDetails );
router.put('/:order_id', authenticateUser,updateOrder);
router.delete('/:order_id', authenticateUser,deleteOrder );

// Order Item Routes
router.post('/:order_id/items', authenticateUser,addOrderItem );
router.put('/:order_id/items/:order_item_seq_id', authenticateUser,updateOrderItem );
router.delete('/:order_id/items/:order_item_seq_id', authenticateUser,deleteOrderItem );

module.exports = router;
