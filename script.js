document.addEventListener("DOMContentLoaded", () => {
    actualizarResumen();
});

// Variables globales para almacenar ingresos y gastos
let ingresos = [];
let gastos = [];

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

        ingresos.push({ fuente, monto, fecha }); // Guardar ingreso en la lista global
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

        gastos.push({ descripcion, monto, categoria, fecha }); // Guardar gasto en la lista global
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
        const totalIngresos = ingresos.reduce((acc, ingreso) => acc + ingreso.monto, 0);
        const totalGastos = gastos.reduce((acc, gasto) => acc + gasto.monto, 0);
        const saldo = totalIngresos - totalGastos;

        document.getElementById("total-ingresos").textContent = totalIngresos.toFixed(2);
        document.getElementById("total-gastos").textContent = totalGastos.toFixed(2);
        document.getElementById("saldo").textContent = saldo.toFixed(2);
    } catch (error) {
        console.error("Error al actualizar resumen:", error);
    }
}

// Función para limpiar campos después de agregar ingresos o gastos
function limpiarCampos(...campos) {
    campos.forEach(id => document.getElementById(id).value = "");
}

// Función para obtener ingresos y gastos
function obtenerDatosIngresos() {
    return ingresos;
}

function obtenerDatosGastos() {
    return gastos;
}

// Función para descargar reporte en Excel
function descargarExcel() {
    try {
        const ingresosData = obtenerDatosIngresos();
        const gastosData = obtenerDatosGastos();

        if (ingresosData.length === 0 && gastosData.length === 0) {
            alert('No hay datos para generar el reporte.');
            return;
        }

        const wb = XLSX.utils.book_new();

        if (ingresosData.length > 0) {
            const wsIngresos = XLSX.utils.json_to_sheet(ingresosData);
            XLSX.utils.book_append_sheet(wb, wsIngresos, 'Ingresos');
        }

        if (gastosData.length > 0) {
            const wsGastos = XLSX.utils.json_to_sheet(gastosData);
            XLSX.utils.book_append_sheet(wb, wsGastos, 'Gastos');
        }

        XLSX.writeFile(wb, 'Reporte_Financiero.xlsx');
        alert('✅ Reporte generado correctamente.');
    } catch (error) {
        console.error('Error en descargarExcel:', error);
        alert('❌ Error al generar reporte. Intenta nuevamente.');
    }
}
