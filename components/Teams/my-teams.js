import config from "../../config/config.js";

export default class myTeams extends HTMLElement {
    static url = import.meta.url
    static async components() {
        return await (await fetch(config.uri(myTeams.url))).text();
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
        (e.type === "submit") ? this.myTeam(e) : undefined;
        (e.type === "click") ? this.mostrarTeams() : undefined;
    }

    handleEliminar(e){
        (e.type === "click") ? this.eliminarTeam(e) : undefined
    }

    myTeam(e){
        e.preventDefault();
        const guardarDatos = Object.fromEntries(new FormData(e.target))

        const wsMyTeams = new Worker("storage/wsMyTeams.js", {type: "module"})
            wsMyTeams.postMessage({module: "agregarTeams", data: guardarDatos})
            wsMyTeams.addEventListener("message", (e) => {
                wsMyTeams.terminate();
            })
    }

    mostrarTeams(){
        const wsMyTeams = new Worker("storage/wsMyTeams.js", {type:"module"})
            wsMyTeams.postMessage({module:"consultarTeams"})

            wsMyTeams.addEventListener("message", (e) => {

                const wsMyTablas = new Worker("storage/Tablas/wsMyTablas.js", {type: "module"})
                wsMyTablas.postMessage({module:"mostrarTeams", data: e.data})

                    wsMyTablas.addEventListener("message", (event) => {

                        this.devolverInfo = this.shadowRoot.querySelector("#devolverInfo");

                        this.devolverInfo.innerHTML = event.data;

                        wsMyTablas.terminate()
                        
                        this.eliminar = this.shadowRoot.querySelectorAll(".eliminar");
                        this.eliminar.forEach((val,id) => {
                            val.addEventListener("click", this.handleEliminar.bind(this))
                        })
                    })
                wsMyTeams.terminate()
            })
    }

    buscador(e){
        let obtenerInput = e.target.value
        let wsPeticionBuscador = new Worker("storage/wsMyTeams.js", {type: "module"});
            wsPeticionBuscador.postMessage({module: "consultarTeamsInput", data : obtenerInput})

            wsPeticionBuscador.addEventListener("message", (e) =>{

                let wsMostrarDatos = new Worker("storage/Tablas/wsMyTablas.js", {type : "module"})
                wsMostrarDatos.postMessage({module:"mostrarTeams", data: e.data})

                wsMostrarDatos.addEventListener("message", (event) => {

                    this.devolverInfo = this.shadowRoot.querySelector("#devolverInfo");
                    this.devolverInfo.innerHTML = event.data;

                    wsMostrarDatos.terminate();
                })
            wsPeticionBuscador.terminate();
        })
    }

    eliminarTeam(e){
        let confirmar = confirm(`¿Estas seguro que deseas eliminar este Team?`)

        if(confirmar == true){
            let id = e.target.id

            const wsTeams = new Worker("storage/wsMyTeams.js", {type:"module"});
                wsTeams.postMessage({module:"EliminarTeam", data: id})
                wsTeams.addEventListener("message", (e) => {
                    wsTeams.terminate();
                    alert("Team Eliminado exitosamente")
           })
        }
    }

    connectedCallback() {
        Promise.resolve(myTeams.components()).then(html => {
            this.shadowRoot.innerHTML = html;
            this.formTeams = this.shadowRoot.querySelector("#formTeams")
            this.formTeams.addEventListener("submit", this.handleEvent.bind(this))

            this.btnMostrarTeams = this.shadowRoot.querySelector("#btnMostrarTeams")
            this.btnMostrarTeams.addEventListener("click", this.handleEvent.bind(this))

            this.InputBuscador = this.shadowRoot.querySelector("#Buscador");
            this.InputBuscador.addEventListener("input", this.handleInput.bind(this))
        })
    }
}
customElements.define(config.name(myTeams.url), myTeams);