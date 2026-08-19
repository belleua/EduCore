const express = require('express');
const router = express.Router();
const { requireRole, requireAuth } = require('../middlewares/auth.middleware');
const {
  registrarCalificacion,
  consultarCalificaciones,
} = require('../controllers/calificaciones.controller');

// HU-10
router.post('/', requireRole('docente'), registrarCalificacion);
// HU-11
router.get('/:estudianteId', requireAuth, consultarCalificaciones);

module.exports = router;
