let app = {

    init: function(){
       app.loadRules();
    },
    difficulty: '',
    x: 2,
    y: 2,
    cellWidth: 40,

    types: {
        'x': 'path',
        '*': 'wall',
        'o': 'mouse',
        '-': 'door',
        'z': 'trap',
        'a': 'topleft',
        'b': 'topright',
        'c': 'bottomleft',
        'd': 'bottomright',
        'f': 'cheese'
    },

    loadRules: function() {

            let rules = document.getElementById('rules');
            let rulesLevel = document.getElementById('rulesLevel');   
            
            let firstRule = document.createElement('p');
            firstRule.classList.add('rules__one');
            firstRule.innerHTML = 'Tu n\'as que quelques secondes pour faire sortir la souris du labyrinthe avant que les chats ne se réveillent. 😏<br>Utilises les touches directionnelles de ton clavier !'

            let moto = document.createElement('p');
            moto.textContent = 'Choisi un niveau de difficulté et c\'est parti.';

            let buttonMedium = document.createElement('button');
            buttonMedium.id = 'launchGameMedium';
            buttonMedium.classList.add('launchGameMedium');
            buttonMedium.textContent = "Normal 😎";

            let buttonEasy = document.createElement('button'
            );
            buttonEasy.id = 'launchGameEasy';
            buttonEasy.classList.add('launchGameEasy');
            buttonEasy.textContent = "Facile 🤨";

            let buttonHard = document.createElement('button');
            buttonHard.id = 'launchGameHard';
            buttonHard.classList.add('launchGameHard');
            buttonHard.textContent = "Difficile 🤓";

            rules.prepend(moto);
            rules.prepend(firstRule);
            rulesLevel.appendChild(buttonMedium);
            rulesLevel.appendChild(buttonEasy);
            rulesLevel.appendChild(buttonHard);

            let selectButtonElmtMedium = document.getElementById('launchGameMedium');
            let selectButtonElmtEasy = document.getElementById('launchGameEasy');
            let selectButtonElmtHard = document.getElementById('launchGameHard');

            selectButtonElmtMedium.addEventListener('click', app.loadLevelMedium);

            selectButtonElmtEasy.addEventListener('click', app.loadLevelEasy);

            selectButtonElmtHard.addEventListener('click', app.loadLevelHard);

            window.addEventListener('keydown', app.logKey);
    },

    loadLevelMedium: function(evt) {
        if (evt.currentTarget) {
            app.difficulty = 1;
            app.loadGame();
        }
    },

    loadLevelEasy: function(evt) {
        if (evt.currentTarget) {
            app.difficulty = 2;
            app.loadGame();
            console.log(app.difficulty);
        }
    },

    loadLevelHard: function(evt) {
        if (evt.currentTarget) {
            app.difficulty = 3;
            app.loadGame();
            console.log(app.difficulty);
        }
    },

    loadGame: function() {
        let rules = document.getElementById('rules');
        rules.innerHTML = '';
        rules.classList.remove('rules');

        app.drawBoard(model);

        console.log(app.difficulty);

        if (app.difficulty == 1) {
            return app.seconds(7000);
        }
        if (app.difficulty == 2) {
            return app.seconds(9000);
        }
        if (app.difficulty == 3) {
            return app.seconds(5000);
        }
    },

    logKey: function(evt) {
        let press = evt.key;

        app.move(press);
    },
    move: function(press) {

        if (press === 'ArrowUp') {
            app.x--;

            if (app.labyrinthSize(app.x, app.y) && app.boardLimit(app.x, app.y)) {
                app.position(app.x, app.y);
            }
            else {
                app.x++;
            }
        }
        if (press === 'ArrowDown') {
            app.x++;

            if (app.labyrinthSize(app.x, app.y) && app.boardLimit(app.x, app.y)) {
                app.position(app.x, app.y);
            }
            else {
                app.x--;
            }
        }
        if (press === 'ArrowLeft') {
            app.y--;

            if (app.labyrinthSize(app.x, app.y) && app.boardLimit(app.x, app.y)) {
                app.position(app.x, app.y);
            }
            else {
                app.y++;
            }
        }
        if (press === 'ArrowRight') {
            app.y++;

            if (app.labyrinthSize(app.x, app.y) && app.boardLimit(app.x, app.y)) {
                app.position(app.x, app.y);
            }
            else {
                app.y--;
            }
        }

    },
    boardLimit: function(x, y) {
        let currentTarget = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');
        if (currentTarget.classList.contains('wall')) {
            return false;
        }
        else {
            return true;
        }
    },
    labyrinthSize: function(x, y) {
        let minX = 1;
        let maxX = 12;
        let minY = 1;
        let maxY = 24;

        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
            return true;
        }
        else {
            return false;
        }
    },
    position: function (x, y) {
        let currentPosition = document.querySelector('.mouse');
        let newPosition = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');
        
        currentPosition.classList.remove('mouse');
        newPosition.classList.add('mouse');

        if (newPosition.classList.contains('door')) {
            app.youWin();
        }

        if (newPosition.classList.contains('trap')) {
            app.beenEated();
        }

        if (newPosition.classList.contains('cheese')) {
            clearTimeout(timer);
            app.seconds(10000);
        }
    },
    drawBoard: function(model) {
        let board = document.getElementById('labyrinth');

        board.innerHTML = '';

        for (let row = 0; row < model.length; row++) {
            let line = model[row];
            
            for (let column = 0; column < line.length; column++) {
                let cell = document.createElement('div')

                cell.dataset.x = row + 1;
                cell.dataset.y = column + 1;
                
                app.setScreenSize(line, board);

                app.setDesign(model, cell, row, column);

                board.appendChild(cell);
            }
        }
    },
    setDesign: function(model, cell, row, column) {
        let whichCell = model[row][column];

        let cellDesign = app.types[whichCell];

        cell.classList.add('cell');

        cell.classList.add(cellDesign);
    },
    setScreenSize: function(line, terrain) {
        let terrainWidthInPixels = line.length * app.cellWidth + 'px';
        terrain.style.width = terrainWidthInPixels;
    },

    seconds: function(time) {
        // je déclare le miniteur dans une variable globale pour pouvoir l'arrêter plus tard
        timer = setTimeout(app.gameOver, time);
    },

    gameOver: function() {
        app.youLose();
    },

    youWin: function() {
        clearTimeout(timer);

        app.cleanLabyrinth();
        
        let winner = document.getElementById('youwin');
        winner.classList.add('youwin');
        let congratulations = document.createElement('p');
        congratulations.classList.add('youwin');
        congratulations.textContent = 'Félicitations, tu as sauvé la souris d\'une mort certaine 😅';

        let a = document.createElement('a');
        a.href = "https://www.obernier.fr/labyrinth";
        home = document.createElement('button');
        home.classList.add('youlose__home');
        home.textContent = 'Retour';

        winner.appendChild(congratulations);
        winner.appendChild(a);
        a.appendChild(home);
    },

    youLose: function() {
        clearTimeout(timer);
        app.cleanLabyrinth();

        let loser = document.getElementById('youlose');
        loser.classList.add('youlose');
        let timeOut = document.createElement('p');
        timeOut.innerHTML = 'Argh, un chat s\'est réveillé, la souris a été trop lente !<br>Bon, il doit bien y avoir une solution... 😜';

        let a = document.createElement('a');
        a.href = "https://www.obernier.fr/labyrinth";
        home = document.createElement('button');
        home.classList.add('youlose__home');
        home.textContent = 'Retour';

        loser.appendChild(timeOut);
        loser.appendChild(a);
        a.appendChild(home);
    },

    beenEated: function() {
        clearTimeout(timer);
        app.cleanLabyrinth();

        let loser = document.getElementById('youlose');
        let mouseCat = document.createElement('p');
        loser.classList.add('youlose');
        mouseCat.classList.add('youlose');
        mouseCat.textContent = 'Argh, la souris a été mangée par un chat ! 🙄';

        let a = document.createElement('a');
        a.href = "https://www.obernier.fr/labyrinth";
        home = document.createElement('button');
        home.classList.add('youlose__home');
        home.textContent = 'Retour';

        loser.appendChild(mouseCat);
        loser.appendChild(a);
        a.appendChild(home);
    },

    cleanLabyrinth: function() {
        document.getElementById('labyrinth').innerHTML = '';
    }
};


document.addEventListener('DOMContentLoaded', app.init);

let model = [
    'a**********************b',
    '*oxxxxxxxxxxxxxxx*xxx*-*',
    '*x*x****x*******x*x*x*x*',
    '*x*x*xxxx*xxxxxxx*x*x*x*',
    '*x*x****xxx*******x*x*x*',
    '*x*xxxx*x***xxxxx*x*x*x*',
    '*x******x**xxz*xf*x*x*x*',
    '*xxx*x*xx**x******x*x*x*',
    '*x*xxxxxxxxxxx**xxx*x*x*',
    '*x***x**********xxz*x*x*',
    '*xxxxxxxxxxxxxxxxxx*xxx*',
    'c**********************d',
];