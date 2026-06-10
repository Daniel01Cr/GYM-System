const db     = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

// ─── POST /auth/login ────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { correo_usuario, password_usuario } = req.body;

    if (!correo_usuario || !password_usuario) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    // Buscar usuario por correo — el único query que sí trae el hash
    const [rows] = await db.query(
      `SELECT
         ID_USUARIO,
         NOMBRE_USUARIO,
         PRIMER_APELLIDO_USUARIO,
         CORREO_USUARIO,
         PASSWORD_USUARIO,
         ROL_USUARIO
       FROM USUARIO
       WHERE CORREO_USUARIO = ?`,
      [correo_usuario]
    );

    // Mismo mensaje para usuario no encontrado y contraseña incorrecta
    // (no revelar si el correo existe o no)
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const usuario = rows[0];

    const passwordValida = await bcrypt.compare(password_usuario, usuario.PASSWORD_USUARIO);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Armar payload del token — solo lo necesario, nunca el hash
    const payload = {
      id:     usuario.ID_USUARIO,
      correo: usuario.CORREO_USUARIO,
      rol:    usuario.ROL_USUARIO
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h'
    });

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id:     usuario.ID_USUARIO,
        nombre: `${usuario.NOMBRE_USUARIO} ${usuario.PRIMER_APELLIDO_USUARIO}`,
        correo: usuario.CORREO_USUARIO,
        rol:    usuario.ROL_USUARIO
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};