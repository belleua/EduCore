const fs = require('fs');
const path = require('path');
const pool = require('./pool');

async function migrate() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  try {
    await pool.query(schema);
    console.log('Migracion completada: tablas creadas/actualizadas.');
  } catch (err) {
    console.error('Error al migrar:', err.message);
  } finally {
    await pool.end();
  }
}

migrate();
