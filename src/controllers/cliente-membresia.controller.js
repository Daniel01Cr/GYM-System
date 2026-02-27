const db = require('../config/db');

exports.asignarMembresia = async(req, res) => {
  try {
    const { id_cliente, id_membresia } = req.body;

    // Obtener duración de la membresía
    const [rows] = await db.query(
      'SELECT DURACION_DIAS FROM MEMBRESIA WHERE ID_MEMBRESIA = ?',
      [id_membresia]
      );
    if (rows.length === 0){
      return res.status(404).json({ message: 'Membresía no encontrada' });
    }

    const duracion = rows[0].DURACION_DIAS;

    // Calcular fechas de inicio y fin
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaInicio.getDate() + duracion);

    const fechaInicioFormateada = formatearFechaLocal(fechaInicio);
    const fechaFinFormateada = formatearFechaLocal(fechaFin);
      
    await db.query(
      `INSERT INTO CLIENTE_MEMBRESIA 
      (ID_CLIENTE, ID_MEMBRESIA, FECHA_INICIO, FECHA_FIN) 
      VALUES (?, ?, ?, ?)`,
      [id_cliente, id_membresia, fechaInicioFormateada, fechaFinFormateada]
    );

    res.status(201).json({
      message: 'Membresía asignada correctamente',
      fecha_inicio: fechaInicioFormateada,
      fecha_fin: fechaFinFormateada
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función para formatear fecha a formato local (YYYY-MM-DD)
function formatearFechaLocal(fecha) {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }