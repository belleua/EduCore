const express = require('express');
const router = express.Router();
const { requireRole, requireAuth } = require('../middlewares/auth.middleware');
const {
  registrarCalificacion,
  buscarCalificacionesPorDocumento,
} = require('../controllers/calificaciones.controller');

router.post('/', requireRole('docente'), registrarCalificacion);
router.get('/buscar', requireAuth, buscarCalificacionesPorDocumento);

module.exports = router;