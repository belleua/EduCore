const form = document.getElementById('form-buscar');
const mensajeGeneral = document.getElementById('mensaje-general');
const resultado = document.getElementById('resultado');

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  mensajeGeneral.hidden = true;
  resultado.innerHTML = '';

  const documentoIdentidad = document.getElementById('documentoIdentidad').value.trim();

  if (!documentoIdentidad) {
    mensajeGeneral.hidden = false;
    mensajeGeneral.className = 'mensaje error';
    mensajeGeneral.textContent = 'Ingresa una cédula para buscar.';
    return;
  }

  try {
    const respuesta = await fetch(`/api/calificaciones/buscar?documentoIdentidad=${encodeURIComponent(documentoIdentidad)}`);
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mensajeGeneral.hidden = false;
      mensajeGeneral.className = 'mensaje error';
      mensajeGeneral.textContent = datos.error || 'No se pudo consultar las calificaciones.';
      return;
    }

    renderResultado(datos);
  } catch (err) {
    mensajeGeneral.hidden = false;
    mensajeGeneral.className = 'mensaje error';
    mensajeGeneral.textContent = 'No se pudo conectar con el servidor.';
  }
});

function renderResultado(datos) {
  const encabezado = `
    <h2>${datos.estudiante.nombreCompleto} — ${datos.estudiante.grado}</h2>
  `;

  if (!datos.grupos || datos.grupos.length === 0) {
    resultado.innerHTML = `
      ${encabezado}
      <div class="mensaje">${datos.mensaje || 'Aún no hay calificaciones publicadas.'}</div>
    `;
    return;
  }

  const filas = datos.grupos.map((grupo) => `
    <tr>
      <td>${grupo.asignatura}</td>
      <td>${grupo.periodo}</td>
      <td>${grupo.calificaciones.join(', ')}</td>
      <td class="promedio">${grupo.promedio}</td>
    </tr>
  `).join('');

  resultado.innerHTML = `
    ${encabezado}
    <table class="tabla-notas">
      <thead>
        <tr>
          <th>Asignatura</th>
          <th>Periodo</th>
          <th>Calificaciones</th>
          <th>Promedio</th>
        </tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>
  `;
}