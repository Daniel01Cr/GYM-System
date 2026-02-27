//const mysql = require('mysql2');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'gym_db',
    waitForConnections: true,
    connectionLimit: 10
});



/*
connection.connect((err) => {
    if(err){
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL correctamente');
});
*/

module.exports = pool;