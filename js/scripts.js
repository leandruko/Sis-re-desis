

document.addEventListener('DOMContentLoaded', function() {
    cargarDatosIniciales();

    document.getElementById('bodega').addEventListener('change', cargarSucursales);
    document.getElementById('btnGuardar').addEventListener('click', procesarFormulario);
});

//fn de carga de datos
function cargarDatosIniciales() {
    fetch('php/obtener_datos.php?action=init')
        .then(response => response.json())
        .then(data => {
            const selectBodega = document.getElementById('bodega');
            data.bodegas.forEach(bodega => {
                let option = document.createElement('option');
                option.value = bodega.id;
                option.textContent = bodega.nombre;
                selectBodega.appendChild(option);
            });

            const selectMoneda = document.getElementById('moneda');
            data.monedas.forEach(moneda => {
                let option = document.createElement('option');
                option.value = moneda.id;
                option.textContent = `${moneda.nombre}`;
                selectMoneda.appendChild(option);
            });
        });
}
//fn de carga sucursales
function cargarSucursales() {
    const bodegaId = document.getElementById('bodega').value;
    const selectSucursal = document.getElementById('sucursal');
    selectSucursal.innerHTML = '<option value="">Elije Sucursal </option>';

    if (bodegaId === "") {
        selectSucursal.disabled = true;
        return;
    }
    selectSucursal.disabled = false;

    fetch(`php/obtener_datos.php?action=get_sucursales&bodega_id=${bodegaId}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(sucursal => {
                let option = document.createElement('option');
                option.value = sucursal.id;
                option.textContent = sucursal.nombre;
                selectSucursal.appendChild(option);
            });
        });
}

//validaciones de campos del formulario

function procesarFormulario() {
    const codigo = document.getElementById('codigo').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const bodega = document.getElementById('bodega').value;
    const sucursal = document.getElementById('sucursal').value;
    const moneda = document.getElementById('moneda').value;
    const precio = document.getElementById('precio').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();


    const materialesCheckboxes = document.querySelectorAll('input[name="material"]:checked');
    

    // validacion codigo de producto
    if (codigo === "") {
        alert("El código del producto no puede estar en blanco.");
        return;
    }
    // validacion regex del codigo del producto
    const codigoRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;
    if (!codigoRegex.test(codigo)) {
        alert("El código del producto debe incluir letras y números para que sea valido");
        return;
    }
    //validacion del largo del codigo minimo 5 y maximo 15 caracteres
    if (codigo.length < 5 || codigo.length > 15) {
        alert("El código del producto debe contener entre 5 y 15 caracteres para ser valido");
        return;
    }

    // Validacion nombre
    if (nombre === "") {
        alert("El nombre del producto no puede estar en blanco.");
        return;
    }
    //validacion largo nombre minimo 2 y maximo 50 caracters
    if (nombre.length < 2 || nombre.length > 50) {
        alert("El nombre del producto debe contener entre 2 y 50 caracteres.");
        return;
    }

    //Validacion bodega
    if (bodega === "") {
        alert("Debe seleccionar una bodega.");
        return;
    }

    // Validacion de la sucursal
    if (sucursal === "") {
        alert("Debe seleccionar una sucursal para la bodega seleccionada.");
        return;
    }

    // Validcacion de moneda
    if (moneda === "") {
        alert("Debe seleccionar una moneda para el producto.");
        return;
    }

    //Validacion precio
    if (precio === "") {
        alert("El precio del producto no puede estar en blanco.");
        return;
    }
    // Validacion del regex que debe tener hasta 2 decimales y que sea positivo
    const precioRegex = /^\d+(\.\d{1,2})?$/;
    if (!precioRegex.test(precio) || parseFloat(precio) <= 0) {
        alert("El precio del producto debe ser un número positivo con hasta dos decimales.");
        return;
    }

    //Validacion materiales
    if (materialesCheckboxes.length < 2) {
        alert("Debe seleccionar al menos dos materiales para el producto.");
        return;
    }

    //Validacion descripcion
    if (descripcion === "") {
        alert("La descripción del producto no puede estar en blanco.");
        return;
    }
    //validacion largo descripcion min 10 max 1000 caracteres
    if (descripcion.length < 10 || descripcion.length > 1000) {
        alert("La descripción del producto debe tener entre 10 y 1000 caracteres.");
        return;
    }

    enviarDatosAlServidor();
}
//fn enviar  los datos de los campos al servidor
function enviarDatosAlServidor() {
    const form = document.getElementById('formProducto');
    const formData = new FormData(form);

    const materiales = [];
    document.querySelectorAll('input[name="material"]:checked').forEach(cb => {
        materiales.push(cb.value);
    });
  
    formData.append('materiales_texto', materiales.join(', '));
   
    formData.append('bodega_id', document.getElementById('bodega').value);
    formData.append('sucursal_id', document.getElementById('sucursal').value);
    formData.append('moneda_id', document.getElementById('moneda').value);
    formData.append('codigo', document.getElementById('codigo').value);
    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('precio', document.getElementById('precio').value);
    formData.append('descripcion', document.getElementById('descripcion').value);

    fetch('php/guardar.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert("Producto registrado exitosamente.");
            window.location.reload();
        } else if (data.status === 'error_codigo') {
            alert("El código del producto ya está registrado.");
        } else {
            alert("Error al guardar: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error de conexión con el servidor.");
    });
}