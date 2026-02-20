/*const express = require('express');
const pool = require('./src/config/db');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API GYM Funcionando');
});

//RUTA TEST MySQL
app.get('/test-db', async (req, res) => {
try {
    const [rows] = await pool.query('SELECT 1');
    res.json({ message: 'Conexion exitosa a MySQL'});

} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error conectando a MySQL'})
}
});

module.exports = app;*/