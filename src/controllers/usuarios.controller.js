// HU-03: Gestion de usuarios y permisos
// TODO:
// - crearUsuario(req,res): recibir nombre, correo, rol; hashear contrasena temporal con bcrypt
// - Validar que un usuario solo tenga un rol activo dentro de una escuela
// - desactivarUsuario(req,res): marcar usuarios.activo = false (no eliminar)
// - Usar el middleware requireRole('administrador') en las rutas de este archivo

async function crearUsuario(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-03 crear usuario' });
}

async function desactivarUsuario(req, res) {
  res.status(501).json({ mensaje: 'Pendiente de implementar: HU-03 desactivar usuario' });
}

module.exports = { crearUsuario, desactivarUsuario };
