export function buildScore(nb) {

    // On crée un élément div qui contiendra le score
    var score = document.createElement("div");
    score.classList.add("score");
    score.id = "blockScore" + nb;
    var p = document.createElement("p");
    // On affiche P (Player) + le numéro du joueur
    p.innerHTML = "P"+nb+": ";
    score.appendChild(p);
    // On crée un élément span qui contiendra la valeur du score
    var span = document.createElement("span");
    span.innerHTML = "0";
    score.appendChild(span);

    document.body.appendChild(score);
}

export function updateScore(snake) {
    var nb = snake.id;
    var score = document.getElementById("blockScore" + nb);
    var span = score.getElementsByTagName("span")[0];
    span.innerHTML = snake.score;
}