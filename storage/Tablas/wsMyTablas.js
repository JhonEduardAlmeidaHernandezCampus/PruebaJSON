export let wsMyTablas = {

    mostrarReclutas(datos){
        let plantilla = "";
            plantilla = `
                            <table>
                                <thead>
                                    <th>Cedula</th>
                                    <th>Nombre</th>
                                    <th>Edad</th>
                                    <th>Direccion</th>
                                    <th>Telefono</th>
                                    <th>Email</th>
                                    <th>Fecha de Nacimiento</th>
                                    <th>Fecha de Ingreso</th>
                                    <th>Team</th>
                                    <th>Option</th>
                                </thead>
                                <tbody>
                                    ${datos.map((val, id) => `
                                                                <tr>
                                                                    <td>${val.NombreRecluta}</td>
                                                                    <td>${val.CedulaRecluta}</td>
                                                                    <td>${val.EdadRecluta}</td>
                                                                    <td>${val.DirecciónRecluta}</td>
                                                                    <td>${val.TeléfonoRecluta}</td>
                                                                    <td>${val.EmailRecluta}</td>
                                                                    <td>${val.NacimientoRecluta}</td>
                                                                    <td>${val.IngresoRecluta}</td>
                                                                    <td>${val.team.nameTeam}</td>
                                                                    <td><button class="eliminar" id="${val.id}">Eliminar</button></td>
                                                                </tr>
                                                             `).join("")}
                                </tbody>
                            </table>
                        `
            return plantilla
    },

    mostrarTeams(datos){
        let plantilla = "";
            plantilla = `
                            <table>
                                <thead>
                                    <th>ID Team</th>
                                    <th>Nombre Team</th>
                                    <th>Trainer</th>
                                    <th>Option</th>
                                </thead>
                                <tbody>
                                    ${datos.map((val, id) => `
                                                                <tr>
                                                                    <td>${val.id}</td>
                                                                    <td>${val.nameTeam}</td>
                                                                    <td>${val.nameTrainer}</td>
                                                                    <td><button class="eliminar" id="${val.id}">Eliminar</button></td>
                                                                </tr>
                                                             `).join("")}
                                </tbody>
                            </table>
                        `
            return plantilla
    },

    mostrarSkills(datos){
        let plantilla = "";
            plantilla = `
                            <table>
                                <thead>
                                    <th>ID Skill</th>
                                    <th>Nombre Skill</th>
                                    <th>Option</th>
                                </thead>
                                <tbody>
                                    ${datos.map((val, id) => `
                                                                <tr>
                                                                    <td>${val.id}</td>
                                                                    <td>${val.nameSkill}</td>
                                                                    <td><button class="eliminar" id="${val.id}">Eliminar</button></td>
                                                                </tr>
                                                             `).join("")}
                                </tbody>
                            </table>
                        `
            return plantilla
    },

    mostrarModulos(datos){
        let plantilla = "";
            plantilla = `
                            <table>
                                <thead>
                                    <th>ID Modulo</th>
                                    <th>Nombre Modulo</th>
                                    <th>Nombre Skill</th>
                                    <th>Option</th>
                                </thead>
                                <tbody>
                                    ${datos.map((val, id) => `
                                                                <tr>
                                                                    <td>${val.id}</td>
                                                                    <td>${val.nameModulo}</td>
                                                                    <td>${val.id_Skills}</td>
                                                                    <td><button class="eliminar" id="${val.id}">Eliminar</button></td>
                                                                </tr>
                                                             `).join("")}
                                </tbody>
                            </table>
                        `
            return plantilla
    },

    mostrarEvaluaciones(datos){
        let plantilla = "";
            plantilla = `
                            <table>
                                <thead>
                                    <th>ID Evaluacion</th>
                                    <th>Nombre Recluta</th>
                                    <th>Nombre Modulo</th>
                                    <th>Nota</th>
                                    <th>Option</th>
                                </thead>
                                <tbody>
                                    ${datos.map((val, id) => `
                                                                <tr>
                                                                    <td>${val.id}</td>
                                                                    <td>${val.id_Reclutas}</td>
                                                                    <td>${val.id_Modulos}</td>
                                                                    <td>${val.nota}</td>
                                                                    <td><button class="eliminar" id="${val.id}">Eliminar</button></td>
                                                                </tr>
                                                             `).join("")}
                                </tbody>
                            </table>
                        `
            return plantilla
    }
}

self.addEventListener("message", (e) => {
    Promise.resolve(wsMyTablas[`${e.data.module}`](e.data.data)).then(res => postMessage(res))
})