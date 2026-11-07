(function () {
    "use strict";

    const whatsappNumber = "527221613166";
    const root = document.createElement("div");
    root.className = "ad-astra-chat";
    root.innerHTML = `
        <section class="ad-astra-chat__panel" id="ad-astra-chat-panel" role="dialog" aria-labelledby="ad-astra-chat-title" hidden>
            <header class="ad-astra-chat__header">
                <div>
                    <h2 class="ad-astra-chat__heading" id="ad-astra-chat-title">Asistente AD ASTRA</h2>
                    <span class="ad-astra-chat__status">Respuestas rápidas · Atención por WhatsApp</span>
                </div>
                <button class="ad-astra-chat__close" type="button" aria-label="Cerrar chat">×</button>
            </header>
            <div class="ad-astra-chat__messages" aria-live="polite" aria-relevant="additions text"></div>
            <form class="ad-astra-chat__form">
                <input class="ad-astra-chat__input" type="text" maxlength="500" placeholder="Escribe tu duda..." aria-label="Escribe tu duda" autocomplete="off" required>
                <button class="ad-astra-chat__send" type="submit">Enviar</button>
            </form>
            <p class="ad-astra-chat__privacy">Este chat no guarda mensajes. Si continúas, compartirás tu consulta con WhatsApp.</p>
        </section>
        <button class="ad-astra-chat__toggle" type="button" aria-controls="ad-astra-chat-panel" aria-expanded="false">💬 ¿Dudas?</button>
    `;
    document.body.appendChild(root);

    const panel = root.querySelector(".ad-astra-chat__panel");
    const toggle = root.querySelector(".ad-astra-chat__toggle");
    const close = root.querySelector(".ad-astra-chat__close");
    const messages = root.querySelector(".ad-astra-chat__messages");
    const form = root.querySelector(".ad-astra-chat__form");
    const input = root.querySelector(".ad-astra-chat__input");
    const sendButton = root.querySelector(".ad-astra-chat__send");
    const chatApi = window.AD_ASTRA_CHAT_API || "";

    function normalize(text) {
        return text.toLocaleLowerCase("es-MX")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, " ")
            .trim();
    }

    function addMessage(text, sender, action, showMenuButton) {
        const message = document.createElement("p");
        message.className = `ad-astra-chat__message${sender === "user" ? " ad-astra-chat__message--user" : ""}`;
        message.textContent = text;

        if (action) {
            const link = document.createElement("a");
            link.href = action.href;
            link.textContent = action.label;
            if (action.external) {
                link.target = "_blank";
                link.rel = "noopener noreferrer";
            }
            message.appendChild(document.createElement("br"));
            message.appendChild(link);
        }

        if (showMenuButton) {
            const backButton = document.createElement("button");
            backButton.className = "ad-astra-chat__back";
            backButton.type = "button";
            backButton.textContent = "Volver al inicio";
            backButton.addEventListener("click", resetMenu);
            message.appendChild(document.createElement("br"));
            message.appendChild(backButton);
        }

        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    function whatsappAction(question) {
        const text = question
            ? `Hola, tengo una duda desde el sitio de AD ASTRA: ${question}`
            : "Hola, quisiera información sobre AD ASTRA.";
        return {
            label: "Continuar por WhatsApp",
            href: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
            external: true
        };
    }

    function findCareer(query, scoreData) {
        if (/medicina veterinaria|zootecnia/.test(query)) {
            return "Medicina Veterinaria y Zootecnia";
        }
        if (/\bmedicina\b|medico cirujano/.test(query)) {
            return "Médico Cirujano";
        }

        return Object.keys(scoreData)
            .sort((a, b) => normalize(b).length - normalize(a).length)
            .find((career) => query.includes(normalize(career))) || null;
    }

    function findScoreAnswer(question, query) {
        const scoreDataAvailable = window.AD_ASTRA_PUNTAJES;
        const data = scoreDataAvailable && scoreDataAvailable.datosUNAM;
        const career = findCareer(query, data || {});

        if (!career) {
            return {
                text: "¿Qué carrera quieres consultar? Escribe el nombre y, si quieres, el plantel. Por ejemplo: «Medicina en CU» o «Derecho en FES Acatlán».",
                action: { label: "Abrir tabla de puntajes", href: "puntajes.html" },
                showMenu: true
            };
        }

        const records = data[career] || [];
        if (!records.length) {
            return {
                text: `Encontré ${career}, pero no hay registros de puntaje disponibles en la base del sitio. Puedes consultar la tabla completa para revisar la información más reciente.`,
                action: { label: "Abrir tabla de puntajes", href: "puntajes.html" },
                showMenu: true
            };
        }

        let matchingRecords = records;
        const directCampus = records.find((record) => query.includes(normalize(record.plantel)));
        const campusAlias = {
            acatlan: "fes acatlan",
            aragon: "fes aragon",
            iztacala: "fes iztacala",
            zaragoza: "fes zaragoza",
            cuautitlan: "fes cuautitlan"
        };
        const matchedAlias = Object.keys(campusAlias).find((alias) => query.includes(alias));
        const asksForCU = /\bcu\b|ciudad universitaria/.test(query);

        if (directCampus) {
            matchingRecords = [directCampus];
        } else if (matchedAlias) {
            matchingRecords = records.filter((record) => normalize(record.plantel) === campusAlias[matchedAlias]);
        } else if (asksForCU) {
            matchingRecords = records.filter((record) => normalize(record.plantel).startsWith("facultad de "));
        }

        if (!matchingRecords.length) {
            return {
                text: `Encontré ${career}, pero no un registro para ese plantel. Puedo mostrarte los planteles disponibles o puedes escribir el nombre completo del plantel.`,
                action: { label: "Abrir tabla de puntajes", href: "puntajes.html" },
                showMenu: true
            };
        }

        const lines = matchingRecords.map((record) => {
            const score = record.puntaje === null || record.puntaje === undefined
                ? "sin puntaje publicado"
                : `${record.puntaje} aciertos`;
            return `• ${record.plantel}: ${score}`;
        });
        const campusNote = asksForCU && !directCampus && !matchedAlias
            ? "Interpreté «CU» como el plantel de Ciudad Universitaria."
            : "";

        return {
            text: `${career} — puntajes de referencia de la base 2026:\n${lines.join("\n")}${campusNote ? `\n${campusNote}` : ""}\nSon referencias y no garantizan admisión.`,
            action: { label: "Ver tabla completa", href: "puntajes.html" }
        };
    }

    function answerFor(question) {
        const q = normalize(question);

        const scoreData = window.AD_ASTRA_PUNTAJES && window.AD_ASTRA_PUNTAJES.datosUNAM;
        const recognizedCareer = scoreData ? findCareer(q, scoreData) : null;
        const scoreIntent = /puntaje|acierto|carrera/.test(q);
        const campusIntent = /\ben\s+(cu|fes|acatlan|aragon|iztacala|zaragoza|cuautitlan)\b|ciudad universitaria/.test(q);

        if (scoreIntent || (recognizedCareer && campusIntent)) {
            if (/significa|que es|como se calcula/.test(q) && scoreIntent) {
                return {
                    text: "El puntaje indica los aciertos de referencia registrados para una carrera y plantel. Los datos disponibles en la página corresponden a la base 2026 y pueden cambiar.",
                    action: { label: "Abrir tabla de puntajes", href: "puntajes.html" }
                };
            }
            return findScoreAnswer(question, q);
        }

        if (/precio|costo|cuanto|mensualidad|pago|beca/.test(q)) {
            return {
                text: "No tengo información confirmada sobre precios o pagos. El equipo de AD ASTRA puede orientarte por WhatsApp.",
                action: whatsappAction(question),
                showMenu: true,
                useAI: true
            };
        }
        if (/horario|hora|fecha|cuando|inicio|empieza/.test(q)) {
            return {
                text: "La página no publica horarios ni fechas detalladas. Escríbenos por WhatsApp para consultar la información vigente.",
                action: whatsappAction(question),
                showMenu: true,
                useAI: true
            };
        }
        if (/inscrip|registro|lugar|requisito/.test(q)) {
            return {
                text: "El sitio anuncia inscripciones abiertas para la Generación UNAM 2027. Para conocer requisitos y completar tu registro, contacta al equipo.",
                action: whatsappAction(question),
                showMenu: true,
                useAI: true
            };
        }
        if (/simulacro/.test(q)) {
            return {
                text: "AD ASTRA ofrece simulacros semanales. Puedes consultar la página del simulacro y abrir el formulario desde ahí.",
                action: { label: "Ver simulacro", href: "simulacros.html" }
            };
        }
        if (/plantel/.test(q)) {
            return {
                text: "Puedo buscar puntajes por carrera y plantel. Escribe, por ejemplo, «Medicina en CU» o «Derecho en FES Acatlán».",
                action: { label: "Abrir tabla de puntajes", href: "puntajes.html" }
            };
        }
        if (/profesor|maestr|docente|equipo/.test(q)) {
            return {
                text: "Puedes conocer al equipo docente y leer sus perfiles en la página de profesores.",
                action: { label: "Ver profesores", href: "profesores.html" }
            };
        }
        if (/curso|clase|modalidad|contenido|repasar|examen/.test(q)) {
            return {
                text: "El sitio menciona clases en vivo, contenido disponible para repasar y simulacros cada semana. Para conocer modalidad, horarios y detalles de inscripción, el equipo puede orientarte.",
                action: whatsappAction(question),
                showMenu: true,
                useAI: true
            };
        }

        return {
            text: "No encontré una respuesta confirmada en el sitio. Te puedo comunicar con el equipo de AD ASTRA por WhatsApp.",
            action: whatsappAction(question),
            showMenu: true,
            useAI: true
        };
    }

    async function submitQuestion(question) {
        const cleanQuestion = question.trim();
        if (!cleanQuestion) return;
        addMessage(cleanQuestion, "user");
        const answer = answerFor(cleanQuestion);

        if (!answer.useAI || !chatApi) {
            addMessage(answer.text, "assistant", answer.action, answer.showMenu);
            return;
        }

        const loading = document.createElement("p");
        loading.className = "ad-astra-chat__message";
        loading.textContent = "Estoy revisando la información del curso…";
        messages.appendChild(loading);
        messages.scrollTop = messages.scrollHeight;
        sendButton.disabled = true;
        input.disabled = true;
        root.querySelectorAll(".ad-astra-chat__quick-replies button").forEach((button) => {
            button.disabled = true;
        });

        try {
            const response = await fetch(chatApi, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: cleanQuestion }),
                signal: AbortSignal.timeout(18000)
            });
            const data = await response.json();
            if (!response.ok || typeof data.answer !== "string") {
                throw new Error("Chat service unavailable");
            }
            loading.remove();
            addMessage(data.answer, "assistant", whatsappAction(cleanQuestion));
        } catch {
            loading.remove();
            addMessage(answer.text, "assistant", answer.action, answer.showMenu);
        } finally {
            sendButton.disabled = false;
            input.disabled = false;
        }
    }

    function addQuickReplies() {
        const message = document.createElement("div");
        message.className = "ad-astra-chat__message";
        message.textContent = "¿Sobre qué tema necesitas ayuda?";
        const choices = document.createElement("div");
        choices.className = "ad-astra-chat__quick-replies";

        ["Inscripciones", "Curso", "Horarios y costos", "Simulacro", "Puntajes"].forEach((label) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = label;
            button.addEventListener("click", () => submitQuestion(label));
            choices.appendChild(button);
        });

        message.appendChild(choices);
        messages.appendChild(message);
    }

    function resetMenu() {
        messages.replaceChildren();
        addMessage("¡Hola! Soy el asistente de AD ASTRA. Puedo responder dudas frecuentes del sitio o conectarte con nuestro equipo por WhatsApp.", "assistant");
        addQuickReplies();
        messages.scrollTop = 0;
    }

    function setOpen(open) {
        panel.hidden = !open;
        toggle.setAttribute("aria-expanded", String(open));
        toggle.textContent = open ? "Cerrar chat" : "💬 ¿Dudas?";
        if (open) input.focus();
    }

    toggle.addEventListener("click", () => setOpen(panel.hidden));
    close.addEventListener("click", () => setOpen(false));
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitQuestion(input.value);
        input.value = "";
        input.focus();
    });
    resetMenu();
})();
