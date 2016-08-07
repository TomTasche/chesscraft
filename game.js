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

        calculateFogs();
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

    function isFoggy(player, x, y) {
        var field = grid[x][y];
        return field.getFoggy(player);
    }

    function addCharacter(player, type, x, y) {
        if (isFoggy(player, x, y)) {
            return false;
        }

        var character = new Character(player, type);
        character.setX(x);
        character.setY(y);

        grid[x][y].setOccupant(character);

        calculateFogs();
    }

    function addWater(player, x, y) {
        if (isFoggy(player, x, y)) {
            return false;
        }

        var field = grid[x][y];
        field.setType(Field.TYPE_WATER);
    }

    function getCharacter(x, y) {
        return grid[x][y].getOccupant();
    }

    function calculateFogs() {
      calculateFog(1);
      calculateFog(2);
    }

    function calculateFog(player) {
        var gridSize = getGridSize();
        // do not make first and last row foggy
        var x;
        if (player === 1) {
            x = 1;
        } else if (player === 2) {
            x = 0;
        }

        var maxX;
        if (player === 1) {
            maxX = gridSize;
        } else if (player === 2) {
            maxX = gridSize - 1;
        }

        for (; x < maxX; x++) {
            for (var y = 0; y < gridSize; y++) {
                var field = grid[x][y];

                field.setFoggy(player, true);
            }
        }

        for (var x = 0; x < gridSize; x++) {
            for (var y = 0; y < gridSize; y++) {
                var field = grid[x][y];

                var character = field.getOccupant();
                if (character) {
                    var range = 2;

                    var rangeX = x - range;
                    rangeX = Math.max(0, rangeX);
                    for (; rangeX <= Math.min(gridSize - 1, x + range); rangeX++) {
                        var rangeY = y - range;
                        rangeY = Math.max(0, rangeY);
                        for (; rangeY <= Math.min(gridSize - 1, y + range); rangeY++) {
                            var rangeField = grid[rangeX][rangeY];
                            rangeField.setFoggy(player, false);
                        }
                    }
                }
            }
        }
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
        var gridSize = getGridSize();

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

        if (field.getOccupant()) {
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

    function isAttackPossible(character, enemyX, enemyY) {
        var gridSize = getGridSize();

        var currentX = character.getX();
        var currentY = character.getY();

        var deltaX = Math.abs(currentX - enemyX);
        var deltaY = Math.abs(currentY - enemyY);
        var maxDelta = Math.max(deltaX, deltaY);

        if (character.getRange() < maxDelta) {
            return false;
        }

        if (currentX === enemyX && currentY === enemyY) {
            return false;
        }

        var isOutOfBounds = Math.abs(enemyX) >= gridSize || Math.abs(enemyY) >= gridSize;
        if (isOutOfBounds) {
            return false;
        }

        var field = grid[enemyX][enemyY];
        if (!field.getOccupant()) {
            return false;
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

        calculateFogs();

        return true;
    }

    function attack(character, enemyX, enemyY) {
        if (!isAttackPossible(character, enemyX, enemyY)) {
            return false;
        }

        var currentX = character.getX();
        var currentY = character.getY();

        var currentField = grid[currentX][currentY];

        var otherField = grid[enemyX][enemyY];
        var otherCharacter = otherField.getOccupant();

        var enemyRemainingHealth = otherCharacter.getHealth();
        enemyRemainingHealth -= character.getStrength();
        otherCharacter.setHealth(enemyRemainingHealth);

        if (enemyRemainingHealth <= 0) {
            otherField.setOccupant(null);

            calculateFogs();
        }

        var currentHealth = character.getHealth();
        currentHealth -= 10;
        character.setHealth(currentHealth);

        return true;
    }

    var bridge = {};
    bridge.initialize = initialize;
    bridge.getGridSize = getGridSize;
    bridge.getGrid = getGrid;
    bridge.addCharacter = addCharacter;
    bridge.addWater = addWater;
    bridge.getCharacter = getCharacter;
    bridge.moveCharacter = moveCharacter;
    bridge.attack = attack;
    bridge.isVerticalMove = isVerticalMove;
    bridge.isHorizontalMove = isHorizontalMove;
    bridge.isDiagonalMove = isDiagonalMove;
    bridge.toString = toString;

    window.Game = bridge;
})();
