const express               = require('express');
const router                = express.Router();
const membresiasController  = require('../controllers/membresias.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

// Lectura → cualquier usuario autenticado
router.get('/',              verificarToken,            membresiasController.getMembresias);
router.get('/:ID_MEMBRESIA', verificarToken,            membresiasController.getMembresiaById);

// Escritura → solo ADMIN (los planes los define el dueño del gym)
router.post('/',             verificarToken, soloAdmin, membresiasController.createMembresia);
router.put('/:ID_MEMBRESIA', verificarToken, soloAdmin, membresiasController.updateMembresia);
router.delete('/:ID_MEMBRESIA', verificarToken, soloAdmin, membresiasController.deleteMembresia);

module.exports = router;