import skills from "../config/API/skills.js";

self.addEventListener("message", (e) => {
    Promise.resolve(skills[`${e.data.module}`]((e.data.data) ? e.data.data : undefined)).then(res => postMessage(res))
})