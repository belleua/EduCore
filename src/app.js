require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const conectarDB = require('./db/connection');

const escuelasRoutes = require('./routes/escuelas.routes');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const estudiantesRoutes = require('./routes/estudiantes.routes');
const expedientesRoutes = require('./routes/expedientes.routes');
const inscripcionesRoutes = require('./routes/inscripciones.routes');
const calificacionesRoutes = require('./routes/calificaciones.routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    secret: process.env.SESSION_SECRET || 'dev_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8 horas
  })
);

// HU-01: Registro de escuela
app.use('/api/escuelas', escuelasRoutes);
// HU-02: Inicio de sesion por rol
app.use('/api/auth', authRoutes);
// HU-03: Gestion de usuarios y permisos
app.use('/api/usuarios', usuariosRoutes);
// HU-04: Registrar estudiante
app.use('/api/estudiantes', estudiantesRoutes);
// HU-05: Consultar expediente digital
app.use('/api/expedientes', expedientesRoutes);
// HU-07 / HU-08: Inscripcion en linea / Revisar y aprobar
app.use('/api/inscripciones', inscripcionesRoutes);
// HU-10 / HU-11: Registrar / Consultar calificaciones
app.use('/api/calificaciones', calificacionesRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});

module.exports = app;