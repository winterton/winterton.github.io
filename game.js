function insertPoint(x, y) {
    if (map[y][x] === 0) {
        map[y][x] = 1;
    } else {
        map[y][x] = 0;
    }
}

function insertGlider(x,y) {
    var coords = [
        [x,y-1],
        [x,y+1],
        [x+1, y],
        [x+1, y+1],
        [x-1, y+1]
    ];
    insertPattern(coords);
}

function insertBlinker(x,y) {
    var coords = [
        [x, y],
        [x-1, y],
        [x+1, y]
    ];
    insertPattern(coords);
}

function insertSpaceship(x,y) {
    var coords = [
		[x-2,y],
        [x-2, y+1],
        [x-2,y+2],
        [x-1,y-1],
        [x-1,y+2],
        [x,y+2],
        [x+1,y+2],
        [x+2,y+1],
        [x+2,y-1]
	];
    insertPattern(coords);
}

function insertToad(x,y) {
    var coords = [
        [x, y],
        [x-1, y],
        [x+1, y],
        [x+1, y-1],
        [x, y-1],
        [x+2, y-1]
    ];
    insertPattern(coords);
}

function insertPattern(coords) {
    var xOffset = 1;
    var yOffset = 1;

    for (var coord in coords) {
        if (coord[0] < 0 && Math.abs(coord[0]) > xOffset) {
            xOffset = Math.abs(coord[0]);
        }
        if (coord[1] < 0 && Math.abs(coord[1]) > yOffset) {
            yOffset = Math.abs(coord[1]);
        }
    }

    for (var i = 0; i < coords.length; ++i) {
        var c = coords[i];
        insertPoint(c[0] + xOffset, c[1] + yOffset);
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
            } else if (neighbors === 3) {
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
    if (numGenerations > 0) {
        for (var i = 0; i < numGenerations; i++) {
            setTimeout(tick, 100 * i);
        }
    } else {
        //go forever
        window.setInterval(tick, 100);
    }
}


function tick() {
    generation();
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

    context.fillStyle = 'rgba(0,0,0,0)';
    context.fillRect(0,0,canvas.width, canvas.height);

    var xPixelSize = 20;
    var yPixelSize = 20;

    var yOffset = 0;
    for (var y = 0; y < map.length; ++y) {
        var xOffset = 0;
        for (var x = 0; x < map[y].length; ++x) {
            if (map[y][x] === 1) {
                context.fillStyle = 'rgba(0,0,0,.25)';
            } else {
                context.fillStyle = 'rgba(0,0,0,0)';
            }
            context.fillRect(x + xOffset, y + yOffset, xPixelSize, yPixelSize);

            xOffset += xPixelSize;
        }
        yOffset += yPixelSize;
    }
}

function getRandomIndex(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

document.addEventListener("DOMContentLoaded", function(){
    generateMap();
    drawGame();
    startGame();
});

function handleClick(e) {
    var x = Math.floor(e.pageX / 20);
    var y = Math.floor(e.pageY / 20);


    var rand = getRandomIndex(0,4);

    switch (rand) {
        case 0:
            insertToad(x,y);
            break;
        case 1:
            insertGlider(x,y);
            break;
        case 2:
            insertBlinker(x,y);
            break;
        case 3:
            insertSpaceship(x,y);
            break;
    }
    drawGame();

}


document.addEventListener('click', handleClick, true);

document.addEventListener('touchend', handleClick, true);
