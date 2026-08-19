const Estudiante = require('../models/Estudiante');
const Calificacion = require('../models/Calificacion');

// HU-05: Consultar expediente digital
// TODO:
// - obtenerExpediente(req,res): datos personales, grado actual, escuela e historial academico
//   (usar .populate('escuela') y .populate('tutor') para traer los datos relacionados)
// - El padre solo visualiza expedientes de estudiantes asociados a el (estudiante.tutor)
// - El docente visualiza expedientes de estudiantes de sus cursos (via Calificacion.docente)
// - Si el expediente no tiene informacion en alguna seccion (ej. sin calificaciones aun),
//   indicarlo explicitamente en la respuesta

async function obtenerExpediente(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-05 consultar expediente' });
}

module.exports = { obtenerExpediente };
