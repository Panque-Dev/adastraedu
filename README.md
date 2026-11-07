# AD ASTRA

## Estructura

- `index.html`: página de inicio y presentación del curso.
- `profesores.html`: perfiles del equipo docente.
- `puntajes.html`: consulta interactiva de puntajes por carrera.
- `simulacros.html`: información y acceso al simulacro externo.
- `assets/css/`: estilos generales y estilos propios de simulacros.
- `assets/js/`: carrusel, datos compartidos de puntajes, consulta interactiva, instalación PWA y búsqueda conversacional por carrera y plantel.
- `assets/css/chat.css` y `assets/js/chat.js`: chat de preguntas frecuentes con derivación a WhatsApp y opción para limpiar el hilo y volver al menú; no almacena conversaciones.
- `assets/js/chat-config.js`: dirección pública del Worker para activar las respuestas con IA al publicarlo.
- `worker/`: Cloudflare Worker, base inicial de conocimiento del curso, configuración de Workers AI, límites y guía de despliegue.
- `.gitignore`: excluye dependencias, artefactos de publicación y secretos locales del repositorio.
- `netlify.toml`: configura la preparación del sitio estático para Netlify.
- `assets/js/puntajes-data.js`: fuente compartida de datos UNAM 2026 para la calculadora de puntajes y la búsqueda del chat por carrera y plantel.
- `assets/images/`: imágenes, retratos, fondos e iconos usados por el sitio.
- `assets/images/archivo/`: imágenes conservadas que actualmente no tienen referencias desde las páginas.
- `manifest.webmanifest` y `service-worker.js`: instalación y caché de la PWA.
- `extras/`: archivo `Microsoft.Services.Store.winmd`, ajeno al sitio web.

## Mejoras SEO y de rendimiento pendientes

1. Las referencias de las imágenes convertidas ya apuntan a WebP. La foto `GRUPO AD ASTRA.jpeg` sigue pendiente de conversión. Conviene conservar PNG para el isotipo e iconos PWA; el GIF UNAM requiere conversión animada si se quiere preservar el movimiento.
2. Añadir imágenes responsivas (`srcset`/`sizes`), dimensiones explícitas y carga diferida solo a imágenes fuera de la primera vista.
3. Configurar URL canónica, Open Graph, `robots.txt` y `sitemap.xml` cuando se conozca el dominio público.
4. Revisar la jerarquía de encabezados y el contenido de cada página; las descripciones meta ya están incluidas.
5. Evaluar alojar las fuentes localmente o quitar importaciones duplicadas; se dejó una sola importación de Montserrat por hoja de estilos.

`index.html` y las demás páginas permanecen en la raíz para conservar compatibilidad con alojamientos estáticos y la navegación actual.

## Publicación en Netlify

El sitio se prepara con `node worker/scripts/build-pages.mjs`; Netlify publica únicamente `.pages-dist`, que contiene las cuatro páginas, sus recursos y la PWA. Al vincular el repositorio de GitHub a Netlify, cada actualización en la rama de producción generará una nueva publicación automáticamente. El Worker de IA se despliega aparte; consulta `worker/README.md`.
