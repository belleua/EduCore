const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

async function login(req, res) {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
  }

  try {
    const usuario = await Usuario.findOne({ correo: correo.toLowerCase(), activo: true });

    if (!usuario) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const coincide = await bcrypt.compare(contrasena, usuario.contrasenaHash);
    if (!coincide) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    req.session.usuario = {
      id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      escuela: usuario.escuela,
    };

    return res.json({ usuario: req.session.usuario });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
}

async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al cerrar sesión.' });
    }
    res.clearCookie('connect.sid');
    return res.json({ mensaje: 'Sesión cerrada correctamente.' });
  });
}

async function usuarioActual(req, res) {
  if (!req.session.usuario) {
    return res.status(401).json({ error: 'No hay sesión activa.' });
  }
  return res.json({ usuario: req.session.usuario });
}

module.exports = { login, logout, usuarioActual };