import config from "../../config/config.js";

export default class mySkills extends HTMLElement {
    static url = import.meta.url
    static async components() {
        return await (await fetch(config.uri(mySkills.url))).text();
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    handleInput(e){
        (e.type === "input") ? this.buscador(e) : undefined; 
    }

    handleEvent(e) {
        e.preventDefault();
        (e.type === "submit") ? this.mySkills(e) : undefined;
        (e.type === "click") ? this.mostrarSkills() : undefined;
    }

    handleEliminar(e){
        (e.type === "click") ? this.eliminarSkills(e) : undefined
    }

    mySkills(e){
        e.preventDefault();
        const guardarDatos = Object.fromEntries(new FormData(e.target))

        const wsMySkills = new Worker("storage/wsMySkills.js", {type: "module"})
            wsMySkills.postMessage({module: "agregarSkills", data: guardarDatos})
            wsMySkills.addEventListener("message", (e) => {
                wsMySkills.terminate();
            })
    }

    mostrarSkills(){
        const wsMySkills = new Worker("storage/wsMySkills.js", {type:"module"})
            wsMySkills.postMessage({module:"consultarSkills"})

            wsMySkills.addEventListener("message", (e) => {

                // Hace el llamado al worker en donde le va a pintar las opciones de teams 
                const wsMyTablas = new Worker("storage/Tablas/wsMyTablas.js", {type: "module"})
                wsMyTablas.postMessage({module:"mostrarSkills", data: e.data})

                    // Crea otro evento de escucha en donde va a pintar las opciones 
                    wsMyTablas.addEventListener("message", (event) => {

                        // Selecciona el input en donde las va a pintar 
                        this.devolverInfo = this.shadowRoot.querySelector("#devolverInfo");

                        // Le inserta la informacion la input 
                        this.devolverInfo.innerHTML = event.data;

                        wsMyTablas.terminate()

                        this.eliminar = this.shadowRoot.querySelectorAll(".eliminar");

                        this.eliminar.forEach((val,id) => {
                            val.addEventListener("click", this.handleEliminar.bind(this))
                        })
                    })
                wsMySkills.terminate()
            })
    }

    buscador(e){
        let obtenerInput = e.target.value
        let wsPeticionBuscador = new Worker("storage/wsMySkills.js", {type: "module"});
            wsPeticionBuscador.postMessage({module: "consultarSkillsInput", data : obtenerInput})

            wsPeticionBuscador.addEventListener("message", (e) =>{

                let wsMostrarDatos = new Worker("storage/Tablas/wsMyTablas.js", {type : "module"})
                wsMostrarDatos.postMessage({module:"mostrarSkills", data: e.data})

                wsMostrarDatos.addEventListener("message", (event) => {

                    this.devolverInfo = this.shadowRoot.querySelector("#devolverInfo");
                    this.devolverInfo.innerHTML = event.data;

                    wsMostrarDatos.terminate();
                })
            wsPeticionBuscador.terminate();
        })
    }

    eliminarSkills(e){
        let confirmar = confirm(`¿Estas seguro que deseas eliminar esta Skill?`)

        if(confirmar == true){
            let id = e.target.id

            const wsSkills = new Worker("storage/wsMySkills.js", {type:"module"});
                wsSkills.postMessage({module:"EliminarSkill", data: id})
                wsSkills.addEventListener("message", (e) => {
                    wsSkills.terminate();
                    alert("Skill Eliminado exitosamente")
           })
        }
    }

    connectedCallback() {
        Promise.resolve(mySkills.components()).then(html => {
            this.shadowRoot.innerHTML = html;
            this.formSkills = this.shadowRoot.querySelector("#formSkills")
            this.formSkills.addEventListener("submit", this.handleEvent.bind(this))

            this.InputBuscador = this.shadowRoot.querySelector("#Buscador");
            this.InputBuscador.addEventListener("input", this.handleInput.bind(this))

            this.mostrarSkills()
        })
    }
}
customElements.define(config.name(mySkills.url), mySkills);