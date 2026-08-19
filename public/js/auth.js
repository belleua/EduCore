const form = document.getElementById('form-login');
const mensajeGeneral = document.getElementById('mensaje-general');

const PANEL_POR_ROL = {
  administrador: '/views/usuarios.html',
  docente: '/views/index.html',
  padre: '/views/index.html',
  estudiante: '/views/index.html',
};

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  mensajeGeneral.hidden = true;
  mensajeGeneral.className = 'mensaje';

  const datos = Object.fromEntries(new FormData(form).entries());

  try {
    const respuesta = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      mensajeGeneral.hidden = false;
      mensajeGeneral.textContent = resultado.error || 'No se pudo iniciar sesión.';
      mensajeGeneral.className = 'mensaje error';
      return;
    }

    const destino = PANEL_POR_ROL[resultado.usuario.rol] || '/views/index.html';
    window.location.href = destino;
  } catch (err) {
    mensajeGeneral.hidden = false;
    mensajeGeneral.textContent = 'No se pudo conectar con el servidor. Intenta de nuevo.';
    mensajeGeneral.className = 'mensaje error';
  }
});