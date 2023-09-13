function solveMaze(start, end, maze) {
    const startCoords = translateLocationToCoords(maze.grid.length - 1, maze.grid, start);
    const endCoords = translateLocationToCoords(maze.grid.length - 1, maze.grid, end);
    // put MazeCells here to check the reference
    let visited = new Set();
    return rSolveMaze(maze, startCoords, [], visited, endCoords);
}
// tbh we should use BFS to show the whole connected maze
function rSolveMaze(maze, cellCoords, path, visited, end) {
    let cell = maze.grid[cellCoords.layer][cellCoords.cell];
    if (visited.has(cell)) {
        return [];
    }
    visited.add(cell);
    path.push(cellCoords);
    if (cellCoords.layer === end.layer && cellCoords.cell === end.cell) {
        return path;
    }
    for (let connectedNeighbor of maze.connectedNeighbors(cellCoords)) {
        let solved = rSolveMaze(maze, connectedNeighbor, path.slice(), visited, end);
        if (solved.length > 0) return solved;
    }
    return [];
}