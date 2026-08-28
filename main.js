// ------------------------------
// Init and Settings
// ------------------------------
import kaplay from "./assets/libraries/kaplay.mjs";
const k = kaplay({
  canvas: document.getElementById("canvas"),
  background: "#1e1523",
  fullscreen: true,
  global: false
});

// Set cursor
k.setCursor("url('./assets/sprites/cursor.png'), auto");

// ------------------------------
// Load sprites
// ------------------------------
k.loadSprite("starr", "./assets/sprites/star-o.png");
k.loadSprite("steel", "./assets/sprites/steel.png");
k.loadSprite("coin", "./assets/sprites/coin-o.png");

// ------------------------------
// Starr
// ------------------------------
const baseX = k.width() * 0.5;
const baseY = k.height() * 0.8;
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
  starr.pos.y = baseY + Math.sin(k.time() * 3) * 25;
  starr.angle += 270 * k.dt();
  
});

// ------------------------------
// Obstacles
// ------------------------------
k.loop(0.5, () => {
  const startAngle = k.rand(0, 360);
  const spinSpeed = k.rand(-180, 180);
  const randomSpeed = k.rand(300, 500);
  const randomScale = k.rand(0.7, 1.1);

  const randomObstacle = k.chance(0.2) ? "coin" : "steel";
  const obstacle = k.add([
    k.sprite(randomObstacle),
    k.pos(k.rand(0, k.width()), -50),
    k.scale(randomScale),
    k.rotate(startAngle),
    k.anchor("center"),
    k.area(),
    randomObstacle,
    "obstacle"
  ]);
  
  // Drop and spin
  obstacle.onUpdate(() => {
    obstacle.pos.y += randomSpeed * k.dt();
    obstacle.angle += spinSpeed * k.dt();
    if (obstacle.pos.y > k.height() + 50) obstacle.destroy();
  });
  
});

// Coins
const coinLabel = document.getElementById("coin-label");
let coins = 0;
function addCoins(num) {
  coins += num;
  coinLabel.innerText = coins;
}

starr.onCollide("coin", (coin) => {
  coin.destroy();
  addCoins(1);
});

// Steel
const healthBar = document.getElementById("health-bar");
let health = 100;
function changeHealth(num) {
  health += num;
  healthBar.style.width = health + "%";

  // Destroy Starr when health < 0
  if (health <= 0) {
    k.addKaboom(starr.pos);
    starr.destroy();
  }

}

starr.onCollide("steel", (steel) => {
  steel.destroy();
  changeHealth(-20);
});
