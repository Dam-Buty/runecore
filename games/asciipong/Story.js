
var Story = {
    start: function() {
        Core.load_sprite({ sprite: "start" })
        .blinkable()
        .center(true)
        .clickable(function() {
            console.log("rock'n'roll");
        });
    }
};
