window.addEventListener("load", function () {
  const form = document.querySelector("form");
  const inputNombre = document.getElementById("inputNombre");
  const inputApellido = document.getElementById("inputApellido");
  const inputEmail = document.getElementById("inputEmail");
  const inputPassword = document.getElementById("inputPassword");
  const BASE_URL = "https://ctd-fe2-todo.herokuapp.com/v1";

  document
    .querySelectorAll("input")
    .forEach((el) => el.addEventListener("blur", (e) => checkInput(e)));

  form.addEventListener("submit", function (event) {
    try {
      event.preventDefault();
      const payload = {
        firstName: normalizarTexto(inputNombre.value),
        lastName: normalizarTexto(inputApellido.value),
        email: normalizarEmail(inputEmail.value),
        password: inputPassword.value,
      };
      checkErrors(event);
      realizarRegister(payload);
      form.reset();
    } catch (err) {
      console.log(err);
    }
  });

  function realizarRegister(settings) {
    loggingState(true, "Creando Cuenta");
    const config = {
      method: "POST",
      body: JSON.stringify(settings),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(`${BASE_URL}/users`, config)
      .then((response) => {
        if (!response.ok)
          throw new Error("Puede que el usuario ya se encuentre registrado");
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("jwt", data.jwt);
        location.replace("/mis-tareas.html");
      })
      .catch((err) => {
        renderGlobalError(form, err);
      })
      .finally(() => loggingState(false, "Crear Cuenta"));
  }
});
