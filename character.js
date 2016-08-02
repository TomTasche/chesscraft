(function() {
    var ASSETS = {};

    var clazz = function(player, type) {
        var x;
        var y;

        var moved;

        function getX() {
            return x;
        }

        function setX(xParameter) {
            x = xParameter;
        }

        function getY() {
            return y;
        }

        function setY(yParameter) {
            y = yParameter;
        }

        function getType() {
            return type;
        }

        function getPlayer() {
            return player;
        }

        function isMovePossible(newX, newY) {
            if (type === Character.TYPE_ARCHER) {
                var diagonalMove = Game.isDiagonalMove(x, y, newX, newY);
                if (!diagonalMove) {
                    return false;
                }
            } else if (type === Character.TYPE_KNIGHT) {
                var deltaX = Math.abs(x - newX);
                var deltaY = Math.abs(y - newY);

                var oneMove = (deltaX === 2 && deltaY === 1);
                var anotherMove = (deltaX === 1 && deltaY === 2);

                if (!oneMove && !anotherMove) {
                    return false;
                }
            } else if (type === Character.TYPE_PAWN) {
                var deltaX = x - newX;
                var deltaY = y - newY;

                var forwardMove = (deltaY === 0 && deltaX === 1);
                if (!forwardMove && !moved) {
                    forwardMove = (deltaY === 0 && deltaX === 2);
                }

                var attackingMove;
                if (deltaX === 1 && deltaY === 1) {
                    var otherCharacter = Game.getCharacter(newX, newY);
                    attackingMove = (otherCharacter && otherCharacter.player !== player);
                }

                if (!forwardMove && !attackingMove) {
                    return false;
                }
            } else {
                return false;
            }

            moved = true;

            return true;
        }

        function getAsset() {
            return ASSETS[type];
        }

        function toString() {
            return type;
        }

        var bridge = {};

        bridge.getX = getX;
        bridge.setX = setX;
        bridge.getY = getY;
        bridge.setY = setY;
        bridge.getType = getType;
        bridge.getPlayer = getPlayer;
        bridge.isMovePossible = isMovePossible;
        bridge.getAsset = getAsset;
        bridge.toString = toString;

        return bridge;
    };
    clazz.TYPE_ARCHER = "archer";
    clazz.TYPE_KNIGHT = "knight";
    clazz.TYPE_PAWN = "pawn";

    ASSETS[clazz.TYPE_ARCHER] = "archer_PLAYER.png";
    ASSETS[clazz.TYPE_KNIGHT] = "knight_PLAYER.png";
    ASSETS[clazz.TYPE_PAWN] = "pawn_PLAYER.png";

    window.Character = clazz;
})();
