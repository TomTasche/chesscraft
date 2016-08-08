(function() {
    var hash = window.location.hash;
    var hashParts = hash.split("#");

    var roomName = hashParts[1];
    if (!roomName) {
        roomName = window.prompt("Welchem Raum willst du beitreten?");
    }

    var player = hashParts[2];
    if (!player) {
        player = window.prompt("Welcher Spieler bist du? (1-2)");
    }

    FirebaseBridge.initialize(roomName);

    Master.initialize();

    var playerNumber = parseInt(player);
    var ui = new Ui(playerNumber);

    var uiPromise = ui.initialize();
    uiPromise.done(function() {
        FirebaseBridge.fetchGame();
    });
})();
