(function() {
    var ASSETS = {};

    var clazz = function(type) {
        var occupant;

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
        bridge.toString = toString;

        return bridge;
    };
    clazz.TYPE_GRASS = "grass";
    clazz.TYPE_WATER = "water";

    ASSETS[clazz.TYPE_GRASS] = "grass_RANDOM.png";
    ASSETS[clazz.TYPE_WATER] = "water.png";

    clazz.ASSETS = ASSETS;

    window.Field = clazz;
})();
