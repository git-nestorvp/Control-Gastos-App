let ingresos = [];
let gastos = [];

function agregarIngreso() {
    let fuente = document.getElementById("fuente").value;
    let monto = parseFloat(document.getElementById("monto-ingreso").value);
    let fecha = document.getElementById("fecha-ingreso").value;

    if (fuente && !isNaN(monto) && monto > 0 && fecha) {
        ingresos.push({ fuente, monto, fecha });
        actualizarListaIngresos();
        guardarDatos();
    }
}

function agregarGasto() {
    let descripcion = document.getElementById("descripcion").value;
    let monto = parseFloat(document.getElementById("monto").value);
    let categoria = document.getElementById("categoria").value;
    let fecha = document.getElementById("fecha-gasto").value;

    if (descripcion && !isNaN(monto) && monto > 0 && fecha) {
        gastos.push({ descripcion, monto, categoria, fecha });
        actualizarListaGastos();
        guardarDatos();
    }
}

function actualizarListaIngresos() {
    let lista = document.getElementById("lista-ingresos");
    lista.innerHTML = "";
    let totalIngresos = 0;

    ingresos.forEach((ingreso, index) => {
        let item = document.createElement("li");
        item.innerHTML = `${ingreso.fecha} - ${ingreso.fuente}: S/ ${ingreso.monto.toFixed(2)}
            <button onclick="eliminarIngreso(${index})">X</button>`;
        lista.appendChild(item);
        totalIngresos += ingreso.monto;
    });

    document.getElementById("total-ingresos").textContent = totalIngresos.toFixed(2);
    actualizarSaldo();
}

function actualizarListaGastos() {
    let lista = document.getElementById("lista-gastos");
    lista.innerHTML = "";
    let totalGastos = 0;

    gastos.forEach((gasto, index) => {
        let item = document.createElement("li");
        item.innerHTML = `${gasto.fecha} - ${gasto.descripcion} (${gasto.categoria}): S/ ${gasto.monto.toFixed(2)}
            <button onclick="eliminarGasto(${index})">X</button>`;
        lista.appendChild(item);
        totalGastos += gasto.monto;
    });

    document.getElementById("total-gastos").textContent = totalGastos.toFixed(2);
    actualizarSaldo();
}

function eliminarIngreso(index) {
    ingresos.splice(index, 1);
    actualizarListaIngresos();
    guardarDatos();
}

function eliminarGasto(index) {
    gastos.splice(index, 1);
    actualizarListaGastos();
    guardarDatos();
}

function actualizarSaldo() {
    let totalIngresos = ingresos.reduce((sum, i) => sum + i.monto, 0);
    let totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
    document.getElementById("saldo").textContent = (totalIngresos - totalGastos).toFixed(2);
}

function guardarDatos() {
    localStorage.setItem("finanzas", JSON.stringify({ ingresos, gastos }));
}

function cargarDatos() {
    let datos = JSON.parse(localStorage.getItem("finanzas"));
    if (datos) {
        ingresos = datos.ingresos || [];
        gastos = datos.gastos || [];
        actualizarListaIngresos();
        actualizarListaGastos();
    }
}

// Función para descargar el reporte en Excel
function descargarExcel() {
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
}

window.onload = cargarDatos;
