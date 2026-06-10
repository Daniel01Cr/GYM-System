const express           = require('express');
const router            = express.Router();
const usuarioController = require('../controllers/usuarios.controller');
const { verificarToken, soloAdmin } = require('../middlewares/auth.middleware');

// Todo lo de usuarios es solo ADMIN
router.get('/',               verificarToken, soloAdmin, usuarioController.getUsuarios);
router.get('/:id',            verificarToken, soloAdmin, usuarioController.getUsuarioById);
router.post('/',              verificarToken, soloAdmin, usuarioController.createUsuario);
router.put('/:id',            verificarToken, soloAdmin, usuarioController.updateUsuario);
router.put('/:id/password',   verificarToken,            usuarioController.updatePassword); // cualquier usuario puede cambiar su propia contraseña
router.delete('/:id',         verificarToken, soloAdmin, usuarioController.deleteUsuario);

module.exports = router;