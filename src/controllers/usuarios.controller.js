const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Usuario = require('../models/Usuario');

const ROLES_VALIDOS = ['administrador', 'docente', 'padre', 'estudiante'];

function generarContrasenaTemporal() {
  return crypto.randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
}

async function crearUsuario(req, res) {
  const { nombre, correo, rol, escuelaId } = req.body;

  const camposFaltantes = [];
  if (!nombre) camposFaltantes.push('nombre');
  if (!correo) camposFaltantes.push('correo');
  if (!rol) camposFaltantes.push('rol');

  if (camposFaltantes.length > 0) {
    return res.status(400).json({ error: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}` });
  }

  if (!ROLES_VALIDOS.includes(rol)) {
    return res.status(400).json({ error: `Rol inválido. Debe ser uno de: ${ROLES_VALIDOS.join(', ')}.` });
  }

  try {
    const contrasenaTemporal = generarContrasenaTemporal();
    const contrasenaHash = await bcrypt.hash(contrasenaTemporal, 10);

    const usuario = await Usuario.create({
      nombre,
      correo: correo.toLowerCase(),
      contrasenaHash,
      rol,
      escuela: escuelaId || req.session.usuario?.escuela,
      activo: true,
    });

    return res.status(201).json({
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        activo: usuario.activo,
      },
      contrasenaTemporal,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Ya existe un usuario registrado con ese correo.' });
    }
    return res.status(500).json({ error: 'Error al crear el usuario.' });
  }
}

async function desactivarUsuario(req, res) {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    return res.json({ mensaje: `Usuario ${usuario.correo} desactivado.`, usuario });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al desactivar el usuario.' });
  }
}

async function listarUsuarios(req, res) {
  try {
    const usuarios = await Usuario.find().select('-contrasenaHash').sort({ nombre: 1 });
    return res.json(usuarios);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar usuarios.' });
  }
}

async function obtenerPerfilPropio(req, res) {
  try {
    const usuario = await Usuario.findById(req.session.usuario.id).select('-contrasenaHash');
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    return res.json(usuario);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener el perfil.' });
  }
}

async function agregarAsignacion(req, res) {
  const { grado, asignatura } = req.body;

  if (!grado || !asignatura) {
    return res.status(400).json({ error: 'Debe indicar grado y asignatura.' });
  }

  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    if (usuario.rol !== 'docente') {
      return res.status(400).json({ error: 'Solo se pueden asignar materias a usuarios con rol docente.' });
    }

    const yaExiste = usuario.asignaciones.some(
      (a) => a.grado === grado && a.asignatura === asignatura
    );
    if (yaExiste) {
      return res.status(409).json({ error: 'Esa asignación ya existe para este docente.' });
    }

    usuario.asignaciones.push({ grado, asignatura });
    await usuario.save();

    return res.status(201).json({ asignaciones: usuario.asignaciones });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al agregar la asignación.' });
  }
}

async function quitarAsignacion(req, res) {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    usuario.asignaciones = usuario.asignaciones.filter(
      (a) => a._id.toString() !== req.params.asignacionId
    );
    await usuario.save();

    return res.json({ asignaciones: usuario.asignaciones });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al quitar la asignación.' });
  }
}

module.exports = {
  crearUsuario,
  desactivarUsuario,
  listarUsuarios,
  obtenerPerfilPropio,
  agregarAsignacion,
  quitarAsignacion,
};