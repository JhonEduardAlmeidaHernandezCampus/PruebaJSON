const header =  new Headers({"Content-Type": "application/json"});
const puerto = 4000;

const agregarModulos = async (datos) => {
    const config = {
        method: "POST",
        headers: header,
        body: JSON.stringify(datos)
    }
    return await( await fetch(`http://localhost:${puerto}/moduloSkill`, config)).json()
}

const consultarModulos = async () =>{
    const config = {
        method : "GET",
        headers : header,
    }   
    return await(await fetch(`http://localhost:${puerto}/moduloSkill`, config)).json()
}

const consultarModulosInput = async (datos) =>{
    const config = {
        method : "GET", 
        headers : header
    }
    return await(await fetch(`http://localhost:${puerto}/moduloSkill?nameModulo_like=${datos}`, config)).json()
}

const EliminarModulo = async (id) =>{
    const config = {
        method : "DELETE",
        headers : header,
    }   
    return await(await fetch(`http://localhost:${puerto}/moduloSkill/${id}`, config)).json()
}


export default {
    agregarModulos,
    consultarModulos,
    consultarModulosInput,
    EliminarModulo
}