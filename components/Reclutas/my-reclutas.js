import config from "../../config/config.js";

export default class myRecluta extends HTMLElement {
    static url = import.meta.url
    static async components() {
        return await (await fetch(config.uri(myRecluta.url))).text();
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    handleEvent(e) {
        e.preventDefault();
        (e.type === "submit") ? this.myReclutas(e) : undefined;
        (e.type === "click") ? this.mostrarReclutas() : undefined;
    }

    handleEliminar(e){
        (e.type === "click") ? this.eliminarRecluta(e) : undefined
    }

    myReclutas(e){
        e.preventDefault()
        let guardarDatos = Object.fromEntries(new FormData(e.target))

        const wsReclutas = new Worker("storage/wsMyReclutas.js", {type: "module"})
            wsReclutas.postMessage({module:"agregarReclutas", data: guardarDatos})

            wsReclutas.addEventListener("message", (e) => {
                wsReclutas.terminate();
            })
    }

    mostrarReclutas(){
        const wsMyReclutas = new Worker("storage/wsMyReclutas.js", {type:"module"})
            wsMyReclutas.postMessage({module:"consultarReclutas"})

            wsMyReclutas.addEventListener("message", (e) => {

                // Hace el llamado al worker en donde le va a pintar las opciones de teams 
                const wsMyTablas = new Worker("storage/Tablas/wsMyTablas.js", {type: "module"})
                wsMyTablas.postMessage({module:"mostrarReclutas", data: e.data})

                    // Crea otro evento de escucha en donde va a pintar las opciones 
                    wsMyTablas.addEventListener("message", (event) => {

                        // Selecciona el input en donde las va a pintar 
                        this.devolverInfo = this.shadowRoot.querySelector("#devolverInfo");

                        // Le inserta la informacion la input 
                        this.devolverInfo.innerHTML = event.data;

                        wsMyTablas.terminate();

                        // Por que monda hace un querySelectorAll dentro un worker justo despues de finalizarlo? 
                        this.eliminar = this.shadowRoot.querySelectorAll(".eliminar");

                        // Por que monda hace un forEarch? 
                        this.eliminar.forEach((val,id) => {
                            val.addEventListener("click", this.handleEliminar.bind(this))
                        })
                    })
                wsMyReclutas.terminate()
            })
    }

    eliminarRecluta(e){
        let confirmar = confirm(`¿Estas seguro que deseas eliminar este Recluta?`)

        if(confirmar == true){
            let id = e.target.id

            const wsReclutas = new Worker("storage/wsMyReclutas.js", {type:"module"});
                wsReclutas.postMessage({module:"EliminarReclutas", data: id})
                wsReclutas.addEventListener("message", (e) => {
                    wsReclutas.terminate();
                    alert("Recluta Eliminado exitosamente")
           })
        }
    }

    mostrarOpciones(){
        // Hacer consulta get al apartado de teams 
        const wsMyTeams = new Worker("storage/wsMyTeams.js", {type:"module"})
            wsMyTeams.postMessage({module:"consultarTeams"})

            // Crea un evento de escucha y dentro crea otro worker que es en donde va a insertar los datos que llamo anteriormente
            wsMyTeams.addEventListener("message", (e) => {

                // Hace el llamado al worker en donde le va a pintar las opciones de teams 
                const wsOptionsTeams = new Worker("storage/Options/wsOptions.js", {type: "module"})
                wsOptionsTeams.postMessage({module:"optionTeams", data: e.data})

                    // Crea otro evento de escucha en donde va a pintar las opciones 
                    wsOptionsTeams.addEventListener("message", (event) => {

                        // Selecciona el input en donde las va a pintar 
                        this.selectTeam = this.shadowRoot.querySelector("#optionTeam");

                        // Le inserta la informacion la input 
                        this.selectTeam.innerHTML = event.data;

                        wsOptionsTeams.terminate()
                    })
                wsMyTeams.terminate()
            })
    }

    connectedCallback() {
        Promise.resolve(myRecluta.components()).then(html => {
            this.shadowRoot.innerHTML = html;
            this.myFormulario = this.shadowRoot.querySelector("#formReclutas")
            this.myFormulario.addEventListener("submit", this.handleEvent.bind(this))

            this.btnMostraReclutas = this.shadowRoot.querySelector("#btnMostraReclutas")
            this.btnMostraReclutas.addEventListener("click", this.handleEvent.bind(this))

            // Ejecuta la funcion en el Callback para que aparezcan las opciones 
            this.mostrarOpciones();
        })
    }
}
customElements.define(config.name(myRecluta.url), myRecluta);