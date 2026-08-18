const express = require('express');
const router = express.Router();
const { crearEscuela, listarEscuelas } = require('../controllers/escuelas.controller');

// POST /api/escuelas - HU-01
router.post('/', crearEscuela);
// GET /api/escuelas - listado (soporta el criterio "activa y visible en el listado")
router.get('/', listarEscuelas);

module.exports = router;
