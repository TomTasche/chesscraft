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

        function getAsset() {
          return ASSETS[type];
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
        bridge.getAsset = getAsset;
        bridge.toString = toString;

        return bridge;
    };
    clazz.TYPE_PATH = "path";
    clazz.TYPE_WALL = "wall";

    ASSETS[clazz.TYPE_PATH] = "grass_RANDOM.png";
    ASSETS[clazz.TYPE_WALL] = "wall.png";

    window.Field = clazz;
})();
