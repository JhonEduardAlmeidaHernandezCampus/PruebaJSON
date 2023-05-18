import config from "../../config/config.js";

export default class myEvaluaciones extends HTMLElement {
    static url = import.meta.url
    static async components() {
        return await (await fetch(config.uri(myEvaluaciones.url))).text();
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    handleFilter(e){
        (e.type === "input") ? this.filterBuscador(e) : this.filterMenorNota();
    }

    handleEvent(e) {
        e.preventDefault();
        (e.type === "submit") ? this.myEvaluaciones(e) : undefined;
        (e.type === "click") ? this.mostrarEvaluaciones() : undefined;
    }

    handleEliminar(e){
        (e.type === "click") ? this.eliminarEvaluacion(e) : undefined
    }

    myEvaluaciones(e){
        e.preventDefault();
        e.stopPropagation();
        const guardarDatos = Object.fromEntries(new FormData(e.target))

        const wsMyModulos = new Worker("storage/wsMyEvaluaciones.js", {type: "module"})
            wsMyModulos.postMessage({module: "agregarEvaluaciones", data: guardarDatos})
            wsMyModulos.addEventListener("message", (e) => {
                wsMyModulos.terminate();

                this.mostrarEvaluaciones();
            })
    }

    mostrarEvaluaciones(){
        const wsMyEvaluaciones = new Worker("storage/wsMyEvaluaciones.js", {type:"module"})
            wsMyEvaluaciones.postMessage({module:"consultarEvaluaciones"})

            wsMyEvaluaciones.addEventListener("message", (e) => {

                const wsMyTablas = new Worker("storage/Tablas/wsMyTablas.js", {type: "module"})
                wsMyTablas.postMessage({module:"mostrarEvaluaciones", data: e.data})

                    wsMyTablas.addEventListener("message", (event) => {

                        this.devolverInfo = this.shadowRoot.querySelector("#devolverInfo");
                        this.devolverInfo.innerHTML = event.data;

                        wsMyTablas.terminate()

                        this.eliminar = this.shadowRoot.querySelectorAll(".eliminar");
                        this.eliminar.forEach((val,id) => {
                            val.addEventListener("click", this.handleEliminar.bind(this))
                        })
                    })
                wsMyEvaluaciones.terminate()
            })
    }

    eliminarEvaluacion(e){
        let confirmar = confirm(`¿Estas seguro que deseas eliminar esta Evaluación?`)

        if(confirmar == true){
            let id = e.target.id

            const wsEvaluacion = new Worker("storage/wsMyEvaluaciones.js", {type:"module"});
                wsEvaluacion.postMessage({module:"EliminarEvaluacion", data: id})
                wsEvaluacion.addEventListener("message", (e) => {
                    wsEvaluacion.terminate();
                    alert("Evaluación Eliminado exitosamente")
           })
        }
    }

    mostrarOpcionesReclutas(){
        const wsMyReclutas = new Worker("storage/wsMyReclutas.js", {type:"module"})
            wsMyReclutas.postMessage({module:"consultarReclutas"})

            wsMyReclutas.addEventListener("message", (e) => {

                const wsOptionsReclutas = new Worker("storage/Options/wsOptions.js", {type: "module"})
                wsOptionsReclutas.postMessage({module:"optionReclutas", data: e.data})

                    wsOptionsReclutas.addEventListener("message", (event) => {

                        this.selectReclutas = this.shadowRoot.querySelector("#optionReclutas");
                        this.selectReclutas.innerHTML = event.data;

                        wsOptionsReclutas.terminate()
                    })
                wsMyReclutas.terminate()
            })
    }

    mostrarOpcionesModulos(){
        const wsMyModulos = new Worker("storage/wsMyModulos.js", {type:"module"})
            wsMyModulos.postMessage({module:"consultarModulos"})

            wsMyModulos.addEventListener("message", (e) => {

                const wsOptionsModulos = new Worker("storage/Options/wsOptions.js", {type: "module"})
                wsOptionsModulos.postMessage({module:"optionModulos", data: e.data})

                    wsOptionsModulos.addEventListener("message", (event) => {

                        this.selectModulos = this.shadowRoot.querySelector("#optionModulos");
                        this.selectModulos.innerHTML = event.data;

                        wsOptionsModulos.terminate()
                    })
                wsMyModulos.terminate()
            })
    }

    filterBuscador(e){
        let guardar = e.target.value

        let wsPeticion = new Worker("storage/wsMyEvaluaciones.js", {type: "module"})
        wsPeticion.postMessage({module: "filterInputEvaluacion", data : guardar})

        wsPeticion.addEventListener("message", (event) =>{

            let wsRecibirRegistros = new Worker("storage/Tablas/wsMyTablas.js", {type: "module"})
                wsRecibirRegistros.postMessage({module : "mostrarEvaluaciones", data : event.data})

                wsRecibirRegistros.addEventListener("message", (evento) => {

                    this.devolverInfo = this.shadowRoot.querySelector("#devolverInfo")
                    this.devolverInfo.innerHTML = evento.data;

                    wsRecibirRegistros.terminate();
                })
            wsPeticion.terminate();
        })
    } 

    filterMenorNota(){
        let wsConsultaNota = new Worker("storage/wsMyEvaluaciones.js", {type: "module"})
            wsConsultaNota.postMessage({module: "filterNotaEvaluacion"})
            wsConsultaNota.addEventListener("message", (e) =>{

                let wsDatosOptenidos = new Worker("storage/Tablas/wsMyTablas.js", {type: "module"})
                    wsDatosOptenidos.postMessage({module: "mostrarEvaluaciones", data: e.data})

                    wsDatosOptenidos.addEventListener("message", (evento) =>{

                        this.devolverInfo = this.shadowRoot.querySelector("#devolverInfo")
                        this.devolverInfo.innerHTML = evento.data;

                        wsDatosOptenidos.terminate();
                    })
                wsConsultaNota.terminate();
            })
    }

    connectedCallback() {
        Promise.resolve(myEvaluaciones.components()).then(html => {
            this.shadowRoot.innerHTML = html;
            this.formEvaluaciones = this.shadowRoot.querySelector("#formEvaluaciones")
            this.formEvaluaciones.addEventListener("submit", this.handleEvent.bind(this))

            this.Buscador = this.shadowRoot.querySelector("#Buscador");
            this.Buscador.addEventListener("input", this.handleFilter.bind(this))

            this.filtrarNota = this.shadowRoot.querySelector("#filtrarNotaMenor");
            this.filtrarNota.addEventListener("click", this.handleFilter.bind(this))

            this.mostrarEvaluaciones();
            this.mostrarOpcionesReclutas();
            this.mostrarOpcionesModulos();
        })
    }
}
customElements.define(config.name(myEvaluaciones.url), myEvaluaciones);