const express = require('express');
const router  = express.Router();
const clienteMembresiaController = require('../controllers/cliente-membresia.controller');

// POST /cliente-membresia/asignar
router.post('/asignar', clienteMembresiaController.asignarMembresia);

// GET /cliente-membresia/estado/:id_cliente
router.get('/estado/:id_cliente', clienteMembresiaController.getEstadoMembresia);

module.exports = router;