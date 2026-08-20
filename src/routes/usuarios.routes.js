const express = require('express');
const router = express.Router();
const { requireRole, requireAuth } = require('../middlewares/auth.middleware');
const {
  crearUsuario,
  desactivarUsuario,
  listarUsuarios,
  obtenerPerfilPropio,
  agregarAsignacion,
  quitarAsignacion,
} = require('../controllers/usuarios.controller');

router.get('/me', requireAuth, obtenerPerfilPropio);

router.post('/', requireRole('administrador'), crearUsuario);
router.get('/', requireRole('administrador'), listarUsuarios);
router.patch('/:id/desactivar', requireRole('administrador'), desactivarUsuario);

router.post('/:id/asignaciones', requireRole('administrador'), agregarAsignacion);
router.delete('/:id/asignaciones/:asignacionId', requireRole('administrador'), quitarAsignacion);

module.exports = router;