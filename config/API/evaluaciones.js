const header =  new Headers({"Content-Type": "application/json"});
const puerto = 4000;

const agregarEvaluaciones = async (datos) => {
    const config = {
        method: "POST",
        headers: header,
        body: JSON.stringify(datos)
    }
    return await( await fetch(`http://localhost:${puerto}/Evaluacion`, config)).json()
}

const consultarEvaluaciones = async () =>{
    const config = {
        method : "GET",
        headers : header,
    }   
    return await(await fetch(`http://localhost:${puerto}/Evaluacion`, config)).json()
}

const EliminarEvaluacion = async (id) =>{
    const config = {
        method : "DELETE",
        headers : header,
    }   
    return await(await fetch(`http://localhost:${puerto}/Evaluacion/${id}`, config)).json()
}

const filterInputEvaluacion = async(datos) => {
    const config = {
        method: "GET",
        headers : header
    }
    return await(await fetch(`http://localhost:${puerto}/Evaluacion?id_Reclutas_like=${datos}`, config)).json();
}

const filterNotaEvaluacion = async() => {
    const config = {
        method: "GET",
        headers : header
    }
    return await(await fetch(`http://localhost:${puerto}/Evaluacion?nota_gte=0&nota_lte=69`, config)).json();
}

export default {
    agregarEvaluaciones,
    consultarEvaluaciones,
    EliminarEvaluacion,
    filterInputEvaluacion,
    filterNotaEvaluacion
}