const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register
router.post('/register', authController.registerUser);

// POST /api/auth/login
router.post('/login', authController.loginUser);

module.exports = router;