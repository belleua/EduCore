const express = require('express');
const router = express.Router();
const { requireRole } = require('../middlewares/auth.middleware');
const { crearEstudiante } = require('../controllers/estudiantes.controller');

router.post('/', requireRole('administrador'), crearEstudiante);

module.exports = router;
