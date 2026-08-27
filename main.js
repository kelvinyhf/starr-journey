import kaplay from "./assets/libraries/kaplay.mjs";
const k = kaplay({
  canvas: document.getElementById("canvas"),
  background: "#333333",
  fullscreen: true,
});

// Load sprites
k.loadSprite("starr", "./assets/images/star-o.png");
k.loadSprite("cursor", "./assets/images/cursor.png");
k.loadSprite("steel", "./assets/images/steel.png");

// Cursor
k.setCursor("url('./assets/images/cursor.png'), auto");

// Starr
const starr = k.add([
  k.sprite("starr"),
  k.pos(width() * 0.5, height() * 0.8),
  k.anchor("center"),
  k.area(),
]);

starr.onUpdate(() => {
  const mousePos = k.toWorld(k.mousePos());
  starr.pos.x = k.lerp(starr.pos.x, mousePos.x, 0.05);
});

// Obstacles
k.loop(1.5, () => {

  const steel = k.add([
    k.sprite("steel"),
    k.pos(k.rand(0, k.width()), -50),
    k.anchor("center"),
    k.area(),
    "obstacle"
  ]);

  steel.onUpdate(() => {
    steel.pos.y += 200 * k.dt();
    if (steel.pos.y > k.height() + 50) steel.destroy();
  });

});

starr.onCollide("obstacle", (obstacle) => {
  obstacle.destroy();
  addKaboom(toWorld(mousePos()));
});
