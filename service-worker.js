const CACHE_NAME = "ad-astra-pwa-v12";

const APP_SHELL = [
    "./",
    "./index.html",
    "./profesores.html",
    "./puntajes.html",
    "./simulacros.html",
    "./assets/css/style.css",
    "./assets/css/simulacros.css",
    "./assets/css/chat.css",
    "./assets/js/script.js",
    "./assets/js/puntajes.js",
    "./assets/js/puntajes-data.js",
    "./assets/js/pwa.js",
    "./assets/js/chat.js",
    "./assets/js/chat-config.js",
    "./manifest.webmanifest",
    "./assets/images/icon-192.png",
    "./assets/images/icon-512.png"
];

self.addEventListener(
    "install",
    function (event) {

        event.waitUntil(

            caches
                .open(CACHE_NAME)

                .then(
                    function (cache) {

                        return cache.addAll(
                            APP_SHELL
                        );

                    }
                )

                .then(
                    function () {

                        return self.skipWaiting();

                    }
                )

        );

    }
);


self.addEventListener(
    "activate",
    function (event) {

        event.waitUntil(

            caches
                .keys()

                .then(
                    function (cacheNames) {

                        return Promise.all(

                            cacheNames

                                .filter(
                                    function (name) {

                                        return name !==
                                            CACHE_NAME;

                                    }
                                )

                                .map(
                                    function (name) {

                                        return caches.delete(
                                            name
                                        );

                                    }
                                )

                        );

                    }
                )

                .then(
                    function () {

                        return self.clients.claim();

                    }
                )

        );

    }
);


self.addEventListener(
    "fetch",
    function (event) {

        const request =
            event.request;

        if (
            request.method !== "GET"
        ) {
            return;
        }

        const url =
            new URL(request.url);

        if (
            url.origin !==
            self.location.origin
        ) {
            return;
        }

        if (
            request.mode === "navigate"
        ) {

            event.respondWith(

                fetch(request)

                    .then(
                        function (response) {

                            const copy =
                                response.clone();

                            caches
                                .open(CACHE_NAME)
                                .then(
                                    function (cache) {

                                        cache.put(
                                            request,
                                            copy
                                        );

                                    }
                                );

                            return response;

                        }
                    )

                    .catch(
                        function () {

                            return caches
                                .match(request)

                                .then(
                                    function (cached) {

                                        return cached ||
                                            caches.match(
                                                "./index.html"
                                            );

                                    }
                                );

                        }
                    )

            );

            return;
        }


        event.respondWith(

            caches
                .match(request)

                .then(
                    function (cached) {

                        const networkRequest =
                            fetch(request)

                                .then(
                                    function (response) {

                                        if (
                                            response &&
                                            response.ok
                                        ) {

                                            const copy =
                                                response.clone();

                                            caches
                                                .open(
                                                    CACHE_NAME
                                                )
                                                .then(
                                                    function (cache) {

                                                        cache.put(
                                                            request,
                                                            copy
                                                        );

                                                    }
                                                );

                                        }

                                        return response;

                                    }
                                )

                                .catch(
                                    function () {

                                        return cached;

                                    }
                                );

                        return cached ||
                            networkRequest;

                    }
                )

        );

    }
);


