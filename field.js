(function() {
    var ASSETS = {};

    var clazz = function(type) {
        var occupant;

        var foggyForPlayer = {};

        function getOccupant() {
            return occupant;
        }

        function setOccupant(character) {
            occupant = character;
        }

        function getType() {
            return type;
        }

        function setType(typeParameter) {
            type = typeParameter;
        }

        function getFoggy(player) {
            return foggyForPlayer[player];
        }

        function setFoggy(player, foggyParameter) {
            foggyForPlayer[player] = foggyParameter;
        }

        function toString() {
            if (occupant) {
                return occupant.toString();
            } else {
                return "empty " + type;
            }
        }

        var bridge = {};
        bridge.getOccupant = getOccupant;
        bridge.setOccupant = setOccupant;
        bridge.getType = getType;
        bridge.setType = setType;
        bridge.getFoggy = getFoggy;
        bridge.setFoggy = setFoggy;
        bridge.toString = toString;

        return bridge;
    };
    clazz.TYPE_GRASS = "grass";
    clazz.TYPE_WATER = "water";

    ASSETS[clazz.TYPE_GRASS] = "grass_RANDOM3.png";
    ASSETS[clazz.TYPE_WATER] = "waterDIRECTION.png";

    clazz.ASSETS = ASSETS;

    window.Field = clazz;
})();
