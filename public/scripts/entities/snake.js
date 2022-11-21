// Import de la classe Cell
import { Cell } from './cell.js';

import * as WorldManager from '../gameEngine/worldManager.js';
import * as Score from '../gameEngine/score.js';

export class Snake {
    constructor(newCase, controls, color1, color2, isABot, id, scene) {
        this.id = id;
        this.scene = scene;
        this.score = 0;
        this.body = [];
        this.body[0] = new Cell(newCase.x, newCase.y, 0, color1, color2, this.scene);
        this.direction = "right";
        this.actualDirection = "right";
        this.thinkToGrow = false;

        this.color1 = color1;
        this.color2 = color2;

        this.delay = 300;
        this.lastTime = new Date().getTime();

        this.isABot = isABot;
        this.isGhost = false;
        this.snakeDead = false;

        this.addControls(controls.up, controls.down, controls.left, controls.right);
    }

    move(scene) {
        for (var i = this.body.length - 1; i > 0; i--) {

            // On déplace la cellule à la position de la cellule précédente
            if(this.body[i].x > this.body[i - 1].x) {
                this.body[i].movingDirection = "left";
            }
            else if(this.body[i].x < this.body[i - 1].x) {
                this.body[i].movingDirection = "right";
            }
            else if(this.body[i].y > this.body[i - 1].y) {
                this.body[i].movingDirection = "down";
            }
            else if(this.body[i].y < this.body[i - 1].y) {
                this.body[i].movingDirection = "up";
            }
            
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
            this.body[i].block.position.x = this.body[i].x;
            this.body[i].block.position.y = this.body[i].y;
        }

        if(this.thinkToGrow) {
            this.body.push(new Cell(this.body[0].x, this.body[0].y, this.body.length, this.color1, this.color2, scene));
            this.thinkToGrow = false;
        }

        if (this.direction == "right") {
            this.body[0].x++;
            this.actualDirection = "right";
            this.body[0].movingDirection = "right";

        }
        else if (this.direction == "left") {
            this.body[0].x--;
            this.actualDirection = "left";
            this.body[0].movingDirection = "left";
        }
        else if (this.direction == "up") {
            this.body[0].y++;
            this.actualDirection = "up";
            this.body[0].movingDirection = "up";
        }
        else if (this.direction == "down") {
            this.body[0].y--;
            this.actualDirection = "down";
            this.body[0].movingDirection = "down";
        }

        this.body[0].block.position.x = this.body[0].x;
        this.body[0].block.position.y = this.body[0].y;
    }

    grow() {
        this.thinkToGrow = true;
    }

    movingAnimation(time) {
        
        var ratio = (time - this.lastTime) / this.delay;

        for (var i = 0; i < this.body.length; i++) {
            if (this.body[i].movingDirection == "right") {
                this.body[i].block.position.x = this.body[i].x + ratio - 1;
            }
            else if (this.body[i].movingDirection == "left") {
                this.body[i].block.position.x = this.body[i].x - ratio + 1;
            }
            else if (this.body[i].movingDirection == "up") {
                this.body[i].block.position.y = this.body[i].y + ratio - 1;
            }
            else if (this.body[i].movingDirection == "down") {
                this.body[i].block.position.y = this.body[i].y - ratio + 1;
            }
        }
    }

    checkCollision(gameMode, snakeList, listOfWalls, apple, listOfEmpties, scene) {

        if (gameMode != "survival" && apple.block != undefined && this.body[0].x == apple.block.position.x && this.body[0].y === apple.block.position.y) {
            this.score++;
            this.grow();
            if(gameMode != "race")
                apple.updatePosition(WorldManager.randomFreePosition(listOfEmpties, snakeList));
            else {
                var highestSnakeX = WorldManager.getHighestSnake(snakeList).body[0].x;
                var position = WorldManager.randomFreePositionBetween(listOfEmpties, snakeList, highestSnakeX + 3, highestSnakeX + 10)
                apple.updatePosition(position);
            }
                
            this.delay -= 10;
            if(!this.isABot)
                Score.updateScore(this);

        }
        for(var i = 0; i < snakeList.length; i++) {
            for(var j = 0; j < snakeList[i].body.length; j++) {
                if(this.body[0] != snakeList[i].body[j] && this.body[0].x === snakeList[i].body[j].x && this.body[0].y === snakeList[i].body[j].y &&snakeList[i].isGhost == false) {
                    return this.kill(snakeList, scene);
                    
                }
            }
        }
        for (var i = 1; i < this.body.length; i++) {
            if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
                return this.kill(snakeList, scene);
                
            }
        }
        for (var i = 0; i < listOfWalls.length; i++) {
            if (this.body[0].x === listOfWalls[i].x && this.body[0].y === listOfWalls[i].y) {
                return this.kill(snakeList, scene);
            }
        }
        
    }

    kill(snakeList, scene) {
        // On récupère l'index de la liste de serpents
        var index = snakeList.indexOf(this);
        // Suppression du serpent
        for(var k = snakeList[index].body.length - 1; k >= 0; k--) {
            scene.remove(snakeList[index].body[k].block);
        }
        snakeList.splice(index, 1);
        return true;
    }


    addControls(up, down, left, right) {
        var self = this;
        document.addEventListener("keydown", function (event) {
            if (event.key == up && self.actualDirection != "down") {
                self.direction = "up";
            }
            else if (event.key == down && self.actualDirection != "up") {
                self.direction = "down";
            }
            else if (event.key == left && self.actualDirection != "right") {
                self.direction = "left";
            }
            else if (event.key == right && self.actualDirection != "left") {
                self.direction = "right";
            }
        });
    }

}