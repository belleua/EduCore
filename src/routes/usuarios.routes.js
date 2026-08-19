const express = require('express');
const router = express.Router();
const { requireRole } = require('../middlewares/auth.middleware');
const { crearUsuario, desactivarUsuario, listarUsuarios } = require('../controllers/usuarios.controller');

router.post('/', requireRole('administrador'), crearUsuario);
router.get('/', requireRole('administrador'), listarUsuarios);
router.patch('/:id/desactivar', requireRole('administrador'), desactivarUsuario);

module.exports = router;