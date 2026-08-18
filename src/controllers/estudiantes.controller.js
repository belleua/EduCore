// HU-04: Registrar estudiante
// TODO:
// - crearEstudiante(req,res): nombre_completo, documento_identidad, fecha_nacimiento, grado, tutor_id
// - Validar que no exista otro estudiante con el mismo documento_identidad en la misma escuela_id
// - Al guardar, el estudiante queda asociado a la escuela del usuario que lo registro (req.session.usuario.escuela_id)
// - El expediente digital se genera automaticamente (es el propio registro en la tabla estudiantes,
//   consultado por HU-05)

async function crearEstudiante(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-04 crear estudiante' });
}

module.exports = { crearEstudiante };
