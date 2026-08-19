const Inscripcion = require('../models/Inscripcion');
const Estudiante = require('../models/Estudiante');

// HU-07: Inscripcion en linea (padre)
// HU-08: Revisar y aprobar inscripcion (personal administrativo)

const GRADOS_VALIDOS = [
  'Pre-Primario',
  '1ro Primaria', '2do Primaria', '3ro Primaria', '4to Primaria', '5to Primaria', '6to Primaria',
  '1ro Secundaria', '2do Secundaria', '3ro Secundaria', '4to Secundaria', '5to Secundaria', '6to Secundaria',
];

const PERIODO_ACTUAL = '2026-2027';

async function crearInscripcion(req, res) {
  try {
    const usuario = req.session.usuario;
    const { estudiantes } = req.body;

    // Paso 1: Validar que se envio un arreglo con al menos un estudiante
    if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
      return res.status(400).json({
        error: 'Debe incluir al menos un estudiante para inscribir.',
      });
    }

    // Paso 2: Validar que el padre tenga una escuela asignada
    if (!usuario.escuela) {
      return res.status(400).json({
        error: 'Su cuenta no tiene una escuela asignada. Contacte al administrador.',
      });
    }

    // Paso 3: Validar cada estudiante antes de guardar nada (todo o nada)
    const errores = [];
    estudiantes.forEach((est, index) => {
      const { nombreCompleto, documentoIdentidad, fechaNacimiento, grado } = est;
      if (!nombreCompleto || !documentoIdentidad || !fechaNacimiento || !grado) {
        errores.push(`Estudiante #${index + 1}: faltan campos obligatorios.`);
      } else if (!GRADOS_VALIDOS.includes(grado)) {
        errores.push(`Estudiante #${index + 1}: el grado "${grado}" no es válido.`);
      }
    });

    if (errores.length > 0) {
      return res.status(400).json({ error: 'Datos inválidos.', detalles: errores });
    }

    // Paso 4: Crear Estudiante + Inscripcion por cada uno
    const inscripcionesCreadas = [];

    for (const est of estudiantes) {
      const nuevoEstudiante = await Estudiante.create({
        nombreCompleto: est.nombreCompleto,
        documentoIdentidad: est.documentoIdentidad,
        fechaNacimiento: est.fechaNacimiento,
        grado: est.grado,
        tutor: usuario.id,
        escuela: usuario.escuela,
        registradoPor: usuario.id,
      });

      const nuevaInscripcion = await Inscripcion.create({
        estudiante: nuevoEstudiante._id,
        solicitadoPor: usuario.id,
        escuela: usuario.escuela,
        grado: est.grado,
        periodo: PERIODO_ACTUAL,
      });

      inscripcionesCreadas.push(nuevaInscripcion);
    }

    // Paso 5: Responder con las inscripciones creadas
    return res.status(201).json({
      mensaje: `${inscripcionesCreadas.length} solicitud(es) de inscripción creada(s) correctamente.`,
      inscripciones: inscripcionesCreadas,
    });
  } catch (err) {
    console.error('Error al crear inscripcion:', err.message);
    return res.status(500).json({ error: 'Error al procesar la inscripción.' });
  }
}

async function listarPendientes(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-08 listar pendientes' });
}

async function listarPorPadre(req, res) {
  try {
    const usuario = req.session.usuario;

    const inscripciones = await Inscripcion.find({ solicitadoPor: usuario.id })
      .populate('estudiante')
      .sort({ creadoEn: -1 });

    return res.status(200).json({ inscripciones });
  } catch (err) {
    console.error('Error al listar inscripciones:', err.message);
    return res.status(500).json({ error: 'Error al consultar sus solicitudes.' });
  }
}

async function revisarInscripcion(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-08 revisar inscripcion' });
}

module.exports = { crearInscripcion, listarPendientes, listarPorPadre, revisarInscripcion };