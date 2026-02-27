const db = require('../config/db');

//OBTENER CLIENTES
exports.getClientes = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM CLIENTE');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//OBTENER CLIENTE BY ID
exports.getClientesByID = async (req, res) => {
    try {
        const {id} = req.params;
        const [rows] = await db.query('SELECT * FROM CLIENTE WHERE ID_CLIENTE = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCliente = async (req, res) => {
    try {
        const {nombre_cliente, primer_apellido_cliente, cedula_cliente, telefono_cliente, 
        email_cliente, edad_cliente, peso_cliente, altura_cliente} = req.body;
        const [rows] = await db.query(
            'INSERT INTO CLIENTE (NOMBRE_CLIENTE, PRIMER_APELLIDO_CLIENTE, CEDULA_CLIENTE, TELEFONO_CLIENTE,' 
            + 'EMAIL_CLIENTE, EDAD_CLIENTE, PESO_CLIENTE, ALTURA_CLIENTE) values (?,?,?,?,?,?,?,?)',
            [nombre_cliente, primer_apellido_cliente, cedula_cliente, telefono_cliente, 
                email_cliente, edad_cliente, peso_cliente, altura_cliente]
        );
        res.status(201).json({ message: 'Cliente CREADO', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//CREAR CLIENTE
exports.createCliente = async (req, res) => {
    try {
        const {nombre_cliente, primer_apellido_cliente, cedula_cliente, telefono_cliente, 
        email_cliente, edad_cliente, peso_cliente, altura_cliente} = req.body;
        const [rows] = await db.query(
            'INSERT INTO CLIENTE (NOMBRE_CLIENTE, PRIMER_APELLIDO_CLIENTE, CEDULA_CLIENTE, TELEFONO_CLIENTE,' 
            + 'EMAIL_CLIENTE, EDAD_CLIENTE, PESO_CLIENTE, ALTURA_CLIENTE) values (?,?,?,?,?,?,?,?)',
            [nombre_cliente, primer_apellido_cliente, cedula_cliente, telefono_cliente, 
                email_cliente, edad_cliente, peso_cliente, altura_cliente]
        );
        res.status(201).json({ message: 'Cliente CREADO', id: rows.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//ACTUALIZAR CLIENTE
exports.updateCliente = async (req, res) => {
    try {
        const {id} = req.params;
        const {nombre_cliente, primer_apellido_cliente, cedula_cliente, telefono_cliente,
        email_cliente, edad_cliente, peso_cliente, altura_cliente} = req.body;
        const [rows] = await db.query(
            'UPDATE CLIENTE SET NOMBRE_CLIENTE=?, PRIMER_APELLIDO_CLIENTE=?, CEDULA_CLIENTE=?, TELEFONO_CLIENTE=?,'
            + 'EMAIL_CLIENTE=?, EDAD_CLIENTE=?, PESO_CLIENTE=?, ALTURA_CLIENTE=? WHERE ID_CLIENTE =?',
            [nombre_cliente, primer_apellido_cliente, cedula_cliente, telefono_cliente,
                email_cliente, edad_cliente, peso_cliente, altura_cliente, id]
        );
        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente ACTUALIZADO' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//ELIMINAR CLIENTE
exports.deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            'DELETE FROM CLIENTE WHERE ID_CLIENTE=?',
            [id]
        );
        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente ELIMINADO' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};