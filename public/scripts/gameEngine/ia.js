

import * as Case from '../entities/case.js';
import * as WorldManager from './worldManager.js';

// Pathfinding - Version naïve (calcul des coordonnées pour déterminer la prochaine case)
export function pathfinding(snake, target, snakeList, listOfWalls) {

    var x1 = snake.body[0].x;
    var y1 = snake.body[0].y;
    var x2 = target.block.position.x;
    var y2 = target.block.position.y;
    var vector = [x1 - x2, y1 - y2];
    // On vérifie les cases adjacentes
    var up = WorldManager.isEmpty(snake.body[0].x, snake.body[0].y + 1, snakeList, listOfWalls);
    var down = WorldManager.isEmpty(snake.body[0].x, snake.body[0].y - 1, snakeList, listOfWalls);
    var left = WorldManager.isEmpty(snake.body[0].x - 1, snake.body[0].y, snakeList, listOfWalls);
    var right = WorldManager.isEmpty(snake.body[0].x + 1, snake.body[0].y, snakeList, listOfWalls);

    var oldDirection = snake.direction;
    // On trouve la direction
    var direction = "";
    if (vector[0] < 0 && right && oldDirection != "left") {
        direction = "right";
    } else if (vector[0] > 0 && left && oldDirection != "right") {
        direction = "left";
    } else if (vector[1] < 0 && up && oldDirection != "down") {
        direction = "up";
    } else if (vector[1] > 0 && down && oldDirection != "up") {
        direction = "down";
    }
    // Si aucune direction n'est trouvée, on cherche une direction alternative
    if (direction == "" && up && oldDirection != "down") {
        direction = "up";
    } else if (direction == "" && down && oldDirection != "up") {
        direction = "down";
    } else if (direction == "" && left && oldDirection != "right") {
        direction = "left";
    } else if (direction == "" && right && oldDirection != "left") {
        direction = "right";
    }
    // Si on ne trouve toujours pas de direction, on en choisit une au hasard
    if (direction == "") {
        var random = Math.floor(Math.random() * 4);
        if (random == 0 && up && oldDirection != "down") {
            direction = "up";
        } else if (random == 1 && down && oldDirection != "up") {
            direction = "down";
        } else if (random == 2 && left && oldDirection != "right") {
            direction = "left";
        } else if (random == 3 && right && oldDirection != "left") {
            direction = "right";
        }
    }
    return direction;
}