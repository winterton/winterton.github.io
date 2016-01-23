
//Glider
var map = [
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
];

//TODO: Refactor, fix x/y, clean up naming

function insertPoint(x, y) {
    if (map[y][x] === 0) {
        map[y][x] = 1;
    } else {
        map[y][x] = 0;
    }
}

function countNeighbors(x, y) {

    var startx = (x > 0) ? x - 1 : x;
    var endx = (x < map.length - 1) ? x + 1 : x;
    var starty = (y > 0) ? y - 1 : y;
    var endy = (y < map[x].length - 1) ? y + 1 : y;

    var count = 0;
    for (var i = startx; i <= endx; ++i) {
        for (var j = starty; j <= endy; j++) {
            if (!(i === x && j ===  y) && map[i][j] === 1) {
                count++;
            }
        }
    }
    return count;
}

function generation() {
    var newGeneration = map.map(function(arr) {
        return arr.slice();
    });
    for (var x = 0; x < map.length; ++x) {
        for (var y = 0; y < map[x].length; ++y) {
            var value = map[x][y];
            var neighbors = countNeighbors(x, y);

            if (value === 1) {
                if (neighbors < 2) newGeneration[x][y] = 0;
                if (neighbors === 2 || neighbors === 3) newGeneration[x][y] = 1;
                if (neighbors > 3) newGeneration[x][y] = 0;
            } else if (neighbors == 3) {
                newGeneration[x][y] = 1;
            }
        }
    }

    map = newGeneration;
}

function printMap() {
    for (var x = 0; x < map.length; ++x) {
        console.log(map[x]);
    }
    console.log('------');
}

function startGame(numGenerations) {
    // generateMap();
    //printMap();
    for (var i = 0; i < numGenerations; i++) {
        setTimeout(tick, 100 * i);
    }
}

function tick() {
    generation();
    printMap();
    drawGame();
}

function generateMap() {
    var size = window.innerWidth / 10;
    map = [];
    for (var i = 0; i < size; ++i) {
        var arr = [];
        for (var j = 0; j < size; ++j) {
            arr.push(0);
        }
        map.push(arr);
    }
}

function drawGame() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    context.fillStyle = '#FFF';
    context.fillRect(0,0,canvas.width, canvas.height);

    var xPixelSize = 20;
    var yPixelSize = 20;

    var yOffset = 0;
    for (var y = 0; y < map.length; ++y) {
        var xOffset = 0;
        for (var x = 0; x < map[y].length; ++x) {
            if (map[y][x] === 1) {
                context.fillStyle = '#000';
            } else {
                context.fillStyle = '#F00';
            }
            context.fillRect(x + xOffset, y + yOffset, xPixelSize, yPixelSize);

            xOffset += xPixelSize;
        }
        yOffset += yPixelSize;
    }
}

document.addEventListener("DOMContentLoaded", function(){
    generateMap();
    map[10][10] = 1;
    map[11][11] = 1;
    map[12][10] = 1;
    map[12][11] = 1;
    map[12][9] = 1;
    drawGame();
});

document.getElementById('canvas').addEventListener('click', function(e){
    //TODO: Handle click events.
});
