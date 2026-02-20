const express = require('express');
const router = express.Router();
const clientesController = require ('../controllers/clientes.controller.js');

router.get('/', clientesController.getClientes);
router.get('/:id', clientesController.getClientesByID);
router.post('/', clientesController.createCliente);
router.delete('/:id', clientesController.deleteCliente);

module.exports = router;