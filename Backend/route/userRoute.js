const express = require('express')
const {getAllUsers, loginUser, createUser} = require("../controller/userController");

const router = express.Router();

router.get('/',getAllUsers)
router.post('/signup',createUser)
router.post('/login',loginUser)

module.exports = router