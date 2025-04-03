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
            throw new Error("Por favor, ingresa datos válidos.");
        }

        ingresos.push({ fuente, monto, fecha });
        actualizarLista("lista-ingresos", ingresos, true);
        actualizarResumen();

        limpiarCampos(["fuente", "monto-ingreso", "fecha-ingreso"]);
    } catch (error) {
        console.error("Error en agregarIngreso:", error.message); // Depuración
        alert(error.message);
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
            throw new Error("Por favor, ingresa datos válidos.");
        }

        gastos.push({ descripcion, monto, categoria, fecha });
        actualizarLista("lista-gastos", gastos, false);
        actualizarResumen();

        limpiarCampos(["descripcion", "monto", "fecha-gasto"]);
    } catch (error) {
        console.error("Error en agregarGasto:", error.message); // Depuración
        alert(error.message);
    }
}

// Funciones adicionales para actualizar la lista y resumen (ejemplos)
function actualizarLista(id, lista, esIngreso) {
    let listaElement = document.getElementById(id);
    listaElement.innerHTML = "";

    lista.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.descripcion || item.fuente} - S/ ${item.monto} - ${item.fecha}`;
        listaElement.appendChild(li);
    });
}

function actualizarResumen() {
    let totalIngresos = ingresos.reduce((acc, ingreso) => acc + ingreso.monto, 0);
    let totalGastos = gastos.reduce((acc, gasto) => acc + gasto.monto, 0);
    let saldo = totalIngresos - totalGastos;

    document.getElementById("total-ingresos").textContent = totalIngresos.toFixed(2);
    document.getElementById("total-gastos").textContent = totalGastos.toFixed(2);
    document.getElementById("saldo").textContent = saldo.toFixed(2);
}

function limpiarCampos(campos) {
    campos.forEach(campo => {
        document.getElementById(campo).value = "";
    });
}

function descargarExcel() {
    const wb = XLSX.utils.book_new();
    const wsIngresos = XLSX.utils.json_to_sheet(ingresos);
    const wsGastos = XLSX.utils.json_to_sheet(gastos);

    XLSX.utils.book_append_sheet(wb, wsIngresos, "Ingresos");
    XLSX.utils.book_append_sheet(wb, wsGastos, "Gastos");

    XLSX.writeFile(wb, "Reporte_Finanzas.xlsx");
}
