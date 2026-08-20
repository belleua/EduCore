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

    if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
      return res.status(400).json({
        error: 'Debe incluir al menos un estudiante para inscribir.',
      });
    }

    if (!usuario.escuela) {
      return res.status(400).json({
        error: 'Su cuenta no tiene una escuela asignada. Contacte al administrador.',
      });
    }

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

    return res.status(201).json({
      mensaje: `${inscripcionesCreadas.length} solicitud(es) de inscripción creada(s) correctamente.`,
      inscripciones: inscripcionesCreadas,
    });
  } catch (err) {
    console.error('Error al crear inscripcion:', err.message);
    return res.status(500).json({ error: 'Error al procesar la inscripción.' });
  }
}

// HU-08: Listar solicitudes pendientes
async function listarPendientes(req, res) {
  try {
    const pendientes = await Inscripcion.find({ estado: 'Pendiente' })
      .populate('estudiante')
      .sort({ creadoEn: 1 });

    return res.status(200).json({ pendientes });
  } catch (err) {
    console.error('Error al listar pendientes:', err.message);
    return res.status(500).json({ error: 'Error al consultar las solicitudes pendientes.' });
  }
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

// HU-08: Aprobar o rechazar una solicitud
async function revisarInscripcion(req, res) {
  try {
    const usuario = req.session.usuario;
    const { id } = req.params;
    const { decision, motivoRechazo } = req.body;

    // Paso 1: Validar que la decision sea valida
    if (!['Aprobada', 'Rechazada'].includes(decision)) {
      return res.status(400).json({
        error: 'La decisión debe ser "Aprobada" o "Rechazada".',
      });
    }

    // Paso 2: Si es rechazo, el motivo es obligatorio
    if (decision === 'Rechazada' && !motivoRechazo) {
      return res.status(400).json({
        error: 'Debe indicar un motivo para rechazar la solicitud.',
      });
    }

    // Paso 3: Buscar la inscripcion
    const inscripcion = await Inscripcion.findById(id);
    if (!inscripcion) {
      return res.status(404).json({ error: 'Solicitud de inscripción no encontrada.' });
    }

    // Paso 4: No se puede revisar una solicitud ya revisada
    if (inscripcion.estado !== 'Pendiente') {
      return res.status(400).json({
        error: `Esta solicitud ya fue revisada anteriormente (estado actual: ${inscripcion.estado}).`,
      });
    }

    // Paso 5: Actualizar la inscripcion
    inscripcion.estado = decision;
    inscripcion.revisadoPor = usuario.id;
    inscripcion.revisadoEn = new Date();
    if (decision === 'Rechazada') {
      inscripcion.motivoRechazo = motivoRechazo;
    }
    await inscripcion.save();
    await inscripcion.populate('estudiante');

    return res.status(200).json({
      mensaje: `Solicitud ${decision.toLowerCase()} correctamente.`,
      inscripcion,
    });
  } catch (err) {
    console.error('Error al revisar inscripcion:', err.message);
    return res.status(500).json({ error: 'Error al procesar la revisión.' });
  }
}

module.exports = { crearInscripcion, listarPendientes, listarPorPadre, revisarInscripcion };