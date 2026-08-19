// HU-01: Registro de escuela — lógica del formulario

const form = document.getElementById('form-escuela');
const mensajeGeneral = document.getElementById('mensaje-general');
const listaEscuelas = document.getElementById('lista-escuelas');

const campos = ['nombre', 'codigo', 'direccion', 'contacto'];

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

function validarEnCliente(datos) {
  const errores = {};
  campos.forEach((campo) => {
    if (!datos[campo] || !datos[campo].trim()) {
      errores[campo] = 'Este campo es obligatorio.';
    }
  });
  return errores;
}

async function cargarEscuelas() {
  try {
    const respuesta = await fetch('/api/escuelas');
    const escuelas = await respuesta.json();
    listaEscuelas.innerHTML = '';

    if (!Array.isArray(escuelas) || escuelas.length === 0) {
      listaEscuelas.innerHTML = '<li class="vacio">Aún no hay escuelas registradas.</li>';
      return;
    }

    escuelas.forEach((escuela) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span><strong>${escuela.nombre}</strong> — ${escuela.direccion} · ${escuela.contacto}</span>
        <span class="codigo">${escuela.codigo}</span>
      `;
      listaEscuelas.appendChild(li);
    });
  } catch (err) {
    listaEscuelas.innerHTML = '<li class="vacio">No se pudo cargar el listado de escuelas.</li>';
  }
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limpiarErrores();

  const datos = Object.fromEntries(new FormData(form).entries());
  const erroresCliente = validarEnCliente(datos);

  if (Object.keys(erroresCliente).length > 0) {
    Object.entries(erroresCliente).forEach(([campo, texto]) => {
      document.querySelector(`[data-error-for="${campo}"]`).textContent = texto;
    });
    mostrarMensaje('Revisa los campos marcados.');
    return;
  }

  try {
    const respuesta = await fetch('/api/escuelas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(resultado.error || 'Ocurrió un error al registrar la escuela.');
      return;
    }

    mostrarMensaje(`Escuela "${resultado.nombre}" registrada correctamente.`, 'exito');
    form.reset();
    cargarEscuelas();
  } catch (err) {
    mostrarMensaje('No se pudo conectar con el servidor. Intenta de nuevo.');
  }
});

cargarEscuelas();