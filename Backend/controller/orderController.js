const db = require('../config/db');

// Create an Order
exports.createOrder = async (req, res) => {
    try {
        const { order_date, shipping_contact_mech_id, billing_contact_mech_id, order_item } = req.body;
        const customer_id = req.customer_id;

        if (!order_date || !shipping_contact_mech_id || !billing_contact_mech_id || !order_item.length) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Insert order into DB
        const orderQuery = `INSERT INTO Order_Header (order_date, customer_id, shipping_contact_mech_id, billing_contact_mech_id) VALUES (?, ?, ?, ?);`;
        const [orderResult] = await db.query(orderQuery, [order_date, customer_id, shipping_contact_mech_id, billing_contact_mech_id]);

        const orderId = orderResult.insertId;

        // Insert order items
        const itemQuery = `INSERT INTO order_item (order_id, product_id, quantity, status) VALUES (?, ?, ?, ?)`;
        for (const item of order_item) {
            await db.query(itemQuery, [orderId, item.product_id, item.quantity, item.status || 'Pending']);
        }

        res.status(201).json({ success: true, message: 'Order created successfully', orderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Retrieve Order Details
exports.getOrderDetails = async (req, res) => {
    try {
        const { order_id } = req.params;
        const customer_id = req.customer_id;

        const orderQuery = `SELECT * FROM Order_Header WHERE order_id = ? AND customer_id = ?`;
        const [orderRows] = await db.query(orderQuery, [order_id, customer_id]);

        if (orderRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const orderItemsQuery = `SELECT * FROM order_item WHERE order_id = ?`;
        const [orderItems] = await db.query(orderItemsQuery, [order_id]);

        res.status(200).json({ success: true, order: orderRows[0], orderItems });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update an Order
exports.updateOrder = async (req, res) => {
    try {
        const { order_id } = req.params;
        const customer_id = req.customer_id;
        const { shipping_contact_mech_id, billing_contact_mech_id } = req.body;

        const updateQuery = `UPDATE Order_Header SET shipping_contact_mech_id = ?, billing_contact_mech_id = ? WHERE order_id = ? AND customer_id = ?`;
        const [result] = await db.query(updateQuery, [shipping_contact_mech_id, billing_contact_mech_id, order_id, customer_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order not found or not authorized' });
        }

        res.status(200).json({ success: true, message: 'Order updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete an Order
exports.deleteOrder = async (req, res) => {
    try {
        const { order_id } = req.params;
        const customer_id = req.customer_id;

        await db.query(`DELETE FROM order_item WHERE order_id = ?`, [order_id]);
        const [result] = await db.query(`DELETE FROM Order_Header WHERE order_id = ? AND customer_id = ?`, [order_id, customer_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order not found or not authorized' });
        }

        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

//  Add an Order Item
exports.addOrderItem = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { product_id, quantity, status } = req.body;

        const itemQuery = `INSERT INTO order_item (order_id, product_id, quantity, status) VALUES (?, ?, ?, ?)`;
        await db.query(itemQuery, [order_id, product_id, quantity, status || 'Pending']);

        res.status(201).json({ success: true, message: 'Order item added successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update an Order Item
exports.updateOrderItem = async (req, res) => {
    try {
        const { order_id, order_item_seq_id } = req.params;
        const { quantity, status } = req.body;

        const updateItemQuery = `UPDATE order_item SET quantity = ?, status = ? WHERE order_id = ? AND order_item_seq_id = ?`;
        const [result] = await db.query(updateItemQuery, [quantity, status, order_id, order_item_seq_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order item not found' });
        }

        res.status(200).json({ success: true, message: 'Order item updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete an Order Item
exports.deleteOrderItem = async (req, res) => {
    try {
        const { order_id, order_item_seq_id } = req.params;

        const deleteQuery = `DELETE FROM order_item WHERE order_id = ? AND order_item_seq_id = ?`;
        const [result] = await db.query(deleteQuery, [order_id, order_item_seq_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order item not found' });
        }

        res.status(200).json({ success: true, message: 'Order item deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
