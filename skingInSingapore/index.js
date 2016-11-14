var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('./map.txt')
    }),
    lineCount = 0, // Used while populating input
    nRows = 0,
    nCols = 0,
    inputGrid = [], // holds the input as is
    answerGrid = [], // holds already calculated shit
    maxPath = 0,
    howDeep = 0,
    blankCell = {'path': 0,'depth':0};

lineReader.on('line', function(line) {
    populateInput(line);
    lineCount++;
});

lineReader.on('close', function(line) {
    doTheShit();
});

let populateInput = function(aLine) {
    var records = aLine.split(' ');
    if (lineCount === 0) {
        nRows = records[0];
        nCols = records[1];
    } else {
        var row = [];
        for (let i in records) {
            row.push(parseInt(records[i]));
        }
        inputGrid.push(row);
        answerGrid.push(Array.from(Array(records.length), (x, i) => blankCell));
    }
}

let doTheShit = function() {

    // console.log('Input :');
    // for (let x = 0; x < nRows; x++) {
    //     console.log(inputGrid[x]);
    // }

    for (var x = 0; x < nRows; x++) {
        for (var y = 0; y < nCols; y++) {
            findLongestPath(x, y);
        }
    }

    // console.log('Output :');
    // for (var x = 0; x < nRows; x++) {
    //     console.log(answerGrid[x]);
    // }

    console.log(maxPath, howDeep);
}

let findLongestPath = function(x, y) {
    var possibilities = [];
    if (answerGrid[x][y].path === 0) {
        if (y > 0 && inputGrid[x][y] > inputGrid[x][y - 1]) {
            // Find west
            var answerFromWest = findLongestPath(x, y - 1);
            possibilities.push({'path': answerFromWest.path + 1, 'depth': answerFromWest.depth + (inputGrid[x][y]-inputGrid[x][y - 1])});
        }
        if (y < nCols - 1 && inputGrid[x][y] > inputGrid[x][y + 1]) {
            // Find east
            var answerFromEast = findLongestPath(x, y + 1);
            possibilities.push({'path': answerFromEast.path + 1, 'depth': answerFromEast.depth + (inputGrid[x][y]-inputGrid[x][y + 1])});
        }
        if (x > 0 && inputGrid[x][y] > inputGrid[x - 1][y]) {
            // Find north
            var answerFromNorth = findLongestPath(x-1, y);
            possibilities.push({'path': answerFromNorth.path + 1, 'depth': answerFromNorth.depth + (inputGrid[x][y]-inputGrid[x-1][y])});
        }
        if (x < nRows - 1 && inputGrid[x][y] > inputGrid[x + 1][y]) {
            // Find south
            var answerFromSouth = findLongestPath(x+1, y);
            possibilities.push({'path': answerFromSouth.path + 1, 'depth': answerFromSouth.depth + (inputGrid[x][y]-inputGrid[x+1][y])});
        }
        answerGrid[x][y] = findLongAndDeep(possibilities);
    }
    return answerGrid[x][y];
}

let findLongAndDeep = function(records) {
    var out = {
        'path': 1,
        'depth': 0
    };
    for (var idx in records) {
        if (records[idx].path > out.path) {
            out = records[idx];
        } else if (records[idx].path === out.path) {
            out = records[idx].depth > out.depth ? records[idx] : out;
        }
    }
    if(out.path > maxPath) {
        maxPath = out.path;
        howDeep = out.depth
    }
    if(out.path === maxPath) {
        howDeep = howDeep > out.depth ? howDeep : out.depth;
    }
    return out;
}
