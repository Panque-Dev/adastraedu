# Worker del chat AD ASTRA

Este Worker expone `POST /` para consultas del chat y usa el binding de Cloudflare Workers AI. No necesita una clave externa de IA. El frontend solo guarda la URL pública del Worker; nunca una credencial.

## Antes de publicar

1. Instalar las dependencias y autenticar Wrangler con la cuenta propietaria del proyecto:

   ```powershell
   cd worker
   npm install
   npx wrangler login
   ```

2. En `wrangler.jsonc`, cambiar `ALLOWED_ORIGINS` por el origen exacto donde se publicará la página (por ejemplo, `https://ad-astra.mx`). Se permiten varios orígenes separados por coma. No incluir rutas como `/index.html`.
3. Completar `src/knowledge.js` con información vigente autorizada por AD ASTRA: precios, modalidades, horarios, fechas, materias, requisitos y políticas. Si un dato no se confirma, dejarlo expresamente como desconocido para que el bot lo derive a WhatsApp.
4. Revisar que el `namespace_id` del limitador no se use ya en otro Worker de la misma cuenta; debe ser un entero único para esta integración.

## Desplegar

Desde la carpeta `worker`:

```powershell
npm run deploy
```

Wrangler mostrará una URL similar a `https://ad-astra-chat.<cuenta>.workers.dev`. Copiarla en `assets/js/chat-config.js`:

```js
window.AD_ASTRA_CHAT_API = "https://ad-astra-chat.<cuenta>.workers.dev";
```

El dominio exacto del sitio debe coincidir con uno de los valores de `ALLOWED_ORIGINS`. Si luego cambia el dominio, actualizar la lista y volver a desplegar.

## Publicar el sitio estático en Cloudflare Pages

El proyecto también incluye un comando que prepara únicamente los archivos públicos del sitio (sin `worker/` ni documentación) y los publica como Cloudflare Pages:

```powershell
npm run deploy:site
```

En la primera publicación, Cloudflare creará el proyecto `ad-astra` y mostrará la URL `*.pages.dev`. Después, colocar esa URL en `ALLOWED_ORIGINS`, desplegar el Worker, poner la URL `*.workers.dev` en `assets/js/chat-config.js` y volver a publicar Pages. El mismo flujo se usa para publicar cambios posteriores.

## Respuestas y límites

- Los puntajes siguen respondiéndose con la base local del sitio; no se pide al modelo calcularlos.
- La IA usa únicamente el texto de `src/knowledge.js` y tiene instrucciones para reconocer cuando desconoce un dato.
- El endpoint limita la pregunta a 500 caracteres, la respuesta y salida del modelo, y aplica un límite aproximado de 20 consultas por minuto por IP de cliente.
- Cloudflare Workers AI da una cuota gratuita diaria; revisa el panel de uso de la cuenta antes de publicar a todo el público.
- El limitador por IP es aproximado y puede agrupar usuarios que compartan una red. La lista CORS limita navegadores de otros orígenes, pero no sustituye una protección contra tráfico automatizado.

## Desarrollo local

Desde `worker`:

```powershell
npm run dev
```

Para probar desde una página servida localmente, agregar su origen (por ejemplo `http://localhost:5173`) a `ALLOWED_ORIGINS` durante desarrollo. No publicar los orígenes locales.
