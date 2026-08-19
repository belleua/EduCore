require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const CORREO_ADMIN = 'admin@educore.com';
const CONTRASENA_ADMIN = 'Admin123456';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB.');

    const existente = await Usuario.findOne({ correo: CORREO_ADMIN });
    if (existente) {
      console.log(`Ya existe un administrador con el correo ${CORREO_ADMIN}. No se creó ninguno nuevo.`);
      process.exit(0);
    }

    const contrasenaHash = await bcrypt.hash(CONTRASENA_ADMIN, 10);
    await Usuario.create({
      nombre: 'Administrador EduCore',
      correo: CORREO_ADMIN,
      contrasenaHash,
      rol: 'administrador',
      activo: true,
    });

    console.log('Administrador creado correctamente:');
    console.log(`  Correo:      ${CORREO_ADMIN}`);
    console.log(`  Contraseña:  ${CONTRASENA_ADMIN}`);
    console.log('Cámbiala después de tu primer login si lo deseas.');
    process.exit(0);
  } catch (err) {
    console.error('Error al crear el administrador:', err.message);
    process.exit(1);
  }
}

seed();