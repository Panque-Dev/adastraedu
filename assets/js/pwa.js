(function () {
    "use strict";

    const SW_PATH = "service-worker.js";
    let deferredPrompt = null;

    function crearBotonInstalar() {
        if (document.getElementById("pwa-install-button")) {
            return;
        }

        const button = document.createElement("button");

        button.id = "pwa-install-button";
        button.type = "button";
        button.setAttribute(
            "aria-label",
            "Instalar AD ASTRA como aplicación"
        );

        button.innerHTML =
            '<span aria-hidden="true">✦</span> INSTALAR APP';

        Object.assign(button.style, {
            position: "fixed",
            right: "18px",
            bottom: "84px",
            zIndex: "9999",
            border: "1px solid rgba(212,175,55,.65)",
            borderRadius: "999px",
            padding: "12px 17px",
            background:
                "linear-gradient(135deg,#241A49,#3D2E73)",
            color: "#fff",
            fontFamily:
                "Montserrat, Segoe UI, Arial, sans-serif",
            fontSize: "11px",
            fontWeight: "800",
            letterSpacing: "1px",
            boxShadow:
                "0 8px 25px rgba(43,33,86,.25)",
            cursor: "pointer",
            display: "none",
            alignItems: "center",
            gap: "8px"
        });

        button.addEventListener(
            "click",
            async function () {

                if (!deferredPrompt) {
                    return;
                }

                deferredPrompt.prompt();

                try {
                    await deferredPrompt.userChoice;
                } catch (error) {
                    console.warn(
                        "No fue posible completar la instalación:",
                        error
                    );
                }

                deferredPrompt = null;
                button.style.display = "none";
            }
        );

        document.body.appendChild(button);

        return button;
    }

    function registrarServiceWorker() {

        if (!("serviceWorker" in navigator)) {
            return;
        }

        window.addEventListener(
            "load",
            function () {

                navigator.serviceWorker
                    .register(
                        SW_PATH,
                        {
                            scope: "./"
                        }
                    )
                    .then(
                        function (registration) {

                            console.log(
                                "AD ASTRA PWA: Service Worker registrado.",
                                registration.scope
                            );

                        }
                    )
                    .catch(
                        function (error) {

                            console.error(
                                "AD ASTRA PWA: error al registrar Service Worker.",
                                error
                            );

                        }
                    );

            }
        );
    }

    function prepararInstalacion() {

        window.addEventListener(
            "beforeinstallprompt",
            function (event) {

                event.preventDefault();

                deferredPrompt = event;

                const button =
                    crearBotonInstalar();

                if (button) {
                    button.style.display = "flex";
                }

            }
        );

        window.addEventListener(
            "appinstalled",
            function () {

                deferredPrompt = null;

                const button =
                    document.getElementById(
                        "pwa-install-button"
                    );

                if (button) {
                    button.style.display = "none";
                }

                console.log(
                    "AD ASTRA PWA: aplicación instalada."
                );

            }
        );
    }

    function ocultarBotonSiYaEsApp() {

        if (
            window.matchMedia(
                "(display-mode: standalone)"
            ).matches ||
            window.navigator.standalone === true
        ) {

            const button =
                document.getElementById(
                    "pwa-install-button"
                );

            if (button) {
                button.remove();
            }
        }
    }

    registrarServiceWorker();

    prepararInstalacion();

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            ocultarBotonSiYaEsApp
        );

    } else {

        ocultarBotonSiYaEsApp();

    }

})();