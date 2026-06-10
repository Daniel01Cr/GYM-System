const db      = require('../config/db');
const bcrypt  = require('bcryptjs');

// ─── Obtener todos los usuarios ──────────────────────────────────────────────
// Nunca devuelve PASSWORD_USUARIO
exports.getUsuarios = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         ID_USUARIO,
         NOMBRE_USUARIO,
         PRIMER_APELLIDO_USUARIO,
         CORREO_USUARIO,
         ROL_USUARIO
       FROM USUARIO`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Obtener usuario por ID ──────────────────────────────────────────────────
exports.getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT
         ID_USUARIO,
         NOMBRE_USUARIO,
         PRIMER_APELLIDO_USUARIO,
         CORREO_USUARIO,
         ROL_USUARIO
       FROM USUARIO
       WHERE ID_USUARIO = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Crear usuario ───────────────────────────────────────────────────────────
exports.createUsuario = async (req, res) => {
  try {
    const { nombre_usuario, primer_apellido_usuario, correo_usuario, password_usuario, rol_usuario } = req.body;

    // Verificar que el correo no esté en uso
    const [existe] = await db.query(
      'SELECT ID_USUARIO FROM USUARIO WHERE CORREO_USUARIO = ?',
      [correo_usuario]
    );
    if (existe.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    // Hashear contraseña antes de guardar
    const passwordHash = await bcrypt.hash(password_usuario, 10);

    const [rows] = await db.query(
      `INSERT INTO USUARIO
         (NOMBRE_USUARIO, PRIMER_APELLIDO_USUARIO, CORREO_USUARIO, PASSWORD_USUARIO, ROL_USUARIO)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre_usuario, primer_apellido_usuario, correo_usuario, passwordHash, rol_usuario || 'RECEPCION']
    );

    res.status(201).json({
      message:     'Usuario creado correctamente',
      id_usuario:  rows.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Actualizar usuario ──────────────────────────────────────────────────────
// Permite cambiar nombre, apellido, correo y rol
// Para cambiar contraseña usar el endpoint dedicado (PUT /usuario/:id/password)
exports.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_usuario, primer_apellido_usuario, correo_usuario, rol_usuario } = req.body;

    // Si cambia el correo, verificar que no lo use otro usuario
    if (correo_usuario) {
      const [existe] = await db.query(
        'SELECT ID_USUARIO FROM USUARIO WHERE CORREO_USUARIO = ? AND ID_USUARIO != ?',
        [correo_usuario, id]
      );
      if (existe.length > 0) {
        return res.status(409).json({ message: 'El correo ya está en uso por otro usuario' });
      }
    }

    const [rows] = await db.query(
      `UPDATE USUARIO
       SET NOMBRE_USUARIO           = ?,
           PRIMER_APELLIDO_USUARIO  = ?,
           CORREO_USUARIO           = ?,
           ROL_USUARIO              = ?
       WHERE ID_USUARIO = ?`,
      [nombre_usuario, primer_apellido_usuario, correo_usuario, rol_usuario, id]
    );

    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Cambiar contraseña ──────────────────────────────────────────────────────
exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password_actual, password_nueva } = req.body;

    // Obtener hash actual
    const [rows] = await db.query(
      'SELECT PASSWORD_USUARIO FROM USUARIO WHERE ID_USUARIO = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const esValida = await bcrypt.compare(password_actual, rows[0].PASSWORD_USUARIO);
    if (!esValida) {
      return res.status(401).json({ message: 'Contraseña actual incorrecta' });
    }

    const nuevoHash = await bcrypt.hash(password_nueva, 10);

    await db.query(
      'UPDATE USUARIO SET PASSWORD_USUARIO = ? WHERE ID_USUARIO = ?',
      [nuevoHash, id]
    );

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Eliminar usuario ────────────────────────────────────────────────────────
exports.deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'DELETE FROM USUARIO WHERE ID_USUARIO = ?',
      [id]
    );
    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};