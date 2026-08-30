// ------------------------------
// Init, Settings, and States
// ------------------------------
import kaplay from "./assets/libraries/kaplay.mjs";
const k = kaplay({
  canvas: document.getElementById("canvas"),
  background: "#1e1523",
  fullscreen: true,
  global: false
});
const COINS = "starr_coins";
let collectedCoins = 0;
let isInGame = false;
let isFinished = false;
let isInvincible = false;
let died = false;

const THE_END = 999;
let meters = 0;

// ------------------------------
// Load sprites
// ------------------------------
k.loadSprite("starr", "./assets/sprites/starr.png");
k.loadSprite("rock-sm", "./assets/sprites/rocks/rock-sm.png");
k.loadSprite("rock-md", "./assets/sprites/rocks/rock-md.png");
k.loadSprite("rock-lg", "./assets/sprites/rocks/rock-lg.png");
k.loadSprite("rock-sm-b", "./assets/sprites/rocks/rock-sm-b.png");
k.loadSprite("rock-md-b", "./assets/sprites/rocks/rock-md-b.png");
k.loadSprite("rock-lg-b", "./assets/sprites/rocks/rock-lg-b.png");
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
// Game
// ------------------------------
const menuUI = document.getElementById("menu-ui");
const gameUI = document.getElementById("game-ui");
const deathScreenUI = document.getElementById("death-screen-ui");
const earnedCoins = document.getElementById("earned-coins");
const retryBtn = document.getElementById("retry-btn");

function enterGame() {
  isInGame = true;
  menuUI.classList.add('hidden');
  gameUI.classList.remove('hidden');
}

function gameOver() {
  k.addKaboom(starr.pos);
  starr.destroy();
  died = true;

  setTimeout(() => {
    deathScreenUI.classList.remove("hidden");
    earnedCoins.innerHTML = `Earned<img src="./assets/sprites/coin/frame1.png" class="inline w-10">${collectedCoins}`;
  }, 1000);

}

menuUI.addEventListener("click", () => enterGame());
retryBtn.addEventListener("click", () => location.reload());

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
  if (isInGame) {
    if (!isFinished) {

      // Make Starr follow mouse smoothly
      const targetX = k.toWorld(k.mousePos()).x;
      starr.pos.x = k.lerp(starr.pos.x, targetX, 0.1);

    } else {
      starr.pos.x = k.lerp(starr.pos.x, baseX, 0.1);
    }
  }

  // Make it float and spins
  starr.pos.y = baseY + Math.sin(k.time() * 3) * 25;
  starr.angle += 270 * k.dt();
  
  // Flash effect when invincible
  if (isInvincible) starr.opacity = k.map(Math.sin(k.time() * 20), -1, 1, 0.25, 1);
  
});

