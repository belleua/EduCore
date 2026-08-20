const form = document.getElementById('form-usuario');
const mensajeGeneral = document.getElementById('mensaje-general');
const listaUsuarios = document.getElementById('lista-usuarios');

function mostrarMensaje(texto, tipo = 'error') {
  mensajeGeneral.hidden = false;
  mensajeGeneral.className = `mensaje ${tipo}`;
  mensajeGeneral.innerHTML = tipo === 'exito'
    ? `${iconoSello()}<span>${texto}</span>`
    : `<span>${texto}</span>`;
}

async function cargarUsuarios() {
  try {
    const respuesta = await fetch('/api/usuarios');

    if (respuesta.status === 401) {
      window.location.href = '/views/login.html';
      return;
    }
    if (respuesta.status === 403) {
      listaUsuarios.innerHTML = '<li class="vacio">No tienes permiso para ver esta sección.</li>';
      return;
    }

    const usuarios = await respuesta.json();
    listaUsuarios.innerHTML = '';

    if (!Array.isArray(usuarios) || usuarios.length === 0) {
      listaUsuarios.innerHTML = '<li class="vacio">Aún no hay usuarios registrados.</li>';
      return;
    }

    usuarios.forEach((usuario) => {
      const li = document.createElement('li');
      li.style.flexDirection = 'column';
      li.style.alignItems = 'stretch';

      const badgeClase = usuario.activo ? 'estado-badge' : 'estado-badge inactivo';
      const badgeTexto = usuario.activo ? 'Activo' : 'Desactivado';
      const esDocente = usuario.rol === 'docente';

      li.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem;">
          <span>
            <strong>${usuario.nombre}</strong> (${usuario.rol})
            <br><span class="correo">${usuario.correo}</span>
          </span>
          <span style="display:flex; align-items:center; gap:0.6rem;">
            <span class="${badgeClase}">${badgeTexto}</span>
            ${esDocente ? `<button type="button" data-toggle-asignaciones="${usuario._id}" class="btn-secundario">Materias</button>` : ''}
            ${usuario.activo ? `<button data-id="${usuario._id}" class="btn-desactivar">Desactivar</button>` : ''}
          </span>
        </div>
        ${esDocente ? `<div class="panel-asignaciones" id="asignaciones-${usuario._id}" hidden></div>` : ''}
      `;
      listaUsuarios.appendChild(li);
    });

    document.querySelectorAll('.btn-desactivar').forEach((boton) => {
      boton.addEventListener('click', () => desactivarUsuario(boton.dataset.id));
    });

    document.querySelectorAll('[data-toggle-asignaciones]').forEach((boton) => {
      boton.addEventListener('click', () => toggleAsignaciones(boton.dataset.toggleAsignaciones));
    });
  } catch (err) {
    listaUsuarios.innerHTML = '<li class="vacio">No se pudo cargar el listado de usuarios.</li>';
  }
}

function renderAsignaciones(usuarioId, asignaciones) {
  const contenedor = document.getElementById(`asignaciones-${usuarioId}`);

  const filas = asignaciones.length
    ? asignaciones.map((a) => `
        <li>
          <span>${a.grado} — ${a.asignatura}</span>
          <button type="button" data-quitar="${a._id}" data-usuario="${usuarioId}">Quitar</button>
        </li>
      `).join('')
    : '<li class="vacio">Sin materias asignadas todavía.</li>';

  contenedor.innerHTML = `
    <ul class="lista-registros" style="margin: 0.75rem 0;">${filas}</ul>
    <form class="form-asignacion" data-usuario="${usuarioId}">
      <input type="text" name="grado" placeholder="Grado (ej. 6to)" required />
      <input type="text" name="asignatura" placeholder="Asignatura (ej. Matemáticas)" required />
      <button type="submit">Agregar</button>
    </form>
  `;

  contenedor.querySelectorAll('[data-quitar]').forEach((boton) => {
    boton.addEventListener('click', () => quitarAsignacion(boton.dataset.usuario, boton.dataset.quitar));
  });

  contenedor.querySelector('.form-asignacion').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const datos = Object.fromEntries(new FormData(evento.target).entries());
    await agregarAsignacion(usuarioId, datos.grado, datos.asignatura);
    evento.target.reset();
  });
}

async function toggleAsignaciones(usuarioId) {
  const contenedor = document.getElementById(`asignaciones-${usuarioId}`);
  if (!contenedor.hidden) {
    contenedor.hidden = true;
    return;
  }

  contenedor.hidden = false;
  contenedor.innerHTML = '<p class="subtitulo">Cargando...</p>';

  try {
    const respuesta = await fetch('/api/usuarios');
    const usuarios = await respuesta.json();
    const usuario = usuarios.find((u) => u._id === usuarioId);
    renderAsignaciones(usuarioId, usuario?.asignaciones || []);
  } catch (err) {
    contenedor.innerHTML = '<p class="mensaje error">No se pudo cargar las asignaciones.</p>';
  }
}

async function agregarAsignacion(usuarioId, grado, asignatura) {
  try {
    const respuesta = await fetch(`/api/usuarios/${usuarioId}/asignaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grado, asignatura }),
    });
    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(resultado.error || 'No se pudo agregar la asignación.');
      return;
    }

    renderAsignaciones(usuarioId, resultado.asignaciones);
  } catch (err) {
    mostrarMensaje('No se pudo conectar con el servidor.');
  }
}

async function quitarAsignacion(usuarioId, asignacionId) {
  try {
    const respuesta = await fetch(`/api/usuarios/${usuarioId}/asignaciones/${asignacionId}`, {
      method: 'DELETE',
    });
    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(resultado.error || 'No se pudo quitar la asignación.');
      return;
    }

    renderAsignaciones(usuarioId, resultado.asignaciones);
  } catch (err) {
    mostrarMensaje('No se pudo conectar con el servidor.');
  }
}

async function desactivarUsuario(id) {
  try {
    const respuesta = await fetch(`/api/usuarios/${id}/desactivar`, { method: 'PATCH' });
    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(resultado.error || 'No se pudo desactivar el usuario.');
      return;
    }

    cargarUsuarios();
  } catch (err) {
    mostrarMensaje('No se pudo conectar con el servidor.');
  }
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  mensajeGeneral.hidden = true;

  const datos = Object.fromEntries(new FormData(form).entries());

  try {
    const respuesta = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(resultado.error || 'No se pudo crear el usuario.');
      return;
    }

    mostrarMensaje(
      `Usuario creado. Contraseña temporal: <span style="font-family: var(--font-mono); font-weight: 600;">${resultado.contrasenaTemporal}</span> (compártela por un canal seguro).`,
      'exito'
    );
    form.reset();
    cargarUsuarios();
  } catch (err) {
    mostrarMensaje('No se pudo conectar con el servidor.');
  }
});

cargarUsuarios();