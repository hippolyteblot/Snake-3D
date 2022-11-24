
import * as WorldManager from '../gameEngine/worldManager.js';

// Centre la caméra sur le monde
export function centerCameraOnMap(WORLD, camera) {
    var width = WORLD[0].length;
    var height = WORLD.length;
    var higher = width;
    if (height > width) {
        higher = height;
    }
    var center = [width / 2, height / 2];
    camera.position.x = center[0];
    camera.position.y = center[1];
    camera.position.z = higher * 0.75;
}

// Centre la caméra sur le joueur du serpent passé en paramètre
export function centerCameraOnPlayer(snake, camera) {
    var center = snake.body[0].block.position;
    camera.position.x = center.x;
    camera.position.y = center.y;
    camera.position.z = 10;
}
// Centre la caméra sur le joueur le plus avancé
export function centerCameraOnHighestSnake(snakeList, camera, light) {
    
    var highestSnake = WorldManager.getHighestSnake(snakeList);

    light.position.x = highestSnake.body[0].x;
    light.position.y = highestSnake.body[0].y;

    centerCameraOnPlayer(highestSnake, camera);
}


export function povCamera(snake, camera, counterViewChange, angle, oldDirection, povDirection) {
    const FPS = 30;
    const piDividFPS = Math.PI / FPS;
    
    camera.position.x = snake.body[0].block.position.x;
    camera.position.y = snake.body[0].block.position.y;
    camera.position.z = 1;
    camera.lookAt(snake.body[0].block.position);
    // Rotate of 90°
    camera.rotateX(Math.PI / 2);
    camera.rotateY(Math.PI / 2);

    var dir = snake.direction;
    if (dir != oldDirection) {
        counterViewChange = 30;
    }
    
    if (dir == "down") {
        angle = Math.PI;
    } else if (dir == "right") {
        angle = -Math.PI / 2;
    } else if (dir == "up") {
        angle = 0;
    } else if (dir == "left") {
        angle = 3 * -Math.PI / 2;
    }
    var oldAngle = angle;
    
    
    if(counterViewChange > 0) {
        var facteur = FPS - counterViewChange/2;
        
        if (povDirection == "down") {
            oldAngle = Math.PI;
        } else if (povDirection == "right") {
            oldAngle = -Math.PI / 2;
        } else if (povDirection == "up") {
            oldAngle = 0;
        } else if (povDirection == "left") {
            oldAngle = 3 * -Math.PI / 2;
        }
        
        if(dir == "down" && povDirection == "right") {
            angle = angle + Math.PI;
        } else if(dir == "up" && povDirection == "right") {
            angle = angle + Math.PI;
        } else if(dir == "down" && povDirection == "left") {
            angle = angle + Math.PI;
        } else if(dir == "up" && povDirection == "left") {
            angle = angle + Math.PI;
        }


        if(povDirection == "left") {
            camera.rotateY( -angle + piDividFPS*facteur );
        } else {
            camera.rotateY( -angle - piDividFPS*facteur );
        }
        counterViewChange--;
    } else {
        camera.rotation.y = angle;
    }
    oldDirection = dir;

    return [counterViewChange, oldDirection, angle];

}