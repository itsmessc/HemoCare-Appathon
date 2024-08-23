const { Pool } = require('pg');

// Create a new pool instance
const pool = new Pool({
    connectionString: 'postgres://avnadmin:AVNS_GCnjM7tQvL78oye176S@pg-aad7f99-wixpolo-8a36.h.aivencloud.com:26046/defaultdb',
    ssl: {
        rejectUnauthorized: false
    }
});

// Export the pool instance for use in other modules
module.exports = pool;
