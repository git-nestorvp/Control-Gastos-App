document.addEventListener("DOMContentLoaded", () => {
    actualizarResumen();
});

// Función para agregar ingresos
function agregarIngreso() {
    try {
        const fuente = document.getElementById("fuente").value.trim();
        const monto = parseFloat(document.getElementById("monto-ingreso").value);
        const fecha = document.getElementById("fecha-ingreso").value;

        if (!fuente || isNaN(monto) || monto <= 0 || !fecha) {
            alert("Por favor, ingrese datos válidos para el ingreso.");
            return;
        }

        const listaIngresos = document.getElementById("lista-ingresos");
        const item = document.createElement("li");
        item.textContent = `${fecha} - ${fuente}: S/ ${monto.toFixed(2)}`;
        listaIngresos.appendChild(item);

        guardarIngreso({ fuente, monto, fecha });
        actualizarResumen();
        limpiarCampos("fuente", "monto-ingreso", "fecha-ingreso");
    } catch (error) {
        console.error("Error al agregar ingreso:", error);
        alert("Hubo un problema al agregar el ingreso.");
    }
}

// Función para agregar gastos
function agregarGasto() {
    try {
        const descripcion = document.getElementById("descripcion").value.trim();
        const monto = parseFloat(document.getElementById("monto").value);
        const categoria = document.getElementById("categoria").value;
        const fecha = document.getElementById("fecha-gasto").value;

        if (!descripcion || isNaN(monto) || monto <= 0 || !fecha) {
            alert("Por favor, ingrese datos válidos para el gasto.");
            return;
        }

        const listaGastos = document.getElementById("lista-gastos");
        const item = document.createElement("li");
        item.textContent = `${fecha} - ${categoria}: ${descripcion} - S/ ${monto.toFixed(2)}`;
        listaGastos.appendChild(item);

        guardarGasto({ descripcion, monto, categoria, fecha });
        actualizarResumen();
        limpiarCampos("descripcion", "monto", "fecha-gasto");
    } catch (error) {
        console.error("Error al agregar gasto:", error);
        alert("Hubo un problema al agregar el gasto.");
    }
}

// Función para actualizar el resumen de ingresos, gastos y saldo
function actualizarResumen() {
    try {
        const ingresos = obtenerDatosIngresos().reduce((acc, ingreso) => acc + ingreso.monto, 0);
        const gastos = obtenerDatosGastos().reduce((acc, gasto) => acc + gasto.monto, 0);
        const saldo = ingresos - gastos;

        document.getElementById("total-ingresos").textContent = ingresos.toFixed(2);
        document.getElementById("total-gastos").textContent = gastos.toFixed(2);
        document.getElementById("saldo").textContent = saldo.toFixed(2);
    } catch (error) {
        console.error("Error al actualizar resumen:", error);
    }
}

// Función para limpiar campos después de agregar ingresos o gastos
function limpiarCampos(...campos) {
    campos.forEach(id => document.getElementById(id).value = "");
}

// Funciones para almacenar datos en memoria
let ingresos = [];
let gastos = [];

function guardarIngreso(ingreso) {
    ingresos.push(ingreso);
}

function guardarGasto(gasto) {
    gastos.push(gasto);
}

function obtenerDatosIngresos() {
    return ingresos;
}

function obtenerDatosGastos() {
    return gastos;
}

// Función para descargar reporte en Excel
function descargarExcel() {
    try {
        const ingresos = obtenerDatosIngresos();
        const gastos = obtenerDatosGastos();

        if (ingresos.length === 0 && gastos.length === 0) {
            alert('No hay datos para generar el reporte.');
            return;
        }

        const wb = XLSX.utils.book_new();

        if (ingresos.length > 0) {
            const wsIngresos = XLSX.utils.json_to_sheet(ingresos);
            XLSX.utils.book_append_sheet(wb, wsIngresos, 'Ingresos');
        }

        if (gastos.length > 0) {
            const wsGastos = XLSX.utils.json_to_sheet(gastos);
            XLSX.utils.book_append_sheet(wb, wsGastos, 'Gastos');
        }

        XLSX.writeFile(wb, 'Reporte_Financiero.xlsx');
        alert('✅ Reporte generado correctamente.');
    } catch (error) {
        console.error('Error en descargarExcel:', error);
        alert('❌ Error al generar reporte. Intenta nuevamente.');
    }
}
