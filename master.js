(function() {
    var yourTurnListeners = {};
    var changeListeners = [];

    var playersTurn = 0;

    function initialize() {
        Game.initialize(15);
    }

    function fromState(state) {
        if (state) {
            playersTurn = state.playersTurn;

            var gridSize = state.size;
            Game.initialize(gridSize);

            Game.fromState(state.game);
        }

        nextTurn();

        callChangeListeners();
    }

    function toState() {
        var state = {};
        state.size = Game.getGridSize();
        state.playersTurn = playersTurn;

        var gameState = Game.toState();
        state.game = gameState;

        return state;
    }

    function finishTurn() {
        FirebaseBridge.saveGame();

        nextTurn();
    }

    function nextTurn() {
        playersTurn = playersTurn % 2;
        playersTurn++;

        callYourTurnListeners(playersTurn);
    }

    function moveCallback(character, newX, newY) {
        Game.moveCharacter(character, newX, newY);

        finishTurn();
    }

    function attackCallback(character, enemyX, enemyY) {
        Game.attack(character, enemyX, enemyY);

        finishTurn();
    }

    function spawnCharacterCallback(player, type, x, y) {
        Game.addCharacter(player, type, x, y);

        finishTurn();
    }

    function spawnFieldCallback(player, type, x, y) {
        if (type === Field.TYPE_WATER) {
            Game.addWater(player, x, y);
        } else {
            console.error("not implemented");
        }

        finishTurn();
    }

    function callChangeListeners() {
        var listeners = changeListeners;
        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];

            listener();
        }
    }

    function callYourTurnListeners(player) {
        var listeners = yourTurnListeners[player];
        if (!listeners) {
            return;
        }

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

    function addOnChangeListener(listener) {
        changeListeners.push(listener);
    }

    var bridge = {};
    bridge.initialize = initialize;
    bridge.addOnYourTurnListener = addOnYourTurnListener;
    bridge.addOnChangeListener = addOnChangeListener;
    bridge.nextTurn = nextTurn;
    bridge.toState = toState;
    bridge.fromState = fromState;

    window.Master = bridge;
})();
