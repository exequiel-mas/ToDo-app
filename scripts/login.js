window.addEventListener("load", function () {
  if (localStorage.getItem("jwt")) {
    location.replace("/mis-tareas.html");
  }

  const form = document.querySelector("form");
  const inputEmail = document.querySelector("#inputEmail");
  const inputPassword = document.querySelector("#inputPassword");
  const BASE_URL = "https://ctd-fe2-todo.herokuapp.com/v1";

  document
    .querySelectorAll("input")
    .forEach((el) => el.addEventListener("blur", (e) => checkInput(e)));

  form.addEventListener("submit", function (event) {
    try {
      event.preventDefault();
      const usuario = {
        email: inputEmail.value,
        password: inputPassword.value,
      };
      checkErrors(event);
      realizarLogin(usuario);
      form.reset();
    } catch (err) {
      console.log(err);
    }
  });

  function realizarLogin(settings) {
    loggingState(true, "Ingresando...");
    const configuraciones = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    };

    fetch(`${BASE_URL}/users/login`, configuraciones)
      .then((response) => {
        if (!response.ok)
          throw new Error("Los datos ingresados son incorrectos");
        return response.json();
      })
      .then((info) => {
        if (info.jwt) {
          localStorage.setItem("jwt", info.jwt);
          location.replace("/mis-tareas.html");
        }
      })
      .catch((err) => {
        renderGlobalError(form, err);
      })
      .finally(() => loggingState(false, "Ingresar"));
  }
});
