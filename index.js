(function() {
    var isWaterMode = false;
    var isCharacterMode = false;
    var isAttackMode = false;

    var characterTemplate = $("#character-template");

    var controlsContainer = $(".container-controls");
    var charactersContainer = $(".container-characters");
    var fieldsContainer = $(".container-fields");
    var playerSelect = $(".select-player");
    var attackButton = $(".attack-button");

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

            Ui.setMode(mode);
        });

        var asset = Field.ASSETS[type];
        var img = Ui.getImageForAsset(asset);

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
                data[Ui.MODE_DATA_PLAYER] = parseInt(playerSelect.val());
            } else {
                mode = Ui.MODE_MOVE;
            }

            Ui.setMode(mode, data);
        });

        var player = playerSelect.val();
        var asset = Character.ASSETS[type];
        var img = Ui.getImageForAsset(asset, {
            player: player
        });

        var imageElement = $(img);
        imageElement.addClass("controls-image");

        characterContainer.prepend(imageElement);

        container.append(characterContainer);
    }

    var uiPromise = Ui.initialize();

    var currentPlayer;
    var urlHash = window.location.hash.substring(1);
    if (urlHash) {
        currentPlayer = parseInt(urlHash);
    } else {
        // TODO: ask which player
        console.warn("choose player by appending a hash to the url and reloading");
    }

    uiPromise.done(function() {
        Ui.setCurrentPlayer(currentPlayer);

        Game.initialize(15, currentPlayer);

        Ui.render();

        Ui.setMode(Ui.MODE_MOVE);

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
            Ui.setMode(mode);
        });

        $(".loading").addClass("hidden");
        $("#canvas").removeClass("hidden");
        $(".container-controls").removeClass("hidden");
    });
})();
