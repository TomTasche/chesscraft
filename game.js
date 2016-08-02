(function() {
    var grid = [];

    function initialize(gridSize) {
        for (var i = 0; i < gridSize; i++) {
            var row = [];
            for (var j = 0; j < gridSize; j++) {
                var field = new Field(Field.TYPE_GRASS);

                row.push(field);
            }

            grid.push(row);
        }
    }

    function getGridSize() {
        return grid.length;
    }

    function getGrid() {
        return grid;
    }

    function toString() {
        var stringGrid = [];
        for (var i = 0; i < getGridSize(); i++) {
            var stringRow = [];
            for (var j = 0; j < getGridSize(); j++) {
                var field = grid[i][j];

                stringRow.push(field.toString());
            }

            stringGrid[i] = stringRow;
        }

        console.table(stringGrid);
    }

    function addCharacter(player, type, x, y) {
        var character = new Character(player, type);
        character.setX(x);
        character.setY(y);

        grid[x][y].setOccupant(character);
    }

    function addWall(x, y) {
        var field = grid[x][y];
        field.setType(Field.TYPE_WATER);
    }

    function getCharacter(x, y) {
        return grid[x][y].getOccupant();
    }

    function isVerticalMove(oldX, oldY, newX, newY) {
        return newX === oldX && newY !== oldY;
    }

    function isHorizontalMove(oldX, oldY, newX, newY) {
        return newX !== oldX && newY === oldY;
    }

    function isDiagonalMove(oldX, oldY, newX, newY) {
        var deltaX = Math.abs(oldX - newX);
        var deltaY = Math.abs(oldY - newY);

        return deltaX === deltaY;
    }

    function isMovePossible(character, newX, newY) {
        var gridSize = Game.getGridSize();

        var oldX = character.getX();
        var oldY = character.getY();
        if (oldX === newX && oldY === newY) {
            return true;
        }

        var isOutOfBounds = Math.abs(newX) >= gridSize || Math.abs(newY) >= gridSize;
        if (isOutOfBounds) {
            return false;
        }

        var field = grid[newX][newY];
        if (field.getType() !== Field.TYPE_GRASS) {
            return false;
        }

        if (!character.isMovePossible(newX, newY)) {
            return false;
        }

        // does not check moves for knights
        // TODO: cleanup code
        if (isVerticalMove(oldX, oldY, newX, newY)) {
            var maxY = Math.max(oldY, newY);
            var minY = Math.min(oldY, newY);

            var x = oldX;
            for (var y = minY + 1; y < maxY; y++) {
                var field = grid[x][y];

                var isOccupied = field.getOccupant();
                var isBlocked = field.getType() === Field.TYPE_WATER;

                if (isOccupied || isBlocked) {
                    return false;
                }
            }
        } else if (isHorizontalMove(oldX, oldY, newX, newY)) {
            var maxX = Math.max(oldX, newX);
            var minX = Math.min(oldX, newX);

            var y = oldY;
            for (var x = minX + 1; x < maxX; x++) {
                var field = grid[x][y];

                var isOccupied = field.getOccupant();
                var isBlocked = field.getType() === Field.TYPE_WATER;

                if (isOccupied || isBlocked) {
                    return false;
                }
            }
        } else if (isDiagonalMove(oldX, oldY, newX, newY)) {
            var maxX = Math.max(oldX, newX);
            var minX = Math.min(oldX, newX);

            var maxY = Math.max(oldY, newY);
            var minY = Math.min(oldY, newY);

            var x = minX + 1;
            for (var y = minY + 1; y < maxY; y++) {
                var field = grid[x][y];

                var isOccupied = field.getOccupant();
                var isBlocked = field.getType() === Field.TYPE_WATER;

                if (isOccupied || isBlocked) {
                    return false;
                }

                x++;
            }
        }

        return true;
    }

    function moveCharacter(character, newX, newY) {
        if (!isMovePossible(character, newX, newY)) {
            return false;
        }

        var oldX = character.getX();
        var oldY = character.getY();

        var field = grid[oldX][oldY];
        field.setOccupant(null);

        var newField = grid[newX][newY];
        newField.setOccupant(character);

        character.setX(newX);
        character.setY(newY);

        return true;
    }

    var bridge = {};
    bridge.initialize = initialize;
    bridge.getGridSize = getGridSize;
    bridge.getGrid = getGrid;
    bridge.addCharacter = addCharacter;
    bridge.addWall = addWall;
    bridge.getCharacter = getCharacter;
    bridge.moveCharacter = moveCharacter;
    bridge.isVerticalMove = isVerticalMove;
    bridge.isHorizontalMove = isHorizontalMove;
    bridge.isDiagonalMove = isDiagonalMove;
    bridge.toString = toString;

    window.Game = bridge;
})();
