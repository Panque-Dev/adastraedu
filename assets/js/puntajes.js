/* Datos compartidos con el chat y la página de puntajes. */
/* =====================================================
   ELEMENTOS
   ===================================================== */

const areaSelect =
    document.getElementById("area");

const carreraSelect =
    document.getElementById("carrera");

const btnPuntaje =
    document.getElementById("btnPuntaje");

const resultado =
    document.getElementById("resultado");

const mensaje =
    document.getElementById("mensaje");

const nombreCarrera =
    document.getElementById("nombreCarrera");

const areaResultado =
    document.getElementById("areaResultado");

const tablaResultado =
    document.getElementById("tablaResultado");

const puntajeGrande =
    document.getElementById("puntajeGrande");

const totalPlanteles =
    document.getElementById("totalPlanteles");

const totalAspirantes =
    document.getElementById("totalAspirantes");

const totalSeleccionados =
    document.getElementById("totalSeleccionados");


/* =====================================================
   CAMBIO DE ÁREA
   ===================================================== */

areaSelect.addEventListener("change", function () {

    const area = this.value;

    carreraSelect.innerHTML = "";

    resultado.classList.remove("mostrar");

    mensaje.textContent = "";

    mensaje.className = "calculator-message";


    if (!area) {

        carreraSelect.disabled = true;

        carreraSelect.innerHTML = `
            <option value="">
                Primero selecciona un área
            </option>
        `;

        return;
    }


    carreraSelect.disabled = false;

    carreraSelect.innerHTML = `
        <option value="">
            Selecciona una carrera
        </option>
    `;


    carrerasUNAM[area].forEach(function (carrera) {

        const option =
            document.createElement("option");

        option.value = carrera;

        option.textContent = carrera;

        carreraSelect.appendChild(option);

    });

});


/* =====================================================
   OBTENER RESULTADO
   ===================================================== */

btnPuntaje.addEventListener("click", function () {

    const area =
        areaSelect.value;

    const carrera =
        carreraSelect.value;


    if (!area) {

        mostrarMensaje(
            "Selecciona primero un área de la UNAM.",
            "error"
        );

        return;
    }


    if (!carrera) {

        mostrarMensaje(
            "Selecciona una carrera para consultar.",
            "error"
        );

        return;
    }


    const registros =
        datosUNAM[carrera];


    if (!registros || registros.length === 0) {

        mostrarMensaje(
            "Los datos detallados de esta carrera todavía no están cargados.",
            "error"
        );

        resultado.classList.remove("mostrar");

        return;
    }


    nombreCarrera.textContent =
        carrera;


    areaResultado.textContent =
        areasNombre[area];


    tablaResultado.innerHTML = "";


    let sumaOferta = 0;
    let sumaAspirantes = 0;
    let sumaPresentaron = 0;
    let sumaSeleccionados = 0;

    let mayorPuntaje = null;
    let menorPuntaje = null;


    registros.forEach(function (registro) {

        sumaOferta +=
            Number(registro.oferta || 0);

        sumaAspirantes +=
            Number(registro.aspirantes || 0);

        sumaPresentaron +=
            Number(registro.presentaronExamen || 0);

        sumaSeleccionados +=
            Number(registro.seleccionados || 0);


        if (
            registro.puntaje !== null &&
            registro.puntaje !== undefined
        ) {

            if (
                mayorPuntaje === null ||
                registro.puntaje > mayorPuntaje
            ) {

                mayorPuntaje =
                    registro.puntaje;

            }


            if (
                menorPuntaje === null ||
                registro.puntaje < menorPuntaje
            ) {

                menorPuntaje =
                    registro.puntaje;

            }

        }


        const fila =
            document.createElement("tr");


        const ofertaTexto =
            registro.oferta === null ||
            registro.oferta === undefined ||
            registro.oferta === 0
                ? "—"
                : Number(
                    registro.oferta
                ).toLocaleString("es-MX");


        const aspirantesTexto =
            registro.aspirantes === null ||
            registro.aspirantes === undefined ||
            registro.aspirantes === 0
                ? "—"
                : Number(
                    registro.aspirantes
                ).toLocaleString("es-MX");


        const presentaronTexto =
            registro.presentaronExamen === null ||
            registro.presentaronExamen === undefined ||
            registro.presentaronExamen === 0
                ? "—"
                : Number(
                    registro.presentaronExamen
                ).toLocaleString("es-MX");


        const seleccionadosTexto =
            registro.seleccionados === null ||
            registro.seleccionados === undefined ||
            registro.seleccionados === 0
                ? "—"
                : Number(
                    registro.seleccionados
                ).toLocaleString("es-MX");


        const puntajeTexto =
            registro.puntaje === null ||
            registro.puntaje === undefined
                ? "—"
                : registro.puntaje;


        const modalidadTexto =
            registro.modalidad ||
            "No especificada";


        const estadoTexto =
            registro.estado
                ? `
                    <small style="
                        display:block;
                        margin-top:6px;
                        opacity:.75;
                    ">
                        ${registro.estado}
                    </small>
                  `
                : "";


        fila.innerHTML = `

            <td class="plantel-cell">

                <div class="plantel-name">

                    <i class="fa-solid fa-building-columns"></i>

                    <span>
                        ${registro.plantel}
                    </span>

                </div>


                <small style="
                    display:block;
                    margin-top:6px;
                    opacity:.75;
                ">

                    Modalidad:
                    ${modalidadTexto}

                    ·

                    Oferta:
                    ${ofertaTexto}

                    ·

                    Presentaron control:
                    ${presentaronTexto}

                </small>

                ${estadoTexto}

            </td>


            <td>
                ${aspirantesTexto}
            </td>


            <td>
                ${seleccionadosTexto}
            </td>


            <td class="puntaje-cell">

                <strong>
                    ${puntajeTexto}
                </strong>

                <span>
                    ${puntajeTexto === "—"
                        ? ""
                        : "aciertos"}
                </span>

            </td>

        `;


        tablaResultado.appendChild(fila);

    });


    totalPlanteles.textContent =
        registros.length;


    totalAspirantes.textContent =
        sumaAspirantes.toLocaleString("es-MX");


    totalSeleccionados.textContent =
        sumaSeleccionados.toLocaleString("es-MX");


    puntajeGrande.textContent =
        mayorPuntaje === null
            ? "—"
            : mayorPuntaje;


    mostrarResumenExtra({

        oferta:
            sumaOferta,

        aspirantes:
            sumaAspirantes,

        presentaron:
            sumaPresentaron,

        seleccionados:
            sumaSeleccionados,

        puntajeMayor:
            mayorPuntaje,

        puntajeMenor:
            menorPuntaje

    });


    mostrarMensaje(
        "Consulta realizada correctamente con los resultados del Examen de Control 2026.",
        "success"
    );


    resultado.classList.add("mostrar");


    setTimeout(function () {

        resultado.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }, 150);

});


