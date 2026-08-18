// HU-07: Inscripcion en linea (padre)
// HU-08: Revisar y aprobar inscripcion (personal administrativo)
// TODO:
// - crearInscripcion(req,res): el padre completa el formulario; validar todos los campos obligatorios
//   antes de guardar; la solicitud queda en estado 'Pendiente'
// - listarPendientes(req,res): listar solicitudes pendientes con fecha y estudiante (para administrativos)
// - listarPorPadre(req,res): el padre puede ver el estado de su(s) solicitud(es)
// - revisarInscripcion(req,res): aprobar o rechazar indicando un motivo (motivo_rechazo obligatorio si se rechaza)
//   Al aprobar, el estudiante queda inscrito en el grado y periodo correspondiente

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
