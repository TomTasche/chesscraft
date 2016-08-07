(function() {
    var yourTurnListeners = {};

    var playersTurn = 0;

    function nextTurn() {
        playersTurn = playersTurn % 2;
        playersTurn++;

        callYourTurnListeners(playersTurn);
    }

    function moveCallback(character, newX, newY) {
        Game.moveCharacter(character, newX, newY);

        nextTurn();
    }

    function attackCallback(character, enemyX, enemyY) {
        Game.attack(character, enemyX, enemyY);

        nextTurn();
    }

    function spawnCharacterCallback(player, type, x, y) {
        Game.addCharacter(player, type, x, y);

        nextTurn();
    }

    function spawnFieldCallback(player, type, x, y) {
        if (type === Field.TYPE_WATER) {
            Game.addWater(player, x, y);
        } else {
            console.error("not implemented");
        }

        nextTurn();
    }

    function callYourTurnListeners(player) {
        var listeners = yourTurnListeners[player];
        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];

            listener(moveCallback, attackCallback, spawnCharacterCallback, spawnFieldCallback);
        }
    }

    function addOnYourTurnListener(player, listener) {
        var listeners = yourTurnListeners[player];
        if (!listeners) {
            listeners = [];

            yourTurnListeners[player] = listeners;
        }

        listeners.push(listener);
    }

    var bridge = {};
    bridge.addOnYourTurnListener = addOnYourTurnListener;
    bridge.nextTurn = nextTurn;

    window.Master = bridge;
})();
