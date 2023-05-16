const header = new Headers({"Content-Type": "application/json"})
const puerto = 4000;

const agregarTeams = async (datos) =>{
    const config = {
        method : "POST",
        headers : header,
        body : JSON.stringify(datos)
    }   
    return await(await fetch(`http://localhost:${puerto}/teams`, config)).json()
}

const consultarTeams = async () =>{
    const config = {
        method : "GET",
        headers : header,
    }   
    return await(await fetch(`http://localhost:${puerto}/teams`, config)).json()
}

const EliminarTeam = async (id) =>{
    const config = {
        method : "DELETE",
        headers : header,
    }   
    return await(await fetch(`http://localhost:${puerto}/teams/${id}`, config)).json()
}

export default {
    agregarTeams,
    consultarTeams,
    EliminarTeam
}