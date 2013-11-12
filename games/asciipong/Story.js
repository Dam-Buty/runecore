
Core.load_sprite({ sprite: "start" });
Core.sprites["start"].animate(
    top: ($("#screen").innerHeight - Core.sprites["start"].outerHeight) / 2 + "px",
    left: ($("#screen").innerWidth - Core.sprites["start"].outerWidth) / 2 + "px"
);
