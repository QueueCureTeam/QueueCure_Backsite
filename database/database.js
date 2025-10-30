const mysql = require('mysql2/promise');
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

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
        const SECRET_ID = "rds-credentials-newcred"; 
        const client = new SecretsManagerClient();
        const command = new GetSecretValueCommand({ SecretId: SECRET_ID });
        const data = await client.send(command);
        const secrets = JSON.parse(data.SecretString);
        
        pool = mysql.createPool({
            host: secrets.host,
            user: secrets.username,
            password: secrets.password,
            database: secrets.dbname, 
            port: 3306
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