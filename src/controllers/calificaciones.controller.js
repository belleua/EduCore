// HU-10: Registrar calificaciones (docente)
// HU-11: Consultar calificaciones (estudiante o padre)
// TODO:
// - registrarCalificacion(req,res): docente selecciona curso, asignatura y periodo;
//   validar que calificacion este dentro del rango permitido (0-100, ver CHECK en schema.sql);
//   validar que el docente solo registre calificaciones de sus propios cursos
// - consultarCalificaciones(req,res): agrupar por asignatura y periodo, calcular promedio;
//   si aun no hay calificaciones publicadas, indicarlo claramente en la respuesta

async function registrarCalificacion(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-10 registrar calificacion' });
}

async function consultarCalificaciones(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-11 consultar calificaciones' });
}

module.exports = { registrarCalificacion, consultarCalificaciones };
