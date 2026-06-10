const express        = require('express');
const router         = express.Router();
const authController = require('../controllers/auth.controller');

// POST /auth/login  →  pública, no requiere token
router.post('/login', authController.login);

module.exports = router;