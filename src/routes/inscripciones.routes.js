const express = require('express');
const router = express.Router();
const { requireRole } = require('../middlewares/auth.middleware');
const {
  crearInscripcion,
  listarPendientes,
  listarPorPadre,
  revisarInscripcion,
} = require('../controllers/inscripciones.controller');

// HU-07
router.post('/', requireRole('padre'), crearInscripcion);
router.get('/mis-solicitudes', requireRole('padre'), listarPorPadre);

// HU-08
router.get('/pendientes', requireRole('administrador'), listarPendientes);
router.patch('/:id/revisar', requireRole('administrador'), revisarInscripcion);

module.exports = router;
