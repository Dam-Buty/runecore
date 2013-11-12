
var Assets = {
    bg: { },
    sprites: { }
};

$.ajax({
    url: Game.path + "/Assets.sprite",
    type: "GET",
    dataType: "text/plain",
    statusCode: {
        200: function(sprites) {
            console.log(sprites);
        }
    }
});


