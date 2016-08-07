var Index = function(container, currentPlayer) {
    var isWaterMode = false;
    var isCharacterMode = false;
    var isAttackMode = false;

    var uiTemplate = $("#ui-template");
    var characterTemplate = $("#character-template");

    var controlsContainer;
    var charactersContainer;
    var fieldsContainer;
    var playerSelect;
    var attackButton;

    var ui;

    function addFieldControl(container, type, name) {
        var characterContainer = $(characterTemplate.html());

        var button = characterContainer.find(".controls-button");
        button.attr("value", type);
        button.text(name);

        button.click(function() {
            isWaterMode = !isWaterMode;
            isCharacterMode = false;
            isAttackMode = false;

            controlsContainer.find(".controls-button").removeClass("controls-button-active");
            button.toggleClass("controls-button-active", isWaterMode);

            var mode;
            if (isWaterMode) {
                mode = Ui.MODE_WATER;
            } else {
                mode = Ui.MODE_MOVE;
            }

            ui.setMode(mode);
        });

        var asset = Field.ASSETS[type];
        var img = ui.getImageForAsset(asset);

        var imageElement = $(img);
        imageElement.addClass("controls-image");

        characterContainer.prepend(imageElement);

        container.append(characterContainer);
    }

    function addPlayerControl(select, playerNumber) {
        var option = $("<option>");
        option.attr("value", playerNumber);
        option.text("Spieler " + playerNumber);

        select.append(option);
    }

    function addCharacterControl(container, type, name) {
        var characterContainer = $(characterTemplate.html());

        var button = characterContainer.find(".controls-button");
        button.attr("value", type);
        button.text(name);

        button.click(function() {
            isCharacterMode = !isCharacterMode;
            isWaterMode = false;
            isAttackMode = false;

            controlsContainer.find(".controls-button").removeClass("controls-button-active");
            button.toggleClass("controls-button-active", isCharacterMode);

            var mode;
            var data = {};
            if (isCharacterMode) {
                mode = Ui.MODE_CHARACTER;

                data[Ui.MODE_DATA_CHARACTER_TYPE] = type;
            } else {
                mode = Ui.MODE_MOVE;
            }

            ui.setMode(mode, data);
        });

        var player = playerSelect.val();
        var asset = Character.ASSETS[type];
        var img = ui.getImageForAsset(asset, {
            player: player
        });

        var imageElement = $(img);
        imageElement.addClass("controls-image");

        characterContainer.prepend(imageElement);

        container.append(characterContainer);
    }

    function initialize() {
        var uiElement = $(uiTemplate.html());

        controlsContainer = uiElement.find(".container-controls");
        charactersContainer = uiElement.find(".container-characters");
        fieldsContainer = uiElement.find(".container-fields");
        playerSelect = uiElement.find(".select-player");
        attackButton = uiElement.find(".attack-button");

        var canvas = uiElement.find(".canvas");

        container.append(uiElement);

        ui = new Ui();
        var uiPromise = ui.initialize(canvas, currentPlayer);
        uiPromise.done(function() {
            ui.render();

            ui.setMode(Ui.MODE_MOVE);

            addPlayerControl(playerSelect, currentPlayer);

            addCharacterControl(charactersContainer, Character.TYPE_ARCHER, "Bogenschütze");
            addCharacterControl(charactersContainer, Character.TYPE_KNIGHT, "Ritter");
            addCharacterControl(charactersContainer, Character.TYPE_PAWN, "Bauer");

            addFieldControl(fieldsContainer, Field.TYPE_WATER, "Wasser");

            attackButton.click(function() {
                isAttackMode = !isAttackMode;
                isCharacterMode = false;
                isWaterMode = false;

                controlsContainer.find(".controls-button").removeClass("controls-button-active");
                attackButton.toggleClass("controls-button-active", isAttackMode);

                var mode;
                if (isAttackMode) {
                    mode = Ui.MODE_ATTACK;
                } else {
                    mode = Ui.MODE_MOVE;
                }
                ui.setMode(mode);
            });

            uiElement.find(".loading").addClass("hidden");
            canvas.removeClass("hidden");
            uiElement.find(".container-controls").removeClass("hidden");
        });
    }

    initialize();
};
