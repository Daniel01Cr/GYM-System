const express = require('express');
const router = express.Router();
const clienteMembresiaRoutes = require('../controllers/cliente-membresia.controller');

router.post('/asignar', clienteMembresiaRoutes.asignarMembresia);

module.exports = router;