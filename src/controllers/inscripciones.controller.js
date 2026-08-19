const Inscripcion = require('../models/Inscripcion');

// HU-07: Inscripcion en linea (padre)
// HU-08: Revisar y aprobar inscripcion (personal administrativo)
// TODO:
// - crearInscripcion(req,res): el padre completa el formulario; validar todos los campos obligatorios
//   antes de guardar; la solicitud queda con estado 'Pendiente' (valor por defecto del modelo)
// - listarPendientes(req,res): Inscripcion.find({ estado: 'Pendiente' }).populate('estudiante')
// - listarPorPadre(req,res): Inscripcion.find({ solicitadoPor: req.session.usuario.id })
// - revisarInscripcion(req,res): aprobar o rechazar indicando un motivo (motivoRechazo obligatorio
//   si se rechaza). Al aprobar, actualizar tambien el estudiante con el grado/periodo correspondiente

async function crearInscripcion(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-07 crear inscripcion' });
}

async function listarPendientes(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-08 listar pendientes' });
}

async function listarPorPadre(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-07 estado de solicitud' });
}

async function revisarInscripcion(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-08 revisar inscripcion' });
}

module.exports = { crearInscripcion, listarPendientes, listarPorPadre, revisarInscripcion };
