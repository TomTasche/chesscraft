(function() {
    var isWallMode = false;
    var isCharacterMode = false;

    var wallButton = $(".button-place-walls");
    var characterButton = $(".button-place-character");

    var playerSelect = $(".select-player");
    var characterSelect = $(".select-character");

    function addPlayer(select, playerNumber) {
        var option = $("<option>");
        option.attr("value", playerNumber);
        option.text("Spieler " + playerNumber);

        select.append(option);
    }

    function addCharacter(select, type, name) {
        var option = $("<option>");
        option.attr("value", type);
        option.text(name);

        select.append(option);
    }

    function toggleWallMode() {
        var text;
        var mode;
        if (isWallMode) {
            text = "Mauer platzieren beenden.";
            mode = Ui.MODE_WALL;
        } else {
            text = "Mauer platzieren...";
            mode = Ui.MODE_MOVE;
        }
        wallButton.text(text);

        Ui.setMode(mode);
    }

    function toggleCharacterMode() {
        var text;
        var mode;
        if (isCharacterMode) {
            text = "Figur platzieren beenden.";
            mode = Ui.MODE_CHARACTER;
        } else {
            text = "Figur platzieren...";
            mode = Ui.MODE_MOVE;
        }
        characterButton.text(text);

        var data = {};
        data[Ui.MODE_DATA_CHARACTER_TYPE] = characterSelect.val();
        data[Ui.MODE_DATA_PLAYER] = playerSelect.val();

        Ui.setMode(mode, data);
    }

    Game.initialize(10);
    var uiPromise = Ui.initialize();

    Game.addCharacter(1, Character.TYPE_ROOK, 0, 1);
    Game.addCharacter(2, Character.TYPE_BISHOP, 4, 3);

    Game.addWall(1, 2);

    var rookCharacter = Game.getCharacter(0, 1);
    var bishopCharacter = Game.getCharacter(4, 3);

    Game.moveCharacter(rookCharacter, 1, 1);
    Game.moveCharacter(bishopCharacter, 1, 0);

    Game.moveCharacter(rookCharacter, 1, 2);

    uiPromise.done(function() {
        Ui.render();
    });

    Ui.setMode(Ui.MODE_MOVE);

    toggleWallMode();
    wallButton.click(function() {
        isWallMode = !isWallMode;
        isCharacterMode = false;

        toggleCharacterMode();
        toggleWallMode();
    });

    toggleCharacterMode();
    characterButton.click(function() {
        isCharacterMode = !isCharacterMode;
        isWallMode = false;

        toggleWallMode();
        toggleCharacterMode();
    });

    addPlayer(playerSelect, 1);
    addPlayer(playerSelect, 2);

    addCharacter(characterSelect, Character.TYPE_KING, "König");
    addCharacter(characterSelect, Character.TYPE_QUEEN, "Dame");
    addCharacter(characterSelect, Character.TYPE_ROOK, "Turm");
    addCharacter(characterSelect, Character.TYPE_BISHOP, "Läufer");
    addCharacter(characterSelect, Character.TYPE_KNIGHT, "Springer");
    addCharacter(characterSelect, Character.TYPE_PAWN, "Bauer");
})();
