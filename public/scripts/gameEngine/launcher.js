// Import de Three.js (depuis un CDN pour alléger le projet)
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
// Import des autres scripts
import * as Score from './score.js';
import * as WorldManager from './worldManager.js';
import * as Camera from '../3D/camera.js';
import * as Snake from '../entities/snake.js';
import * as Controls from '../entities/controls.js';
import * as Apple from '../entities/apple.js';
import * as Calming from '../entities/calming.js';
import * as Potion from '../entities/potion.js';
import * as Case from '../entities/case.js';
import * as Environnement from '../entities/envrionnement.js';
import * as IA from './ia.js';

// Définition des constantes
const EMPTY = 0;
const WALL = 1;

const SNAKECOLOR1 = 0x3620fa;
const SNAKECOLOR2 = 0x9d2eff;

const SNAKECOLOR3 = 0xe5ff1c;
const SNAKECOLOR4 = 0xff821c;

const SNAKECOLOR5 = 0x28c9fa;
const SNAKECOLOR6 = 0x1c1ce8;

const SNAKECOLOR7 = 0xbf0202;
const SNAKECOLOR8 = 0xe017ff;

const SNAKECOLORIA1 = 0x9c9c9c;
const SNAKECOLORIA2 = 0xebebeb;

var snakeColor = [
    [SNAKECOLOR1, SNAKECOLOR2],
    [SNAKECOLOR3, SNAKECOLOR4],
    [SNAKECOLOR5, SNAKECOLOR6],
    [SNAKECOLOR7, SNAKECOLOR8]
];

var pov = false;
let counterViewChange = 0;
var angle = 0;
var oldDirection = "left";
var povDirection = "left";


var gameMode = document.getElementById("selectGameMode").value;
var nbPlayers = document.getElementById("selectNbPlayer").value;
var nbAI = document.getElementById("selectNbAI").value;

// On supprime le dernier caractère pour avoir un nombre
nbPlayers = nbPlayers.substring(0, nbPlayers.length - 1);
nbAI = nbAI.substring(0, nbAI.length - 1);

// On construit les scores
for (var i = 0; i < nbPlayers; i++) {
    Score.buildScore(i + 1);
}

// Création du monde
var WORLD;
if (gameMode == "classic" || gameMode == "survival") {
    var size = prompt("Wich size do you want for the map ?", "20");
    var template = WorldManager.generateTemplate(size, size);
    let difficulty = prompt("Wich difficulty do you want ? (0 to 10)", "0");
    WORLD = WorldManager.generateLevel(difficulty, template);
} else if (gameMode == "race") {
    var nbRows = (parseInt(nbAI) + parseInt(nbPlayers)) * 3;
    var nbCols = prompt("Wich length do you want for the race?", 100);
    var template = WorldManager.generateTemplate(nbRows, nbCols);
    let difficulty = prompt("Wich difficulty do you want ? (0 to 10)", "0");
    WORLD = WorldManager.generateLevel(difficulty, template);
}

var listOfWalls = [];
var listOfEmpties = [];
WorldManager.fillLists(listOfWalls, listOfEmpties, WORLD);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
Camera.centerCameraOnMap(WORLD, camera);

// Création du renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x9ddbe3, 1);
document.body.appendChild(renderer.domElement);
var render = function () {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};
render();

// Construction du monde en 3D
WorldManager.buildWorld(WORLD, scene);
WorldManager.buildFloor(WORLD, scene);

// Ajout d'une lumière
var light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(WORLD[0].length / 2, WORLD.length / 2, 20);
light.intensity = 1.75;
// Ajout d'un ombre
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;

scene.add(light);

// Création des différets controls
var controlsSnake1 = new Controls.Controls("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight");
var controlsSnake2 = new Controls.Controls("z", "s", "q", "d");
var controlsSnake3 = new Controls.Controls("i", "k", "j", "l");
var controlsSnake4 = new Controls.Controls("t", "g", "f", "h");
var controlsSnakeAI = new Controls.Controls(null, null, null, null);
var controlsSnake = [controlsSnake1, controlsSnake2, controlsSnake3, controlsSnake4];

// Générations et placement des serpents en fonction du nombre de joueurs et du mode de jeu
var snakeList = [];
for (var i = 0; i < nbPlayers; i++) {
    if (gameMode != "race") {
        var freeCase = listOfEmpties[Math.floor(Math.random() * listOfEmpties.length)];
    } else {
        var freeCase = new Case.Case(1, i * 2 + 1);
    }
    snakeList.push(new Snake.Snake(freeCase, controlsSnake[i], snakeColor[i][0], snakeColor[i][1], false, i + 1, scene, pov, povDirection));
}
for (var i = 0; i < nbAI; i++) {
    if (gameMode != "race") {
        var freeCase = listOfEmpties[Math.floor(Math.random() * listOfEmpties.length)];
    } else {
        var freeCase = new Case.Case(1, i * 2 + 1);
    }
    snakeList.push(new Snake.Snake(freeCase, controlsSnakeAI, SNAKECOLORIA1, SNAKECOLORIA2, true, null, scene, pov, povDirection));
}


