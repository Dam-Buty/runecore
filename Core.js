

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
        width: function() { return this.pre.innerWidth(); },
        height: function() { return this.pre.innerHeight(); },
        offset: function() { // offset will not only provide top & left, but also right & bottom
            var offset = this.pre.offset(); 
            
            return $.extend(true, offset, {
                bottom: this.height() + offset.top,
                right: this.width() + offset.left
            });
        }
    },
    sprites: {},
    start: function() {
        Game.load();
    },
    load_bg: function(bg) {
        Core.screen.sel.find("pre").empty().text(Game.Assets.bg[bg]);
        Core.current_bg = bg;
        
        // get width of the widest line in the sprite
        var max_width = Game.Assets.bg[bg].split("\n").sort(function (a, b) { return b.length - a.length; })[0].length;
        
        $("#screen pre").css("width", max_width + "ch");
    },
    load_sprite: function(options) {
        options = $.extend(true, {
            id: options.sprite
        }, options);
        var sprite = Game.Assets.sprites[options.sprite];
        
        div = $("<div></div>")
            .append(
                $("<pre></pre>")
                .text(sprite.normal)
            )
            .attr("id", options.id)
            .addClass("sprites");
        
        Core.screen.pre.prepend(div);
        Core.sprites[options.id] = $.extend(true, { sel: div, pre: div.find("pre") }, sprite, _sprite);
        
        return Core.sprites[options.id];
    }
};

var _sprite = {
    height: function() {
        return this.sel.outerHeight();
    },
    width: function() {
        return this.sel.outerWidth();
    },
    center: function() {
        return {
            top: (Core.screen.height() - this.height()) / 2 + "px",
            left: (Core.screen.width() - this.width()) / 2 + "px"
        };
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
    },
    rev: function() {
        if (this.pre.css("direction") == "ltr") {
            this.pre.css("direction", "rtl");
        } else {
            this.pre.css("direction", "ltr");
        }
    },
    setPosition: function(args) {
    // TODO cette fonction devrait plutot prendre des attributs
    // css et les passer en vrac a jQuery
        var options = $.extend(true, {
            animate: false,
            time: 1000,
            css: {},
            short: 0,
            progress: function() {}
        }, args);
        
        if (options.short != "") {
            switch(options.short) {
                case "centertop":
                    $.extend(true, options.css, { top: 0, left: this.center.left() });
                    break;
                case "centerright":
                    $.extend(true, options.css, { top: this.center().top, right: 0 });
                    break;
                case "centerbottom":
                    $.extend(true, options.css, { bottom: 0, left: this.center.left() });
                    break;
                case "centerleft":
                    $.extend(true, options.css, { top: this.center().top, left: 0 });
                    break;
                case "center":
                    $.extend(true, options.css, { top: this.center().top, left: this.center().left });
                    break;
            };
        }
        
        if (options.animate) {
            this.sel.animate(options.css, {
                duration: options.time,
                progress: options.progress
            });
        } else {
            this.sel.css(options.css, options.time)
        }
        return this;
    }
}