// ------------------------------
// Stars Background
// ------------------------------
k.loop(0.1, () => {
  const randomSpeed = k.rand(500, 650);
  const randomSize = k.rand(3, 6);
  const randomOpacity = k.rand(0, 0.75);
  const star = k.add([
    k.rect(randomSize, randomSize),
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
  const randomSize = k.rand(2, 4);
  const randomOpacity = k.rand(0, 0.25);
  const star = k.add([
    k.rect(randomSize, randomSize),
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
  const randomSize = k.rand(4, 8);
  const randomOpacity = k.rand(0.5, 0.75);
  const star = k.add([
    k.rect(randomSize, randomSize),
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
const MENU_ITEMS = [
  { name: "rock-sm", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: [90, 90] },
  { name: "rock-md", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: [90, 90] },
  { name: "rock-lg", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: [90, 90] }
];

const GAME_ITEMS = [
  {
    name: "coin",
    type: "coin",
    weight: 3,
    anim: { anim: "idle" }
  },
  
  { name: "rock-sm", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: [90, 90] },
  { name: "rock-md", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: [90, 90] },
  { name: "rock-lg", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: [90, 90] },

  { name: "rock-sm-b", type: "rock-b", weight: 0.2, scale: [0.75, 1.25], speed: [1250, 1500], zIndex: 100 },
  { name: "rock-md-b", type: "rock-b", weight: 0.2, scale: [0.75, 1.25], speed: [1250, 1500], zIndex: 100 },
  { name: "rock-lg-b", type: "rock-b", weight: 0.2, scale: [0.75, 1.25], speed: [1250, 1500], zIndex: 100 },

];

function getDifficulty() {
  return 1 + (meters / 20) * 0.25;
}

function getRandomItem(config) {
  const availableItems = config;
  
  const totalWeight = availableItems.reduce((sum, item) => sum + item.weight, 0);
  let randomNum = k.rand(0, totalWeight);

  for (const item of availableItems) {
    if (randomNum < item.weight) return item;
    randomNum -= item.weight;
  }
  return availableItems[0];
}

let itemTimer = 0;
k.loop(0.1, () => {
  itemTimer += 0.1;
  const baseInterval = isInGame ? 0.5 : 0.75;
  const targetInterval = Math.max(0.15, baseInterval / getDifficulty());
  
  if (itemTimer >= targetInterval) {
    itemTimer = 0;

    const itemConfig = getRandomItem(isInGame ? GAME_ITEMS : MENU_ITEMS);

    const [w, h] = itemConfig.hitbox || [];
    const hitbox = itemConfig.hitbox ? { shape: new k.Rect(k.vec2(-w / 2, -h / 2), w, h) } : {};

    const [minScale, maxScale] = itemConfig.scale || [0.75, 1];
    const randomScale = k.rand(minScale, maxScale);

    const [minSpeed, maxSpeed] = itemConfig.speed || [300, 500];
    const randomSpeed = k.rand(minSpeed, maxSpeed) * Math.min(3, getDifficulty());

    const item = k.add([
      k.sprite(itemConfig.name, itemConfig.anim || {}),
      k.pos(k.rand(0, k.width()), -500),
      k.scale(randomScale),
      k.rotate(k.rand(0, 360)),
      k.anchor("center"),
      k.area(hitbox),
      k.z(itemConfig.zIndex || 10),
      itemConfig.type,
      "item"
    ]);
    
    const spinSpeed = k.rand(-120, 120);
    
    // Drop and spin
    item.onUpdate(() => {
      item.pos.y += randomSpeed * k.dt();
      item.angle += spinSpeed * k.dt();
      if (item.pos.y > k.height() + 500) item.destroy();
    });

  }
});

// Coins
const coinLabel = document.getElementById("coin-label");
let coins = parseInt(localStorage.getItem(COINS) || "0", 10);

// Init coin label
coinLabel.innerText = coins;

function addCoins(num) {
  coins += num;
  collectedCoins += num;
  localStorage.setItem(COINS, coins);
  coinLabel.innerText = coins;
}

starr.onCollide("coin", (coin) => {
  if (isFinished || !isInGame) return;
  coin.destroy();
  addCoins(1);
});

// Rocks
const healthBar = document.getElementById("health-bar");
let health = 20;
function changeHealth(num) {
  health += num;
  healthBar.style.width = health + "%";

  // Destroy Starr when health < 0
  if (health <= 0) {
    health = 0;
    gameOver();
  }

}

starr.onCollide("rock", (rock) => {
  if (isFinished || isInvincible || !isInGame) return;
  isInvincible = true;
  rock.destroy();
  changeHealth(-20);
  setTimeout(() => {
    isInvincible = false;
    starr.opacity = 1;
  }, 2000);
});

// ------------------------------
// Meter Counter
// ------------------------------
const meterCounter = document.getElementById("meter-counter");
const progressBar = document.getElementById("progress-bar");

function truncTo(num, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.trunc(num * factor) / factor;
}

k.onUpdate(() => {
  if (!isInGame || died) return;
  if (meters < THE_END) {
    meters += k.dt();
    progressBar.style.width = meters / THE_END * 100 + "%";
    meterCounter.innerText = meters.toFixed(1) + "m";
  } else {
    isFinished = true;
  }
});
