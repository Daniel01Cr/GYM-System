const express           = require('express');
const router            = express.Router();
const usuarioController = require('../controllers/usuario.controller');

// GET    /usuario              → todos los usuarios
router.get('/',                  usuarioController.getUsuarios);

// GET    /usuario/:id          → usuario por ID
router.get('/:id',               usuarioController.getUsuarioById);

// POST   /usuario              → crear usuario
router.post('/',                 usuarioController.createUsuario);

// PUT    /usuario/:id          → actualizar datos (sin contraseña)
router.put('/:id',               usuarioController.updateUsuario);

// PUT    /usuario/:id/password → cambiar contraseña
router.put('/:id/password',      usuarioController.updatePassword);

// DELETE /usuario/:id          → eliminar usuario
router.delete('/:id',            usuarioController.deleteUsuario);

module.exports = router;