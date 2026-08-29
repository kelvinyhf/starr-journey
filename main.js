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
k.loadSprite("rock-sm", "./assets/sprites/rocks/rock-sm.png");
k.loadSprite("rock-md", "./assets/sprites/rocks/rock-md.png");
k.loadSprite("rock-lg", "./assets/sprites/rocks/rock-lg.png");
k.loadSprite(
  "coin",
  [
    "./assets/sprites/coin/frame1.png",
    "./assets/sprites/coin/frame2.png",
    "./assets/sprites/coin/frame3.png",
    "./assets/sprites/coin/frame4.png",
    "./assets/sprites/coin/frame5.png",
    "./assets/sprites/coin/frame6.png",
    "./assets/sprites/coin/frame7.png",
    "./assets/sprites/coin/frame8.png"
  ],
  {
    anims: {
      idle: {
        from: 0,
        to: 7,
        speed: 8,
        loop: true
      }
    }
  }
);

// ------------------------------
// Global State
// ------------------------------
let isFinished = false;


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
  k.area(),
  k.z(99)
]);

starr.onUpdate(() => {
  if (!isFinished) {

    // Make Starr follow mouse smoothly
    const targetX = k.mousePos().x !== 0 && k.mousePos().y !== 0 ? k.toWorld(k.mousePos()).x : baseX;
    starr.pos.x = k.lerp(starr.pos.x, targetX, 0.1);

  } else {
    starr.pos.x = k.lerp(starr.pos.x, baseX, 0.1);
  }
  
  // Make it float and spins
  starr.pos.y = baseY + Math.sin(k.time() * 3) * 25;
  starr.angle += 270 * k.dt();
  
});

// ------------------------------
// Stars Background
// ------------------------------
k.loop(0.1, () => {
  const randomSpeed = k.rand(500, 650);
  const randomRadius = k.rand(1.5, 3);
  const randomOpacity = k.rand(0, 0.75);
  const star = k.add([
    k.circle(randomRadius),
    k.color(255, 255, 255),
    k.opacity(randomOpacity),
    k.pos(k.rand(0, k.width()), -50),
    k.anchor("center"),
    k.area(),
    k.z(1),
    "star"
  ]);
  
  star.onUpdate(() => {
    star.pos.y += randomSpeed * k.dt();
    if (star.pos.y > k.height() + 50) star.destroy();
  });
  
});

// Second layer (furthest)
k.loop(0.025, () => {
  const randomSpeed = k.rand(250, 300);
  const randomRadius = k.rand(0.75, 1.25);
  const randomOpacity = k.rand(0, 0.25);
  const star = k.add([
    k.circle(randomRadius),
    k.color(255, 255, 255),
    k.opacity(randomOpacity),
    k.pos(k.rand(0, k.width()), -50),
    k.anchor("center"),
    k.area(),
    k.z(0),
    "star"
  ]);
  
  star.onUpdate(() => {
    star.pos.y += randomSpeed * k.dt();
    if (star.pos.y > k.height() + 50) star.destroy();
  });
  
});

// Third layer (closest)
k.loop(0.5, () => {
  const randomSpeed = k.rand(850, 1000);
  const randomRadius = k.rand(3, 5);
  const randomOpacity = k.rand(0.5, 0.75);
  const star = k.add([
    k.circle(randomRadius),
    k.color(255, 255, 255),
    k.opacity(randomOpacity),
    k.pos(k.rand(0, k.width()), -50),
    k.anchor("center"),
    k.area(),
    k.z(2),
    "star"
  ]);
  
  star.onUpdate(() => {
    star.pos.y += randomSpeed * k.dt();
    if (star.pos.y > k.height() + 50) star.destroy();
  });
  
});

// ------------------------------
// Items
// ------------------------------
const ITEMS_CONFIG = [
  {
    name: "coin",
    type: "coin",
    weight: 5,
    anim: { anim: "idle" },
    normalOnly: true
  },
  
  { name: "rock-sm", type: "rock", weight: 8, scale: [0.15, 0.3] },
  { name: "rock-md", type: "rock", weight: 8, scale: [0.15, 0.3] },
  { name: "rock-lg", type: "rock", weight: 8, scale: [0.15, 0.3] },

  { name: "rock-sm", type: "rock", weight: 3, scale: [0.25, 0.5] },
  { name: "rock-md", type: "rock", weight: 3, scale: [0.25, 0.5] },
  { name: "rock-lg", type: "rock", weight: 3, scale: [0.25, 0.5] },

  { name: "rock-sm", type: "rock", weight: 1, scale: [1, 1.25], zIndex: 100 },
  { name: "rock-md", type: "rock", weight: 1, scale: [1, 1.25], zIndex: 100 },
  { name: "rock-lg", type: "rock", weight: 1, scale: [1, 1.25], zIndex: 100 },

];

function getRandomItem() {
  const availableItems = ITEMS_CONFIG.filter(item => !(isFinished && item.normalOnly));

  const totalWeight = availableItems.reduce((sum, item) => sum + item.weight, 0);
  let randomNum = k.rand(0, totalWeight);

  for (const item of availableItems) {
    if (randomNum < item.weight) return item;
    randomNum -= item.weight;
  }
  return availableItems[0];
}

k.loop(0.5, () => {
  const itemConfig = getRandomItem();

  const [minScale, maxScale] = itemConfig.scale || [0.75, 1];
  const randomScale = k.rand(minScale, maxScale);

  const item = k.add([
    k.sprite(itemConfig.name, itemConfig.anim || {}),
    k.pos(k.rand(0, k.width()), -500),
    k.scale(randomScale),
    k.rotate(k.rand(0, 360)),
    k.anchor("center"),
    k.area(),
    k.z(itemConfig.zIndex || 10),
    itemConfig.type,
    "item"
  ]);
  
  const spinSpeed = k.rand(-120, 120);
  const randomSpeed = k.rand(300, 500);
  
  // Drop and spin
  item.onUpdate(() => {
    item.pos.y += randomSpeed * k.dt();
    item.angle += spinSpeed * k.dt();
    if (item.pos.y > k.height() + 500) item.destroy();
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
  if (isFinished) return;
  coin.destroy();
  addCoins(1);
});

// Rocks
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

starr.onCollide("rock", (rock) => {
  if (isFinished) return;
  rock.destroy();
  changeHealth(-20);
});

// ------------------------------
// Progress
// ------------------------------
const progressBar = document.getElementById("progress-bar");
const MAX_PROGRESS = 10;
let progress = 0;
k.onUpdate(() => {
  if (progress < MAX_PROGRESS) {
    progress += k.dt();
    progressBar.style.width = progress / MAX_PROGRESS * 100 + "%";
  } else {
    isFinished = true;
  }
});
