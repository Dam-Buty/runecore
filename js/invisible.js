
var repeat = function(n, char) {
    return Array(n + 1).join(char);
};

var load_sprite = function(sprite) {
    var arrayed = [];
    $.each(sprite.split("\n"), function() {
        arrayed.push(this);
    });
    
    return arrayed;
};

// The Invisible structure contains all the informations about the current game
var Invisible = {
    Bootstrap: {
        loaded: 0,
        total: 0,
    },
    Assets: {
        backgrounds: [],
        sprites: []
    },
    Queue: {
        
    },
    Screen: {
        width: 80,
        height: 30,
        fps: 10,
        alpha: ".",
        backgrounds: {
            active: 0,
            x: 0,
            y: 0
        },
        pixel: function(char, x, y) {
            var line = Invisible.Screen.content[y];
            line = line.substr(0,x) + char + line.substr(x+1);
            Invisible.Screen.content[y] = line;
        },
        erase: function() {
            Invisible.Screen.content.length = 0;
            $.each(Array(Invisible.Screen.height), function() {
                Invisible.Screen.content.push(repeat(Invisible.Screen.width, Invisible.Screen.alpha));
            });
        },
        draw: function(sprite, x, y) {
            // draw checks for every line if it must be displayed
            // and checks for every character if it must be displayed
            $.each(sprite, function(i, line) {
                if (i + y < Invisible.Screen.height - 1 && i + y > 0) {
                    $.each(line.split(''), function(j, char) {
                        if (char != " " && j + x < Invisible.Screen.width - 1 && j + x > 0) {
                            Invisible.Screen.pixel(char, x + j, y + i);
                        }
                    });
                }
            });
        },
        display: function() {
            var content = "";
            $.each(Invisible.Screen.content, function(i, line) {
                content += line + "<br/>"; 
            });
            
            $("#screen").empty();
            $("#screen").append(content);
        },
        content: []
    },
    Store: {
    
    }
};

var Machinist = {
    Reel: function() {  
        // First load all the backgrounds listed
        $.ajax({
            url: "backgrounds/backgrounds.list",
            type: "GET",
            dataType: "text/plain",
            statusCode: {
                200: function(backgrounds) {
                    $.each(backgrounds.responseText.split("\n"), function(i, background) {
                        if (background != "") {
                            $.ajax({
                                url: "backgrounds/" + background + ".sprite",
                                type: "GET",
                                dataType: "text/plain",
                                statusCode: {
                                    200: function(sprite) {
                                        Invisible.Assets.backgrounds.collection.push(load_sprite(sprite.responseText));
                                    }
                                }
                            });
                        }
                    });
                }
            }        
        });
    },
    // Once Switched, the Machinist will execute every 1/fps second and :
    // - advance one step in the animation queues
    // - erase screen
    // - draw the background
    // - draw the objects by order of z-index
    // - and display the screen
    Switch: function() {
            setInterval(function() {
                Invisible.Screen.erase();
                
                Invisible.Screen.draw(Invisible.Assets.backgrounds[Invisible.Assets.backgrounds.active], 0, Invisible.Screen.background.y);
                
                Invisible.Screen.display();
                
            }, 1000/Invisible.Screen.fps);
    }
};
