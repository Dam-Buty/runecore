
var Story = {
    start: function() {
        Core.load_sprite({ sprite: "start" })
        .blinkable()
        .setPosition({
            animate: true,
            short: "center"
        })
        .clickable(function() { bootstrap(); });
    }
};
