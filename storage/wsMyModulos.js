import modulos from "../config/API/modulos.js";

self.addEventListener("message", (e) => {
    Promise.resolve(modulos[`${e.data.module}`]((e.data.data) ? e.data.data : undefined)).then(res => postMessage(res))
})