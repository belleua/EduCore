# EduCore

Proyecto académico — plataforma web para que escuelas gestionen usuarios, estudiantes, inscripciones y calificaciones.

## Stack

- **Backend**: Node.js + Express
- **Frontend**: HTML/CSS/JavaScript plano
- **Base de datos**: MongoDB (Atlas) + Mongoose

## Requisitos previos

- Node.js 18+
- Acceso a la base de datos compartida en MongoDB Atlas (ver abajo)

## Base de datos compartida (MongoDB Atlas)

Todo el equipo usa el **mismo cluster de MongoDB Atlas**, así que todos ven los mismos datos.

**Quien crea el cluster (una sola vez):**
1. Crear cuenta/proyecto en https://www.mongodb.com/cloud/atlas (plan gratuito M0).
2. Crear un cluster (M0 Free Tier).
3. En **Database Access**, crear un usuario de base de datos con contraseña (evitar símbolos raros para que sea más fácil de copiar).
4. En **Network Access**, agregar `0.0.0.0/0` (permitir acceso desde cualquier IP) — para un proyecto académico esto simplifica que todo el equipo se conecte sin configurar IPs una por una.
5. En **Connect → Drivers → Node.js**, copiar el connection string (`mongodb+srv://...`).
6. Compartir ese connection string con el equipo por un canal privado (no lo subas a GitHub — ya está en `.gitignore` vía `.env`).

**Cada integrante del equipo:**
```bash
npm install
cp .env.example .env
# pega el MONGODB_URI que te compartieron en .env
npm run dev
```

El servidor queda disponible en `http://localhost:3000`. Mongoose crea las colecciones automáticamente la primera vez que se guarda un documento — no hace falta correr ninguna migración.

> ⚠️ Nunca subas el archivo `.env` a GitHub — solo `.env.example` (sin credenciales reales) va al repositorio.

## Estructura del proyecto

```
src/
  app.js                 # punto de entrada de Express
  db/
    connection.js          # conexion a MongoDB (Mongoose)
  models/                 # esquemas de Mongoose (Escuela, Usuario, Estudiante, Inscripcion, Calificacion)
  routes/                 # rutas por historia de usuario
  controllers/            # lógica de cada endpoint
  middlewares/            # autenticación y control de roles
public/
  css/ js/ views/          # frontend plano
```

## Historias de usuario — Sprint 1

| HU | Descripción | Rama |
|----|-------------|------|
| HU-01 | Registro de escuela | `feature/HU-01-registro-escuela` |
| HU-02 | Inicio de sesión por rol | `feature/HU-02-login-por-rol` |
| HU-03 | Gestión de usuarios y permisos | `feature/HU-03-gestion-usuarios-permisos` |
| HU-04 | Registrar estudiante | `feature/HU-04-registrar-estudiante` |
| HU-05 | Consultar expediente digital | `feature/HU-05-consultar-expediente` |
| HU-07 | Inscripción en línea | `feature/HU-07-inscripcion-en-linea` |
| HU-08 | Revisar y aprobar inscripción | `feature/HU-08-revisar-aprobar-inscripcion` |
| HU-10 | Registrar calificaciones | `feature/HU-10-registrar-calificaciones` |
| HU-11 | Consultar calificaciones | `feature/HU-11-consultar-calificaciones` |

`HU-01` viene implementada como ejemplo de referencia (validaciones, respuestas de error, código duplicado). El resto de las rutas/controladores están creadas como *stubs* con comentarios `TODO` que resumen los criterios de aceptación de cada historia.

## Flujo de trabajo con Git

- `main`: código estable, listo para entrega/demo del sprint.
- `develop`: rama de integración del sprint. Todas las features se mergean aquí primero.
- `feature/HU-XX-nombre-corto`: una rama por historia de usuario, creada desde `develop`.

Flujo sugerido por historia de usuario:

```bash
git checkout develop
git pull
git checkout feature/HU-XX-nombre-corto
# ... trabajar, hacer commits ...
git push origin feature/HU-XX-nombre-corto
# abrir Pull Request hacia develop en GitHub
```

Al cerrar el sprint, se mergea `develop` → `main`.
