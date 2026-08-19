function requireAuth(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ error: 'Debe iniciar sesion para continuar.' });
  }
  next();
}

function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({ error: 'Debe iniciar sesion para continuar.' });
    }
    if (!rolesPermitidos.includes(req.session.usuario.rol)) {
      return res.status(403).json({ error: 'Acceso denegado: no tiene permiso para esta seccion.' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };