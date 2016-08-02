(function() {
    var isWaterMode = false;
    var isCharacterMode = false;

    var characterTemplate = $("#character-template");

    var controlsContainer = $(".container-controls");
    var charactersContainer = $(".container-characters");
    var fieldsContainer = $(".container-fields");
    var playerSelect = $(".select-player");

    function addField(container, type, name) {
        var characterContainer = $(characterTemplate.html());

        var button = characterContainer.find(".character-button");
        button.attr("value", type);
        button.text(name);

        button.click(function() {
            isWaterMode = !isWaterMode;
            isCharacterMode = false;

            controlsContainer.find(".character-button").removeClass("character-button-active");
            button.toggleClass("character-button-active", isWaterMode);

            toggleCharacterMode();
            toggleWaterMode();
        });

        var asset = Field.ASSETS[type];
        var img = Ui.getImageForAsset(asset);

        characterContainer.prepend(img);

        container.append(characterContainer);
    }

    function addPlayer(select, playerNumber) {
        var option = $("<option>");
        option.attr("value", playerNumber);
        option.text("Spieler " + playerNumber);

        select.append(option);
    }

    function addCharacter(container, type, name) {
        var characterContainer = $(characterTemplate.html());

        var button = characterContainer.find(".character-button");
        button.attr("value", type);
        button.text(name);

        button.click(function() {
            isCharacterMode = !isCharacterMode;
            isWaterMode = false;

            controlsContainer.find(".character-button").removeClass("character-button-active");
            button.toggleClass("character-button-active", isCharacterMode);

            toggleWaterMode();
            toggleCharacterMode(type);
        });

        var player = playerSelect.val();
        var asset = Character.ASSETS[type];
        var img = Ui.getImageForAsset(asset, player);

        characterContainer.prepend(img);

        container.append(characterContainer);
    }

    function toggleWaterMode() {
        var mode;
        if (isWaterMode) {
            mode = Ui.MODE_WATER;
        } else {
            mode = Ui.MODE_MOVE;
        }

        Ui.setMode(mode);
    }

    function toggleCharacterMode(type) {
        var mode;
        var data = {};
        if (isCharacterMode) {
            mode = Ui.MODE_CHARACTER;

            data[Ui.MODE_DATA_CHARACTER_TYPE] = type;
            data[Ui.MODE_DATA_PLAYER] = playerSelect.val();
        } else {
            mode = Ui.MODE_MOVE;
        }

        Ui.setMode(mode, data);
    }

    Game.initialize(10);
    var uiPromise = Ui.initialize();

    Game.addCharacter(1, Character.TYPE_KNIGHT, 0, 1);
    Game.addCharacter(2, Character.TYPE_ARCHER, 4, 3);

    Game.addWater(1, 2);

    var character = Game.getCharacter(4, 3);
    Game.moveCharacter(character, 1, 0);

    uiPromise.done(function() {
        Ui.render();

        Ui.setMode(Ui.MODE_MOVE);

        addPlayer(playerSelect, 1);
        addPlayer(playerSelect, 2);

        addCharacter(charactersContainer, Character.TYPE_ARCHER, "Bogenschütze");
        addCharacter(charactersContainer, Character.TYPE_KNIGHT, "Ritter");
        addCharacter(charactersContainer, Character.TYPE_PAWN, "Bauer");

        addField(fieldsContainer, Field.TYPE_WATER, "Wasser");

        $(".loading").addClass("hidden");
        $("#canvas").removeClass("hidden");
        $(".container-controls").removeClass("hidden");
    });
})();
