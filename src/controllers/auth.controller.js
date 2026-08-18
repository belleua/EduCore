// HU-02: Inicio de sesion por rol
// TODO:
// - login(req,res): validar correo y contrasena contra usuarios.contrasena_hash (bcrypt.compare)
// - Si las credenciales son invalidas, responder con mensaje generico (sin indicar cual dato fallo)
// - Al autenticar, guardar req.session.usuario = { id, nombre, rol, escuela_id }
// - logout(req,res): destruir la sesion (req.session.destroy)
// - Redirigir/responder segun el rol: administrador, docente, padre, estudiante

async function login(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-02 login' });
}

async function logout(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-02 logout' });
}

module.exports = { login, logout };
