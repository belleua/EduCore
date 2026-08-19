const express = require('express');
const router = express.Router();
const { crearEscuela, listarEscuelas } = require('../controllers/escuelas.controller');

router.post('/', crearEscuela);
router.get('/', listarEscuelas);

module.exports = router;