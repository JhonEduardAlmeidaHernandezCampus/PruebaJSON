import reclutas from "../config/API/reclutas.js"

self.addEventListener("message", (e) => {
    Promise.resolve(reclutas[`${e.data.module}`]((e.data.data) ? e.data.data : undefined)).then(res => postMessage(res))
})