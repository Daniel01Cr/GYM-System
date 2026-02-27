const express = require('express');
const router = express.Router();
const membresiasController = require('../controllers/membresias.controller');

router.get('/', membresiasController.getMembresias);
router.get('/:ID_MEMBRESIA', membresiasController.getMembresiaById);
router.post('/', membresiasController.createMembresia);
router.put('/:ID_MEMBRESIA', membresiasController.updateMembresia);
router.delete('/:ID_MEMBRESIA', membresiasController.deleteMembresia);

module.exports = router;