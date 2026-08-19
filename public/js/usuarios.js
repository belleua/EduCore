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
      const badgeClase = usuario.activo ? 'estado-badge' : 'estado-badge inactivo';
      const badgeTexto = usuario.activo ? 'Activo' : 'Desactivado';
      li.innerHTML = `
        <span>
          <strong>${usuario.nombre}</strong> (${usuario.rol})
          <br><span class="correo">${usuario.correo}</span>
        </span>
        <span style="display:flex; align-items:center; gap:0.6rem;">
          <span class="${badgeClase}">${badgeTexto}</span>
          ${usuario.activo ? `<button data-id="${usuario._id}" class="btn-desactivar">Desactivar</button>` : ''}
        </span>
      `;
      listaUsuarios.appendChild(li);
    });

    document.querySelectorAll('.btn-desactivar').forEach((boton) => {
      boton.addEventListener('click', () => desactivarUsuario(boton.dataset.id));
    });
  } catch (err) {
    listaUsuarios.innerHTML = '<li class="vacio">No se pudo cargar el listado de usuarios.</li>';
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