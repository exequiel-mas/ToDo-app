function validarTexto(texto) {
  if (!texto) throw new Error("Ingrese un dato");
  if (texto.length < 3)
    throw new Error("El texto debe tener más de 2 caracteres");
  if (!texto.split("").every((el) => !Boolean(el - 1 + 10)))
    throw new Error(
      "El dato ingresado no puede contener números o caracteres especiales"
    );
}

function normalizarTexto(texto) {
  return texto.toLowerCase().trim();
}

function validarEmail(email) {
  const isValidEmail = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  if (!email) throw new Error("Ingrese un correo electrónico");
  if (!isValidEmail) throw new Error("El email debe tener un formato válido");
}

function normalizarEmail(email) {
  return email.toLowerCase().trim();
}

function validarContrasenia(pass) {
  if (!pass) throw new Error("Ingrese una contraseña");
  if (pass.split("").length < 8)
    throw new Error("La contraseña debe tener mas de 8 caracteres");
  if (pass.includes(" "))
    throw new Error("La contraseña no puede tener espacios");
}

function compararContrasenias(pass1, pass2) {
  if (!pass2) throw new Error("Repita su contraseña");
  if (pass1 !== pass2) throw new Error("Las contraseñas no coinciden");
}

function renderErrorMsg(e, msg) {
  if (!e.target.nextElementSibling.classList.contains("errorMsg")) {
    const markup = `<p class="errorMsg">${msg}</p>`;
    e.target.insertAdjacentHTML("afterend", markup);
    e.target.classList.remove("input-right");
    e.target.classList.add("input-wrong");
  }
}

function renderValidation(e) {
  if (e.target.nextElementSibling.classList.contains("errorMsg")) {
    e.target.nextElementSibling.remove();
  }
  e.target.classList.remove("input-wrong");
  e.target.classList.add("input-right");
}

function checkInput(e) {
  try {
    switch (e.target.id) {
      case "inputNombre":
        validarTexto(e.target.value);
        renderValidation(e);
        break;
      case "inputApellido":
        validarTexto(e.target.value);
        renderValidation(e);
        break;
      case "inputEmail":
        validarEmail(e.target.value);
        renderValidation(e);
        break;
      case "inputPassword":
        validarContrasenia(e.target.value);
        renderValidation(e);
        break;
      case "inputPasswordRepetida":
        const contrasenia = document.getElementById("inputPassword").value;
        compararContrasenias(contrasenia, e.target.value);
        renderValidation(e);
        break;
    }
  } catch (err) {
    renderErrorMsg(e, err);
  }
}

function checkErrors(e) {
  const msg = e.target.querySelector(".errorMsg");
  if (msg) throw new Error("Por favor ingrese datos válidos");
}

function renderGlobalError(nodo, err) {
  const msg = nodo.querySelector(".errorGlobalMsg");
  if (!msg) {
    const markup = `<p class="errorGlobalMsg">${err}</p>`;
    nodo.insertAdjacentHTML("beforeend", markup);
  }
}

function loggingState(state, msg) {
  if (state) {
    document.querySelector("button").classList.add("button-loading");
    document.querySelector("button").innerText = msg;
  } else {
    document.querySelector("button").classList.remove("button-loading");
    document.querySelector("button").innerText = msg;
  }
}
