const Escuela = require('../models/Escuela');

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
    const existente = await Escuela.findOne({ codigo });
    if (existente) {
      return res.status(409).json({ error: 'Ya existe una escuela registrada con ese codigo.' });
    }

    const escuela = await Escuela.create({ nombre, codigo, direccion, contacto, activa: true });
    return res.status(201).json(escuela);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Ya existe una escuela registrada con ese codigo.' });
    }
    return res.status(500).json({ error: 'Error al registrar la escuela.' });
  }
}

async function listarEscuelas(req, res) {
  try {
    const escuelas = await Escuela.find({ activa: true }).sort({ nombre: 1 });
    return res.json(escuelas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar escuelas.' });
  }
}

module.exports = { crearEscuela, listarEscuelas };