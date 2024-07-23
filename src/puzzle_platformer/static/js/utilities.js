export function createEntity(x, y, color, width, height, label) {
    return { x, y, color, width, height, label};
}

export function drawMazeGrid(ctx, maze, rows, cols, cellSize) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }
}

export function drawEntity(ctx, element, cellSize) {
    ctx.fillStyle = element.color;
    ctx.fillRect(
        element.x * cellSize + cellSize / 4,
        element.y * cellSize + cellSize / 4,
        element.width,
        element.height
    );
    if (element.label) {
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            element.label, 
            element.x * cellSize + cellSize / 2, 
            element.y * cellSize + cellSize / 2
        );
    }
}

export function checkCollision(rect1, rect2) {
    return rect1.x === rect2.x && rect1.y === rect2.y;
}

export function checkWallHit(player, maze) {
    return maze[player.y][player.x] === 1;
}

export function isValidDirection(x, y, direction, cols, rows, maze) {
    const nextX = x + direction.x;
    const nextY = y + direction.y;
    return nextX >= 0 && nextX < cols && nextY >= 0 && nextY < rows && maze[nextY][nextX] === 0;
}