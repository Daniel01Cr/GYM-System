const db = require('../config/db');

// Obtener todas las membresías
exports.getMembresias = (req, res) => {
  db.query('SELECT ID_MEMBRESIA, NOMBRE_MEMBRESIA, DURACION_DIAS, PRECIO FROM MEMBRESIA', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// Obtener membresía por ID 
exports.getMembresiaById = (req, res) => {
  const { ID_MEMBRESIA } = req.params;

  db.query('SELECT ID_MEMBRESIA, NOMBRE_MEMBRESIA, DURACION_DIAS, PRECIO FROM MEMBRESIA WHERE ID_MEMBRESIA = ?', [ID_MEMBRESIA], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: 'Membresía no encontrada' });
    res.json(results[0]);
  });
};

// Crear membresía
exports.createMembresia = (req, res) => {
  const { NOMBRE_MEMBRESIA, DURACION_DIAS, PRECIO } = req.body;

  db.query(
    'INSERT INTO MEMBRESIA (NOMBRE_MEMBRESIA, DURACION_DIAS, PRECIO) VALUES (?, ?, ?)',
    [ NOMBRE_MEMBRESIA, DURACION_DIAS, PRECIO],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: 'Membresía creada', id: result.insertId });
    }
  );
};

// Actualizar membresía
exports.updateMembresia = (req, res) => {
  const { ID_MEMBRESIA } = req.params;
  const { NOMBRE_MEMBRESIA, DURACION_DIAS, PRECIO } = req.body;

  db.query(
    'UPDATE MEMBRESIA SET NOMBRE_MEMBRESIA=?, DURACION_DIAS=?, PRECIO=? WHERE ID_MEMBRESIA=?',
    [NOMBRE_MEMBRESIA, DURACION_DIAS, PRECIO, ID_MEMBRESIA],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Membresía actualizada' });
    }
  );
};

// Eliminar membresía
exports.deleteMembresia = (req, res) => {
  const { ID_MEMBRESIA } = req.params;

  db.query(
    'DELETE FROM MEMBRESIA WHERE ID_MEMBRESIA=?',
    [ID_MEMBRESIA],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Membresía eliminada' });
    }
  );
};