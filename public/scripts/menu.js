
var infos = document.getElementsByClassName('info');
var optionSelected = "";
var select = document.getElementById('selectGameMode');
// Pour chaque élément sélectionné, on affiche les infos correspondantes
select.addEventListener('change', function() {
    optionSelected = this.value;
    printInfos(optionSelected);
});

function printInfos(optionSelected) {
    for (var i = 0; i < infos.length; i++) {
        infos[i].style.display = 'none';
    }
    document.getElementById(optionSelected).style.display = 'block';
}

var selectNbPlayer = document.getElementById('selectNbPlayer');

function addClassToElements(elements, className) {
    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.add(className);
    }
}
function removeClassToElements(elements, className) {
    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove(className);
    }
}

selectNbPlayer.addEventListener('change', function() {
    
    // On retire le dernier caractère de la valeur du selectNbPlayer pour avoir le nombre de joueurs
    var nbPlayer = this.value.substring(0, this.value.length - 1);
    if(nbPlayer >= 2) {
        addClassToElements(document.getElementsByClassName('zqsd'), 'active');
    } else {
        removeClassToElements(document.getElementsByClassName('zqsd'), 'active');
    }
    if(nbPlayer >= 3) {
        addClassToElements(document.getElementsByClassName('ijkl'), 'active');
    } else {
        removeClassToElements(document.getElementsByClassName('ijkl'), 'active');
    }
    if(nbPlayer == 4) {
        addClassToElements(document.getElementsByClassName('tfgh'), 'active');
    } else {
        removeClassToElements(document.getElementsByClassName('tfgh'), 'active');
    }
});


// Function permettant de lancer le jeu
function chooseLevel() {

    var menu = document.querySelector('article');
    
    menu.style.display = 'none';

    // Overflow du body hidden pour éviter les scrollbars avec le canevas
    document.body.style.overflow = 'hidden';

    // On sauvegarde les options sélectionnées
    var mode = document.getElementById('selectGameMode').value;
    var nbPlayer = document.getElementById('selectNbPlayer').value;
    var nbAI = document.getElementById('selectNbAI').value;

    localStorage.setItem('mode', mode);
    localStorage.setItem('nbPlayer', nbPlayer);
    localStorage.setItem('nbAI', nbAI);
    localStorage.setItem('pov', document.getElementById('firstPersonCheckbox').checked);

    // On affiche la page de sélection du niveau
    var levelSelection = document.getElementById('levelSelection');
    levelSelection.style.display = 'flex';
    if(mode == 'race') 
        levelSelection.getElementsByClassName('loadLevel')[0].style.display = 'none';
    levelSelection.style.justifyContent = 'space-around';
}

function startGeneration() {
    var id = this.id;
    var article = document.querySelector('#levelSelection');
    if(id == 'startLevelGeneration') {
        article.value = 'generation';
    } else {
        article.value = 'selection';
    }

    var article = document.querySelector('#levelSelection');
    article.style.display = 'none';
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    // On récupère le loader
    var loader = document.getElementById('loader');
    // On l'affiche pendant le chargement du jeu
    loader.style.display = 'flex';

    // On enlève l'image de fond du body
    document.body.style.background = 'none';

    // On récupère les options sélectionnées
    var size = document.getElementById('selectLevelSize').value;
    var difficulty = document.getElementById('selectLevelDifficulty').value;
    var level = document.getElementById('chooseLevel').value;

    localStorage.setItem('size', size);
    localStorage.setItem('difficulty', difficulty);
    localStorage.setItem('level', level);


    // On appelle le script qui fait tourner le jeu
    script.src = 'scripts/gameEngine/launcher.js';
    script.type = 'module';

    head.appendChild(script);
}

// Quand le boutton #start est cliqué, on lance la fonction chooseLevel()
document.getElementById('start').addEventListener('click', chooseLevel);
// Même chose pour le boutton #startLevel
document.getElementById('startLevelPrebuild').addEventListener('click', startGeneration);
document.getElementById('startLevelGeneration').addEventListener('click', startGeneration);

function setOptionsFromStorage() {
    var mode = localStorage.getItem('mode');
    if(!mode) {
        mode = 'classic';
    }
    var nbPlayer = localStorage.getItem('nbPlayer');
    if(!nbPlayer) {
        nbPlayer = '1p';
    }
    var nbAI = localStorage.getItem('nbAI');
    if(nbAI == null) {
        nbAI = '0b';
    }
    var pov = localStorage.getItem('pov');
    if(!pov) {
        pov = "false";
    }
    var size = localStorage.getItem('size');
    if(!size) {
        size = '10';
    }
    var difficulty = localStorage.getItem('difficulty');
    if(!difficulty) {
        difficulty = '0';
    }
    var level = localStorage.getItem('level');
    if(!level) {
        level = 'level1.json';
    }
    document.getElementById('selectGameMode').value = mode;
    document.getElementById('selectNbPlayer').value = nbPlayer;
    document.getElementById('selectNbAI').value = nbAI;
    document.getElementById('selectLevelSize').value = size;
    document.getElementById('selectLevelDifficulty').value = difficulty;
    document.getElementById('chooseLevel').value = level;
    if(pov == "true") {
        document.getElementById('firstPersonCheckbox').checked = true;
    } else {
        document.getElementById('firstPersonCheckbox').checked = false;
    }
}


// Load the name of the levels (file name without extension) in the folder levels
function loadLevelList() {
    // On récupère le fichier levelsList.json avec fetch
    fetch('levels/levelsList.json')
    .then(function(response) {
        // On récupère le contenu du fichier
        return response.json();
    }
    ).then(function(data) {
        // On récupère la liste des niveaux
        var levels = data.levels;
        // On récupère le select contenant les niveaux
        var select = document.getElementById('chooseLevel');
        // Pour chaque niveau, on ajoute une option au select
        for(var i = 0; i < levels.length; i++) {
            var option = document.createElement('option');
            option.value = levels[i].path;
            option.innerHTML = levels[i].name;
            select.appendChild(option);
        }
    }
    );
}

loadLevelList();
// On attend 0.1s pour s'assurer que la liste des niveaux est bien chargée
setTimeout(setOptionsFromStorage, 100);

printInfos(select.value);