const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mdb',
    password: 'mouadali2020',
    port: 5432, // default Postgres port
});

// Function to check the connection
const checkConnection = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('Connection successful, current time:', result.rows[0]);
        client.release(); // Release the client back to the pool
    } catch (err) {
        console.error('Error connecting to the database:', err.stack);
    }
};

// Export both the pool and the connection check function
module.exports = { pool, checkConnection };
