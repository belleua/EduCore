const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth.middleware');
const { obtenerExpediente } = require('../controllers/expedientes.controller');

router.get('/:estudianteId', requireAuth, obtenerExpediente);

module.exports = router;
