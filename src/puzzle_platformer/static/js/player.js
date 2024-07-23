export function handlePlayerInput(e, player, maze, rows, cols, running) {
    if (!running) return;

    let newX = player.x;
    let newY = player.y;

    switch (e.key) {
        case 'ArrowUp':
            newY -= 1;
            player.direction = 'up';
            break;
        case 'ArrowDown':
            newY += 1;
            player.direction = 'down';
            break;
        case 'ArrowLeft':
            newX -= 1;
            player.direction = 'left';
            break;
        case 'ArrowRight':
            newX += 1;
            player.direction = 'right';
            break;
    }

    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
    }
}

export function handlePlayerShooting(e, player, bullets, bulletSpeed, cellSize, running) {
    if (!running || e.key.toLowerCase() !== 'f' || player.ammo <= 0) return;

    let bullet = { 
        x: player.x, 
        y: player.y, 
        width: cellSize / 4, 
        height: cellSize / 4, 
        color: 'purple',
        directionX: 0,
        directionY: 0,
        createdAt: Date.now()
    };

    switch (player.direction) {
        case 'up':
            bullet.directionY = -1;
            break;
        case 'down':
            bullet.directionY = 1;
            break;
        case 'left':
            bullet.directionX = -1;
            break;
        case 'right':
            bullet.directionX = 1;
            break;
    }

    bullets.push(bullet);
    player.ammo -= 1;
}