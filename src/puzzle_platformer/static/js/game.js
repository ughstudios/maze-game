import { createMaze, generateMonsters } from './maze.js';
import { handlePlayerInput, handlePlayerShooting } from './player.js';
import {
    createEntity,
    drawMazeGrid,
    drawEntity,
    checkCollision,
    checkWallHit
} from './utilities.js';

const gameCanvas = document.getElementById('gameCanvas');
const gameCtx = gameCanvas.getContext('2d');
gameCtx.fillStyle = 'black';
gameCtx.font = '14px Arial';

let gameActive = false;
let currentScore = 0;
let frameCounter = 0;
let animationFrameId;
let movementCounter = 0;
let playerBullets = [];

const bulletSpeed = 5;
const maxAmmo = 100;

const gridCellSize = 40;
const totalRows = Math.floor((gameCanvas.height - 200) / gridCellSize);
const totalCols = Math.floor(gameCanvas.width / gridCellSize);
const movementSpeed = 30;
const monsterSpawnCount = 15;

let mazeGrid, playerCharacter, keyItem, exitPoint, door;
let monsters = [];

function generateKey(maze, cellSize, validPositions) {
    const emptyCells = validPositions.filter(pos => 
        pos.y < maze.length && pos.x < maze[0].length && maze[pos.y][pos.x] === 0
    );

    if (emptyCells.length === 0) {
        throw new Error('No valid empty cells to place the key.');
    }

    const { x: keyX, y: keyY } = _.sample(emptyCells);
    const keyEntity = createEntity(keyX, keyY, 'gold', cellSize / 2, cellSize / 2);
    keyEntity.label = 'key';
    return keyEntity;
}

function setupGame() {
    const { maze, validPositions } = createMaze(totalRows, totalCols);
    mazeGrid = maze;
    playerCharacter = createEntity(1, 1, 'blue', gridCellSize / 2, gridCellSize / 2);
    playerCharacter.label = 'player';
    playerCharacter.ammo = maxAmmo;
    playerCharacter.hasKey = false;
    keyItem = generateKey(mazeGrid, gridCellSize, validPositions);
    exitPoint = createEntity(totalCols - 2, totalRows - 2, 'green', gridCellSize / 2, gridCellSize / 2, 'exit');
    door = createEntity(totalCols - 2, totalRows - 2, 'brown', gridCellSize, gridCellSize, 'door');
    monsters = generateMonsters(validPositions, monsterSpawnCount, mazeGrid);
    monsters.forEach(monster => monster.label = 'monster');
}

function runGameLoop() {
    if (gameActive) {
        frameCounter++;
        movementCounter++;

        drawMazeGrid(gameCtx, mazeGrid, totalRows, totalCols, gridCellSize);
        drawEntity(gameCtx, playerCharacter, gridCellSize);
        if (!playerCharacter.hasKey) {
            drawEntity(gameCtx, keyItem, gridCellSize);
        }
        drawEntity(gameCtx, exitPoint, gridCellSize);
        drawEntity(gameCtx, door, gridCellSize);

        monsters.forEach(monster => {
            drawEntity(gameCtx, monster, gridCellSize);
            if (movementCounter % movementSpeed === 0) {
                move(monster, mazeGrid, monsters);
            }
        });

        const currentTime = Date.now();
        playerBullets = playerBullets.filter(bullet => {
            if (currentTime - bullet.createdAt >= 3000) {
                return false;
            }
            drawEntity(gameCtx, bullet, gridCellSize);
            if (movementCounter % movementSpeed === 0) {
                return move(bullet, mazeGrid, monsters, true);
            }
            return true;
        });

        monsters.forEach(monster => {
            if (checkCollision(playerCharacter, monster)) {
                gameActive = false;
                alert('Game Over!');
                restartGame();
                return;
            }
        });

        if (checkCollision(playerCharacter, exitPoint)) {
            currentScore += 1;
            restartGame();
            return;
        }

        if (!playerCharacter.hasKey && checkCollision(playerCharacter, keyItem)) {
            playerCharacter.hasKey = true;
            keyItem = null;
        }

        if (checkWallHit(playerCharacter, mazeGrid)) {
            gameActive = false;
            alert('Game Over!');
            restartGame();
            return;
        }

        gameCtx.fillStyle = 'black';
        gameCtx.font = '16px Arial';
        gameCtx.fillText(`Score: ${currentScore}`, gameCanvas.width - 75, gameCanvas.height - 130);
        gameCtx.fillText(`Ammo: ${playerCharacter.ammo}`, gameCanvas.width - 75, gameCanvas.height - 110);

        animationFrameId = requestAnimationFrame(runGameLoop);
    }

    const instructions = [
        'Instructions:',
        'Move with arrow keys.',
        'Shoot with "F" key.',
        'Collect the key and reach the exit to win.',
        'Avoid monsters and don\'t hit walls.',
        'Bullets can break walls and destroy monsters.'
    ];
    instructions.forEach((text, index) => {
        gameCtx.fillText(text, 170, gameCanvas.height - 200 + (index * 30));
    });
}

function move(object, maze, monsters, isBullet = false) {
    const { x, y, directionX, directionY } = object;
    let newX = x + directionX;
    let newY = y + directionY;

    if (newX < 0 || newX >= totalCols || newY < 0 || newY >= totalRows) {
        if (!isBullet) {
            object.directionX *= -1;
            object.directionY *= -1;
        }
        return false;
    }

    if (!isBullet && maze[newY][newX] === 1) {
        object.directionX *= -1;
        object.directionY *= -1;
        return false;
    }

    if (isBullet && maze[newY][newX] === 1) {
        maze[newY][newX] = 0;
        return false;
    }

    for (let i = 0; i < monsters.length; i++) {
        if (newX === monsters[i].x && newY === monsters[i].y) {
            if (isBullet) {
                monsters.splice(i, 1);
                return false;
            }
        }
    }

    object.x = newX;
    object.y = newY;
    return true;
}

function startGame() {
    if (!gameActive) {
        gameActive = true;
        restartGame();
    }
}

function togglePauseResumeGame() {
    const pauseResumeButton = document.getElementById('pauseBtn');
    if (gameActive) {
        gameActive = false;
        cancelAnimationFrame(animationFrameId);
        pauseResumeButton.innerText = 'Resume';
    } else {
        gameActive = true;
        pauseResumeButton.innerText = 'Pause';
        runGameLoop();
    }
}

function restartGame() {
    gameActive = true;
    currentScore = 0;
    document.getElementById('pauseBtn').innerText = 'Pause';
    cancelAnimationFrame(animationFrameId);
    setupGame();
    frameCounter = 0;
    movementCounter = 0;
    playerBullets = [];
    runGameLoop();
}

function addEventListeners() {
    const controlButtons = [
        { id: 'startBtn', action: startGame },
        { id: 'pauseBtn', action: togglePauseResumeGame },
        { id: 'restartBtn', action: restartGame }
    ];

    controlButtons.forEach(button => {
        document.getElementById(button.id).addEventListener('click', button.action);
    });

    window.addEventListener('keydown', event => handlePlayerInput(event, playerCharacter, mazeGrid, totalRows, totalCols, gameActive));
    window.addEventListener('keydown', event => handlePlayerShooting(event, playerCharacter, playerBullets, bulletSpeed, gridCellSize, gameActive));
}

document.addEventListener('DOMContentLoaded', () => {
    addEventListeners();
    setupGame();
});