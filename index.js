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
const METERS = "starr_meters";
const COINS = "starr_coins";
let meters = 0;
let collectedCoins = 0;
let isInGame = false;
let isInvincible = false;
let died = false;

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

k.loadSprite(
  "spark",
  [
    "./assets/sprites/spark/frame1.png",
    "./assets/sprites/spark/frame2.png",
    "./assets/sprites/spark/frame3.png",
    "./assets/sprites/spark/frame4.png"
  ],
  {
    anims: {
      spark: {
        from: 0,
        to: 3,
        speed: 20,
        loop: false
      }
    }
  }
);

k.loadSprite("explosion-sm", "./assets/sprites/explosions/explosion-sm.png", {
  sliceX: 8,
  sliceY: 1,
  anims: {
    explode: {
      from: 0,
      to: 7,
      speed: 16,
      loop: false
    }
  }
});

k.loadSprite("explosion-md", "./assets/sprites/explosions/explosion-md.png", {
  sliceX: 8,
  sliceY: 1,
  anims: {
    explode: {
      from: 0,
      to: 7,
      speed: 16,
      loop: false
    }
  }
});

k.loadSprite("explosion-lg", "./assets/sprites/explosions/explosion-lg.png", {
  sliceX: 7,
  sliceY: 1,
  anims: {
    explode: {
      from: 0,
      to: 6,
      speed: 16,
      loop: false
    }
  }
});

// ------------------------------
// Load sounds
// ------------------------------
k.loadSound("coin1", "./assets/sounds/coin1.wav");
k.loadSound("coin2", "./assets/sounds/coin2.wav");
k.loadSound("coin3", "./assets/sounds/coin3.wav");
k.loadSound("explosion1", "./assets/sounds/explosion1.wav");
k.loadSound("explosion2", "./assets/sounds/explosion2.wav");
k.loadSound("gameover", "./assets/sounds/gameover.wav");
k.loadSound("Pixel Peeker Polka - slower", "./assets/sounds/Pixel Peeker Polka - slower.mp3");
k.loadSound("Pixelland", "./assets/sounds/Pixelland.mp3");
k.loadSound("Reformat", "./assets/sounds/Reformat.mp3");

// Load Shader
k.loadShader("flash", null, `
  vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    float alpha = texture2D(tex, uv).a;
    return vec4(1.0, 1.0, 1.0, alpha);
  }
`);

const bgms = ["Pixel Peeker Polka - slower", "Pixelland", "Reformat"];
let startIndex = k.choose([0, 1, 2]);
function playBGM(index) {
  const currentBGM = k.play(bgms[index], { volume: 0.5 });
  currentBGM.onEnd(() => {
    setTimeout(() => {
      playBGM(index === 2 ? 0 : ++index)
    }, 5000);
  });
}

// ------------------------------
// Game
// ------------------------------
const menuUI = document.getElementById("menu-ui");
const gameUI = document.getElementById("game-ui");
const deathScreenUI = document.getElementById("death-screen-ui");
const collectedCoinsLabel = document.getElementById("collected-coins-label");
const retryBtn = document.getElementById("retry-btn");

function enterGame() {
  isInGame = true;
  menuUI.classList.add('hidden');
  gameUI.classList.remove('hidden');
  playBGM(startIndex);
}

function gameOver() {
  starr.destroy();
  died = true;
  
  // Set best distance
  if (meters > bestDistance) {
    bestDistance = meters.toFixed(1);
    localStorage.setItem(METERS, meters.toFixed(1));
  }
  
  setTimeout(() => {
    k.play("gameover", { volume: 1.25 });
    deathScreenUI.classList.remove("hidden");
    collectedCoinsLabel.innerHTML = `Collected <span class="text-2xl font-bold">${collectedCoins}</span> <img src="./assets/sprites/coin/frame1.png" class="inline w-6 h-6">`;
    bestDistanceLabel.innerHTML = `Best Distance <span class="text-2xl text-red-10 font-bold">${bestDistance}m</span>`;
  }, 1000);

}

function getDifficulty() {
  return Math.min(1 + (meters / 20) * 0.25, 5);
}

menuUI.addEventListener("click", () => enterGame());
retryBtn.addEventListener("click", () => location.reload());

// Loading Screen
document.addEventListener("DOMContentLoaded", () => {
  k.onLoad(() => document.getElementById("loading-screen").remove());
});

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
  k.z(99),
  k.shader("flash")
]);
starr.shader = null;

