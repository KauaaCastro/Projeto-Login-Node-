const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'Users_Password023', 
    database: 'Users_db',
    charset: 'utf8mb4' 
});

module.exports = pool;