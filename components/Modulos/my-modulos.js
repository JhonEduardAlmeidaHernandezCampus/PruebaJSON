import config from "../../config/config.js";

export default class myModulos extends HTMLElement {
    static url = import.meta.url
    static async components() {
        return await (await fetch(config.uri(myModulos.url))).text();
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
        (e.type === "submit") ? this.myModulos(e) : undefined;
        (e.type === "click") ? this.mostrarModulos() : undefined;
    }

    handleEliminar(e){
        (e.type === "click") ? this.eliminarModulo(e) : undefined
    }

    myModulos(e){
        e.preventDefault();
        const guardarDatos = Object.fromEntries(new FormData(e.target))

        const wsMyModulos = new Worker("storage/wsMyModulos.js", {type: "module"})
            wsMyModulos.postMessage({module: "agregarModulos", data: guardarDatos})
            wsMyModulos.addEventListener("message", (e) => {
                wsMyModulos.terminate();
            })
    }

    mostrarOpciones(){
        const wsMySkills = new Worker("storage/wsMySkills.js", {type:"module"})
            wsMySkills.postMessage({module:"consultarSkills"})

            wsMySkills.addEventListener("message", (e) => {

                const wsOptionsSkills = new Worker("storage/Options/wsOptions.js", {type: "module"})
                wsOptionsSkills.postMessage({module:"optionSkills", data: e.data})

                    wsOptionsSkills.addEventListener("message", (event) => {

                        this.selectSkills = this.shadowRoot.querySelector("#optionSkills");
                        this.selectSkills.innerHTML = event.data;

                        wsOptionsSkills.terminate()
                    })
                wsMySkills.terminate()
            })
    }

    mostrarModulos(){
        const wsMyModulos = new Worker("storage/wsMyModulos.js", {type:"module"})
            wsMyModulos.postMessage({module:"consultarModulos"})

            wsMyModulos.addEventListener("message", (e) => {

                const wsMyTablas = new Worker("storage/Tablas/wsMyTablas.js", {type: "module"})
                wsMyTablas.postMessage({module:"mostrarModulos", data: e.data})

                    wsMyTablas.addEventListener("message", (event) => {

                        this.devolverInfo = this.shadowRoot.querySelector("#devolverInfo");
                        this.devolverInfo.innerHTML = event.data;

                        wsMyTablas.terminate()

                        this.eliminar = this.shadowRoot.querySelectorAll(".eliminar");
                        this.eliminar.forEach((val,id) => {
                            val.addEventListener("click", this.handleEliminar.bind(this))
                        })
                    })
                wsMyModulos.terminate()
            })
    }

    buscador(e){
        let obtenerInput = e.target.value
        let wsPeticionBuscador = new Worker("storage/wsMyModulos.js", {type: "module"});
            wsPeticionBuscador.postMessage({module: "consultarModulosInput", data : obtenerInput})

            wsPeticionBuscador.addEventListener("message", (e) =>{

                let wsMostrarDatos = new Worker("storage/Tablas/wsMyTablas.js", {type : "module"})
                wsMostrarDatos.postMessage({module:"mostrarModulos", data: e.data})

                wsMostrarDatos.addEventListener("message", (event) => {

                    this.devolverInfo = this.shadowRoot.querySelector("#devolverInfo");
                    this.devolverInfo.innerHTML = event.data;

                    wsMostrarDatos.terminate();
                })
            wsPeticionBuscador.terminate();
        })
    }

    eliminarModulo(e){
        let confirmar = confirm(`¿Estas seguro que deseas eliminar este Modulo?`)

        if(confirmar == true){
            let id = e.target.id

            const wsModulos = new Worker("storage/wsMyModulos.js", {type:"module"});
                wsModulos.postMessage({module:"EliminarModulo", data: id})
                wsModulos.addEventListener("message", (e) => {
                    wsModulos.terminate();
                    alert("Modulo Eliminado exitosamente")
           })
        }
    }

    connectedCallback() {
        Promise.resolve(myModulos.components()).then(html => {
            this.shadowRoot.innerHTML = html;
            this.formModulosSkills = this.shadowRoot.querySelector("#formModulosSkills")
            this.formModulosSkills.addEventListener("submit", this.handleEvent.bind(this))

            this.InputBuscador = this.shadowRoot.querySelector("#Buscador");
            this.InputBuscador.addEventListener("input", this.handleInput.bind(this))

            this.mostrarModulos();
            this.mostrarOpciones();
        })
    }
}
customElements.define(config.name(myModulos.url), myModulos);