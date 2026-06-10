const express                    = require('express');
const router                     = express.Router();
const clienteMembresiaController = require('../controllers/cliente-membresia.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

// Check-in → RECEPCION y ADMIN lo necesitan
router.get('/estado/:id_cliente', verificarToken, clienteMembresiaController.getEstadoMembresia);

// Asignar membresía → solo ADMIN
router.post('/asignar', verificarToken, soloAdmin, clienteMembresiaController.asignarMembresia);

module.exports = router;