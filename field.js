var Field = function(type) {
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
Field.TYPE_PATH = "path";
Field.TYPE_WALL = "wall";
