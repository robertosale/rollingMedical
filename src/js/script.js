// when app starts
window.onload = startApp;



let usuarios = [

  //clientes
  { nivel: "paciente", user: "benja", pass: "montero", name: "Benjamin Montero", turns: [], },
  { nivel: "paciente", user: "roberto", pass: "sale", name: "Roberto Sale", turns: [], },
  { nivel: "paciente", user: "juan", pass: "navarro", name: "Juan Pablo Navarro", turns: [], },
  { nivel: "paciente", user: "fede", pass: "meson", name: "Federico Meson", turns: [], },

  //Medicos

];

function startApp() {
  let usuariosTemp; //variable encargada de tener los usuarios cargados en el local storage

  //indicar que primero verifique la carga de los arrays, 
  //si no encuentra cargado el USUARIOS procede a la carga de la misma
  if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
  //tomamos el valor de los usuarios guardados para poder empezar verificacion
  usuariosTemp = JSON.parse(localStorage.getItem("usuarios"));
}

function login() {
  let usuarioLogin = document.getElementById('txtUsuario').value
  let PasswordLogin = document.getElementById('txtPassword').value
  let usuariosTemp = JSON.parse(localStorage.getItem("usuarios"));
  console.log(usuariosTemp)

  usuariosTemp.forEach(element => {

    if (element.user == usuarioLogin && element.pass == PasswordLogin) {
      console.log(element);
       sessionStorage.setItem("usuarioActual", JSON.stringify(element));

      switch (element.nivel) {

        case "paciente":
          window.location.href ="../src/cliente.html";
          break;
        case "administrador":
          window.location.href = "../src/administrador.html";
          break;
        case "medico":
          window.location.href = "../src/medico.html";
          break;
      }
    }
  });
}
