const Calificacion = require('../models/Calificacion');
const Estudiante = require('../models/Estudiante');
const Usuario = require('../models/Usuario');

function agruparConPromedio(calificaciones) {
  const gruposMap = new Map();
  calificaciones.forEach((c) => {
    const clave = `${c.asignatura}__${c.periodo}`;
    if (!gruposMap.has(clave)) {
      gruposMap.set(clave, { asignatura: c.asignatura, periodo: c.periodo, calificaciones: [] });
    }
    gruposMap.get(clave).calificaciones.push(c.calificacion);
  });

  return Array.from(gruposMap.values()).map((grupo) => ({
    asignatura: grupo.asignatura,
    periodo: grupo.periodo,
    calificaciones: grupo.calificaciones,
    promedio: Number(
      (grupo.calificaciones.reduce((suma, n) => suma + n, 0) / grupo.calificaciones.length).toFixed(2)
    ),
  }));
}

async function registrarCalificacion(req, res) {
  const { documentoIdentidad, asignatura, periodo, calificacion } = req.body;

  const camposFaltantes = [];
  if (!documentoIdentidad) camposFaltantes.push('documentoIdentidad');
  if (!asignatura) camposFaltantes.push('asignatura');
  if (!periodo) camposFaltantes.push('periodo');
  if (calificacion === undefined || calificacion === null || calificacion === '') camposFaltantes.push('calificacion');

  if (camposFaltantes.length > 0) {
    return res.status(400).json({ error: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}` });
  }

  const calificacionNum = Number(calificacion);
  if (Number.isNaN(calificacionNum) || calificacionNum < 0 || calificacionNum > 100) {
    return res.status(400).json({ error: 'La calificación debe ser un número entre 0 y 100.' });
  }

  try {
    const estudiante = await Estudiante.findOne({ documentoIdentidad });
    if (!estudiante) {
      return res.status(404).json({ error: 'No se encontró ningún estudiante con esa cédula.' });
    }

    const docente = await Usuario.findById(req.session.usuario.id);
    if (!docente || docente.rol !== 'docente') {
      return res.status(403).json({ error: 'Solo un docente puede registrar calificaciones.' });
    }

    const tienePermiso = docente.asignaciones.some(
      (a) => a.grado === estudiante.grado && a.asignatura === asignatura
    );

    if (!tienePermiso) {
      return res.status(403).json({
        error: `No tienes asignada la materia "${asignatura}" para el grado "${estudiante.grado}".`,
      });
    }

    const nuevaCalificacion = await Calificacion.create({
      estudiante: estudiante._id,
      docente: docente._id,
      curso: estudiante.grado,
      asignatura,
      periodo,
      calificacion: calificacionNum,
    });

    return res.status(201).json({
      calificacion: nuevaCalificacion,
      estudiante: { nombreCompleto: estudiante.nombreCompleto, grado: estudiante.grado },
    });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'La calificación debe estar entre 0 y 100.' });
    }
    return res.status(500).json({ error: 'Error al registrar la calificación.' });
  }
}

async function buscarCalificacionesPorDocumento(req, res) {
  const { documentoIdentidad } = req.query;
  const usuarioSesion = req.session.usuario;

  if (!documentoIdentidad) {
    return res.status(400).json({ error: 'Debe indicar la cédula del estudiante.' });
  }

  try {
    const estudiante = await Estudiante.findOne({ documentoIdentidad });
    if (!estudiante) {
      return res.status(404).json({ error: 'No se encontró ningún estudiante con esa cédula.' });
    }

    if (usuarioSesion.rol === 'padre' && String(estudiante.tutor) !== String(usuarioSesion.id)) {
      return res.status(403).json({ error: 'No tienes permiso para ver las calificaciones de este estudiante.' });
    }

    const calificaciones = await Calificacion.find({ estudiante: estudiante._id }).sort({ periodo: 1, asignatura: 1 });

    if (calificaciones.length === 0) {
      return res.json({
        estudiante: { nombreCompleto: estudiante.nombreCompleto, grado: estudiante.grado },
        mensaje: 'Aún no hay calificaciones publicadas para este estudiante.',
        grupos: [],
      });
    }

    return res.json({
      estudiante: { nombreCompleto: estudiante.nombreCompleto, grado: estudiante.grado },
      grupos: agruparConPromedio(calificaciones),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al consultar las calificaciones.' });
  }
}

module.exports = { registrarCalificacion, buscarCalificacionesPorDocumento };