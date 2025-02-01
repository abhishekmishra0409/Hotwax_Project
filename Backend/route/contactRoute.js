const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const {createContact, getAllContacts, getContactById, updateContact, deleteContact} = require("../controller/contactController");
const {deleteOrder} = require("../controller/orderController");


router.post('/', authMiddleware, createContact);

router.get('/', authMiddleware, getAllContacts);

router.get('/:contact_mech_id', authMiddleware, getContactById);

router.put('/:contact_mech_id', authMiddleware, updateContact);
router.delete('/:contact_mech_id', authMiddleware, deleteContact);

module.exports = router;
