let ingresos = [];
let gastos = [];

// Cargar datos desde el localStorage al cargar la página
document.addEventListener("DOMContentLoaded", cargarDatos);

function cargarDatos() {
    try {
        let datos = JSON.parse(localStorage.getItem("finanzas"));
        if (datos) {
            ingresos = datos.ingresos || [];
            gastos = datos.gastos || [];
            actualizarListaIngresos();
            actualizarListaGastos();
            actualizarResumen();
        }
    } catch (error) {
        console.error("Error al cargar los datos desde el localStorage:", error);
    }
}

// Función para agregar un ingreso
function agregarIngreso() {
    try {
        let fuente = document.getElementById("fuente").value;
        let monto = parseFloat(document.getElementById("monto-ingreso").value);
        let fecha = document.getElementById("fecha-ingreso").value;

        // Validación de datos
        if (!fuente || isNaN(monto) || monto <= 0 || !fecha) {
            throw new Error("Por favor, ingresa datos válidos.");
        }

        ingresos.push({ fuente, monto, fecha });
        actualizarListaIngresos();
        actualizarResumen();
        limpiarCamposIngreso();
        guardarDatos();
    } catch (error) {
        alert(error.message); // Muestra un mensaje de error en caso de que algo salga mal
    }
}

// Función para agregar un gasto
function agregarGasto() {
    try {
        let descripcion = document.getElementById("descripcion").value;
        let monto = parseFloat(document.getElementById("monto").value);
        let categoria = document.getElementById("categoria").value;
        let fecha = document.getElementById("fecha-gasto").value;

        // Validación de datos
        if (!descripcion || isNaN(monto) || monto <= 0 || !fecha) {
            throw new Error("Por favor, ingresa datos válidos.");
        }

        gastos.push({ descripcion, monto, categoria, fecha });
        actualizarListaGastos();
        actualizarResumen();
        limpiarCamposGasto();
        guardarDatos();
    } catch (error) {
        alert(error.message);
    }
}

// Función para eliminar un ingreso o gasto
function eliminarItem(index, tipo) {
    try {
        if (tipo === 'ingreso') {
            ingresos.splice(index, 1);
            actualizarListaIngresos();
        } else if (tipo === 'gasto') {
            gastos.splice(index, 1);
            actualizarListaGastos();
        }
        actualizarResumen();
        guardarDatos();
    } catch (error) {
        alert("Error al eliminar el item. Intenta nuevamente.");
    }
}

// Función para actualizar la lista de ingresos
function actualizarListaIngresos() {
    let lista = document.getElementById("lista-ingresos");
    lista.innerHTML = ""; 
    ingresos.forEach((ingreso, index) => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `${ingreso.fecha} - ${ingreso.fuente}: S/ ${ingreso.monto.toFixed(2)} 
            <button onclick="eliminarItem(${index}, 'ingreso')">X</button>`;
        lista.appendChild(listItem);
    });
}

// Función para actualizar la lista de gastos
function actualizarListaGastos() {
    let lista = document.getElementById("lista-gastos");
    lista.innerHTML = ""; 
    gastos.forEach((gasto, index) => {
        let listItem = document.createElement("li");
        listItem.innerHTML = `${gasto.fecha} - ${gasto.descripcion} (${gasto.categoria}): S/ ${gasto.monto.toFixed(2)} 
            <button onclick="eliminarItem(${index}, 'gasto')">X</button>`;
        lista.appendChild(listItem);
    });
}

// Función para actualizar el resumen (totales y saldo)
function actualizarResumen() {
    const totalIngresos = ingresos.reduce((acc, i) => acc + i.monto, 0);
    const totalGastos = gastos.reduce((acc, g) => acc + g.monto, 0);
    
    document.getElementById("total-ingresos").textContent = totalIngresos.toFixed(2);
    document.getElementById("total-gastos").textContent = totalGastos.toFixed(2);
    document.getElementById("saldo").textContent = (totalIngresos - totalGastos).toFixed(2);
}

// Función para limpiar los campos de ingreso
function limpiarCamposIngreso() {
    document.getElementById("fuente").value = "";
    document.getElementById("monto-ingreso").value = "";
    document.getElementById("fecha-ingreso").value = "";
}

// Función para limpiar los campos de gasto
function limpiarCamposGasto() {
    document.getElementById("descripcion").value = "";
    document.getElementById("monto").value = "";
    document.getElementById("categoria").value = "Alimentación";
    document.getElementById("fecha-gasto").value = "";
}

// Función para guardar los datos en localStorage
function guardarDatos() {
    try {
        let datos = { ingresos, gastos };
        localStorage.setItem("finanzas", JSON.stringify(datos));
    } catch (error) {
        console.error("Error al guardar los datos:", error);
    }
}

// Función para descargar el reporte en Excel
function descargarExcel() {
    try {
        let wb = XLSX.utils.book_new();

        let wsIngresos = XLSX.utils.json_to_sheet(ingresos.map((i, index) => ({
            "#": index + 1,
            "Fecha": i.fecha,
            "Fuente": i.fuente,
            "Monto": `S/ ${i.monto.toFixed(2)}`
        })));

        let wsGastos = XLSX.utils.json_to_sheet(gastos.map((g, index) => ({
            "#": index + 1,
            "Fecha": g.fecha,
            "Descripción": g.descripcion,
            "Categoría": g.categoria,
            "Monto": `S/ ${g.monto.toFixed(2)}`
        })));

        XLSX.utils.book_append_sheet(wb, wsIngresos, "Ingresos");
        XLSX.utils.book_append_sheet(wb, wsGastos, "Gastos");

        XLSX.writeFile(wb, "Reporte_Finanzas.xlsx");
    } catch (error) {
        alert("Error al generar el reporte. Intenta nuevamente.");
    }
}
