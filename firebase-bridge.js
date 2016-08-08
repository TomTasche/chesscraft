(function() {
    var roomName;

    function initialize(roomNameParameter) {
        roomName = roomNameParameter;

        var config = {
            apiKey: "AIzaSyChfGnCCVcaxLEPwyt3Ca_xjkfpPwdkeXk",
            authDomain: "chesscraft-b855a.firebaseapp.com",
            databaseURL: "https://chesscraft-b855a.firebaseio.com",
            storageBucket: "chesscraft-b855a.appspot.com"
        };
        firebase.initializeApp(config);
    }

    function saveGame() {
        var state = Master.toState();
        firebase.database().ref("games/" + roomName).set(state);
    }

    function fetchGame() {
        firebase.database().ref("games/" + roomName).on("value", function(snapshot) {
            var state = snapshot.val();

            Master.fromState(state);
        });
    }

    var bridge = {};
    bridge.initialize = initialize;
    bridge.saveGame = saveGame;
    bridge.fetchGame = fetchGame;

    window.FirebaseBridge = bridge;
})();
