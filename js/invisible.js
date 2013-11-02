
var repeat = function(n, char) {
    return Array(n + 1).join(char);
};

// The Invisible structures contains all the informations about the current game
var Invisible = {
    Bootstrap: {
        loaded: 0,
        total: 0,
    },
    Screen: {
        width: 80,
        height: 40,
        fps: 10,
        background: {
            active: 0,
            collection: []
        },
        sprites: [],
        queues: [],
        draw: function() {
            // First draw the background
        },
        display: function() {
            var content = "";
            $.each(Invisible.Screen.content, function(i, ligne) {
                content += ligne + "<br/>"; 
            });
            
            $("#ecran").empty();
            $("#ecran").append(content);
        },
        content: []
    },
    Store: {
    
    }
};

// Once Switched, the Machinist will execute every 1/fps second and :
// - advance one step in the animation queues
// - call the drawing and displaying
var Machinist = {
    Reel: function() {  
        Invisible.Screen.content = new Array(Invisible.Screen.height).map(function() { 
            return repeat(Invisible.Screen.width, " ");
        })
        $.ajax({
            url: "backgrounds/backgrounds.list",
            type: "GET",
            dataType: "text/plain",
            statusCode: {
                200: function(backgrounds) {
                    console.log(backgrounds);
                }
            }        
        });
    },
    Switch: function() {
            setTimeout(function() {
                
            }, 1000/Invisible.Screen.fps);
    }
};
