const express            = require('express');
const router             = express.Router();
const facturaController  = require('../controllers/facturas.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

// Lectura → ambos roles (recepción puede ver facturas del cliente)
router.get('/',                    verificarToken,            facturaController.getFacturas);
router.get('/cliente/:id_cliente', verificarToken,            facturaController.getFacturasByCliente);
router.get('/:id',                 verificarToken,            facturaController.getFacturaById);

// Escritura → solo ADMIN
router.post('/',                   verificarToken, soloAdmin, facturaController.createFactura);
router.delete('/:id',              verificarToken, soloAdmin, facturaController.deleteFactura);

module.exports = router;