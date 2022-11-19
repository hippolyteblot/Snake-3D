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