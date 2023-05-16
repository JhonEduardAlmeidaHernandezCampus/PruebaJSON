export let wsOptions = {

    optionTeams(data){
        let plantilla = "";
        data.forEach((val,id) => {
            plantilla += `
            <option value="${val.id}">${val.nameTeam}</option>
            `
        });
        return plantilla
    },

    optionSkills(data){
        let plantilla = "";
        data.forEach((val,id) => {
            plantilla += `
            <option value="${val.nameSkill}">${val.nameSkill}</option>
            `
        });
        return plantilla
    },
    
    optionReclutas(data){
        let plantilla = "";
        data.forEach((val,id) => {
            plantilla += `
            <option value="${val.NombreRecluta}">${val.NombreRecluta}</option>
            `
        });
        return plantilla
    },

    optionModulos(data){
        let plantilla = "";
        data.forEach((val,id) => {
            plantilla += `
            <option value="${val.nameModulo}">${val.nameModulo}</option>
            `
        });
        return plantilla
    }

}

self.addEventListener("message", (e) => {
    Promise.resolve(wsOptions[`${e.data.module}`](e.data.data)).then(res => postMessage(res))
})