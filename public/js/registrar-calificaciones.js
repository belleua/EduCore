const form = document.getElementById('form-calificacion');
const mensajeGeneral = document.getElementById('mensaje-general');
const selectGrado = document.getElementById('grado');
const selectAsignatura = document.getElementById('asignatura');
const avisoSinAsignaciones = document.getElementById('sin-asignaciones');
const fichaFormulario = document.getElementById('ficha-formulario');

const campos = ['documentoIdentidad', 'grado', 'asignatura', 'periodo', 'calificacion'];

let asignacionesDocente = [];

function limpiarErrores() {
  campos.forEach((campo) => {
    document.querySelector(`[data-error-for="${campo}"]`).textContent = '';
  });
  mensajeGeneral.hidden = true;
  mensajeGeneral.innerHTML = '';
  mensajeGeneral.className = 'mensaje';
}

function mostrarMensaje(texto, tipo = 'error') {
  mensajeGeneral.hidden = false;
  mensajeGeneral.className = `mensaje ${tipo}`;
  mensajeGeneral.innerHTML = tipo === 'exito'
    ? `${iconoSello()}<span>${texto}</span>`
    : `<span>${texto}</span>`;
}

async function cargarAsignaciones() {
  try {
    const respuesta = await fetch('/api/usuarios/me');

    if (respuesta.status === 401) {
      window.location.href = '/views/login.html';
      return;
    }

    const usuario = await respuesta.json();

    if (usuario.rol !== 'docente') {
      fichaFormulario.hidden = true;
      mostrarMensaje('Esta sección es solo para docentes.');
      return;
    }

    asignacionesDocente = usuario.asignaciones || [];

    if (asignacionesDocente.length === 0) {
      fichaFormulario.hidden = true;
      avisoSinAsignaciones.hidden = false;
      return;
    }

    const grados = [...new Set(asignacionesDocente.map((a) => a.grado))];
    selectGrado.innerHTML = '<option value="">Selecciona un grado</option>' +
      grados.map((g) => `<option value="${g}">${g}</option>`).join('');
  } catch (err) {
    mostrarMensaje('No se pudo cargar tus asignaciones.');
  }
}

selectGrado.addEventListener('change', () => {
  const grado = selectGrado.value;
  const asignaturas = asignacionesDocente
    .filter((a) => a.grado === grado)
    .map((a) => a.asignatura);

  selectAsignatura.innerHTML = asignaturas.length
    ? '<option value="">Selecciona una asignatura</option>' + asignaturas.map((a) => `<option value="${a}">${a}</option>`).join('')
    : '<option value="">Sin asignaturas para este grado</option>';
});

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limpiarErrores();

  const datos = Object.fromEntries(new FormData(form).entries());
  const { grado, ...datosParaEnviar } = datos;

  try {
    const respuesta = await fetch('/api/calificaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosParaEnviar),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(resultado.error || 'No se pudo registrar la calificación.');
      return;
    }

    mostrarMensaje(
      `Calificación registrada para ${resultado.estudiante.nombreCompleto} (${resultado.estudiante.grado}).`,
      'exito'
    );
    form.reset();
    selectAsignatura.innerHTML = '<option value="">Selecciona un grado primero</option>';
  } catch (err) {
    mostrarMensaje('No se pudo conectar con el servidor.');
  }
});

cargarAsignaciones();