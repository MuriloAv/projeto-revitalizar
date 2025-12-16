const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "'postgresql://neondb_owner:npg_er9F3jhMwnlg@ep-blue-firefly-adu6vpgh-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'", // Cole dentro das aspas!
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;