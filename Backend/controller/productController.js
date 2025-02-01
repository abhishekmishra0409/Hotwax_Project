const db = require('../config/db'); 

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { product_name, color, size } = req.body;

        if (!product_name) {
            return res.status(400).json({
                success: false,
                message: 'Product name is required',
            });
        }

        // SQL Query to insert a new product into the Product table
        const result = await db.query(`
      INSERT INTO Product (product_name, color, size) 
      VALUES (?, ?, ?)
    `, [product_name, color, size]);

        // Assuming auto-generated product_id is returned
        const product_id = result[0].insertId;

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product_id: product_id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        // SQL Query to get all products from the Product table
        const products = await db.query('SELECT * FROM Product');

        res.status(200).json({
            success: true,
            data: products[0], // result comes in an array [0] for MySQL
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get a product by ID
const getProductById = async (req, res) => {
    try {
        const { product_id } = req.params;

        // SQL Query to get a product by product_id
        const product = await db.query('SELECT * FROM Product WHERE product_id = ?', [product_id]);

        if (!product[0].length) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            data: product[0][0], // First element of the array gives the result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update a product by ID
const updateProduct = async (req, res) => {
    try {
        const { product_id } = req.params;
        const { product_name, color, size } = req.body;

        // SQL Query to update product details
        const result = await db.query(`
      UPDATE Product 
      SET product_name = ?, color = ?, size = ? 
      WHERE product_id = ?
    `, [product_name, color, size, product_id]);

        if (result[0].affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
        const { product_id } = req.params;

        // SQL Query to delete product by product_id
        const result = await db.query('DELETE FROM Product WHERE product_id = ?', [product_id]);

        if (result[0].affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
