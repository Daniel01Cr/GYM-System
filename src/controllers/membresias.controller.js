const db = require('../config/db');

// Obtener todas las membresías
exports.getMembresias = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT ID_MEMBRESIA, NOMBRE_MEMBRESIA, DURACION_DIAS, PRECIO FROM MEMBRESIA');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
};

// Obtener membresía por ID 
exports.getMembresiaById = async (req, res) => {
  try {
    const { ID_MEMBRESIA } = req.params;
    const [rows] = await db.query('SELECT ID_MEMBRESIA, NOMBRE_MEMBRESIA, DURACION_DIAS, PRECIO FROM MEMBRESIA WHERE ID_MEMBRESIA = ?', [ID_MEMBRESIA]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Membresía no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear membresía
exports.createMembresia = async (req, res) => {
  try {
    const { NOMBRE_MEMBRESIA, DURACION_DIAS, PRECIO } = req.body;
    const [rows] = await db.query(
      'INSERT INTO MEMBRESIA (NOMBRE_MEMBRESIA, DURACION_DIAS, PRECIO) VALUES (?, ?, ?)',
      [NOMBRE_MEMBRESIA, DURACION_DIAS, PRECIO]
    );
    res.status(201).json({ message: 'Membresía creada', id: rows.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar membresía
exports.updateMembresia = async (req, res) => {
  try {
    const { ID_MEMBRESIA } = req.params;
    const { NOMBRE_MEMBRESIA, DURACION_DIAS, PRECIO } = req.body;
    const [rows] = await db.query(
      'UPDATE MEMBRESIA SET NOMBRE_MEMBRESIA=?, DURACION_DIAS=?, PRECIO=? WHERE ID_MEMBRESIA=?',
      [NOMBRE_MEMBRESIA, DURACION_DIAS, PRECIO, ID_MEMBRESIA]
    );
    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: 'Membresía no encontrada' });
    }
    res.json({ message: 'Membresía actualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar membresía
exports.deleteMembresia = async (req, res) => {
  try {
    const { ID_MEMBRESIA } = req.params;
    const [rows] = await db.query(
      'DELETE FROM MEMBRESIA WHERE ID_MEMBRESIA=?',
      [ID_MEMBRESIA]
    );
    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: 'Membresía no encontrada' });
    }
    res.json({ message: 'Membresía eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};