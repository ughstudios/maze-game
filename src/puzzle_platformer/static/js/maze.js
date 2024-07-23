export let validPositions = [];

export function createMaze(rows, cols) {
    const maze = Array.from({ length: rows }, () => Array(cols).fill(1));
    const pathStack = [[1, 1]];
    maze[1][1] = 0;
    validPositions = [{ x: 1, y: 1 }];
    const visited = new Set(['1,1']);

    const movements = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0]
    ];

    while (pathStack.length) {
        const [currentX, currentY] = pathStack[pathStack.length - 1];
        const randomMovements = _.shuffle(movements);
        let moved = false;

        for (const [dx, dy] of randomMovements) {
            const newX = currentX + 2 * dx;
            const newY = currentY + 2 * dy;
            const newKey = `${newX},${newY}`;

            if (isWithinBounds(newX, newY, cols, rows) && maze[newY][newX] === 1 && !visited.has(newKey)) {
                maze[newY][newX] = 0;
                maze[currentY + dy][currentX + dx] = 0;
                pathStack.push([newX, newY]);
                addValidPosition(newX, newY);
                addValidPosition(currentX + dx, currentY + dy);
                visited.add(newKey);
                moved = true;
                break;
            }
        }

        if (!moved) {
            pathStack.pop();
        }
    }

    return { maze, validPositions };
}

function addValidPosition(x, y) {
    validPositions.push({ x, y });
}

function isWithinBounds(x, y, cols, rows) {
    return x >= 0 && x < cols && y >= 0 && y < rows;
}

export function generateMonsters(validPositions, count, maze) {
    const monsters = [];
    for (let i = 0; i < count; i++) {
        const pos = _.sample(validPositions);
        const directions = getValidDirections(pos.x, pos.y, maze);
        const chosenDirection = directions.length > 0 ? _.sample(directions) : { dx: 0, dy: 0 };
        monsters.push({ 
            ...pos, 
            directionX: chosenDirection.dx, 
            directionY: chosenDirection.dy, 
            type: 'monster', 
            color: 'red', 
            width: 20, 
            height: 20 
        });
    }
    return monsters;
}

function getValidDirections(x, y, maze) {
    const directions = [];
    const movements = [
        { dx: 0, dy: -1 }, // Up
        { dx: 0, dy: 1 },  // Down
        { dx: -1, dy: 0 }, // Left
        { dx: 1, dy: 0 }   // Right
    ];

    for (const { dx, dy } of movements) {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length && maze[newY][newX] === 0) {
            directions.push({ dx, dy });
        }
    }
    return directions;
}