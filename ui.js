var Ui = function(currentPlayer) {
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

    var statusElement;
    var canvasElement;
    var images;

    var controlsContainer;

    var selectedCharacter;

    var currentMode;
    var currentModeData;

    var turnFuture;

    function initialize() {
        Master.addOnYourTurnListener(currentPlayer, onYourTurn);
        Master.addOnChangeListener(onChange);

        var future = $.Deferred();

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

        var uiTemplate = $("#ui-template");

        var uiElement = $(uiTemplate.html());
        controlsContainer = uiElement.find(".container-controls");
        canvasElement = uiElement.find(".canvas");
        statusElement = uiElement.find(".status");

        $(".uis").append(uiElement);

        $.when.apply($, imagePromises).done(function() {
            render();

            setMode(MODE_MOVE);

            var playerSelect = uiElement.find(".select-player");
            addPlayerControl(playerSelect, currentPlayer);

            var controlTemplate = $("#control-template");

            var charactersContainer = uiElement.find(".container-characters");
            addCharacterControl(charactersContainer, controlTemplate, Character.TYPE_ARCHER, "Bogenschütze");
            addCharacterControl(charactersContainer, controlTemplate, Character.TYPE_KNIGHT, "Ritter");
            addCharacterControl(charactersContainer, controlTemplate, Character.TYPE_PAWN, "Bauer");

            var fieldsContainer = uiElement.find(".container-fields");
            addFieldControl(fieldsContainer, controlTemplate, Field.TYPE_WATER, "Wasser");

            var modesContainer = uiElement.find(".container-modes");
            addAttackControl(modesContainer, controlTemplate, "Angriff!");

            uiElement.find(".loading").addClass("hidden");
            canvasElement.removeClass("hidden");
            uiElement.find(".container-controls").removeClass("hidden");

            future.resolve();
        });

        return future.promise();
    }

    function addAttackControl(container, template, name) {
        var element = $(template.html());

        var button = element.find(".controls-button");
        button.text(name);

        button.click(function() {
            var isAttackMode = currentMode !== MODE_ATTACK;

            controlsContainer.find(".controls-button").removeClass("controls-button-active");
            button.toggleClass("controls-button-active", isAttackMode);

            var mode;
            if (isAttackMode) {
                mode = MODE_ATTACK;
            } else {
                mode = MODE_MOVE;
            }
            setMode(mode);
        });

        container.prepend(element);
    }

    function addFieldControl(container, template, type, name) {
        var element = $(template.html());

        var button = element.find(".controls-button");
        button.text(name);

        button.click(function() {
            var isWaterMode = currentMode !== MODE_WATER;

            controlsContainer.find(".controls-button").removeClass("controls-button-active");
            button.toggleClass("controls-button-active", isWaterMode);

            var mode;
            if (isWaterMode) {
                mode = MODE_WATER;
            } else {
                mode = MODE_MOVE;
            }

            setMode(mode);
        });

        var asset = Field.ASSETS[type];
        var img = getImageForAsset(asset, {
            direction: ""
        });

        var imageElement = $(img);
        imageElement.addClass("controls-image");

        element.prepend(imageElement);

        container.append(element);
    }

    function addPlayerControl(select, playerNumber) {
        var option = $("<option>");
        option.attr("value", playerNumber);
        option.text("Spieler " + playerNumber);

        select.append(option);
    }

    function addCharacterControl(container, template, type, name) {
        var element = $(template.html());

        var button = element.find(".controls-button");
        button.text(name);

        button.click(function() {
            var isCharacterMode = currentMode !== MODE_CHARACTER;

            controlsContainer.find(".controls-button").removeClass("controls-button-active");
            button.toggleClass("controls-button-active", isCharacterMode);

            var mode;
            var data = {};
            if (isCharacterMode) {
                mode = MODE_CHARACTER;

                data[MODE_DATA_CHARACTER_TYPE] = type;
            } else {
                mode = MODE_MOVE;
            }

            setMode(mode, data);
        });

        var asset = Character.ASSETS[type];
        var img = getImageForAsset(asset, {
            player: currentPlayer
        });

        var imageElement = $(img);
        imageElement.addClass("controls-image");

        element.prepend(imageElement);

        container.append(element);
    }

    function awaitNextTurn() {
        var future = $.Deferred();
        turnFuture = future;

        return future.promise();
    }

    function onYourTurn(moveCallback, attackCallback, spawnCharacterCallback, spawnFieldCallback) {
        statusElement.text("Du bist dran!");

        var promise = awaitNextTurn();
        promise.done(function(turn) {
            if (turn.mode === MODE_MOVE) {
                moveCallback(turn.character, turn.x, turn.y);
            } else if (turn.mode === MODE_ATTACK) {
                attackCallback(turn.character, turn.x, turn.y);
            } else if (turn.mode === MODE_WATER) {
                spawnFieldCallback(turn.player, Field.TYPE_WATER, turn.x, turn.y);
            } else if (turn.mode === MODE_CHARACTER) {
                spawnCharacterCallback(turn.player, turn.characterType, turn.x, turn.y);
            }

            statusElement.text("Guter Zug.");
        });
    }

    function onChange() {
        render();
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
        clickX -= canvasElement[0].offsetLeft;
        clickY -= canvasElement[0].offsetTop;

        var x = Math.floor(clickY / (FIELD_SIZE + SEPARATOR_WIDTH));
        var y = Math.floor(clickX / (FIELD_SIZE + SEPARATOR_WIDTH));

        var turned = false;
        var turn = {};
        if (currentMode === MODE_MOVE) {
            if (selectedCharacter) {
                turn.character = selectedCharacter;
                turn.mode = MODE_MOVE;
                turn.x = x;
                turn.y = y;

                selectedCharacter = null;

                turned = true;
            } else {
                var grid = Game.getGrid();

                var field = grid[x][y];
                selectedCharacter = field.getOccupant();
            }
        } else if (currentMode === MODE_ATTACK) {
            if (selectedCharacter) {
                turn.character = selectedCharacter;
                turn.mode = MODE_ATTACK;
                turn.x = x;
                turn.y = y;

                selectedCharacter = null;

                turned = true;
            } else {
                var grid = Game.getGrid();

                var field = grid[x][y];
                selectedCharacter = field.getOccupant();
            }
        } else if (currentMode === MODE_WATER) {
            turn.player = currentPlayer;
            turn.mode = MODE_WATER;
            turn.x = x;
            turn.y = y;
        } else if (currentMode === MODE_CHARACTER) {
            var characterType = currentModeData[MODE_DATA_CHARACTER_TYPE];

            turn.characterType = characterType;
            turn.player = currentPlayer;
            turn.mode = MODE_CHARACTER;
            turn.x = x;
            turn.y = y;

            turned = true;
        }

        if (selectedCharacter) {
            if (selectedCharacter.getPlayer() !== currentPlayer) {
                selectedCharacter = null;
            }
        }

        if (turnFuture && turned) {
            turnFuture.resolve(turn);
            turnFuture = null;
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
        var domCanvas = canvasElement[0];
        var context = domCanvas.getContext("2d");

        domCanvas.addEventListener("click", onCanvasClicked, false);

        var length = calculateGridDistance(Game.getGridSize());

        domCanvas.width = length;
        domCanvas.height = length;

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
                        if (character.getPlayer() === currentPlayer) {
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

                if (field.getFoggy(currentPlayer)) {
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

    Ui.MODE_MOVE = MODE_MOVE;
    Ui.MODE_WATER = MODE_WATER;
    Ui.MODE_CHARACTER = MODE_CHARACTER;
    Ui.MODE_ATTACK = MODE_ATTACK;

    Ui.MODE_DATA_CHARACTER_TYPE = MODE_DATA_CHARACTER_TYPE;

    return bridge;
};
