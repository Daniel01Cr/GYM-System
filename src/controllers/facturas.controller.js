const db = require('../config/db');

// ─── Obtener todas las facturas ──────────────────────────────────────────────
exports.getFacturas = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         f.ID_FACTURA,
         f.NUMERO_FACTURA,
         f.MONTO,
         f.FECHA_PAGO,
         f.METODO_PAGO,
         c.ID_CLIENTE,
         CONCAT(c.NOMBRE_CLIENTE, ' ', c.PRIMER_APELLIDO_CLIENTE) AS NOMBRE_CLIENTE,
         m.NOMBRE_MEMBRESIA
       FROM FACTURA f
       JOIN CLIENTE_MEMBRESIA cm ON f.ID_CLIENTE_MEMBRESIA = cm.ID_CLIENTE_MEMBRESIA
       JOIN CLIENTE            c  ON cm.ID_CLIENTE          = c.ID_CLIENTE
       JOIN MEMBRESIA          m  ON cm.ID_MEMBRESIA         = m.ID_MEMBRESIA
       ORDER BY f.FECHA_PAGO DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Obtener factura por ID ──────────────────────────────────────────────────
exports.getFacturaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT
         f.ID_FACTURA,
         f.NUMERO_FACTURA,
         f.MONTO,
         f.FECHA_PAGO,
         f.METODO_PAGO,
         c.ID_CLIENTE,
         CONCAT(c.NOMBRE_CLIENTE, ' ', c.PRIMER_APELLIDO_CLIENTE) AS NOMBRE_CLIENTE,
         c.CEDULA_CLIENTE,
         m.NOMBRE_MEMBRESIA,
         cm.FECHA_INICIO,
         cm.FECHA_FIN
       FROM FACTURA f
       JOIN CLIENTE_MEMBRESIA cm ON f.ID_CLIENTE_MEMBRESIA = cm.ID_CLIENTE_MEMBRESIA
       JOIN CLIENTE            c  ON cm.ID_CLIENTE          = c.ID_CLIENTE
       JOIN MEMBRESIA          m  ON cm.ID_MEMBRESIA         = m.ID_MEMBRESIA
       WHERE f.ID_FACTURA = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Obtener facturas por cliente ────────────────────────────────────────────
exports.getFacturasByCliente = async (req, res) => {
  try {
    const { id_cliente } = req.params;

    // Verificar que el cliente existe
    const [cliente] = await db.query(
      'SELECT ID_CLIENTE FROM CLIENTE WHERE ID_CLIENTE = ?',
      [id_cliente]
    );
    if (cliente.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const [rows] = await db.query(
      `SELECT
         f.ID_FACTURA,
         f.NUMERO_FACTURA,
         f.MONTO,
         f.FECHA_PAGO,
         f.METODO_PAGO,
         m.NOMBRE_MEMBRESIA,
         cm.FECHA_INICIO,
         cm.FECHA_FIN,
         cm.ESTADO
       FROM FACTURA f
       JOIN CLIENTE_MEMBRESIA cm ON f.ID_CLIENTE_MEMBRESIA = cm.ID_CLIENTE_MEMBRESIA
       JOIN MEMBRESIA          m  ON cm.ID_MEMBRESIA         = m.ID_MEMBRESIA
       WHERE cm.ID_CLIENTE = ?
       ORDER BY f.FECHA_PAGO DESC`,
      [id_cliente]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Crear factura ───────────────────────────────────────────────────────────
exports.createFactura = async (req, res) => {
  try {
    const { id_cliente_membresia, monto, metodo_pago, numero_factura } = req.body;

    // Verificar que la membresía existe
    const [membresia] = await db.query(
      'SELECT ID_CLIENTE_MEMBRESIA FROM CLIENTE_MEMBRESIA WHERE ID_CLIENTE_MEMBRESIA = ?',
      [id_cliente_membresia]
    );
    if (membresia.length === 0) {
      return res.status(404).json({ message: 'Membresía de cliente no encontrada' });
    }

    // Verificar que el número de factura no esté duplicado
    const [duplicado] = await db.query(
      'SELECT ID_FACTURA FROM FACTURA WHERE NUMERO_FACTURA = ?',
      [numero_factura]
    );
    if (duplicado.length > 0) {
      return res.status(409).json({ message: 'El número de factura ya existe' });
    }

    const [rows] = await db.query(
      `INSERT INTO FACTURA
         (ID_CLIENTE_MEMBRESIA, MONTO, METODO_PAGO, NUMERO_FACTURA)
       VALUES (?, ?, ?, ?)`,
      [id_cliente_membresia, monto, metodo_pago, numero_factura]
    );

    res.status(201).json({
      message:    'Factura creada correctamente',
      id_factura: rows.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ─── Eliminar factura ────────────────────────────────────────────────────────
exports.deleteFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'DELETE FROM FACTURA WHERE ID_FACTURA = ?',
      [id]
    );
    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    res.json({ message: 'Factura eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};