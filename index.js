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