let controlling = false;
starr.onUpdate(() => {

  // Mark when mouse entered the canva
  if (!controlling) {
    if (k.mousePos().x !== 0 || k.mousePos().y !== 0) controlling = true;
  }

  if (isInGame) {
    if (controlling) {
      // Make Starr follow mouse smoothly
      const targetX = k.toWorld(k.mousePos()).x;
      starr.pos.x = k.lerp(starr.pos.x, targetX, 0.1);
    } else {
      starr.pos.x = k.lerp(starr.pos.x, baseX, 0.1);
    }
  }

  // Make it float and spins
  starr.pos.y = baseY + Math.sin(k.time() * 3) * 25;
  starr.angle += 180 * getDifficulty() * k.dt();
  
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

  { name: "rock-sm-b", type: "rock-b", weight: 0.2, scale: [0.75, 1.25], speed: [1250, 1500], zIndex: 199 },
  { name: "rock-md-b", type: "rock-b", weight: 0.2, scale: [0.75, 1.25], speed: [1250, 1500], zIndex: 199 },
  { name: "rock-lg-b", type: "rock-b", weight: 0.2, scale: [0.75, 1.25], speed: [1250, 1500], zIndex: 199 },

];

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
  const targetInterval = baseInterval / getDifficulty();
  
  if (itemTimer >= targetInterval) {
    itemTimer = 0;

    const itemConfig = getRandomItem(isInGame ? GAME_ITEMS : MENU_ITEMS);

    const [w, h] = itemConfig.hitbox || [];
    const hitbox = itemConfig.hitbox ? { shape: new k.Rect(k.vec2(-w / 2, -h / 2), w, h) } : {};

    const [minScale, maxScale] = itemConfig.scale || [0.75, 1];
    const randomScale = k.rand(minScale, maxScale);

    const [minSpeed, maxSpeed] = itemConfig.speed || [300, 500];
    const randomSpeed = k.rand(minSpeed, maxSpeed) * getDifficulty();

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

function addCoins(num, coinPos) {
  coins += num;
  collectedCoins += num;
  localStorage.setItem(COINS, coins);
  coinLabel.innerText = coins;

  const spark = k.add([
    k.sprite("spark"),
    k.pos(coinPos),
    k.scale(4),
    k.opacity(1),
    k.anchor("top"),
    k.z(100)
  ]);

  // Play animation and destroy when finished
  spark.play("spark");
  spark.onAnimEnd(() => {
    spark.destroy();
  });

}

starr.onCollide("coin", (coin) => {
  if (!isInGame) return;

  // Destroy and add coin, play sfx
  coin.destroy();
  addCoins(1, coin.pos);
  k.play(k.choose(["coin1", "coin2", "coin3"]), { volume: 0.8 });
});

// Rocks
const healthBar = document.getElementById("health-bar");
let health = 100;
function changeHealth(num, rockPos) {
  health += num;
  healthBar.src = `./assets/sprites/health-bar/${health}.png`;

  // Destroy Starr when health < 0
  if (health <= 0) {
    health = 0;
    gameOver();
    explode(rockPos, true);
    k.play("explosion2", { volume: 1.2 });
  } else {
    explode(rockPos)
    k.play("explosion1", { volume: 0.8 });
  }

}

function explode(rockPos, fatal = false) {
  const type = fatal ? "explosion-lg" : k.choose(["explosion-sm", "explosion-md"]);
  const explosion = k.add([
    k.sprite(type),
    k.pos(rockPos),
    k.scale(fatal ? 5 : 3),
    k.anchor("center"),
    k.z(100)
  ]);

  // Play animation and destroy when finished
  explosion.play("explode");
  explosion.onAnimEnd(() => explosion.destroy());
  starr.shader = "flash";
  setTimeout(() => starr.shader = null, 100);
  
}

starr.onCollide("rock", (rock) => {
  if (isInvincible || !isInGame) return;
  isInvincible = true;

  // Destroy rock and reduce health
  rock.destroy();
  changeHealth(-25, rock.pos);

  // Invincible for 2 second
  setTimeout(() => {
    isInvincible = false;
    starr.opacity = 1;
  }, 2000);
});

// ------------------------------
// Meter Counter
// ------------------------------
const meterCounter = document.getElementById("meter-counter");
const bestDistanceLabel = document.getElementById("best-distance");
let bestDistance = parseFloat(localStorage.getItem(METERS) || "0", 10);

function truncTo(num, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.trunc(num * factor) / factor;
}

k.onUpdate(() => {
  if (!isInGame || died) return;
  meters += k.dt();
  meterCounter.innerText = meters.toFixed(1) + "m";
});
