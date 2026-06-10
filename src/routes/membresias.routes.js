const express = require('express');
const router = express.Router();
const membresiasController = require('../controllers/membresias.controller');

router.get('/', membresiasController.getMembresias);
router.get('/:id', membresiasController.getMembresiaById);
router.post('/', membresiasController.createMembresia);
router.put('/:id', membresiasController.updateMembresia);
router.delete('/:id', membresiasController.deleteMembresia);

module.exports = router;