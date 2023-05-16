import "../components/Reclutas/my-reclutas.js";
import "../components/Teams/my-teams.js";
import "../components/Skills/my-skills.js";
import "../components/Modulos/my-modulos.js";
import "../components/Evaluaciones/my-evaluaciones.js";

let btnRecluta = document.querySelector("#btnReclutas")
btnRecluta.addEventListener("click", (e) => {
    document.querySelector("#pintarForm").innerHTML = "<my-reclutas></my-reclutas>"
})

let btnTeams = document.querySelector("#btnTeams")
btnTeams.addEventListener("click", (e) => {
    document.querySelector("#pintarForm").innerHTML = "<my-teams></my-teams>"
})

let btnSkills = document.querySelector("#btnSkills")
btnSkills.addEventListener("click", (e) => {
    document.querySelector("#pintarForm").innerHTML = "<my-skills></my-skills>"
})

let btnModulos = document.querySelector("#btnModulos")
btnModulos.addEventListener("click", (e) => {
    document.querySelector("#pintarForm").innerHTML = "<my-modulos></my-modulos>"
})

let btnEvaluaciones = document.querySelector("#btnEvaluacion")
btnEvaluaciones.addEventListener("click", (e) => {
    document.querySelector("#pintarForm").innerHTML = "<my-evaluaciones></my-evaluaciones>"
})