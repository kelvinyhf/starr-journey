import kaplay from "./assets/libraries/kaplay.mjs";
const k = kaplay({
  canvas: document.getElementById("canvas"),
  background: "#1e1523",
  fullscreen: true
});

// Load sprites
k.loadSprite("starr", "./assets/images/star-o.png");
k.loadSprite("cursor", "./assets/images/cursor.png");
k.loadSprite("steel", "./assets/images/steel.png");

// Cursor
k.setCursor("url('./assets/images/cursor.png'), auto");

// Starr
const baseX = width() * 0.5;
const baseY = height() * 0.8;
const starr = k.add([
  k.sprite("starr"),
  k.pos(baseX, baseY),
  k.rotate(0),
  k.anchor("center"),
  k.area()
]);

starr.onUpdate(() => {
  
  // Make Starr follow mouse smoothly
  const targetX = k.mousePos().x !== 0 && k.mousePos().y !== 0 ? k.toWorld(k.mousePos()).x : baseX;
  starr.pos.x = k.lerp(starr.pos.x, targetX, 0.075);
  
  // Make it float and spins
  starr.pos.y = baseY + Math.sin(k.time() * 3) * 12;
  starr.angle += 270 * k.dt();
  
});

// Obstacles
k.loop(0.5, () => {
  const startAngle = k.rand(0, 360);
  const spinSpeed = k.rand(-180, 180);
  const randomSpeed = k.rand(250, 500);
  const randomScale = k.rand(0.7, 1.1);
  const steel = k.add([
    k.sprite("steel"),
    k.pos(k.rand(0, k.width()), -50),
    k.scale(randomScale),
    k.rotate(startAngle),
    k.anchor("center"),
    k.area(),
    "obstacle"
  ]);
  
  // Drop and spin
  steel.onUpdate(() => {
    steel.pos.y += randomSpeed * k.dt();
    steel.angle += spinSpeed * k.dt();
    if (steel.pos.y > k.height() + 50) steel.destroy();
  });
  
});

// Kaboom when collided
starr.onCollide("obstacle", (obstacle) => {
  obstacle.destroy();
  addKaboom(starr.pos);
  starr.destroy();
});
