// Variables

let baseDeDatos = [];
let baseDeDatosFiltrada = [];
let carrito = [];

const moneda = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const DOMbotonBuscar = document.querySelector('#boton-buscar');
const DOMbotonContinuar = document.querySelector('#boton-continuar');
const DOMbotonSuscripcion = document.querySelector('.btn-sub');
const DOMcajaBuscar = document.querySelector('#caja-buscar');
const DOMalert = document.querySelector('.alert');
const DOMcajaEmail = document.querySelector('.caja-email');
const DOMdatosEntrega = document.querySelector('#row-compra');
const DOMdomicilioEntrega = document.querySelector('#dir-entrega');
let DOMtipoEntrega = document.querySelector('#tipo-entrega');
const DOMbotonAceptarCompra = document.querySelector('#btn-aceptar-compra');
const DOMnombreCliente = document.querySelector('#nombre');
const DOMemailCliente = document.querySelector('#email');
const DOMtelefonoCliente = document.querySelector('#telefono');
const DOMdirEntregaCliente = document.querySelector('#direccion');
const d = document;



/**
 * Dibuja todos los productos a partir de la base de datos.
 */
function renderizarProductos(respuesta) {
    DOMitems.innerHTML = "";
    if (baseDeDatosFiltrada.length === 0) {
        baseDeDatos = respuesta;
        baseDeDatos.forEach((producto) => {
            DibujaEstructuraTarjetas(producto)
        });
    } else {
        baseDeDatosFiltrada.forEach((producto) => {
            DibujaEstructuraTarjetas(producto)
        });
    }

}

function DibujaEstructuraTarjetas(p) {
    // Estructura
    const miNodo = document.createElement('div');
    miNodo.classList.add('card', 'col-sm-4', 'h-70', 'shadow-sm');
    // Body
    const miNodoCardBody = document.createElement('div');
    miNodoCardBody.classList.add('card-body');
    // Marca
    const miNodoLabel = document.createElement('div');
    miNodoLabel.classList.add('label-top', 'shadow-sm');
    miNodoLabel.textContent = p.marca.toUpperCase();
    const miNodoMarca = document.createElement('div');
    miNodoMarca.classList.add('clearfix', 'mb-3');
    // SKU
    const miNodoSku = document.createElement("h2");
    miNodoSku.classList.add('card-title');
    miNodoSku.textContent = `${p.sku}`;
    // Precio
    const miNodoPrecio = document.createElement("span");
    miNodoPrecio.classList.add('float-center', 'badge', 'rounded-pill', 'bg-success');
    miNodoPrecio.textContent = `${p.precio}${moneda}`;
    // Detalle producto
    const miNodoTitle = document.createElement('h2');
    miNodoTitle.classList.add('card-title');
    miNodoTitle.textContent = p.detalle;
    // Imagen
    const miNodoImagen = document.createElement('img');
    miNodoImagen.classList.add('card-img-top');
    miNodoImagen.setAttribute('src', p.imagen);
    // Precio
    // const miNodoPrecio = document.createElement('p');
    // miNodoPrecio.classList.add('card-text');
    // miNodoPrecio.textContent = `${p.precio}${moneda}`;
    // Boton 
    const miNodoBoton = document.createElement('button');
    miNodoBoton.classList.add('btn', 'btn-warning');
    miNodoBoton.textContent = 'Agregar al carrito';
    miNodoBoton.setAttribute('marcador', p.id);
    miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
    // Insertamos
    miNodoCardBody.appendChild(miNodoImagen);
    miNodoCardBody.appendChild(miNodoMarca);
    miNodoCardBody.appendChild(miNodoLabel);
    miNodoCardBody.appendChild(miNodoSku);
    miNodoCardBody.appendChild(miNodoPrecio);
    miNodoCardBody.appendChild(miNodoTitle);
    miNodoCardBody.appendChild(miNodoBoton);
    miNodo.appendChild(miNodoCardBody);
    DOMitems.appendChild(miNodo);
}

/**
 * Evento para añadir un producto al carrito de la compra
 */
function anyadirProductoAlCarrito(evento) {
    // Anyadimos el Nodo a nuestro carrito
    carrito.push(evento.target.getAttribute('marcador'))
    // Actualizamos el carrito 
    renderizarCarrito();
    DOMalert.style.display = 'none';
}

/**
 * Dibuja todos los productos guardados en el carrito
 */
