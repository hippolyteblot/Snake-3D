// Import de Three.js (depuis un CDN pour allegé le projet)
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

// Import des autres scripts
import * as Score from './score.js';
import * as WorldManager from './worldManager.js';
import * as Camera from '../3D/camera.js';
import * as Snake from '../entities/snake.js';
import * as Controls from '../entities/controls.js';

// Définition des constantes
const EMPTY = 0;
const WALL = 1;

const SNAKECOLOR1 = 0x3620fa;
const SNAKECOLOR2 = 0x9d2eff;


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
    var template = WorldManager.generateTemplate(nbRows, nbCols);
    let difficulty = prompt("Entrer le niveau de difficulté (1-10)", "1");
    WORLD = WorldManager.generateLevel(difficulty, template);
} else if(gameMode == "race"){
    var nbRows = (parseInt(nbAI) + parseInt(nbPlayers)) * 3;
    var nbCols = prompt("Wich length do you want for the race?", 100);
    var template = WorldManager.generateTemplate(nbRows, nbCols);
    let difficulty = prompt("Entrer le niveau de difficulté (1-10)", "1");
    WORLD = WorldManager.generateLevel(difficulty, template);
}

var listOfWalls = [];
var listOfEmpties = [];
WorldManager.fillLists(listOfWalls, listOfEmpties, WORLD);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
Camera.centerCameraOnMap(WORLD, camera);

// Création du renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff, 1);
document.body.appendChild( renderer.domElement );
var render = function () {
    requestAnimationFrame( render );
    renderer.render(scene, camera);
    };
render();

// Construction du monde en 3D
WorldManager.buildWorld(WORLD, scene);
WorldManager.buildFloor(WORLD, scene);

// Ajout d'une lumière
var light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(WORLD[0].length / 2, WORLD.length / 2, 20);
light.intensity = 1.5;
scene.add(light);

// x, y, controls, color1, color2, isABot, id
var snake = new Snake.Snake(1, 1, new Controls.Controls("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"), SNAKECOLOR1, SNAKECOLOR2, false, 0, scene);