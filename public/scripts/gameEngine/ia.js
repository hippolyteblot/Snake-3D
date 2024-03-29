import * as WorldManager from './worldManager.js';

// Pathfinding - Version avec recherche de plus court chemin
function pathfinding(snake, target, snakeList, listOfWalls, WORLD) {

    /* Dijkstra */
    var start = snake.body[0];
    var end = target.block.position;
    var world = WORLD;
    var width = world.length;
    var height = world[0].length;
    var map = new Array(height);
    for (let i = 0; i < height; i++) {
        map[i] = new Array(width);
    }
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            map[i][j] = 0;
        }
    }
    for (let i = 0; i < snakeList.length; i++) {
        for (let j = 0; j < snakeList[i].body.length; j++) {
            map[snakeList[i].body[j].y][snakeList[i].body[j].x] = 1;
        }
    }
    for (let i = 0; i < listOfWalls.length; i++) {
        map[listOfWalls[i].y][listOfWalls[i].x] = 1;
    }
    var queue = [];
    var visited = [];
    var parent = [];

    queue.push(start);
    visited.push(start);
    parent.push(start);

    var current;

    while (queue.length > 0) {
        current = queue.shift();
        if (current.x == end.x && current.y == end.y) {
            break;
        }
        var neighbors = getNeighbors(current, map);
        for (var i = 0; i < neighbors.length; i++) {
            if (!includesSame(visited, neighbors[i])) {
                queue.push(neighbors[i]);
                visited.push(neighbors[i]);
                parent.push(current);
            }
        }
    }

    var path = [];
    current = end;
    while (current.x != start.x || current.y != start.y) {
        path.push(current);
        current = parent[indexOfValue(visited, current)];
        // Si on ne trouve pas de chemin, on utilise le pathfinding naif
        if (current == undefined) {
            return naivePathfinding(snake, target, snakeList, listOfWalls);
        }
            
    }
    path.push(start);
    path.reverse();

    // On récupère la direction à prendre
    var direction = "";
    if (path[1].x > path[0].x) {
        direction = "right";
    }
    if (path[1].x < path[0].x) {
        direction = "left";
    }
    if (path[1].y > path[0].y) {
        direction = "up";
    }
    if (path[1].y < path[0].y) {
        direction = "down";
    }
    return direction;
}

// Fonction exisante reprogrammée pour ne pas se baser sur la référence de l'objet mais sur ses valeurs
function includesSame(array, element) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].x == element.x && array[i].y == element.y) {
            return true;
        }
    }
    return false;
}

// Fonction exisante reprogrammée pour ne pas se baser sur la référence de l'objet mais sur ses valeurs
function indexOfValue(array, element) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].x == element.x && array[i].y == element.y) {
            return i;
        }
    }
    return -1;
}
// Renvoie les voisins d'une case
function getNeighbors(current, map) {
    var neighbors = [];
    if (current.x > 0 && map[current.y][current.x - 1] == 0) {
        neighbors.push({ x: current.x - 1, y: current.y });
    }
    if (current.x < map[0].length - 1 && map[current.y][current.x + 1] == 0) {
        neighbors.push({ x: current.x + 1, y: current.y });
    }
    if (current.y > 0 && map[current.y - 1][current.x] == 0) {
        neighbors.push({ x: current.x, y: current.y - 1 });
    }
    if (current.y < map.length - 1 && map[current.y + 1][current.x] == 0) {
        neighbors.push({ x: current.x, y: current.y + 1 });
    }
    return neighbors;
}

// Pathfinding - Version naïve (calcul des coordonnées pour déterminer la prochaine case)
function naivePathfinding(snake, target, snakeList, listOfWalls) {

    var x1 = snake.body[0].x;
    var y1 = snake.body[0].y;
    var x2 = target.block.position.x;
    var y2 = target.block.position.y;
    var vector = [x1 - x2, y1 - y2];
    // On vérifie les cases adjacentes
    var up = WorldManager.isEmpty(snake.body[0].x, snake.body[0].y + 1, snakeList, listOfWalls, snake.isGhost);
    var down = WorldManager.isEmpty(snake.body[0].x, snake.body[0].y - 1, snakeList, listOfWalls, snake.isGhost);
    var left = WorldManager.isEmpty(snake.body[0].x - 1, snake.body[0].y, snakeList, listOfWalls, snake.isGhost);
    var right = WorldManager.isEmpty(snake.body[0].x + 1, snake.body[0].y, snakeList, listOfWalls, snake.isGhost);

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

// Choisit une cible pour générer le pathfinding en fonction de la situation
export function chooseTarget(snake, snakeList, potion, apple, listOfWalls, listOfEmpties, WORLD) {
    // Si une potion est disponible, on la prend. Sinon, on va vers la pomme. Enfin, on va vers une case vide.
    if(potion && potion.block.position.x != -100)
        snake.direction = pathfinding(snake, potion, snakeList, listOfWalls, WORLD);
    else if(apple && apple.block.position.x != -100)
        snake.direction = pathfinding(snake, apple, snakeList, listOfWalls, WORLD);
    else {
        let randomFreePosition = WorldManager.randomFreePosition(listOfEmpties, snakeList);
        var tmp = {block: {position: {x: randomFreePosition.x, y: randomFreePosition.y}}};
        snake.direction = pathfinding(snake, tmp, snakeList, listOfWalls, WORLD);
    }
}