function renderizarCarrito() {
    // Vaciamos todo el carrito
    DOMcarrito.textContent = '';
    // Quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carrito)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {
        // Obtenemos el item que necesitamos de la variable base de datos
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            // ¿Coincide las id? Solo puede existir un caso
            return itemBaseDatos.id === parseInt(item);
        });
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            // ¿Coincide las id? Incremento el contador, en caso contrario lo mantengo
            return itemId === item ? total += 1 : total;
        }, 0);
        // Creamos el nodo del item del carrito
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].detalle} - ${miItem[0].precio}${moneda}`;
        // Boton de borrar
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5', 'text-center');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        // Mezclamos nodos
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });
    // Renderizamos el precio total en el HTML
    DOMtotal.textContent = calcularTotal();
    if (DOMtotal.textContent === "0.00" || DOMtotal.textContent === "") {
        DOMalert.style.display = 'block';
        DOMdatosEntrega.style.display = 'none';
        DOMtipoEntrega.value = "Seleccione el tipo de entrega";
        DOMbotonAceptarCompra.value = "";
        DOMnombreCliente.value = "";
        DOMemailCliente.value = "";
        DOMdirEntregaCliente.value = "";
        DOMbotonAceptarCompra.style.display = 'none';
    } else {
        DOMalert.style.display = 'none';
    }
}

/**
 * Evento para borrar un elemento del carrito
 */
function borrarItemCarrito(evento) {
    // Obtenemos el producto ID que hay en el boton pulsado
    const id = evento.target.dataset.item;
    // Borramos todos los productos
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    // volvemos a renderizar
    renderizarCarrito();
    // Actualizamos el LocalStorage
    addLocalStorage();

}

/**
 * Calcula el precio total teniendo en cuenta los productos repetidos
 */
function calcularTotal() {
    // Recorremos el array del carrito 
    return carrito.reduce((total, item) => {
        // De cada elemento obtenemos su precio
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        // Los sumamos al total
        addLocalStorage()
        return total + miItem[0].precio;

    }, 0).toFixed(2);
}

/**
 * Varia el carrito y vuelve a dibujarlo
 */
function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
    // Renderizamos los cambios
    renderizarCarrito();
    // Borra LocalStorage
    localStorage.clear();
    DOMalert.style.display = 'block';
    DOMdatosEntrega.style.display = 'none';
    DOMtipoEntrega.value = "Seleccione el tipo de entrega";
    DOMbotonAceptarCompra.value = "";
    DOMnombreCliente.value = "";
    DOMemailCliente.value = "";
    DOMdirEntregaCliente.value = "";
    DOMbotonAceptarCompra.style.display = 'none';
}

function addLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

/**
 * Evento para buscar un elemento del carrito
 */
function buscarProducto() {
    baseDeDatosFiltrada = baseDeDatos.filter((element) => element.marca.toUpperCase().includes(DOMcajaBuscar.value.toUpperCase()));
    //console.log(baseDeDatosFiltrada)
    // volvemos a renderizar
    renderizarProductos();
}

/**
 * Evento para validar botón comprar
 */
function btnContinuarCarrito() {
    // Sin operador ternario ?
    if (DOMtotal.textContent === "0.00" || DOMtotal.textContent === "") {
        Swal.fire({
            icon: 'info',
            title: 'Atención',
            text: 'No tenés productos en tu carrito de compras!',
        })
    } else {
        //window.location.assign("./pages/compra.html");
        DOMdatosEntrega.style.display = '';
        DOMdomicilioEntrega.style.display = 'none';
        DOMbotonAceptarCompra.style.display = '';
    }
}

/**
 * Evento para validar que haya ingresado un correo
 */
function validarCorreo() {
    // Con operador ternario ?
    (DOMcajaEmail.value === '') ? (
        Swal.fire({
            icon: 'info',
            title: 'Atención',
            text: 'Debe ingresar una cuenta de correo',

        })
    ) : (
        Swal.fire('Gracias por suscribirse a nuestro newsletter')
    );
}

function validarDatosCompra() {
    if ((DOMtipoEntrega.value != 1) &&
        (DOMtipoEntrega.value != 2) &&
        (DOMtipoEntrega.value != 3) &&
        (DOMtipoEntrega.value != 5) &&
        (DOMtipoEntrega.value != 6)
    ) {
        Swal.fire({
            icon: 'info',
            title: 'Atención',
            text: 'Debe seleccionar un tipo de entrega',
        })
    } else if (DOMnombreCliente.value == "") {
        Swal.fire({
            icon: 'info',
            title: 'Atención',
            text: 'Debe ingresar su nombre',
        })
    } else if (DOMemailCliente.value == "") {
        Swal.fire({
            icon: 'info',
            title: 'Atención',
            text: 'Debe ingresar un email',
        })
    } else if (DOMtelefonoCliente.value == "") {
        Swal.fire({
            icon: 'info',
            title: 'Atención',
            text: 'Debe ingresar un teléfono',
        })
    } else if ((document.getElementById('dir-entrega').style.display != 'none') &&
        (DOMdirEntregaCliente.value == "")) {
        Swal.fire({
            icon: 'info',
            title: 'Atención',
            text: 'Debe ingresar una direccíon de entrega',
        })
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Gracias por su compra!',
            text: 'Su comprobante le llegará por mail',
        })
    }
}

/**
 * Evento para capturar valor SELECT
 */
function obtenerSeleccion() {
    // Con operador ternario ?
    (DOMtipoEntrega.value == 1) ? DOMdomicilioEntrega.style.display = '' : DOMdomicilioEntrega.style.display = 'none';
}

// Eventos

DOMbotonBuscar.addEventListener('click', buscarProducto);
DOMbotonVaciar.addEventListener('click', vaciarCarrito);
DOMbotonContinuar.addEventListener('click', btnContinuarCarrito);
DOMbotonSuscripcion.addEventListener('click', validarCorreo);
DOMtipoEntrega.addEventListener('change', obtenerSeleccion);
DOMbotonAceptarCompra.addEventListener('click', validarDatosCompra);

window.onload = function () {
    const storage = JSON.parse(localStorage.getItem('carrito'));
    if (storage) {
        carrito = storage;
        renderizarCarrito()
    } 
}

$.ajax({
    url: "./data.json",
    dataType: "json",
    success: (respuesta) => {
        renderizarProductos(respuesta);
    },
});
DOMdatosEntrega.style.display = 'none';
DOMbotonAceptarCompra.style.display = 'none';
