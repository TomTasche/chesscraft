(function() {
    var FIELD_SIZE = 50;
    var SEPARATOR_WIDTH = 0.5;
    var CHARACTER_SIZE = 30;

    var canvas;

    var symbols;
    var imageCache;

    var selectedCharacter;

    function initialize() {
        canvas = $("#canvas");

        symbols = {};

        symbols[Character.TYPE_KING] = "\u265A";
        symbols[Character.TYPE_QUEEN] = "\u265B";
        symbols[Character.TYPE_ROOK] = "\u265C";
        symbols[Character.TYPE_BISHOP] = "\u265D";
        symbols[Character.TYPE_KNIGHT] = "\u265E";
        symbols[Character.TYPE_PAWN] = "\u265F";

        symbols[Field.TYPE_WALL] = "🔥";

        imageCache = [];
        var imagePromises = [];
        for (var type in symbols) {
            var symbol = symbols[type];

            var img = loadEmojiImage(symbol);
            if (img) {
                imageCache.push(img);

                var imagePromise = waitForImage(img);
                imagePromises.push(imagePromise);
            }
        }

        $.when.apply($, imagePromises).done(function() {
            canvas.removeClass("hidden");
            $(".loading").addClass("hidden");
        });
    }

    function waitForImage(img) {
        var future = $.Deferred();

        img.addEventListener("load", function() {
            future.resolve();
        }, false);

        return future.promise();
    }

    function calculateDistance(position) {
        var distance = position * FIELD_SIZE + position * SEPARATOR_WIDTH;

        return distance;
    }

    function calculateCharacterDistance(position) {
        return calculateDistance(position) + 10;
    }

    function calculateGridDistance(position) {
        return calculateDistance(position);
    }

    function onCanvasClicked(event) {
        var clickX;
        var clickY;
        if (event.pageX || event.pageY) {
            clickX = event.pageX;
            clickY = event.pageY;
        } else {
            clickX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            clickY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        clickX -= canvas[0].offsetLeft;
        clickY -= canvas[0].offsetTop;

        var x = Math.floor(clickY / (FIELD_SIZE + SEPARATOR_WIDTH));
        var y = Math.floor(clickX / (FIELD_SIZE + SEPARATOR_WIDTH));

        if (selectedCharacter) {
            Game.moveCharacter(selectedCharacter, x, y);

            selectedCharacter = null;
        } else {
            var grid = Game.getGrid();

            var field = grid[x][y];
            selectedCharacter = field.getOccupant();
        }

        render();
    }

    function loadEmojiImage(symbol) {
        var twemojiHtml = twemoji.parse(symbol);
        var twemojiUrl = $(twemojiHtml).filter("img").attr("src");

        if (twemojiUrl) {
            var img = new Image();
            img.src = twemojiUrl;

            return img;
        }

        return null;
    }

    function renderSymbol(context, symbol, xDistance, yDistance) {
        var img = loadEmojiImage(symbol);
        if (img) {
            img.addEventListener("load", function() {
                context.drawImage(img, xDistance, yDistance, CHARACTER_SIZE, CHARACTER_SIZE);
            }, false);
        } else {
            context.fillText(symbol, xDistance, yDistance, CHARACTER_SIZE);
        }
    }

    function render() {
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");

        canvas.addEventListener("click", onCanvasClicked, false);

        var length = calculateGridDistance(Game.getGridSize());

        canvas.width = length;
        canvas.height = length;

        context.lineWidth = SEPARATOR_WIDTH;
        context.strokeStyle = "black";
        context.beginPath();

        for (var i = 0; i <= Game.getGridSize(); i++) {
            var distance = calculateGridDistance(i);

            context.moveTo(distance, 0);
            context.lineTo(distance, length);

            context.moveTo(0, distance);
            context.lineTo(length, distance);
        }

        context.stroke();

        context.lineWidth = 1;
        context.font = CHARACTER_SIZE + "px serif";
        context.textBaseline = "top"

        var grid = Game.getGrid();
        var gridSize = Game.getGridSize();

        for (var x = 0; x < gridSize; x++) {
            for (var y = 0; y < gridSize; y++) {
                var yDistance = calculateCharacterDistance(x);
                var xDistance = calculateCharacterDistance(y);

                var field = grid[x][y];
                var character = field.getOccupant();

                context.fillStyle = "#000000";

                var type;
                if (character) {
                    if (character === selectedCharacter) {
                        context.fillStyle = "#ff0000";
                    }

                    type = character.getType();
                } else {
                    type = field.getType();
                }

                symbol = symbols[type];
                if (symbol) {
                    renderSymbol(context, symbol, xDistance, yDistance);
                }
            }
        }
    }

    var bridge = {};

    bridge.initialize = initialize;
    bridge.render = render;

    window.Ui = bridge;
})();