var lastSpawn = new Date().getTime();
var time = 0;
var apple;
var calming;
var potion;
if (gameMode == "classic") {
    apple = new Apple.Apple(WorldManager.randomFreePosition(listOfEmpties, snakeList), scene);
    calming = new Calming.Calming(WorldManager.randomFreePosition(listOfEmpties, snakeList), scene);
    potion = new Potion.Potion(WorldManager.randomFreePosition(listOfEmpties, snakeList), scene);
} else if (gameMode == "race") {
    apple = new Apple.Apple(WorldManager.randomFreePositionBetween(listOfEmpties, snakeList, 3, 10), scene);
    calming = new Calming.Calming(WorldManager.randomFreePositionBetween(listOfEmpties, snakeList, 3, 10), scene);
    potion = new Potion.Potion(WorldManager.randomFreePositionBetween(listOfEmpties, snakeList, 3, 10), scene);
}


var snakeDead = false;
if(gameMode == "classic" || gameMode == "survival"){
    var factor = WORLD.length / 20;
    new Environnement.Environnement(new Case.Case(-10 * factor, -10 * factor), factor, 0, scene);
    new Environnement.Environnement(new Case.Case(-10 * factor, 10 * factor), factor, 0, scene);
    new Environnement.Environnement(new Case.Case(-10 * factor, 30 * factor), factor, 0, scene);

    new Environnement.Environnement(new Case.Case(30 * factor, -10 * factor), factor, 0, scene);
    new Environnement.Environnement(new Case.Case(30 * factor, 10 * factor), factor, 0, scene);
    new Environnement.Environnement(new Case.Case(30 * factor, 30 * factor), factor, 0, scene);
    new Environnement.Environnement(new Case.Case(10 * factor, 30 * factor), factor, Math.PI / 2, scene);
    new Environnement.Environnement(new Case.Case(10 * factor, -10 * factor), factor, -Math.PI / 2, scene);
}

var loader = document.getElementById("loader");
loader.classList.add("disepear");
setTimeout(function () {
    loader.style.display = "none";
}, 1500);

// Boucle principale
var loop = function () {

    // Si tous les serpents sont morts, on arrête la boucle
    if (snakeList.length == 0) {
        alert("Game Over");
        // On recharge la page
        location.reload();
    }

    if (gameMode == "survival") {
        // On fait grossir le serpent toutes les 5 secondes
        if (new Date().getTime() - lastSpawn > 3000) {
            lastSpawn = new Date().getTime();
            for (var i = 0; i < snakeList.length; i++) {
                snakeList[i].grow();
            }
        }
    }
    if (nbPlayers == 1 && pov) {
        var tmpVar = Camera.povCamera(snakeList[0], camera, counterViewChange, angle, oldDirection, povDirection);
        counterViewChange = tmpVar[0];
        angle = tmpVar[2];
        oldDirection = tmpVar[1];
    }
    else {
        if (gameMode == "race") {
            Camera.centerCameraOnHighestSnake(snakeList, camera, light);
        } else {
            if (snakeList.length > 1) {
                Camera.centerCameraOnMap(WORLD, camera);
            } else {
                Camera.centerCameraOnPlayer(snakeList[0], camera);
            }
        }
    }

    for (var i = 0; i < snakeList.length; i++) {
        time = new Date().getTime();
        if (time > snakeList[i].lastTime + snakeList[i].delay) {
            snakeList[i].lastTime = time;

            if (snakeList[i].isABot) {
                if(potion && potion.block.position.x != -100)
                    snakeList[i].direction = IA.pathfinding(snakeList[i], potion, snakeList, listOfWalls, WORLD);
                else
                    snakeList[i].direction = IA.pathfinding(snakeList[i], apple, snakeList, listOfWalls, WORLD);
            }

            oldDirection = snakeList[i].move(scene, oldDirection);
            snakeList[i].lastTime = time;

            snakeDead = snakeList[i].checkCollision(gameMode, snakeList, listOfWalls, apple, calming, potion, listOfEmpties, scene, WORLD);

            if (snakeDead) {
                snakeDead = false;
                break;
            }
        }
        snakeList[i].movingAnimation(time);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}
if(gameMode == "classic" || gameMode == "survival"){
    // On centre la caméra sur la carte pour que chaque joueur puisse voir son serpent et choisir sa direction
    Camera.centerCameraOnMap(WORLD, camera);
} else if(gameMode == "race"){
    Camera.centerCameraOnHighestSnake(snakeList, camera, light);
}
// La partie commence quand on appuie sur "entrer"
document.addEventListener('keydown', function (event) {
    if (event.key == "Enter") {
        loop();
    }
});