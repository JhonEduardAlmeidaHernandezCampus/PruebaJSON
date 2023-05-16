const header = new Headers({"Content-Type": "application/json"})
const puerto = 4000;

const agregarSkills = async (datos) =>{
    const config = {
        method : "POST",
        headers : header,
        body : JSON.stringify(datos)
    }   
    return await(await fetch(`http://localhost:${puerto}/Skills`, config)).json()
}

const consultarSkills = async () =>{
    const config = {
        method : "GET",
        headers : header,
    }   
    return await(await fetch(`http://localhost:${puerto}/Skills`, config)).json()
}

const EliminarSkill = async (id) =>{
    const config = {
        method : "DELETE",
        headers : header,
    }   
    return await(await fetch(`http://localhost:${puerto}/Skills/${id}`, config)).json()
}

export default {
    agregarSkills,
    consultarSkills,
    EliminarSkill
}