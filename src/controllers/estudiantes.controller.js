const Estudiante = require('../models/Estudiante');

// HU-04: Registrar estudiante
// TODO:
// - crearEstudiante(req,res): nombreCompleto, documentoIdentidad, fechaNacimiento, grado, tutor
// - El indice unico { documentoIdentidad, escuela } en el modelo ya evita duplicados en la misma escuela;
//   capturar el error de duplicado (err.code === 11000) y responder 409
// - Al guardar, asociar escuela: req.session.usuario.escuela y registradoPor: req.session.usuario.id
// - El expediente digital es el propio documento en la coleccion, consultado luego por HU-05

async function crearEstudiante(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-04 crear estudiante' });
}

module.exports = { crearEstudiante };
