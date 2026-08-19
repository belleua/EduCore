const express = require('express');
const router = express.Router();
const { login, logout, usuarioActual } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', usuarioActual);

module.exports = router;