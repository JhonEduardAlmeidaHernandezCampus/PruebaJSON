const header =  new Headers({"Content-Type": "application/json"});
const puerto = 4000;

const agregarReclutas = async (datos) => {
    const config = {
        method: "POST",
        headers: header,
        body: JSON.stringify(datos)
    }
    return await( await fetch(`http://localhost:${puerto}/reclutas`, config)).json()
}

const consultarReclutas = async () =>{
    const config = {
        method : "GET",
        headers : header,
    }   
    return await(await fetch(`http://localhost:${puerto}/reclutas?_expand=team`, config)).json()
}

const consultarReclutasEdad = async () =>{
    const config = {
        method : "GET",
        headers : header,
    }   
    return await(await fetch(`http://localhost:${puerto}/reclutas?EdadRecluta_gte=1&EdadRecluta_lte=18`, config)).json()
}

const FiltrarReclutasFecha = async () =>{
    const config = {
        method : "GET",
        headers : header,
    }   
    return await(await fetch(`http://localhost:${puerto}/reclutas?IngresoRecluta_gte=2023-03-08`, config)).json()
}

const EliminarReclutas = async (id) =>{
    const config = {
        method : "DELETE",
        headers : header,
    }   
    return await(await fetch(`http://localhost:${puerto}/reclutas/${id}`, config)).json()
}

export default {
    agregarReclutas,
    consultarReclutas,
    EliminarReclutas,
    consultarReclutasEdad,
    FiltrarReclutasFecha
}