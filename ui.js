(function() {
    var FIELD_SIZE = 50;
    var SEPARATOR_WIDTH = 0.5;
    var SELECTOR_WIDTH = 3;
    var CHARACTER_SIZE = FIELD_SIZE;
    var FOG_SIZE = CHARACTER_SIZE + 30;

    var MODE_MOVE = "move";
    var MODE_WATER = "water";
    var MODE_CHARACTER = "character";
    var MODE_ATTACK = "attack";

    var MODE_DATA_CHARACTER_TYPE = "characterType";
    var MODE_DATA_PLAYER = "player";

    var canvas;
    var images;

    var selectedCharacter;

    var currentPlayer;
    var currentMode;
    var currentModeData;

    function initialize() {
        var future = $.Deferred();

        canvas = $("#canvas");
        images = {};

        var assets = [];

        assets.push("archer_1.png");
        assets.push("archer_2.png");
        assets.push("knight_1.png");
        assets.push("knight_2.png");
        assets.push("pawn_1.png");
        assets.push("pawn_2.png");

        assets.push("grass_1.png");
        assets.push("grass_2.png");
        assets.push("grass_3.png");

        assets.push("water.png");
        assets.push("water_N.png");
        assets.push("water_E.png");
        assets.push("water_S.png");
        assets.push("water_W.png");
        assets.push("water_N_S.png");
        assets.push("water_E_W.png");
        assets.push("water_E_S.png");
        assets.push("water_E_S_W.png");
        assets.push("water_N_E.png");
        assets.push("water_N_E_S.png");
        assets.push("water_N_E_W.png");
        assets.push("water_N_S_W.png");
        assets.push("water_N_W.png");
        assets.push("water_S_W.png");

        assets.push("fog_1.png");
        assets.push("fog_2.png");
        assets.push("fog_3.png");
        assets.push("fog_4.png");
        assets.push("fog_5.png");
        assets.push("fog_6.png");
        assets.push("fog_7.png");
        assets.push("fog_8.png");

        var imagePromises = [];
        for (var i = 0; i < assets.length; i++) {
            var asset = assets[i];

            var promise = loadAsset(asset);
            imagePromises.push(promise);
        }

        $.when.apply($, imagePromises).done(function() {
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

    function setCurrentPlayer(currentPlayerParameter) {
        currentPlayer = currentPlayerParameter;
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

        var dirty = false;

        if (currentMode === MODE_MOVE) {
            if (selectedCharacter) {
                Game.moveCharacter(selectedCharacter, x, y);

                selectedCharacter = null;

                dirty = true;
            } else {
                var grid = Game.getGrid();

                var field = grid[x][y];
                selectedCharacter = field.getOccupant();
            }
        } else if (currentMode === MODE_ATTACK) {
            if (selectedCharacter) {
                Game.attack(selectedCharacter, x, y);

                selectedCharacter = null;

                dirty = true;
            } else {
                var grid = Game.getGrid();

                var field = grid[x][y];
                selectedCharacter = field.getOccupant();
            }
        } else if (currentMode === MODE_WATER) {
            var character = Game.getCharacter(x, y);
            if (!character) {
                Game.addWater(x, y);

                dirty = true;
            }
        } else if (currentMode === MODE_CHARACTER) {
            var characterType = currentModeData[MODE_DATA_CHARACTER_TYPE];
            var player = currentModeData[MODE_DATA_PLAYER];

            Game.addCharacter(player, characterType, x, y);

            dirty = true;
        }

        if (selectedCharacter) {
            if (selectedCharacter.getPlayer() !== currentPlayer) {
                selectedCharacter = null;
            }
        }

        if (dirty) {
            render();
        }
    }

    // taken from: http://stackoverflow.com/a/1527820/198996
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getImageForAsset(asset, metadata) {
        metadata = metadata || {};

        var player = metadata.player;
        asset = asset.replace("PLAYER", player);

        var random3 = getRandomInt(1, 3);
        asset = asset.replace("RANDOM3", random3);

        var random8 = getRandomInt(1, 8);
        asset = asset.replace("RANDOM8", random8);

        var direction = metadata.direction;
        asset = asset.replace("DIRECTION", direction);

        var img = images[asset];
        return img;
    }

    function isWater(x, y) {
        var gridSize = Game.getGridSize();

        var isOutOfBounds = Math.abs(x) >= gridSize || Math.abs(y) >= gridSize || x < 0 || y < 0;
        if (isOutOfBounds) {
            return false;
        }

        return Game.getGrid()[x][y].getType() === Field.TYPE_WATER;
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

                var fieldMetadata;
                if (field.getType() === Field.TYPE_WATER) {
                    fieldMetadata = {};

                    var direction = "";
                    if (isWater(x - 1, y)) {
                        direction += "_N";
                    }
                    if (isWater(x, y + 1)) {
                        direction += "_E";
                    }
                    if (isWater(x + 1, y)) {
                        direction += "_S";
                    }
                    if (isWater(x, y - 1)) {
                        direction += "_W";
                    }

                    fieldMetadata.direction = direction;
                }

                var fieldAsset = Field.ASSETS[field.getType()];
                var fieldImage = getImageForAsset(fieldAsset, fieldMetadata);
                context.drawImage(fieldImage, xDistance, yDistance, CHARACTER_SIZE, CHARACTER_SIZE);

                if (character) {
                    var characterAsset = Character.ASSETS[character.getType()];
                    var characterImage = getImageForAsset(characterAsset, {
                        player: character.getPlayer()
                    });

                    context.drawImage(characterImage, xDistance, yDistance, CHARACTER_SIZE, CHARACTER_SIZE);

                    var color;
                    if (character === selectedCharacter) {
                        color = "blue";
                    } else {
                        if (character.getPlayer() === 1) {
                            color = "green";
                        } else {
                            color = "red";
                        }
                    }

                    context.save();
                    context.globalAlpha = 0.3;
                    context.fillStyle = color;

                    context.fillRect(xDistance, yDistance, CHARACTER_SIZE, CHARACTER_SIZE);
                    context.restore();

                    var healthString = character.getHealth() + " / " + character.getBaseHealth();
                    context.fillText(healthString, xDistance, yDistance + 45);
                }

                if (field.getFoggy()) {
                    var fogImage = getImageForAsset("fog_RANDOM8.png");
                    context.drawImage(fogImage, xDistance - 15, yDistance - 15, FOG_SIZE, FOG_SIZE);
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
    bridge.setCurrentPlayer = setCurrentPlayer;
    bridge.getImageForAsset = getImageForAsset;
    bridge.render = render;
    bridge.setMode = setMode;

    bridge.MODE_MOVE = MODE_MOVE;
    bridge.MODE_WATER = MODE_WATER;
    bridge.MODE_CHARACTER = MODE_CHARACTER;
    bridge.MODE_ATTACK = MODE_ATTACK;

    bridge.MODE_DATA_CHARACTER_TYPE = MODE_DATA_CHARACTER_TYPE;
    bridge.MODE_DATA_PLAYER = MODE_DATA_PLAYER;

    window.Ui = bridge;
})();
