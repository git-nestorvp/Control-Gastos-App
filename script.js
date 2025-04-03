// Variables globales
let ingresos = [];
let gastos = [];

// Función para actualizar el resumen
function actualizarResumen() {
    const totalIngresos = ingresos.reduce((total, ingreso) => total + ingreso.monto, 0);
    const totalGastos = gastos.reduce((total, gasto) => total + gasto.monto, 0);
    const balance = totalIngresos - totalGastos;

    document.getElementById("total-ingresos").innerText = `Total Ingresos: S/ ${totalIngresos.toFixed(2)}`;
    document.getElementById("total-gastos").innerText = `Total Gastos: S/ ${totalGastos.toFixed(2)}`;
    document.getElementById("balance").innerText = `Balance: S/ ${balance.toFixed(2)}`;
}

// Función para agregar un ingreso
function agregarIngreso() {
    try {
        let fuente = document.getElementById("fuente").value.trim();
        let monto = parseFloat(document.getElementById("monto-ingreso").value);
        let fecha = document.getElementById("fecha-ingreso").value;

        // Validaciones
        if (!fuente || isNaN(monto) || monto <= 0 || !fecha) {
            throw new Error("Por favor, ingresa datos válidos para el ingreso.");
        }

        ingresos.push({ fuente, monto, fecha });
        actualizarLista("lista-ingresos", ingresos);
        actualizarResumen();
        limpiarCampos(["fuente", "monto-ingreso", "fecha-ingreso"]);
    } catch (error) {
        mostrarError(error.message);
    }
}

// Función para agregar un gasto
function agregarGasto() {
    try {
        let descripcion = document.getElementById("descripcion").value.trim();
        let monto = parseFloat(document.getElementById("monto").value);
        let categoria = document.getElementById("categoria").value;
        let fecha = document.getElementById("fecha-gasto").value;

        // Validaciones
        if (!descripcion || isNaN(monto) || monto <= 0 || !fecha) {
            throw new Error("Por favor, ingresa datos válidos para el gasto.");
        }

        gastos.push({ descripcion, monto, categoria, fecha });
        actualizarLista("lista-gastos", gastos);
        actualizarResumen();
        limpiarCampos(["descripcion", "monto", "fecha-gasto", "categoria"]);
    } catch (error) {
        mostrarError(error.message);
    }
}

// Función para mostrar errores en la interfaz
function mostrarError(mensaje) {
    const mensajeError = document.getElementById("mensaje-error");
    mensajeError.innerText = mensaje;
}

// Función para limpiar los campos después de agregar un ingreso o gasto
function limpiarCampos(campos) {
    campos.forEach(campo => document.getElementById(campo).value = '');
}

// Función para actualizar la lista en el HTML
function actualizarLista(idLista, lista) {
    const listaElement = document.getElementById(idLista);
    listaElement.innerHTML = '';  // Limpiar la lista
    lista.forEach(item => {
        const li = document.createElement("li");
        li.textContent = JSON.stringify(item);
        listaElement.appendChild(li);
    });
}

// Función para exportar el reporte a Excel
function exportarExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["Fuente", "Monto", "Fecha"]]);

    ingresos.forEach(ingreso => {
        ws["!ref"] = `A1:C${ingresos.length + 1}`;
        XLSX.utils.sheet_add_aoa(ws, [[ingreso.fuente, ingreso.monto, ingreso.fecha]], { origin: -1 });
    });

    XLSX.utils.book_append_sheet(wb, ws, "Ingresos");

    const wsGastos = XLSX.utils.aoa_to_sheet([["Descripción", "Monto", "Categoría", "Fecha"]]);
    gastos.forEach(gasto => {
        wsGastos["!ref"] = `A1:D${gastos.length + 1}`;
        XLSX.utils.sheet_add_aoa(wsGastos, [[gasto.descripcion, gasto.monto, gasto.categoria, gasto.fecha]], { origin: -1 });
    });

    XLSX.utils.book_append_sheet(wb, wsGastos, "Gastos");

    // Descarga el archivo Excel
    XLSX.writeFile(wb, "Reporte_Ingresos_Gastos.xlsx");
}
