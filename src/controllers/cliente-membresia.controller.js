const db = require('../config/db');

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatearFechaLocal(fecha) {
  const year  = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day   = String(fecha.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ─── Asignar membresía a un cliente ─────────────────────────────────────────

exports.asignarMembresia = async (req, res) => {
  try {
    const { id_cliente, id_membresia } = req.body;

    // Verificar que el cliente existe
    const [cliente] = await db.query(
      'SELECT ID_CLIENTE FROM CLIENTE WHERE ID_CLIENTE = ?',
      [id_cliente]
    );
    if (cliente.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Obtener duración de la membresía
    const [membresia] = await db.query(
      'SELECT DURACION_DIAS FROM MEMBRESIA WHERE ID_MEMBRESIA = ?',
      [id_membresia]
    );
    if (membresia.length === 0) {
      return res.status(404).json({ message: 'Membresía no encontrada' });
    }

    const duracion = membresia[0].DURACION_DIAS;

    const fechaInicio = new Date();
    const fechaFin    = new Date();
    fechaFin.setDate(fechaInicio.getDate() + duracion);

    const fechaInicioFormateada = formatearFechaLocal(fechaInicio);
    const fechaFinFormateada    = formatearFechaLocal(fechaFin);

    await db.query(
      `INSERT INTO CLIENTE_MEMBRESIA
        (ID_CLIENTE, ID_MEMBRESIA, FECHA_INICIO, FECHA_FIN)
       VALUES (?, ?, ?, ?)`,
      [id_cliente, id_membresia, fechaInicioFormateada, fechaFinFormateada]
    );

    res.status(201).json({
      message:      'Membresía asignada correctamente',
      fecha_inicio: fechaInicioFormateada,
      fecha_fin:    fechaFinFormateada
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── GET /cliente-membresia/estado/:id_cliente ───────────────────────────────
//
// Devuelve la membresía ACTIVA más reciente del cliente.
// Casos posibles en la respuesta:
//   acceso: true  → puede entrar hoy
//   acceso: false → membresía vencida o no tiene ninguna

exports.getEstadoMembresia = async (req, res) => {
  try {
    const { id_cliente } = req.params;

    // 1. Verificar que el cliente existe
    const [clienteRows] = await db.query(
      `SELECT ID_CLIENTE, NOMBRE_CLIENTE, PRIMER_APELLIDO_CLIENTE
       FROM CLIENTE
       WHERE ID_CLIENTE = ?`,
      [id_cliente]
    );

    if (clienteRows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const cliente = clienteRows[0];

    // 2. Buscar la membresía ACTIVA más reciente del cliente
    const [membresiaRows] = await db.query(
      `SELECT
         cm.ID_CLIENTE_MEMBRESIA,
         cm.FECHA_INICIO,
         cm.FECHA_FIN,
         cm.ESTADO,
         m.NOMBRE_MEMBRESIA,
         m.PRECIO,
         DATEDIFF(cm.FECHA_FIN, CURDATE()) AS dias_restantes
       FROM CLIENTE_MEMBRESIA cm
       JOIN MEMBRESIA m ON cm.ID_MEMBRESIA = m.ID_MEMBRESIA
       WHERE cm.ID_CLIENTE = ?
         AND cm.ESTADO = 'ACTIVO'
       ORDER BY cm.FECHA_FIN DESC
       LIMIT 1`,
      [id_cliente]
    );

    // 3. Sin membresía activa → acceso denegado
    if (membresiaRows.length === 0) {
      return res.status(200).json({
        acceso:  false,
        cliente: {
          id:     cliente.ID_CLIENTE,
          nombre: `${cliente.NOMBRE_CLIENTE} ${cliente.PRIMER_APELLIDO_CLIENTE}`
        },
        message: 'Sin membresía activa'
      });
    }

    const membresia = membresiaRows[0];

    // 4. Con membresía activa → acceso permitido
    res.status(200).json({
      acceso:  true,
      cliente: {
        id:     cliente.ID_CLIENTE,
        nombre: `${cliente.NOMBRE_CLIENTE} ${cliente.PRIMER_APELLIDO_CLIENTE}`
      },
      membresia: {
        id:              membresia.ID_CLIENTE_MEMBRESIA,
        plan:            membresia.NOMBRE_MEMBRESIA,
        precio:          membresia.PRECIO,
        fecha_inicio:    membresia.FECHA_INICIO,
        fecha_fin:       membresia.FECHA_FIN,
        dias_restantes:  membresia.dias_restantes
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};