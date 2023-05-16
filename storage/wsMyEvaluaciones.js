import evaluaciones from "../config/API/evaluaciones.js";

self.addEventListener("message", (e) => {
    Promise.resolve(evaluaciones[`${e.data.module}`]((e.data.data) ? e.data.data : undefined)).then(res => postMessage(res))
})