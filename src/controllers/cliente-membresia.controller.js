const db = require('../config/db');

// Asignar membresía a cliente
exports.asignarMembresia = (req, res) => {
  const { id_cliente, id_membresia } = req.body;

  // Obtener duración de la membresía
  db.query(
    'SELECT DURACION_DIAS FROM MEMBRESIA WHERE ID_MEMBRESIA = ?',
    [id_membresia],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0)
        return res.status(404).json({ message: 'Membresía no encontrada' });

      const duracion = results[0].DURACION_DIAS;

      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaFin.setDate(fechaInicio.getDate() + duracion);

      const fechaInicioFormateada = formatearFechaLocal(fechaInicio);
      const fechaFinFormateada = formatearFechaLocal(fechaFin);

      db.query(
        `INSERT INTO CLIENTE_MEMBRESIA 
        (ID_CLIENTE, ID_MEMBRESIA, FECHA_INICIO, FECHA_FIN) 
        VALUES (?, ?, ?, ?)`,
        [id_cliente, id_membresia, fechaInicioFormateada, fechaFinFormateada],
        (err, result) => {
          if (err) return res.status(500).json(err);

          res.status(201).json({
            message: 'Membresía asignada correctamente',
            fecha_inicio: fechaInicioFormateada,
            fecha_fin: fechaFinFormateada
          });
        }
      );
    }
  );
};

// Función para formatear fecha a formato local (YYYY-MM-DD)
function formatearFechaLocal(fecha) {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }