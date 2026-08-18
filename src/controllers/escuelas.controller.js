const pool = require('../db/pool');

// HU-01: Registro de escuela
// Criterios: nombre, codigo, direccion y contacto obligatorios;
// no permite codigos duplicados; queda activa y visible al guardar.

async function crearEscuela(req, res) {
  const { nombre, codigo, direccion, contacto } = req.body;

  const camposFaltantes = [];
  if (!nombre) camposFaltantes.push('nombre');
  if (!codigo) camposFaltantes.push('codigo');
  if (!direccion) camposFaltantes.push('direccion');
  if (!contacto) camposFaltantes.push('contacto');

  if (camposFaltantes.length > 0) {
    return res.status(400).json({
      error: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`,
    });
  }

  try {
    const existente = await pool.query('SELECT id FROM escuelas WHERE codigo = $1', [codigo]);
    if (existente.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe una escuela registrada con ese codigo.' });
    }

    const resultado = await pool.query(
      `INSERT INTO escuelas (nombre, codigo, direccion, contacto, activa)
       VALUES ($1, $2, $3, $4, TRUE) RETURNING *`,
      [nombre, codigo, direccion, contacto]
    );

    return res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al registrar la escuela.' });
  }
}

async function listarEscuelas(req, res) {
  try {
    const resultado = await pool.query('SELECT * FROM escuelas WHERE activa = TRUE ORDER BY nombre');
    return res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar escuelas.' });
  }
}

module.exports = { crearEscuela, listarEscuelas };
