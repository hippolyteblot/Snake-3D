// Import de Three.js (depuis un CDN pour allegé le projet)
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

// Import des autres scripts
import * as Score from './score.js';
import * as WorldBuilder from './worldBuilder.js';

// Définition des constantes
const EMPTY = 0;
const WALL = 1;


var gameMode = document.getElementById("selectGameMode").value;
var nbPlayers = document.getElementById("selectNbPlayer").value;
var nbAI = document.getElementById("selectNbAI").value;

// On supprime le dernier caractère pour avoir un nombre
nbPlayers = nbPlayers.substring(0, nbPlayers.length - 1);
nbAI = nbAI.substring(0, nbAI.length - 1);

// On construit les scores
Score.buildScore(nbPlayers, nbAI);

// Création du monde
var WORLD;
if(gameMode == "classic" || gameMode == "survival") {
    var nbRows = prompt("How many rows do you want in your level?", 20);
    var nbCols = prompt("How many columns do you want in your level?", 20);
    var template = WorldBuilder.generateTemplate(nbRows, nbCols);
    let difficulty = prompt("Entrer le niveau de difficulté (1-10)", "1");
    WORLD = WorldBuilder.generateLevel(difficulty, template);
} else if(gameMode == "race"){
    var nbRows = (parseInt(nbAI) + parseInt(nbPlayers)) * 3;
    var nbCols = prompt("Wich length do you want for the race?", 100);
    var template = WorldBuilder.generateTemplate(nbRows, nbCols);
    let difficulty = prompt("Entrer le niveau de difficulté (1-10)", "1");
    WORLD = WorldBuilder.generateLevel(difficulty, template);
}

console.log(WORLD);