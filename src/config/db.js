require('dotenv').config();
const mysql = require('mysql2/promise');
 
const pool = mysql.createPool({
    host:            process.env.DB_HOST,
    user:            process.env.DB_USER,
    password:        process.env.DB_PASSWORD,
    database:        process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10
});
 
module.exports = pool;

//const mysql = require('mysql2');
/*const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'gym_db',
    waitForConnections: true,
    connectionLimit: 10
});*/