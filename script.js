// Variables globales
let ingresos = [];
let gastos = [];

document.addEventListener("DOMContentLoaded", () => {
    actualizarResumen();
});

// Función para agregar un ingreso con manejo de errores
function agregarIngreso() {
    try {
        let fuente = document.getElementById("fuente").value.trim();
        let monto = parseFloat(document.getElementById("monto-ingreso").value);
        let fecha = document.getElementById("fecha-ingreso").value;

        console.log(`Fuente: ${fuente}, Monto: ${monto}, Fecha: ${fecha}`); // Depuración

        // Validaciones
        if (!fuente || isNaN(monto) || monto <= 0 || !fecha) {
            mostrarError("Por favor, ingresa datos válidos.");
            return; // No continuar con la función si hay un error
        }

        ingresos.push({ fuente, monto, fecha });
        actualizarLista("lista-ingresos", ingresos, true);
        actualizarResumen();

        limpiarCampos(["fuente", "monto-ingreso", "fecha-ingreso"]);
        limpiarError(); // Limpiar el mensaje de error si es válido
    } catch (error) {
        console.error("Error en agregarIngreso:", error.message); // Depuración
        mostrarError(error.message);
    }
}

// Función para agregar un gasto con manejo de errores
function agregarGasto() {
    try {
        let descripcion = document.getElementById("descripcion").value.trim();
        let monto = parseFloat(document.getElementById("monto").value);
        let categoria = document.getElementById("categoria").value;
        let fecha = document.getElementById("fecha-gasto").value;

        console.log(`Descripción: ${descripcion}, Monto: ${monto}, Fecha: ${fecha}`); // Depuración

        // Validaciones
        if (!descripcion || isNaN(monto) || monto <= 0 || !fecha) {
            mostrarError("Por favor, ingresa datos válidos.");
            return; // No continuar con la función si hay un error
        }

        gastos.push({ descripcion, monto, categoria, fecha });
        actualizarLista("lista-gastos", gastos, false);
        actualizarResumen();

        limpiarCampos(["descripcion", "monto", "fecha-gasto"]);
        limpiarError(); // Limpiar el mensaje de error si es válido
    } catch (error) {
        console.error("Error en agregarGasto:", error.message); // Depuración
        mostrarError(error.message);
    }
}

// Función para mostrar el mensaje de error en el DOM
function mostrarError(mensaje) {
    // Verificar si ya existe un mensaje de error visible
    const mensajeError = document.getElementById("mensaje-error");
    if (mensajeError) {
        mensajeError.textContent = mensaje; // Actualizar el mensaje de error
    } else {
        // Si no existe el mensaje de error, lo creamos
        const errorDiv = document.createElement("div");
        errorDiv.id = "mensaje-error";
        errorDiv.style.color = "red";
        errorDiv.textContent = mensaje;
        document.body.appendChild(errorDiv); // O donde prefieras mostrar el mensaje
    }
}

// Función para limpiar el mensaje de error cuando la validación es correcta
function limpiarError() {
    const mensajeError = document.getElementById("mensaje-error");
    if (mensajeError) {
        mensajeError.remove(); // Elimina el mensaje de error del DOM
    }
}

// Función para actualizar la lista de ingresos y gastos
function actualizarLista(elementoId, lista, esIngreso) {
    let listaElement = document.getElementById(elementoId);
    listaElement.innerHTML = ""; // Limpiar lista antes de actualizar

    lista.forEach((item, index) => {
        let li = document.createElement("li");
        if (esIngreso) {
            li.textContent = `Fuente: ${item.fuente}, Monto: S/${item.monto}, Fecha: ${item.fecha}`;
        } else {
            li.textContent = `Descripción: ${item.descripcion}, Monto: S/${item.monto}, Categoría: ${item.categoria}, Fecha: ${item.fecha}`;
        }
        listaElement.appendChild(li);
    });
}

// Función para actualizar el resumen de ingresos y gastos
function actualizarResumen() {
    let totalIngresos = ingresos.reduce((total, item) => total + item.monto, 0);
    let totalGastos = gastos.reduce((total, item) => total + item.monto, 0);
    let balance = totalIngresos - totalGastos;

    document.getElementById("total-ingresos").textContent = `Total Ingresos: S/${totalIngresos}`;
    document.getElementById("total-gastos").textContent = `Total Gastos: S/${totalGastos}`;
    document.getElementById("balance").textContent = `Balance: S/${balance}`;
}

// Función para limpiar los campos después de agregar
function limpiarCampos(campos) {
    campos.forEach((campo) => {
        document.getElementById(campo).value = "";
    });
}

// Función para exportar los datos a Excel
function exportarExcel() {
    // Crear la tabla para exportar
    let tabla = "<table border='1'><tr><th>Fuente</th><th>Monto</th><th>Fecha</th></tr>";

    ingresos.forEach((ingreso) => {
        tabla += `<tr><td>${ingreso.fuente}</td><td>S/${ingreso.monto}</td><td>${ingreso.fecha}</td></tr>`;
    });

    tabla += "</table>";

    // Crear un enlace temporal para descargar el archivo Excel
    let enlace = document.createElement("a");
    let blob = new Blob([tabla], { type: "application/vnd.ms-excel" });
    let url = URL.createObjectURL(blob);

    enlace.href = url;
    enlace.download = "reporte_ingresos.xls"; // Nombre del archivo
    enlace.click(); // Disparar la descarga
    URL.revokeObjectURL(url); // Revocar el URL después de la descarga
}
