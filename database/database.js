const mysql = require('mysql2/promise');
let pool; // connection

async function initDatabase() {
    if (pool) return pool;

    if (process.env.NODE_ENV === 'development') {
        console.log("กำลังเชื่อมต่อ Database (Localhost)...");
        pool = mysql.createPool({
            host: '127.0.0.1', 
            user: 'root',      
            password: '',      
            database: 'queuecure', 
            port: 3306
        });

    } 
    else {
        console.log("กำลังเชื่อมต่อ Database (RDS)...");
        pool = mysql.createPool({
            host: process.env.RDS_HOST,
            user: process.env.RDS_USER,
            password: process.env.RDS_PASSWORD,
            database: process.env.RDS_DBNAME,
            port: process.env.RDS_PORT || 3306,
        });
    }

    const connection = await pool.getConnection();
    console.log("✅ Database เชื่อมต่อสำเร็จ!");
    connection.release();
    return pool;
}

function getDbPool() {
    if (!pool) {
        throw new Error("Database pool ยังไม่ถูกสร้าง! เรียก initDatabase() ก่อน");
    }
    return pool;
}

module.exports = { initDatabase, getDbPool };