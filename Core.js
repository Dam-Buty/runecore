

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
                    // loads all assets in memory
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
                            
                            // Loads the first background
                            Core.load_bg("title");
                        }
                    });
                    
                    // And fires up the story!
                    $.getScript(Game.path + "/Story.js", function() {
                        Story.start();
                    });
                    
                    return Game;
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
    screen: {
        sel: $("#screen"),
        pre: $("#screen pre"),
        width: function() {
            return this.pre.innerWidth();
        },
        height: function() {
            return this.pre.innerHeight();
        }
    },
    sprites: {},
    start: function() {
        Game.load();
    },
    load_bg: function(bg) {
        Core.screen.sel.find("pre").empty().text(Game.Assets.bg[bg]);
        Core.current_bg = bg;
        
        var max_width = Game.Assets.bg[bg].split("\n").sort(function (a, b) { return b.length - a.length; })[0].length;
        
        $("#screen pre").css("width", max_width + "ch");
    },
    load_sprite: function(options) {
        options = $.extend({
            x: 50,
            y: 50,
        }, options);
        var sprite = Game.Assets.sprites[options.sprite];
        
        div = $("<div></div>")
            .append(
                $("<pre></pre>")
                .text(sprite.normal)
            )
            .css({
                position: "absolute",
                top: options.x + "px",
                left: options.y + "px",
            })
            .addClass("sprites");
        
        Core.screen.sel.append(div);
        Core.sprites[options.sprite] = $.extend(proto_sprite, { sel: div }, sprite);
        
        return Core.sprites[options.sprite];
    }
};

var proto_sprite = {
    sel: "",
    normal: "",
    blink: "",
    center: function(animate, time) {
        if (animate) {
            this.sel.animate({
                top: (Core.screen.height() - this.sel.outerHeight()) / 2 + "px",
                left: (Core.screen.width() - this.sel.outerWidth()) / 2 + "px"
            }, time || 1000)
        }
        return this;
    },
    blinkable: function() {
        sprite = this;
        this.sel.find("pre")
        .hover(function () {
            $(this).text(sprite.blink);
        }, function() {
            $(this).text(sprite.normal);
        });
        
        return this;
    },
    clickable: function(callback) {
        this.sel.css("cursor", "pointer");
        this.sel.click(callback);
    }
}
