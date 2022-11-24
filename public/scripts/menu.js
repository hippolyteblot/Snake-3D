
var infos = document.getElementsByClassName('info');
var optionSelected = "";
var select = document.getElementById('selectGameMode');
// Foreach select element, add an event listener to it
select.addEventListener('change', function() {
    // Delete the previous options selected
    optionSelected = this.value;
    printInfos(optionSelected);
});

function printInfos(optionSelected) {
    for (var i = 0; i < infos.length; i++) {
        infos[i].style.display = 'none';
    }
    document.getElementById(optionSelected).style.display = 'block';
}

printInfos(select.value);

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
    
    /* On retire le dernier caractère de la valeur du selectNbPlayer pour avoir le nombre de joueurs */
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
function start() {

    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    var menu = document.querySelector('article');
    
    menu.style.display = 'none';
    // On enlève l'image de fond du body
    document.body.style.background = 'none';
    // Overflow du body hidden pour éviter les scrollbars avec le canevas
    document.body.style.overflow = 'hidden';

    // On appelle le script qui fait tourner le jeu
    script.src = 'scripts/gameEngine/launcher.js';
    script.type = 'module';
    head.appendChild(script);

    // On récupère le loader
    var loader = document.getElementById('loader');
    // On l'affiche pendant le chargement du jeu
    loader.style.display = 'flex';

    // On sauvegarde les options sélectionnées
    var mode = document.getElementById('selectGameMode').value;
    var nbPlayer = document.getElementById('selectNbPlayer').value;
    var nbAI = document.getElementById('selectNbAI').value;

    localStorage.setItem('mode', mode);
    localStorage.setItem('nbPlayer', nbPlayer);
    localStorage.setItem('nbAI', nbAI);
}

// Quand le boutton #start est cliqué, on lance la fonction start()
document.getElementById('start').addEventListener('click', start);

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

    document.getElementById('selectGameMode').value = mode;
    document.getElementById('selectNbPlayer').value = nbPlayer;
    document.getElementById('selectNbAI').value = nbAI;
}


setOptionsFromStorage();