/* =====================================================
   RESUMEN EXTRA
   ===================================================== */

function mostrarResumenExtra(datos) {

    let resumen =
        document.getElementById("resumenExtraUNAM");


    if (!resumen) {

        resumen =
            document.createElement("div");

        resumen.id =
            "resumenExtraUNAM";

        resumen.style.cssText = `
            display:grid;
            grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
            gap:12px;
            margin-top:18px;
        `;

        const contenedorTabla =
            tablaResultado.closest("table");

        if (contenedorTabla) {

            contenedorTabla.insertAdjacentElement(
                "afterend",
                resumen
            );

        } else {

            tablaResultado.parentElement.appendChild(
                resumen
            );

        }

    }


    const ofertaTexto =
        datos.oferta === 0
            ? "—"
            : datos.oferta.toLocaleString("es-MX");


    const aspirantesTexto =
        datos.aspirantes === 0
            ? "—"
            : datos.aspirantes.toLocaleString("es-MX");


    const presentaronTexto =
        datos.presentaron === 0
            ? "—"
            : datos.presentaron.toLocaleString("es-MX");


    const seleccionadosTexto =
        datos.seleccionados === 0
            ? "—"
            : datos.seleccionados.toLocaleString("es-MX");


    const puntajeMayorTexto =
        datos.puntajeMayor === null
            ? "—"
            : datos.puntajeMayor + " aciertos";


    const puntajeMenorTexto =
        datos.puntajeMenor === null
            ? "—"
            : datos.puntajeMenor + " aciertos";


    resumen.innerHTML = `

        <div style="
            padding:14px;
            border-radius:12px;
            background:rgba(255,255,255,.06);
        ">
            <strong>Oferta total</strong>

            <div style="
                font-size:1.25rem;
                margin-top:4px;
            ">
                ${ofertaTexto}
            </div>
        </div>


        <div style="
            padding:14px;
            border-radius:12px;
            background:rgba(255,255,255,.06);
        ">
            <strong>Aspirantes</strong>

            <div style="
                font-size:1.25rem;
                margin-top:4px;
            ">
                ${aspirantesTexto}
            </div>
        </div>


        <div style="
            padding:14px;
            border-radius:12px;
            background:rgba(255,255,255,.06);
        ">
            <strong>Presentaron control</strong>

            <div style="
                font-size:1.25rem;
                margin-top:4px;
            ">
                ${presentaronTexto}
            </div>
        </div>


        <div style="
            padding:14px;
            border-radius:12px;
            background:rgba(255,255,255,.06);
        ">
            <strong>Seleccionados</strong>

            <div style="
                font-size:1.25rem;
                margin-top:4px;
            ">
                ${seleccionadosTexto}
            </div>
        </div>


        <div style="
            padding:14px;
            border-radius:12px;
            background:rgba(255,255,255,.06);
        ">
            <strong>Corte más alto</strong>

            <div style="
                font-size:1.25rem;
                margin-top:4px;
            ">
                ${puntajeMayorTexto}
            </div>
        </div>


        <div style="
            padding:14px;
            border-radius:12px;
            background:rgba(255,255,255,.06);
        ">
            <strong>Corte más bajo</strong>

            <div style="
                font-size:1.25rem;
                margin-top:4px;
            ">
                ${puntajeMenorTexto}
            </div>
        </div>

    `;

}


/* =====================================================
   MENSAJES
   ===================================================== */

function mostrarMensaje(texto, tipo) {

    mensaje.textContent =
        texto;

    mensaje.className =
        "calculator-message " + tipo;

}