

var Game = {
    name: "Ascii Pong",
    path: "games/asciipong",
    load: function() {
        // Load the game mechanics
        $.getScript(Game.path + "/Mechanics.js");
        
        // Load the game assets
        $.ajax({
            url: Game.path + "/Assets.sprite",
            type: "GET",
            dataType: "text/plain",
            statusCode: {
                200: function(assets) {
                    $.each(assets.responseText.split("__ASSET__"), function(i, asset) {
                        if (asset != "") {
                            var type = asset.split("\n__BEGIN__\n")[0].split("_")[0];
                            var titre = asset.split("\n__BEGIN__\n")[0].split("_")[1];
                            var sprite = asset.split("\n__BEGIN__\n")[1];
                            
                            if (type == "bg") {
                                Game.Assets.bg[titre] = sprite;
                            } else {
                                Game.Assets.sprites[titre] = { normal: sprite.split("\n__BLINK__\n")[0], blink: sprite.split("\n__BLINK__\n")[1] };
                            }
                            
                            // Load the first background
                            Core.load_bg("title");
                            
                            // And fire up the story!
                            $.getScript(Game.path + "/Story.js");
                        }
                    });
                }
            }
        });
    },
    Assets: {
        bg: { },
        sprites: { }
    }
};

var Core = {
    current_bg: "",
    screen: $("#screen"),
    sprites: {},
    start: function() {
        Game.load();
    },
    load_bg: function(bg) {
        Core.screen.find("pre").empty().text(Game.Assets.bg[bg]);
    },
    load_sprite: function(options) {
        options = $.extend({
            x: 50,
            y: 50,
        }, options);
        
        console.log(options);
        
        div = $("<div></div>")
            .append(
                $("<pre></pre>")
                .text(Game.Assets.sprites[options.sprite].normal)
                .hover(function () {
                    $(this).text(Game.Assets.sprites[options.sprite].blink);
                }, function() {
                    $(this).text(Game.Assets.sprites[options.sprite].normal);
                })
            )
            .css({
                position: "absolute",
                top: options.x + "px",
                left: options.y + "px",
            })
        
        Core.screen.append(div);
        Core.sprites[options.sprite] = div;
    }
};
