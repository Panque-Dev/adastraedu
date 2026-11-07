document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTOS DEL CARRUSEL
    ===================================================== */

    const carrusel = document.querySelector(".carrusel");
    const slides = document.querySelectorAll(".slide");

    const flechaAnterior =
        document.querySelector(".carousel-prev");

    const flechaSiguiente =
        document.querySelector(".carousel-next");

    const puntos =
        document.querySelectorAll(".carousel-dot");

    const contador =
        document.querySelector("#current-slide");


    /* =====================================================
       COMPROBAR QUE EXISTE EL CARRUSEL
    ===================================================== */

    if (!carrusel || slides.length === 0) {
        console.warn("Carrusel no encontrado.");
        return;
    }


    /* =====================================================
       VARIABLES
    ===================================================== */

    let slideActual = 0;

    let cambiando = false;

    let presionando = false;

    let inicioX = 0;

    let diferenciaX = 0;


    /* =====================================================
       MOSTRAR SLIDE
    ===================================================== */

    function mostrarSlide(numero) {

        if (cambiando) {
            return;
        }

        /* -----------------------------------------------
           LOOP INFINITO
        ----------------------------------------------- */

        if (numero < 0) {
            numero = slides.length - 1;
        }

        if (numero >= slides.length) {
            numero = 0;
        }

        slideActual = numero;


        /* -----------------------------------------------
           QUITAR ACTIVE
        ----------------------------------------------- */

        slides.forEach(function (slide) {

            slide.classList.remove("active-slide");

        });


        /* -----------------------------------------------
           ACTIVAR SLIDE
        ----------------------------------------------- */

        slides[slideActual]
            .classList.add("active-slide");


        /* -----------------------------------------------
           ACTUALIZAR PUNTOS
        ----------------------------------------------- */

        puntos.forEach(function (punto, indice) {

            punto.classList.toggle(
                "active",
                indice === slideActual
            );

        });


        /* -----------------------------------------------
           ACTUALIZAR CONTADOR
        ----------------------------------------------- */

        if (contador) {

            contador.textContent =
                String(slideActual + 1).padStart(2, "0");

        }


        /* -----------------------------------------------
           BLOQUEO TEMPORAL
        ----------------------------------------------- */

        cambiando = true;

        setTimeout(function () {

            cambiando = false;

        }, 450);

    }


    /* =====================================================
       FLECHA ANTERIOR
    ===================================================== */

    if (flechaAnterior) {

        flechaAnterior.addEventListener(
            "click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();

                mostrarSlide(slideActual - 1);

            }
        );

    }


    /* =====================================================
       FLECHA SIGUIENTE
    ===================================================== */

    if (flechaSiguiente) {

        flechaSiguiente.addEventListener(
            "click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();

                mostrarSlide(slideActual + 1);

            }
        );

    }


    /* =====================================================
       PUNTOS
    ===================================================== */

    puntos.forEach(function (punto, indice) {

        punto.addEventListener(
            "click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();

                mostrarSlide(indice);

            }
        );

    });


    /* =====================================================
       MOUSE - INICIO DEL ARRASTRE
    ===================================================== */

    carrusel.addEventListener(
        "mousedown",
        function (e) {

            /*
             * Solamente iniciar arrastre si el clic
             * ocurrió dentro del carrusel.
             */

            presionando = true;

            inicioX = e.clientX;

            diferenciaX = 0;

            carrusel.classList.add("arrastrando");

        }
    );


    /* =====================================================
       MOUSE - MOVIMIENTO
    ===================================================== */

    carrusel.addEventListener(
        "mousemove",
        function (e) {

            if (!presionando) {
                return;
            }

            diferenciaX =
                e.clientX - inicioX;

        }
    );


    /* =====================================================
       FINALIZAR ARRASTRE
    ===================================================== */

    function terminarArrastre() {

        if (!presionando) {
            return;
        }

        presionando = false;

        carrusel.classList.remove("arrastrando");


        /* -----------------------------------------------
           CAMBIAR SLIDE
        ----------------------------------------------- */

        if (Math.abs(diferenciaX) > 50) {

            if (diferenciaX < 0) {

                mostrarSlide(slideActual + 1);

            } else {

                mostrarSlide(slideActual - 1);

            }

        }

        diferenciaX = 0;

    }


    carrusel.addEventListener(
        "mouseup",
        terminarArrastre
    );


    carrusel.addEventListener(
        "mouseleave",
        terminarArrastre
    );


    document.addEventListener(
        "mouseup",
        function () {

            if (presionando) {
                terminarArrastre();
            }

        }
    );


    /* =====================================================
       TOUCH - INICIO
    ===================================================== */

    let inicioTouch = 0;

    let diferenciaTouch = 0;


    carrusel.addEventListener(
        "touchstart",
        function (e) {

            inicioTouch =
                e.touches[0].clientX;

            diferenciaTouch = 0;

        },
        {
            passive: true
        }
    );


    /* =====================================================
       TOUCH - MOVIMIENTO
    ===================================================== */

    carrusel.addEventListener(
        "touchmove",
        function (e) {

            diferenciaTouch =
                e.touches[0].clientX -
                inicioTouch;

        },
        {
            passive: true
        }
    );


    /* =====================================================
       TOUCH - FINAL
    ===================================================== */

    carrusel.addEventListener(
        "touchend",
        function () {

            if (
                Math.abs(diferenciaTouch) > 50
            ) {

                if (diferenciaTouch < 0) {

                    mostrarSlide(
                        slideActual + 1
                    );

                } else {

                    mostrarSlide(
                        slideActual - 1
                    );

                }

            }

            diferenciaTouch = 0;

        }
    );


    /* =====================================================
       EVITAR ARRASTRE DE IMÁGENES
    ===================================================== */

    const imagenes =
        carrusel.querySelectorAll("img");

    imagenes.forEach(function (imagen) {

        imagen.addEventListener(
            "dragstart",
            function (e) {

                e.preventDefault();

            }
        );

    });


    /* =====================================================
       TECLADO
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (e) {

            if (e.key === "ArrowLeft") {

                mostrarSlide(slideActual - 1);

            }

            if (e.key === "ArrowRight") {

                mostrarSlide(slideActual + 1);

            }

        }
    );


    /* =====================================================
       INICIAR
    ===================================================== */

    mostrarSlide(0);

});

