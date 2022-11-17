// Import de Three.js (depuis un CDN pour allegé le projet)
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

// Import des autres scripts
import * as Score from './score.js';


var gameMode = document.getElementById("selectGameMode").value;
var nbPlayers = document.getElementById("selectNbPlayer").value;
var nbAI = document.getElementById("selectNbAI").value;

// On supprime le dernier caractère pour avoir un nombre
nbPlayers = nbPlayers.substring(0, nbPlayers.length - 1);
nbAI = nbAI.substring(0, nbAI.length - 1);

// Affichage des infos du mode de jeu
console.log("Mode de jeu : " + gameMode + " - Nombre de joueurs : " + nbPlayers + " - Nombre d'IA : " + nbAI);

// On construit les scores
Score.buildScore(nbPlayers, nbAI);
console.log("Scores construits");