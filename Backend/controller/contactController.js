const db = require('../config/db');

// Create a new contact
const createContact = async (req, res) => {
    try {
        const { street_address, city, state, postal_code, phone_number, email } = req.body;
        const customer_id = req.customer_id; // Assuming customer_id is passed through JWT

        if (!street_address || !city || !state || !postal_code) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const query = `
            INSERT INTO Contact_Mech (customer_id, street_address, city, state, postal_code, phone_number, email)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [customer_id, street_address, city, state, postal_code, phone_number, email]);

        res.status(201).json({
            success: true,
            message: 'Contact created successfully',
            contact_id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get all contacts for a user
const getAllContacts = async (req, res) => {
    try {
        const customer_id = req.customer_id;
        const query = `SELECT * FROM Contact_Mech WHERE customer_id = ?`;
        const [contacts] = await db.query(query, [customer_id]);

        if (contacts.length === 0) {
            return res.status(404).json({ success: false, message: 'No contacts found' });
        }

        res.status(200).json({ success: true, contacts });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get a specific contact by ID
const getContactById = async (req, res) => {
    try {
        const { contact_mech_id } = req.params;
        const customer_id = req.customer_id;
        const query = `SELECT * FROM Contact_Mech WHERE contact_mech_id = ? AND customer_id = ?`;

        const [contact] = await db.query(query, [contact_mech_id, customer_id]);

        if (contact.length === 0) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }

        res.status(200).json({ success: true, contact: contact[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update a specific contact
const updateContact = async (req, res) => {
    try {
        const { contact_mech_id } = req.params;
        const { street_address, city, state, postal_code, phone_number, email } = req.body;
        const customer_id = req.customer_id;

        const query = `
            UPDATE Contact_Mech
            SET street_address = ?, city = ?, state = ?, postal_code = ?, phone_number = ?, email = ?
            WHERE contact_mech_id = ? AND customer_id = ?
        `;
        const [result] = await db.query(query, [street_address, city, state, postal_code, phone_number, email, contact_mech_id, customer_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Contact not found or not authorized' });
        }

        res.status(200).json({ success: true, message: 'Contact updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete a specific contact
const deleteContact = async (req, res) => {
    try {
        const { contact_mech_id } = req.params;
        const customer_id = req.customer_id;

        const query = `DELETE FROM Contact_Mech WHERE contact_mech_id = ? AND customer_id = ?`;
        const [result] = await db.query(query, [contact_mech_id, customer_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Contact not found or not authorized' });
        }

        res.status(200).json({ success: true, message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
}
