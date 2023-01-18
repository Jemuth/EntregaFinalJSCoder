

let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();
    mostrarSeccion();
    cambiarSeccion();
    paginaSiguiente();
    paginaAnterior();
    botonesPaginador();
    mostrarResumen();
    nombreCita();
    fechaCita();
    deshabilitarFechaAnterior();
    horaCita();
}

function mostrarSeccion() {

    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if( seccionAnterior ) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    const tabAnterior = document.querySelector('.tabs .actual');
     
    if ( tabAnterior ) {
        tabAnterior.classList.remove('actual');
    }

    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);

            mostrarSeccion();

            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch ('./servicios.json');
        const db = await resultado.json(); 
        const  { servicios } = db;

        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;

            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            servicioDiv.onclick = seleccionarServicio;

            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            document.querySelector('#servicios').appendChild(servicioDiv);
        } )
    } catch (error){
        console.log(error);
    }
}

function seleccionarServicio(e) {

    let elemento;

    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt ( elemento.dataset.idServicio );

        eliminarServicio(id);
    } else {
    elemento.classList.add('seleccionado');

    const servicioObj = {
        id: parseInt( elemento.dataset.idServicio ),
        nombre: elemento.firstElementChild.textContent,
        precio: elemento.firstElementChild.nextElementSibling.textContent
    }

    agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id);
    console.log(cita);
}
function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];
    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;

        console.log(pagina);

        botonesPaginador();
    });

}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        console.log(pagina);

        botonesPaginador();
    });    
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina == 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }    

    mostrarSeccion();
}

function mostrarResumen() {

    const { nombre, fecha, hora, servicios } = cita;

    const resumenDiv = document.querySelector('.contenido-resumen');

    while( resumenDiv.firstChild ) {
        resumenDiv.removeChild( resumenDiv.firstChild );
    }

    if(Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Por favor, ingrese los datos faltantes';

        noServicios.classList.add('invalidar-cita');

        resumenDiv.appendChild(noServicios);
        return;
}
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de reserva';

    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    servicios.forEach( servicio => {

        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');

        cantidad +=  parseInt( totalServicio[1].trim());

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);

    });

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Valor referencial: </span> $${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim(); 

        if( nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido', 'error')
        } else { 
            const alerta = document.querySelector('.alerta');
            if(alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto
        }
        
    })
}

function mostrarAlerta(mensaje, tipo) {

    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error');
    }

   const formulario = document.querySelector('.formulario');
   formulario.appendChild( alerta );
   setTimeout(() => {
       alerta.remove();
   }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {

        const dia = new Date(e.target.value).getUTCDay();
        if([0].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Lo sentimos, no atendemos dia Domingo', 'error')
        } else {
            cita.fecha = fechaInput.value;
        }
    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = (fechaAhora.getMonth() + 1).toString().padStart(2,'0');
    const dia = (fechaAhora.getDate() + 1).toString().padStart(2, "0");
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;
    inputFecha.min = fechaDeshabilitar;
}


function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {
        console.log(e.target.value);

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 18 ) {
            mostrarAlerta('Hora no válida', 'error');
            setTimeout(() => {
                inputHora.value = ''; 
            }, 3000);
            
        } else {
            cita.hora = horaCita;

            console.log(cita);
        }
    });
}