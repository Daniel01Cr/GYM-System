const db = require('../config/db');

exports.getClientes = (req, res) => {
    db.query('SELECT * FROM CLIENTE', (err,results) =>{
        if (err) return res.status(500).json(err);
        res.json(results)
    });
};

//OBTENER CLIENTE BY ID
exports.getClientesByID = (req, res) => {
    const {id} = req.params;
    db.query('SELECT * FROM CLIENTE WHERE ID_CLIENTE = ?', [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.lenght ===0) return res.status(404).json({ message:'Cliente no encontrado'});
        res.json(results[0]);

    });
};

//CREAR CLIENTE
exports.createCliente = (req, res) => {
    const {nombre_cliente, primer_apellido_cliente, cedula_cliente, telefono_cliente, 
        email_cliente, edad_cliente, peso_cliente, altura_cliente} = req.body;
    db.query(
        'INSERT INTO CLIENTE (NOMBRE_CLIENTE, PRIMER_APELLIDO_CLIENTE, CEDULA_CLIENTE, TELEFONO_CLIENTE,' 
        + 'EMAIL_CLIENTE, EDAD_CLIENTE, PESO_CLIENTE, ALTURA_CLIENTE) values (?,?,?,?,?,?,?,?)'
    [nombre_cliente, primer_apellido_cliente, cedula_cliente, telefono_cliente, 
        email_cliente, edad_cliente, peso_cliente, altura_cliente],
    (err, results) =>{
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: 'Cliente CREADO', id : result.insertid});
        }
    );    
}

//ACTUALIZAR CLIENTE
exports.updateCliente = (req, res) => {
    const {id} = req.params;
    const {nombre_cliente, primer_apellido_cliente, cedula_cliente, telefono_cliente, 
        email_cliente, edad_cliente, peso_cliente, altura_cliente} = req.body;
    db.query(
        'UPDATE CLIENTE SET NOMBRE_CLIENTE=?, PRIMER_APELLIDO_CLIENTE=?, CEDULA_CLIENTE=?, TELEFONO_CLIENTE=?,' 
        + 'EMAIL_CLIENTE=?, EDAD_CLIENTE=?, PESO_CLIENTE=?, ALTURA_CLIENTE=? WHERE ID_CLIENTE =?'
    [nombre_cliente, primer_apellido_cliente, cedula_cliente, telefono_cliente, 
        email_cliente, edad_cliente, peso_cliente, altura_cliente],
    (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Cliente ACTUALIZADO' });
        }    
    );
}

//ELIMINAR CLIENTE
exports.deleteCliente = (req, res) => {
    const { id } = req.params;
    db.query(
        'DELETE FROM CLIENTE WHERE ID_CLIENTE=?'
        [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Cliente ELIMINADO' });
    }    
    )
}