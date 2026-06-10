const express            = require('express');
const router             = express.Router();
const clientesController = require('../controllers/clientes.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

// Lectura → cualquier usuario autenticado (ADMIN y RECEPCION)
router.get('/',    verificarToken,            clientesController.getClientes);
router.get('/:id', verificarToken,            clientesController.getClientesByID);

// Escritura → solo ADMIN
router.post('/',   verificarToken, soloAdmin, clientesController.createCliente);
router.put('/:id', verificarToken, soloAdmin, clientesController.updateCliente);
router.delete('/:id', verificarToken, soloAdmin, clientesController.deleteCliente);

module.exports = router;