const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'gym_db'
});

connection.connect((err) => {
    if(err){
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL correctamente');
});

module.exports = connection;