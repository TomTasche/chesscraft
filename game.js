(function() {
    var grid = [];

    function initialize(gridSize) {
        for (var i = 0; i < gridSize; i++) {
            var row = [];
            for (var j = 0; j < gridSize; j++) {
                var field = new Field(Field.TYPE_PATH);

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
        field.setType(Field.TYPE_WALL);
    }

    function getCharacter(x, y) {
        return grid[x][y].getOccupant();
    }

    function isMovePossible(character, newX, newY) {
        var gridSize = Game.getGridSize();

        if (character.getX() === newX && character.getY() === newY) {
            return true;
        }

        var isOutOfBounds = Math.abs(newX) >= gridSize || Math.abs(newY) >= gridSize;
        if (isOutOfBounds) {
            return false;
        }

        var field = grid[newX][newY];
        if (field.getType() !== Field.TYPE_PATH) {
            return false;
        }

        return character.isMovePossible(newX, newY);
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
    bridge.toString = toString;

    window.Game = bridge;
})();
