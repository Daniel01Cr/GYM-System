const jwt = require('jsonwebtoken');

// ─── verificarToken ──────────────────────────────────────────────────────────
// Valida que el request traiga un JWT válido en el header Authorization.
// Inyecta req.usuario = { id, correo, rol } para que los controllers lo usen.
//
// Uso en rutas:
//   router.get('/', verificarToken, controller.getAll);
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // El header debe venir como: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id, correo, rol, iat, exp }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado, inicia sesión nuevamente' });
    }
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// ─── soloAdmin ───────────────────────────────────────────────────────────────
// Permite el acceso solo a usuarios con rol ADMIN.
// Siempre debe ir después de verificarToken.
//
// Uso en rutas:
//   router.delete('/:id', verificarToken, soloAdmin, controller.delete);
const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'ADMIN') {
    return res.status(403).json({ message: 'Acceso denegado: se requiere rol ADMIN' });
  }
  next();
};

// ─── soloRecepcion ───────────────────────────────────────────────────────────
// Permite el acceso solo a RECEPCION (no ADMIN).
// En la práctica se usa poco — ADMIN suele poder hacer todo.
const soloRecepcion = (req, res, next) => {
  if (req.usuario.rol !== 'RECEPCION') {
    return res.status(403).json({ message: 'Acceso denegado: se requiere rol RECEPCION' });
  }
  next();
};

module.exports = { verificarToken, soloAdmin, soloRecepcion };