// Import de Three.js (depuis un CDN pour alléger le projet)
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

import * as Case from '../entities/case.js';


// Définition des constantes
const EMPTY = 0;
const WALL = 1;

const FLOOR1 = 0x47de2c;
const FLOOR2 = 0x3bbd24;

// Génère un monde de nbRows lignes et nbCols colonnes entouré de murs
export function generateTemplate(nbRows, nbCols) {
    var template = [];
    for (var i = 0; i < nbRows; i++) {
        var row = [];
        for (var j = 0; j < nbCols; j++) {
            if (i === 0 || i === nbRows - 1 || j === 0 || j === nbCols - 1) {
                row.push(WALL);
            } else {
                row.push(EMPTY);
            }
        }
        template.push(row);
    }
    return template;
}

// Ajoute des murs aléatoirement dans le template en fonction de la difficulté
export function generateLevel(difficulty, template) {
    var level = template;
    var width = level[0].length;
    var height = level.length;
    var numberOfWalls = width * height * difficulty / 100;
    for (var i = 0; i < numberOfWalls; i++) {
        var x = Math.floor(Math.random() * width);
        var y = Math.floor(Math.random() * height);
        level[y][x] = WALL;
    }
    return level;
}

export function fillLists(listOfWalls, listOfEmpties, level) {
    for (var i = 0; i < level.length; i++) {
        for (var j = 0; j < level[i].length; j++) {
            if (level[i][j] === WALL) {
                listOfWalls.push(new Case.Case(j, i));
            } else {
                listOfEmpties.push(new Case.Case(j, i));
            }
        }
    }
}

export function randomFreePosition(listOfEmpties, snakeList) {
    // Copy the list of empties
    var freeArray = listOfEmpties.slice();

    for (var i = 0; i < snakeList.length; i++) {
        for (var j = 0; j < snakeList[i].body.length; j++) {
            for (var k = 0; k < freeArray.length; k++) {
                if (snakeList[i].body[j].x === freeArray[k].x && snakeList[i].body[j].y === freeArray[k].y) {
                    freeArray.splice(k, 1);
                }
            }    
        }
    }

    var randomIndex = Math.floor(Math.random() * freeArray.length);
    return freeArray[randomIndex];
}

export function randomFreePositionBetween(listOfEmpties, snakeList, min, max) {
    
    var highestX = 0;
    for (var i = 0; i < listOfEmpties.length; i++) {
        if (listOfEmpties[i].x > highestX) {
            highestX = listOfEmpties[i].x;
        }
    }
    if (highestX < min) {
        return null;
    }

    var freeArray = [];
    for (var i = 0; i < listOfEmpties.length; i++) {
        if (listOfEmpties[i].x >= min && listOfEmpties[i].x <= max) {
            freeArray.push(listOfEmpties[i]);
        }
    }

    for (var i = 0; i < snakeList.length; i++) {
        for (var j = 0; j < snakeList[i].body.length; j++) {
            for (var k = 0; k < freeArray.length; k++) {
                if (snakeList[i].body[j].x === freeArray[k].x && snakeList[i].body[j].y === freeArray[k].y) {
                    freeArray.splice(k, 1);
                }
            }    
        }
    }

    if (freeArray.length === 0) {
        return null;
    }

    var index = Math.floor(Math.random() * freeArray.length);
    return freeArray[index];
}

export function getHighestSnake(snakeList) {
    var highestSnake = snakeList[0];
    for (var i = 1; i < snakeList.length; i++) {
        if (snakeList[i].body[0].block.position.x > highestSnake.body[0].block.position.x) {
            highestSnake = snakeList[i];
        }
    }
    return highestSnake;
}

export function buildWorld(WORLD, scene) {
    for (var i = 0; i < WORLD.length; i++) {
        for (var j = 0; j < WORLD[i].length; j++) {
            if (WORLD[i][j] === WALL) {
                var wall = new THREE.Mesh( 
                    new THREE.BoxGeometry( 1, 1, 1 ),
                    new THREE.MeshLambertMaterial({color: 0x888888})
                );
                wall.position.x = j;
                wall.position.y = i;
                wall.receiveShadow = true;
                wall.castShadow = true;
                scene.add(wall);

            }
        }
    }
}

export function buildFloor(WORLD, scene) {
    var width = WORLD[0].length;
    var height = WORLD.length;
    // Altern case color (#316600 and #428a00)
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var color = FLOOR1;
            if((i + (j%2)) % 2 == 0) {
                color = FLOOR2;
            }
            var floor = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, 1),
                new THREE.MeshLambertMaterial({ color: color })
            );
            floor.position.x = j;
            floor.position.y = i;
            floor.position.z = -1;

            floor.receiveShadow = true;
            floor.castShadow = true;
            scene.add(floor);
        }
    }
}

export function isEmpty(x, y, snakeList, listOfWalls) {
    for (var i = 0; i < snakeList.length; i++) {
        for (var j = 0; j < snakeList[i].body.length; j++) {
            if (snakeList[i].body[j].x == x && snakeList[i].body[j].y == y) {
                return false;
            }
        }
    }
    for (var i = 0; i < listOfWalls.length; i++) {
        if (listOfWalls[i].x == x && listOfWalls[i].y == y) {
            return false;
        }
    }
    return true;
}