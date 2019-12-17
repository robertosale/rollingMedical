let DB;
////// Selectores de la interfaz
const form = document.querySelector('form'),
        nombrePaciente = document.querySelector('#paciente'),
        nombreMedico = document.querySelector('#medico'),
        telefono = document.querySelector('#telefono'),
        fecha = document.querySelector('#fecha'),
        hora = document.querySelector('#hora'),
        sintomas = document.querySelector('#sintomas'),
        turnos = document.querySelector('#turnos'),
        headingAdministra = document.querySelector('administra');

///// Esperar por el DOM Ready
document.addEventListener('DOMContentLoaded', () => {
        //Crear la base de datos
        let crearDB = window.indexedDB.open('turnos', 1);


    // Si hay un error muestra en la consola
    crearDB.onerror = function() {

        console.log('Hubo un error ');
    }
    //// Si todo esta bien entonces muestra en consola, y asignar la base de datos.-
    crearDB.onsuccess = function() {

        //console.log('Todo salio bien!');

        /// Asignar la Base de datos
        DB = crearDB.result;
       /// console.log(DB);

       mostrarTurnos();
    }

    // Este metodo solo corre una vez y es ideal para crear el Schema del sistema.-
    crearDB.onupgradeneeded = function(e) {

        console.log("Solo se crea un vez la DB");
        // El evento es la misma base de datos por eso le pasamos el parametro (e).
        let db = e.target.result; //nos da una instancia ya de la base de datos
        
        //definir el objectstore, toma 2 parametros el nombre de la base de datos y el segundo las opciones
        // keypath es el indice de la base de datos
        let objectStore = db.createObjectStore('turnos', {keyPath: 'key', autoIncrement: true } );

        // Crear los indices y campos de la base de datos, createIndex :  3 parametros, nombre , keypath y opciones.
        objectStore.createIndex('paciente', 'paciente', { unique : false} );
        objectStore.createIndex('medico', 'medico', { unique : false} );
        objectStore.createIndex('telefono', 'telefono', { unique : false} );
        objectStore.createIndex('fecha', 'fecha', { unique : false} );
        objectStore.createIndex('hora', 'hora', { unique : false} );
        objectStore.createIndex('sintomas', 'sintomas', { unique : false} );
       
        console.log('base de datos creada y lista para usar !!');
    }
    // cuando el formulario se envia
    
    form.addEventListener('submit', agregarDatos);

    function agregarDatos(e){
        e.preventDefault();

        const nuevoTurno = {

            paciente : nombrePaciente.value, 
            medico:  nombreMedico.value,
            telefono : telefono.value,
            fecha : fecha.value,
            hora : hora.value,
            sintomas : sintomas.value 
        }
       /// console.log(nuevoTurno);
        let transaction = DB.transaction(['turnos'], 'readwrite');
        let objectStore = transaction.objectStore('turnos');
        //console.log(objectStore);

        let peticion = objectStore.add(nuevoTurno);
       // console.log(peticion);

        peticion.onsuccess = () => {
            form.reset();
        }
        transaction.oncomplete = () => {
           // console.log('Turno Agregado');
            mostrarTurnos();
        }
        transaction.onerror = () => {
           // console.log('Hubo un error ! ')
        }
    }

    function mostrarTurnos() {
        //limpiar los turnos anteriores
        while(turnos.firstChild) {
            turnos.removeChild(turnos.firstChild);

        }

            //// Creamos un objectStore
            let objectStore = DB.transaction('turnos').objectStore('turnos');

            //esto retorna la peticion
            objectStore.openCursor().onsuccess = function(e) {
                /// Cursor se va posicionar en el registro indicado para acceder a los datos.
                let cursor = e.target.result;
                ///console.log(cursor);
                if(cursor) {
                    let turnoHTML = document.createElement('li');
                    turnoHTML.setAttribute('data-turno-id', cursor.value.key);
                    turnoHTML.classList.add('list-group-item');

                    turnoHTML.innerHTML = `
                    <p class ="font-weight-bold">Paciente: <span class="font-weight-normal">${cursor.value.paciente}</span></p>
                    <p class ="font-weight-bold">Medico: <span class="font-weight-normal">${cursor.value.medico}</span></p>
                    <p class ="font-weight-bold">Telefono: <span class="font-weight-normal">${cursor.value.telefono}</span></p>
                    <p class ="font-weight-bold">Fecha: <span class="font-weight-normal">${cursor.value.fecha}</span></p>
                    <p class ="font-weight-bold">Hora: <span class="font-weight-normal">${cursor.value.hora}</span></p>
                    <p class ="font-weight-bold">Sintomas: <span class="font-weight-normal">${cursor.value.sintomas}</span></p>

                    `;

                    ///boton de Borrar
                    const botonBorrar = document.createElement('button');
                    botonBorrar.classList.add('borrar', 'btn', 'btn-danger');
                    botonBorrar.innerHTML = '<span aria-hidden="true">x</span> Borrar';
                    botonBorrar.onclick = borrarTurno;
                    turnoHTML.appendChild(botonBorrar);

                     ///boton de Modificar
                    //  const botonModificar = document.createElement('button');
                    //  botonModificar.classList.add('modificar', 'btn', 'btn-info');
                    //  botonModificar.innerHTML = '<span aria-hidden="true">-</span> Modificar';
                     //botonModificar.onclick = borrarTurno;
                     //turnoHTML.appendChild(botonBorrar);

                    
                    


                    // append del padre
                    turnos.appendChild(turnoHTML);
                    

                    ////Consultar los siguientes registros
                    cursor.continue();
                }else{
                    if(!turnos.firstChild){
                        ///cuando no hay registros
                        administra.textContent = 'Agrega Turnos para empezar';
                        let listado = document.createElement('p');
                        listado.classList.add('text-center');
                        listado.textContent = 'No hay registros';
                        turnos.appendChild(listado);

                    }else{
                        administra.textContent = 'Administra tus turnos';
                    }


                }
        
            }
    }

    function borrarTurno(e){
        
        let turnoID = Number(e.target.parentElement.getAttribute('data-turno-id') );

        let transaction = DB.transaction(['turnos'], 'readwrite');
        let objectStore = transaction.objectStore('turnos');
        //console.log(objectStore);

        let peticion = objectStore.delete(turnoID);
        transaction.oncomplete = () => {
            e.target.parentElement.parentElement.removeChild(e.target.parentElement);
            console.log(`Se elimino la cita con el ID: ${turnoID}`)

            if(!turnos.firstChild){
                ///cuando no hay registros
                administra.textContent = 'Agrega Turnos para empezar';
                let listado = document.createElement('p');
                listado.classList.add('text-center');
                listado.textContent = 'No hay registros';
                turnos.appendChild(listado);

            }else{
                administra.textContent = 'Administra tus turnos';
            }
        }
    }

})
          