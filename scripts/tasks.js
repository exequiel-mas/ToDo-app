window.addEventListener("load", function () {
  const BASE_URL = "https://ctd-fe2-todo.herokuapp.com/v1";
  const nombreUsuario = document.querySelector(".user-info p");
  const contenedorTareasPendientes =
    document.querySelector(".tareas-pendientes");
  const contenedorTareasTerminadas =
    document.querySelector(".tareas-terminadas");
  const formCrearTarea = document.querySelector("form.nueva-tarea");
  const inputCrearTarea = document.querySelector("#nuevaTarea");
  const JWT = localStorage.getItem("jwt");
  const cantidadTareasFinalizadas = document.getElementById(
    "cantidad-finalizadas"
  );

  document.addEventListener("click", cambiarTarea);
  document.addEventListener("click", borrarTarea);
  document.addEventListener("click", cerrarSesion);
  formCrearTarea.addEventListener("submit", crearTarea);

  obtenerNombreUsuario();
  consultarTareas();

  function obtenerNombreUsuario() {
    const config = {
      method: "GET",
      headers: {
        authorization: JWT,
      },
    };

    fetch(`${BASE_URL}/users/getMe`, config)
      .then((respueta) => respueta.json())
      .then((data) => {
        nombreUsuario.textContent = data.firstName;
      });
  }

  function consultarTareas() {
    const config = {
      method: "GET",
      headers: {
        authorization: JWT,
      },
    };

    fetch(`${BASE_URL}/tasks`, config)
      .then((respuesta) => respuesta.json())
      .then((data) => {
        renderizarTareas(data);
      });
  }

  function crearTarea(e) {
    e.preventDefault();
    const payload = {
      description: inputCrearTarea.value,
      completed: false,
    };

    const config = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        authorization: JWT,
        "Content-Type": "application/json",
      },
    };

    fetch(`${BASE_URL}/tasks`, config)
      .then((response) => response.json())
      .then((info) => {
        consultarTareas();
      });

    this.reset();
  }

  function renderizarTareas(listado) {
    contenedorTareasPendientes.innerHTML = "";
    contenedorTareasTerminadas.innerHTML = "";
    const listadoTareasTerminadas = listado.filter((item) => item.completed);
    const listadoTareasPendientes = listado.filter((item) => !item.completed);
    cantidadTareasFinalizadas.textContent = listadoTareasTerminadas.length;

    listadoTareasPendientes.forEach((tarea) => {
      contenedorTareasPendientes.innerHTML += `
      <li class="tarea" data-aos="fade-down">
        <button class="change" id="${tarea.id}" data-description="${
        tarea.description
      }"><i class="fa-regular fa-circle"></i></button>
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <p class="timestamp">${dayjs(tarea.createdAt).format(
            "MMM D, YYYY"
          )}</p>
        </div>
      </li>
      `;
    });

    listadoTareasTerminadas.forEach((tarea) => {
      contenedorTareasTerminadas.innerHTML += `
      <li class="tarea" data-aos="fade-up">
        <div class="hecha">
          <i class="fa-regular fa-circle-check"></i>
        </div>
        <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <div class="cambios-estados">
            <button class="change incompleta" id="${tarea.id}" data-description="${tarea.description}"><i class="fa-solid fa-rotate-left"></i></button>
            <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      </li>
      `;
    });
  }

  function cambiarTarea(e) {
    if (e.target.classList.contains("change")) {
      const payload = {
        description: e.target.dataset.description,
        completed: e.target.classList.contains("incompleta") ? false : true,
      };

      const config = {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          authorization: JWT,
          "Content-Type": "application/json",
        },
      };
      fetch(`${BASE_URL}/tasks/${e.target.id}`, config)
        .then((response) => response.json())
        .then((info) => {
          consultarTareas();
        });
    }
  }

  function borrarTarea(e) {
    if (e.target.classList.contains("borrar")) {
      const configuraciones = {
        method: "DELETE",
        headers: {
          authorization: JWT,
          "Content-Type": "application/json",
        },
      };

      fetch(`${BASE_URL}/tasks/${e.target.id}`, configuraciones)
        .then((response) => response.json())
        .then((info) => {
          consultarTareas();
        });
    }
  }
});

function cerrarSesion(e) {
  if (e.target.id === "closeApp") {
    const confirmacion = confirm("¿Seguro desea cerrar sesión?");
    if (confirmacion) {
      localStorage.clear();
      location.replace("./");
    }
  }
}
