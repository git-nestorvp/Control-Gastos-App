// Variables globales
let ingresos = JSON.parse(localStorage.getItem("ingresos")) || [];
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

document.addEventListener("DOMContentLoaded", () => {
    actualizarResumen();
    actualizarLista("lista-ingresos", ingresos, true);
    actualizarLista("lista-gastos", gastos, false);
});

// Función para agregar un ingreso con manejo de errores
function agregarIngreso() {
    try {
        let fuente = document.getElementById("fuente").value.trim();
        let monto = parseFloat(document.getElementById("monto-ingreso").value);
        let fecha = document.getElementById("fecha-ingreso").value;

        // Limpiar cualquier mensaje de error previo
        limpiarMensajesError();

        // Validaciones
        if (!fuente || isNaN(monto) || monto <= 0 || !fecha) {
            throw new Error("Por favor, ingresa datos válidos.");
        }

        ingresos.push({ fuente, monto, fecha });
        localStorage.setItem("ingresos", JSON.stringify(ingresos)); // Guardar en localStorage
        actualizarLista("lista-ingresos", ingresos, true);
        actualizarResumen();

        limpiarCampos(["fuente", "monto-ingreso", "fecha-ingreso"]);
    } catch (error) {
        console.error("Error en agregarIngreso:", error.message);
        mostrarMensajeError("fuente", error.message);  // Muestra mensaje cerca del campo fuente
        mostrarMensajeError("monto-ingreso", error.message);  // Muestra mensaje cerca del campo monto
        mostrarMensajeError("fecha-ingreso", error.message);  // Muestra mensaje cerca del campo fecha
    }
}

// Función para agregar un gasto con manejo de errores
function agregarGasto() {
    try {
        let descripcion = document.getElementById("descripcion").value.trim();
        let monto = parseFloat(document.getElementById("monto").value);
        let categoria = document.getElementById("categoria").value;
        let fecha = document.getElementById("fecha-gasto").value;

        // Limpiar cualquier mensaje de error previo
        limpiarMensajesError();

        // Validaciones
        if (!descripcion || isNaN(monto) || monto <= 0 || !fecha) {
            throw new Error("Por favor, ingresa datos válidos.");
        }

        gastos.push({ descripcion, monto, categoria, fecha });
        localStorage.setItem("gastos", JSON.stringify(gastos)); // Guardar en localStorage
        actualizarLista("lista-gastos", gastos, false);
        actualizarResumen();

        limpiarCampos(["descripcion", "monto", "fecha-gasto"]);
    } catch (error) {
        console.error("Error en agregarGasto:", error.message);
        mostrarMensajeError("descripcion", error.message);
        mostrarMensajeError("monto", error.message);
        mostrarMensajeError("fecha-gasto", error.message);
    }
}

// Función para mostrar el mensaje de error cerca de un campo
function mostrarMensajeError(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error");
    errorDiv.textContent = mensaje;
    campo.parentElement.appendChild(errorDiv);
}

// Función para limpiar los mensajes de error
function limpiarMensajesError() {
    const mensajes = document.querySelectorAll(".error");
    mensajes.forEach(mensaje => mensaje.remove());
}

// Función para actualizar las listas
function actualizarLista(idLista, lista, esIngreso) {
    const listaElement = document.getElementById(idLista);
    listaElement.innerHTML = ""; // Limpiar la lista actual

    lista.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${esIngreso ? "Ingreso" : "Gasto"} ${index + 1}: ${item.descripcion || item.fuente} - $${item.monto} (${item.fecha})`;
        listaElement.appendChild(li);
    });
}

// Función para actualizar el resumen
function actualizarResumen() {
    const totalIngresos = ingresos.reduce((acc, item) => acc + item.monto, 0);
    const totalGastos = gastos.reduce((acc, item) => acc + item.monto, 0);
    const saldo = totalIngresos - totalGastos;

    document.getElementById("total-ingresos").textContent = `Total Ingresos: $${totalIngresos}`;
    document.getElementById("total-gastos").textContent = `Total Gastos: $${totalGastos}`;
    document.getElementById("saldo").textContent = `Saldo: $${saldo}`;
}
