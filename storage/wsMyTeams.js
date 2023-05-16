import teams from "../config/API/teams.js";

self.addEventListener("message", (e) => {
    Promise.resolve(teams[`${e.data.module}`]((e.data.data) ? e.data.data : undefined)).then(res => postMessage(res))
})