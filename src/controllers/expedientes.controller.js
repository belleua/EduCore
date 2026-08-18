// HU-05: Consultar expediente digital
// TODO:
// - obtenerExpediente(req,res): datos personales, grado actual, escuela e historial academico
// - El padre solo visualiza expedientes de estudiantes asociados a el (estudiantes.tutor_id)
// - El docente visualiza expedientes de estudiantes de sus cursos (via tabla calificaciones/cursos)
// - Si el expediente no tiene informacion en alguna seccion, indicarlo explicitamente en la respuesta

async function obtenerExpediente(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-05 consultar expediente' });
}

module.exports = { obtenerExpediente };
