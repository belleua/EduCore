const Estudiante = require('../models/Estudiante');
const Calificacion = require('../models/Calificacion');

// HU-05: Consultar expediente digital
// - obtenerExpediente(req,res): datos personales, grado actual, escuela e historial academico
//   (usar .populate('escuela') y .populate('tutor') para traer los datos relacionados)
// - El padre solo visualiza expedientes de estudiantes asociados a el (estudiante.tutor)
// - El docente visualiza expedientes de estudiantes de sus cursos (via Calificacion.docente)
// - Si el expediente no tiene informacion en alguna seccion (ej. sin calificaciones aun),
//   indicarlo explicitamente en la respuesta

async function obtenerExpediente(req, res) {
  try {
    const { estudianteId } = req.params;
    const usuario = req.session.usuario;

    // Paso 1: Buscar al estudiante con sus datos relacionados
    const estudiante = await Estudiante.findById(estudianteId)
      .populate('escuela')
      .populate('tutor', '-contrasenaHash');

    // Paso 2: Verificar que el estudiante existe
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    // Paso 3: Verificar permisos segun el rol del usuario logueado
    if (usuario.rol === 'padre') {
      const esTutor =
        estudiante.tutor && estudiante.tutor._id.toString() === usuario.id;
      if (!esTutor) {
        return res.status(403).json({
          error: 'Acceso denegado: este estudiante no esta asociado a usted.',
        });
      }
    } else if (usuario.rol === 'docente') {
      const tieneCurso = await Calificacion.exists({
        estudiante: estudiante._id,
        docente: usuario.id,
      });
      if (!tieneCurso) {
        return res.status(403).json({
          error: 'Acceso denegado: este estudiante no pertenece a sus cursos.',
        });
      }
    }
    // administrador: acceso libre, no se restringe

    // Paso 4: Buscar el historial academico (calificaciones)
    const calificaciones = await Calificacion.find({ estudiante: estudiante._id });

    // Paso 5: Armar la respuesta, indicando explicitamente si falta informacion
    const expediente = {
      datosPersonales: {
        nombreCompleto: estudiante.nombreCompleto,
        documentoIdentidad: estudiante.documentoIdentidad,
        fechaNacimiento: estudiante.fechaNacimiento,
        grado: estudiante.grado,
      },
      escuela: estudiante.escuela || null,
      tutor: estudiante.tutor || null,
      historialAcademico:
        calificaciones.length > 0
          ? calificaciones
          : { mensaje: 'Este estudiante aun no tiene calificaciones registradas.' },
    };

    return res.status(200).json(expediente);
  } catch (err) {
    console.error('Error al consultar expediente:', err.message);
    return res.status(500).json({ error: 'Error al consultar el expediente.' });
  }
}

module.exports = { obtenerExpediente };
