async function initLayout() {
  const paginaActual = document.body.dataset.page;
  document.querySelectorAll('.nav-lista a').forEach((link) => {
    if (link.dataset.page === paginaActual) link.classList.add('activo');
  });

  const zonaUsuario = document.getElementById('nav-usuario');
  if (!zonaUsuario) return;

  try {
    const respuesta = await fetch('/api/auth/me');
    if (!respuesta.ok) {
      zonaUsuario.innerHTML = '<a href="/views/login.html" class="entrar">Iniciar sesión</a>';
      return;
    }

    const { usuario } = await respuesta.json();
    zonaUsuario.innerHTML = `
      <div class="nombre">${usuario.nombre}</div>
      <span class="rol-pill">${usuario.rol}</span>
      <button id="btn-logout" type="button">Cerrar sesión</button>
    `;

    document.getElementById('btn-logout').addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/views/login.html';
    });

    if (usuario.rol !== 'administrador') {
      document.querySelectorAll('[data-solo-admin]').forEach((el) => el.remove());
    }
  } catch (err) {
    zonaUsuario.innerHTML = '<a href="/views/login.html" class="entrar">Iniciar sesión</a>';
  }
}

function iconoSello() {
  return `
    <div class="sello">
      <svg viewBox="0 0 24 24" fill="none" stroke="#2F6F5E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', initLayout);