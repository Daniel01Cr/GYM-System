const express    = require('express');
const router     = express.Router();
const facturaController = require('../controllers/factura.controller');

// GET  /factura                          → todas las facturas
router.get('/',                        facturaController.getFacturas);

// GET  /factura/:id                      → una factura por ID
router.get('/:id',                     facturaController.getFacturaById);

// GET  /factura/cliente/:id_cliente      → historial de facturas de un cliente
router.get('/cliente/:id_cliente',     facturaController.getFacturasByCliente);

// POST /factura                          → crear factura
router.post('/',                       facturaController.createFactura);

// DELETE /factura/:id                    → eliminar factura
router.delete('/:id',                  facturaController.deleteFactura);

module.exports = router;