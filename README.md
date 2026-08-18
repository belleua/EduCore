# EduCore

Proyecto académico — plataforma web para que escuelas gestionen usuarios, estudiantes, inscripciones y calificaciones.

## Stack

- **Backend**: Node.js + Express
- **Frontend**: HTML/CSS/JavaScript plano
- **Base de datos**: PostgreSQL

## Requisitos previos

- Node.js 18+
- PostgreSQL 14+ corriendo localmente (o accesible por red)

## Instalación

```bash
npm install
cp .env.example .env
# edita .env con tus credenciales de PostgreSQL
npm run migrate   # crea las tablas
npm run dev        # levanta el servidor con nodemon
```

El servidor queda disponible en `http://localhost:3000`.

## Estructura del proyecto

```
src/
  app.js                 # punto de entrada de Express
  db/
    pool.js               # conexión a PostgreSQL
    schema.sql             # esquema de base de datos
    migrate.js             # script de migración
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
