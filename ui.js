(function() {
    var FIELD_SIZE = 50;
    var SEPARATOR_WIDTH = 0.5;
    var SELECTOR_WIDTH = 3;
    var CHARACTER_SIZE = FIELD_SIZE;

    var MODE_MOVE = "move";
    var MODE_WALL = "wall";
    var MODE_CHARACTER = "character";

    var MODE_DATA_CHARACTER_TYPE = "characterType";
    var MODE_DATA_PLAYER = "player";

    var canvas;
    var images;

    var selectedCharacter;

    var currentMode;
    var currentModeData;

    function initialize() {
        var future = $.Deferred();

        canvas = $("#canvas");
        images = {};

        var assets = [];

        assets.push("king_1.png");
        assets.push("king_2.png");
        assets.push("queen_1.png");
        assets.push("queen_2.png");
        assets.push("rook_1.png");
        assets.push("rook_2.png");
        assets.push("bishop_1.png");
        assets.push("bishop_2.png");
        assets.push("knight_1.png");
        assets.push("knight_2.png");
        assets.push("pawn_1.png");
        assets.push("pawn_2.png");

        assets.push("grass_1.png");
        assets.push("grass_2.png");
        assets.push("grass_3.png");
        assets.push("wall.png");

        var imagePromises = [];
        for (var i = 0; i < assets.length; i++) {
            var asset = assets[i];

            var promise = loadAsset(asset);
            imagePromises.push(promise);
        }

        $.when.apply($, imagePromises).done(function() {
            canvas.removeClass("hidden");
            $(".loading").addClass("hidden");

            future.resolve();
        });

        return future.promise();
    }

    function loadAsset(asset) {
        var future = $.Deferred();

        var img = new Image();

        img.addEventListener("load", function() {
            future.resolve();
        }, false);

        img.src = "img/" + asset;

        images[asset] = img;

        return future.promise();
    }

    function calculateDistance(position) {
        var distance = position * FIELD_SIZE + position * SEPARATOR_WIDTH;

        return distance;
    }

    function calculateCharacterDistance(position) {
        return calculateDistance(position) + 10;
    }

    function calculateGridDistance(position) {
        return calculateDistance(position);
    }

    function onCanvasClicked(event) {
        var clickX;
        var clickY;
        if (event.pageX || event.pageY) {
            clickX = event.pageX;
            clickY = event.pageY;
        } else {
            clickX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            clickY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        clickX -= canvas[0].offsetLeft;
        clickY -= canvas[0].offsetTop;

        var x = Math.floor(clickY / (FIELD_SIZE + SEPARATOR_WIDTH));
        var y = Math.floor(clickX / (FIELD_SIZE + SEPARATOR_WIDTH));

        if (currentMode === MODE_MOVE) {
            if (selectedCharacter) {
                Game.moveCharacter(selectedCharacter, x, y);

                selectedCharacter = null;
            } else {
                var grid = Game.getGrid();

                var field = grid[x][y];
                selectedCharacter = field.getOccupant();
            }
        } else if (currentMode === MODE_WALL) {
            var character = Game.getCharacter(x, y);
            if (!character) {
                Game.addWall(x, y);
            }
        } else if (currentMode === MODE_CHARACTER) {
            var characterType = currentModeData[MODE_DATA_CHARACTER_TYPE];
            var player = currentModeData[MODE_DATA_PLAYER];

            Game.addCharacter(player, characterType, x, y);
        }

        render();
    }

    // taken from: http://stackoverflow.com/a/1527820/198996
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getImageForAsset(asset, player) {
        asset = asset.replace("PLAYER", player);

        var random = getRandomInt(1, 3);
        asset = asset.replace("RANDOM", random);

        var img = images[asset];
        return img;
    }

    function render() {
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");

        canvas.addEventListener("click", onCanvasClicked, false);

        var length = calculateGridDistance(Game.getGridSize());

        canvas.width = length;
        canvas.height = length;

        var grid = Game.getGrid();
        var gridSize = Game.getGridSize();

        context.lineWidth = SELECTOR_WIDTH;

        for (var x = 0; x < gridSize; x++) {
            for (var y = 0; y < gridSize; y++) {
                var yDistance = calculateGridDistance(x);
                var xDistance = calculateGridDistance(y);

                var field = grid[x][y];
                var character = field.getOccupant();

                if (field.getType() !== Field.TYPE_PATH) {
                    // TODO: do not hardcode
                    var backgroundImage = getImageForAsset("grass_RANDOM.png");
                    context.drawImage(backgroundImage, xDistance, yDistance, CHARACTER_SIZE, CHARACTER_SIZE);
                }

                var fieldAsset = field.getAsset();
                var fieldImage = getImageForAsset(fieldAsset);
                context.drawImage(fieldImage, xDistance, yDistance, CHARACTER_SIZE, CHARACTER_SIZE);

                if (character) {
                    if (character === selectedCharacter) {
                        context.strokeStyle = "red";

                        context.strokeRect(xDistance, yDistance, CHARACTER_SIZE, CHARACTER_SIZE)
                    }

                    context.strokeStyle = "black";

                    var characterAsset = character.getAsset();
                    var characterImage = getImageForAsset(characterAsset, character.getPlayer());

                    context.drawImage(characterImage, xDistance, yDistance, CHARACTER_SIZE, CHARACTER_SIZE);
                }
            }
        }

        context.beginPath();
        context.lineWidth = SEPARATOR_WIDTH;
        context.strokeStyle = "black";

        for (var i = 0; i <= Game.getGridSize(); i++) {
            var distance = calculateGridDistance(i);

            context.moveTo(distance, 0);
            context.lineTo(distance, length);

            context.moveTo(0, distance);
            context.lineTo(length, distance);
        }

        context.stroke();
    }

    function setMode(mode, data) {
        currentMode = mode;
        currentModeData = data;
    }

    var bridge = {};

    bridge.initialize = initialize;
    bridge.render = render;
    bridge.setMode = setMode;

    bridge.MODE_MOVE = MODE_MOVE;
    bridge.MODE_WALL = MODE_WALL;
    bridge.MODE_CHARACTER = MODE_CHARACTER;

    bridge.MODE_DATA_CHARACTER_TYPE = MODE_DATA_CHARACTER_TYPE;
    bridge.MODE_DATA_PLAYER = MODE_DATA_PLAYER;

    window.Ui = bridge;
})();
