// Définition des constantes
const EMPTY = 0;
const WALL = 1;

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