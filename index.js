// ------------------------------
// KAPLAY Initialization
// ------------------------------
import kaplay from "./assets/libraries/kaplay.mjs";
const k = kaplay({
  canvas: document.getElementById("canvas"),
  background: "#1e1523",
  fullscreen: true,
  global: false
});

// States
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

// Data storage
const METERS = "starr_meters";
const COINS = "starr_coins";
const SILVER_COIN = "starr_silver_coins";
let bestDistance = parseFloat(localStorage.getItem(METERS) || "0", 10);
let coins = parseInt(localStorage.getItem(COINS) || "0", 10);
let silverCoins = parseInt(localStorage.getItem(SILVER_COIN) || "0", 10);

// Game const
const minX = (k.width() / 2) - 240;
const maxX = (k.width() / 2) + 240;

// Game vars and flags
let isInGame = false;
let isInvincible = false;
let invincibleOnStart = false;
let controlling = false;
let died = false;
let health = 100;
let meters = 0;
let speed = 1;
let collectedCoins = 0;
let collectedSilverCoins = 0;

// Effects
let hasShield = false;
let isStasis = false;
let canDodge = false;
let doubleCoins = false;

// ------------------------------
// Load sprites
// ------------------------------
k.loadSprite("starr", "./assets/sprites/starr/default.png");
k.loadSprite("starr-green-border", "./assets/sprites/starr/green-border.png");
k.loadSprite("starr-orange-border", "./assets/sprites/starr/orange-border.png");

// Rocks
k.loadSprite("rock-sm", "./assets/sprites/rocks/rock-sm.png");
k.loadSprite("rock-md", "./assets/sprites/rocks/rock-md.png");
k.loadSprite("rock-lg", "./assets/sprites/rocks/rock-lg.png");
k.loadSprite("rock-fs", "./assets/sprites/rocks/rock-fs.png");

// Coin
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
        speed: 28,
        loop: false
      }
    }
  }
);

// Silver Coin
k.loadSprite(
  "silver-coin",
  [
    "./assets/sprites/silver-coin/frame1.png",
    "./assets/sprites/silver-coin/frame2.png",
    "./assets/sprites/silver-coin/frame3.png",
    "./assets/sprites/silver-coin/frame4.png",
    "./assets/sprites/silver-coin/frame5.png",
    "./assets/sprites/silver-coin/frame6.png",
    "./assets/sprites/silver-coin/frame7.png",
    "./assets/sprites/silver-coin/frame8.png"
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
  "silver-spark",
  [
    "./assets/sprites/silver-spark/frame1.png",
    "./assets/sprites/silver-spark/frame2.png",
    "./assets/sprites/silver-spark/frame3.png",
    "./assets/sprites/silver-spark/frame4.png"
  ],
  {
    anims: {
      spark: {
        from: 0,
        to: 3,
        speed: 28,
        loop: false
      }
    }
  }
);

// Coin Bag
k.loadSprite("coin-bag", "./assets/sprites/pickups/coin-bag.png");

// Health Potion
k.loadSprite("health-potion", "./assets/sprites/pickups/health-potion.png");
k.loadSprite(
  "recover",
  [
    "./assets/sprites/recover/frame1.png",
    "./assets/sprites/recover/frame2.png",
    "./assets/sprites/recover/frame3.png",
    "./assets/sprites/recover/frame4.png"
  ],
  {
    anims: {
      recover: {
        from: 0,
        to: 3,
        speed: 20,
        loop: false
      }
    }
  }
);

// Speed Potion
k.loadSprite("speed-potion", "./assets/sprites/pickups/speed-potion.png");
k.loadSprite(
  "speedup",
  [
    "./assets/sprites/speedup/frame1.png",
    "./assets/sprites/speedup/frame2.png",
    "./assets/sprites/speedup/frame3.png",
    "./assets/sprites/speedup/frame4.png"
  ],
  {
    anims: {
      speedup: {
        from: 0,
        to: 3,
        speed: 20,
        loop: false
      }
    }
  }
);

// Explosion animations
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

// Statics
k.loadSprite("shield", "./assets/sprites/statics/shield-effect.png");
k.loadSprite("shield-explosion", "./assets/sprites/statics/shield-explosion.png");
k.loadSprite("stasis", "./assets/sprites/statics/stasis-effect.png");

// ------------------------------
// Load sounds
// ------------------------------
k.loadSound("coin1", "./assets/sounds/coin1.wav");
k.loadSound("coin2", "./assets/sounds/coin2.wav");
k.loadSound("explosion1", "./assets/sounds/explosion1.wav");
k.loadSound("explosion2", "./assets/sounds/explosion2.wav");
k.loadSound("buff1", "./assets/sounds/buff1.wav");
k.loadSound("buff2", "./assets/sounds/buff2.wav");
k.loadSound("buff3", "./assets/sounds/buff3.wav");
k.loadSound("failed", "./assets/sounds/failed.wav")
k.loadSound("gameover", "./assets/sounds/gameover.wav");
k.loadSound("Pixel Peeker Polka - slower", "./assets/sounds/Pixel Peeker Polka - slower.mp3");
k.loadSound("Pixelland", "./assets/sounds/Pixelland.mp3");
k.loadSound("Reformat", "./assets/sounds/Reformat.mp3");
k.loadSound("shield-explode", "./assets/sounds/shield-explode.wav");
k.loadSound("dodge", "./assets/sounds/dodge.wav");

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
const playBtn = document.getElementById("play-btn");
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

  // Disable effects
  isStasis = false;
  canDodge = false;

  // Set best distance
  if (meters > bestDistance) {
    bestDistance = meters.toFixed(1);
    localStorage.setItem(METERS, meters.toFixed(1));
  }

  // Set coins + Effect of the shop item "double"
  collectedCoins *= (doubleCoins ? 2 : 1);
  coins += collectedCoins;
  localStorage.setItem(COINS, coins);
  coinLabel.innerText = coins;

  collectedSilverCoins *= (doubleCoins ? 2 : 1);
  silverCoins += collectedSilverCoins;
  localStorage.setItem(SILVER_COIN, silverCoins);
  silverCoinLabel.innerText = silverCoins;

  setTimeout(() => {
    k.play("gameover", { volume: 1.25 });
    deathScreenUI.classList.remove("hidden");
    collectedCoinsLabel.innerHTML = `
      Collected
      <span class="inline-flex items-center gap-2">
        <img src="./assets/sprites/coin/frame1.png" class="w-5 h-5">
        <span class="text-xl">${collectedCoins}</span>
      </span>
      and
      <span class="inline-flex items-center gap-2">
        <img src="./assets/sprites/silver-coin/frame1.png" class="w-5 h-5">
        <span class="text-xl">${collectedSilverCoins}</span>
      </span>
      ${doubleCoins ? "(Doubled!)" : ""}
    `;
    bestDistanceLabel.innerHTML = `Best Distance <span class="text-xl text-red-10">${bestDistance}m</span>`;
  }, 1000);

}

function getDifficulty() {
  return Math.min(1 + (meters / 20) * 0.025, 5);
}

playBtn.addEventListener("click", () => enterGame());
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

let trailTimer = 0;
starr.onUpdate(() => {

  // Mark when mouse entered the canva
  if (!controlling) {
    if (k.mousePos().x !== 0 || k.mousePos().y !== 0) controlling = true;
  }
  
  if (isInGame) {
    if (controlling) {

      // Make Starr follow mouse smoothly
      const mouseX = k.toWorld(k.mousePos()).x;
      const targetX = k.clamp(mouseX, minX, maxX);
      starr.pos.x = k.lerp(starr.pos.x, targetX, 0.15);

    } else {
      starr.pos.x = k.lerp(starr.pos.x, baseX, 0.15);
    }
    
    // Invincible on start
    if (!invincibleOnStart) {
      invincibleOnStart = true;
      isInvincible = true;
      setTimeout(() => {
        isInvincible = false
        starr.opacity = 1;
      }, 1000);
    }
  }

  // Make it float and spins
  starr.pos.y = baseY + Math.sin(k.time() * 3) * 25;
  starr.angle += 180 * getDifficulty() * k.dt();

  // Flash effect when invincible
  if (isInvincible) starr.opacity = k.map(Math.sin(k.time() * 20), -1, 1, 0.25, 1);

  // Trail Effect
  trailTimer += k.dt();
  if (trailTimer >= 0.05) {
    trailTimer = 0;

    const trail = k.add([
      k.sprite("starr"),
      k.pos(starr.pos),
      k.rotate(starr.angle),
      k.scale(0.75),
      k.anchor("center"),
      k.opacity(0.25),
      k.z(starr.z - 1)
    ]);

    trail.onUpdate(() => {
      trail.pos.y += 300 * k.dt();
      trail.scale = trail.scale.sub(k.vec2(1.5 * k.dt()));
      trail.opacity -= 0.5 * k.dt();
      if (trail.opacity <= 0) trail.destroy();
    });
  }

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
  { name: "rock-sm", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: 0.25 },
  { name: "rock-md", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: 0.25 },
  { name: "rock-lg", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: 0.25 }
];

let GAME_ITEMS = [

  // Basic Items (Coin and Rocks)
  { name: "coin", type: "coin", weight: 1, anim: { anim: "idle" }, category: "positive" },
  { name: "silver-coin", type: "silver-coin", weight: 3, anim: { anim: "idle" }, category: "positive" },
  { name: "rock-sm", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: 0.25, category: "negative" },
  { name: "rock-md", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: 0.25, category: "negative" },
  { name: "rock-lg", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: 0.25, category: "negative" },
  { name: "rock-fs", type: "rock", weight: 0.3, scale: [0.1, 0.3], hitbox: 0.15, speed: [750, 1000], category: "negative" },

  // Pickups
  { name: "health-potion", type: "health-potion", weight: 0.05, scale: [1, 1.25], category: "positive" },
  { name: "speed-potion", type: "speed-potion", weight: 0.25, scale: [1, 1.25], category: "positive" },
  { name: "coin-bag", type: "coin-bag", weight: 0.15, scale: [1, 1.25], category: "positive" },

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
  const baseInterval = isInGame ? 0.3 : 0.75;
  const targetInterval = baseInterval / getDifficulty();

  if (itemTimer >= targetInterval) {
    itemTimer = 0;

    const itemConfig = getRandomItem(isInGame ? GAME_ITEMS : MENU_ITEMS);

    const [minScale, maxScale] = itemConfig.scale || [0.75, 1];
    const randomScale = k.rand(minScale, maxScale);

    const [minSpeed, maxSpeed] = itemConfig.speed || [300, 500];
    const randomSpeed = k.rand(minSpeed, maxSpeed) * getDifficulty();

    const item = k.add([
      k.sprite(itemConfig.name, itemConfig.anim || {}),
      k.pos(k.rand(minX, maxX), -500),
      k.scale(randomScale),
      k.rotate(k.rand(0, 360)),
      k.anchor("center"),
      k.area({ scale: itemConfig.hitbox || 1 }),
      k.opacity(1),
      k.z(itemConfig.zIndex || 10),
      itemConfig.type,
      "item"
    ]);

    const spinSpeed = k.rand(-120, 120);

    // Drop and spin
    item.onUpdate(() => {
      
      // Effect of the shop item "stasis"
      item.pos.y += randomSpeed * k.dt() * (
        itemConfig.type === "rock" &&
        isStasis &&
        item.pos.x >= starr.pos.x - 150 &&
        item.pos.x <= starr.pos.x + 150 &&
        item.pos.y >= starr.pos.y - 300 &&
        item.pos.y <= starr.pos.y ?
        k.map(item.pos.dist(starr.pos), 0, 300, 0.6, 1) : 1
      );
      
      item.angle += spinSpeed * k.dt();
      if (item.pos.y > k.height() + 500) item.destroy();
    });

  }
});

// Currencies
function changeCoins(num, coinPos, isGold = false) {
  if (isInGame) {
    if (isGold) {
      collectedCoins += num;
    } else {
      collectedSilverCoins += num;
    }
  } else {

    // Directly change coins if not in game (but in shop)
    if (isGold) {
      coins += num;
      localStorage.setItem(COINS, coins);
      coinLabel.innerText = coins;
    } else {
      silverCoins += num;
      localStorage.setItem(SILVER_COIN, silverCoins);
      silverCoinLabel.innerText = silverCoins;
    }

  }
  
  // Spark and bounce if coinPos is provided
  if (coinPos) {
    sparkEffect(coinPos, isGold);
    coinBounceEffect(coinPos, isGold);
  }

}

function sparkEffect(coinPos, isGold = false) {
  const spark = k.add([
    k.sprite(isGold ? "spark" : "silver-spark"),
    k.pos(coinPos),
    k.rotate(k.rand(0, 360)),
    k.scale(4),
    k.opacity(0.5),
    k.anchor("center"),
    k.z(100)
  ]);
  
  const spinSpeed = k.rand(-360, 360);
  spark.onUpdate(() => {
    spark.angle += spinSpeed * k.dt();
    spark.scale = spark.scale.sub(k.vec2(6 * k.dt()));
    spark.opacity -= 2 * k.dt();
  });
  
  // Play animation and destroy when finished
  spark.play("spark");
  spark.onAnimEnd(() => {
    spark.destroy();
  });
}

function coinBounceEffect(coinPos, isGold = false) {
  const bounceCoin = k.add([
    k.sprite(isGold ? "coin" : "silver-coin", { anim: "idle" }),
    k.pos(coinPos),
    k.scale(0.75),
    k.anchor("center"),
    k.opacity(1),
    k.z(100)
  ]);
  
  let velocityY = k.rand(-200, -400);
  let velocityX = k.rand(-100, 100);
  
  bounceCoin.onUpdate(() => {
    velocityY += 1250 * k.dt();
    bounceCoin.pos.y += velocityY * k.dt();
    bounceCoin.pos.x += velocityX * k.dt();
    bounceCoin.angle += 720 * k.dt();
    bounceCoin.opacity -= 1.5 * k.dt();
    if (bounceCoin.opacity <= 0) bounceCoin.destroy();
  });
}

// Coins
const coinLabel = document.getElementById("coin-label");

// Init coin label
coinLabel.innerText = coins;

starr.onCollide("coin", (coin) => {
  if (!isInGame) return;

  // Destroy and add coin, play sfx
  coin.destroy();
  changeCoins(1, coin.pos, true);
  k.play("coin2", { volume: 0.5 });
});

// Silver Coins
const silverCoinLabel = document.getElementById("silver-coin-label");

// Init silver coin label
silverCoinLabel.innerText = silverCoins;

starr.onCollide("silver-coin", (coin) => {
  if (!isInGame) return;
  
  // Destroy and add coin, play sfx
  coin.destroy();
  changeCoins(1, coin.pos, false);
  k.play("coin1", { volume: 0.5 });
});

// Coin Bag
starr.onCollide("coin-bag", (bag) => {
  if (!isInGame) return;

  // Destroy bag and play sfx
  bag.destroy();
  k.play("coin1", { volume: 0.4 }).onEnd(() => k.play("coin2", { volume: 0.4 }));

  // Add 8-24 gold coins
  const goldCoins =  k.randi(2, 6);
  for (let i = 0; i < goldCoins; i++) changeCoins(4, bag.pos, true);
  
  // Add 16-48 silver coins
  const silverCoins = k.randi(2, 6);
  for (let i = 0; i < silverCoins; i++) changeCoins(8, bag.pos, false);

});

// Rocks
const healthBar = document.getElementById("health-bar");
function changeHealth(num, rockPos) {
  health += num;
  if (health > 100) {
    health = 100;
  } else if (health < 0) {
    health = 0;
  }
  
  // Set health bar
  healthBar.src = `./assets/sprites/health-bar/${health}.png`;
  
  // Destroy Starr when health < 0
  if (rockPos) {
    if (health <= 0) {
      health = 0;
      gameOver();
      explode(rockPos, true);
      k.play("explosion2", { volume: 1 });
    } else {
      explode(rockPos)
      k.play("explosion1", { volume: 0.8 });
    }
  }

}

function explode(rockPos, fatal = false) {
  const type = fatal ? "explosion-lg" : k.choose(["explosion-sm", "explosion-md"]);
  const shakeIntensity = fatal ? 20 : 10;
  const explosion = k.add([
    k.sprite(type),
    k.pos(rockPos),
    k.scale(fatal ? 5 : 3),
    k.anchor("center"),
    k.z(100)
  ]);

  // Play animation
  explosion.play("explode");
  explosion.onAnimEnd(() => explosion.destroy());
  
  // Shake screen
  k.shake(shakeIntensity);
  
  // Damage effect (flash) 
  starr.shader = "flash";
  setTimeout(() => starr.shader = null, 100);
  
}

starr.onCollide("rock", (rock) => {
  if (isInvincible || !isInGame) return;

  if (canDodge && k.chance(0.35)) {
    isInvincible = true;

    // Effect of the shop item "dodge"
    rock.onUpdate(() => rock.opacity -= 3 * k.dt());
    k.play("dodge", { volume: 0.8 });

    // Starr flicks
    const startX = starr.pos.x;
    k.tween(startX, startX + 25, 0.1, (x) => starr.pos.x = x).then(() => {
      k.tween(startX + 25, startX, 0.1, (x) => starr.pos.x = x);
    });

    // Invincible for 1 second
    setTimeout(() => {
      isInvincible = false;
      starr.opacity = 1;
    }, 1000);

  } else if (hasShield) {
    
    // Effect of the shop item "shield"
    hasShield = false;
    rock.destroy();
    
    // Destroy shield, set health bar, and explosion effect
    const shield = k.get("shield")[0];
    const explosion = k.add([
      k.sprite("shield-explosion", { width: shield.width, height: shield.height }),
      k.pos(starr.pos),
      k.scale(1),
      k.anchor("center"),
      k.opacity(0.75),
      k.z(starr.z - 1)
    ]);

    shield.destroy();
    healthBar.src = `./assets/sprites/health-bar/${health}.png`;

    k.play("shield-explode", { volume: 0.5 });
    explosion.onUpdate(() => {
      explosion.pos = starr.pos;
      explosion.scale = explosion.scale.add(k.vec2(8 * k.dt()));
      explosion.opacity -= 2 * k.dt();
      if (explosion.opacity <= 0) explosion.destroy();
    });
    
  } else {
    isInvincible = true;

    // Destroy rock and reduce health
    rock.destroy();
    changeHealth(-25, rock.pos);

    // Invincible for 1.5 second
    setTimeout(() => {
      isInvincible = false;
      starr.opacity = 1;
    }, 1500);

  }
});

// Health Potion
function recoverEffect() {
  const recover = k.add([
    k.sprite("recover"),
    k.pos(starr.pos),
    k.scale(3),
    k.opacity(1),
    k.anchor("center"),
    k.z(100)
  ]);
  
  // Fade out effect when anim ended
  let isFading = false;
  recover.onUpdate(() => {
    recover.pos = starr.pos;
    if (isFading) {
      recover.opacity -= 1.5 * k.dt();
      if (recover.opacity <= 0) recover.destroy();
    }
  });
  
  recover.play("recover");
  recover.onAnimEnd(() => {
    isFading = true;
    
    // Green border effect
    const border = k.add([
      k.sprite("starr-green-border"),
      k.pos(starr.pos),
      k.opacity(0.75),
      k.rotate(starr.angle),
      k.anchor("center"),
      k.z(starr.z - 1)
    ]);
    
    border.onUpdate(() => {
      border.pos = starr.pos;
      border.angle = starr.angle;
      border.opacity -= 1.5 * k.dt();
      if (border.opacity <= 0) border.destroy();
    });
    
  });
  
}

starr.onCollide("health-potion", (potion) => {
  if (!isInGame) return;

  // Destroy potion, increase health (if don't have shield), play sfx
  potion.destroy();
  recoverEffect();
  if (!hasShield) changeHealth(+25);
  k.play(k.choose(["buff1", "buff2", "buff3"]), { volume: 0.75 });
});

// Speed Potion
function speedupEffect() {
  const speedup = k.add([
    k.sprite("speedup"),
    k.pos(starr.pos),
    k.scale(3),
    k.opacity(1),
    k.anchor("center"),
    k.z(100)
  ]);
  
  // Fade out effect when anim ended
  let isFading = false;
  speedup.onUpdate(() => {
    speedup.pos = starr.pos;
    if (isFading) {
      speedup.opacity -= 1.5 * k.dt();
      if (speedup.opacity <= 0) speedup.destroy();
    }
  });
  
  speedup.play("speedup");
  speedup.onAnimEnd(() => {
    isFading = true;
    
    // Orange border effect
    const border = k.add([
      k.sprite("starr-orange-border"),
      k.pos(starr.pos),
      k.opacity(0.75),
      k.rotate(starr.angle),
      k.anchor("center"),
      k.z(starr.z - 1)
    ]);
    
    border.onUpdate(() => {
      border.pos = starr.pos;
      border.angle = starr.angle;
      border.opacity -= 1.5 * k.dt();
      if (border.opacity <= 0) border.destroy();
    });
    
  });
  
}

starr.onCollide("speed-potion", (potion) => {
  if (!isInGame) return;

  // Destroy potion and increase speed
  potion.destroy();
  speedupEffect();
  speed += 0.75;
  k.play(k.choose(["buff1", "buff2", "buff3"]), { volume: 0.75 });
});

// ------------------------------
// Meter Counter
// ------------------------------
const meterCounter = document.getElementById("meter-counter");
const bestDistanceLabel = document.getElementById("best-distance");

function truncTo(num, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.trunc(num * factor) / factor;
}

k.onUpdate(() => {
  if (!isInGame || died) return;
  meters += speed * k.dt();
  meterCounter.innerText = meters.toFixed(1) + "m";
});

// ------------------------------
// Overlay and Modals
// ------------------------------
const overlay = document.getElementById("overlay");

// Hide overlay and all modals
overlay.addEventListener("click", () => {
  overlay.classList.add("hidden");
  shopUI.classList.add("hidden");
});

// ------------------------------
// Shop Items
// ------------------------------
const SHOP_ITEMS = [
  { id: "item-shield", name: "Shield", currency: "silver-coin", price: 30, icon: "shield.png",
    info: "Give Starr a 25 HP shield on start", bought: false,
    onBuy: () => {
      addBuffIcon("shield");
      hasShield = true;
      
      const shield = k.add([
        k.sprite("shield"),
        k.scale(1.2),
        k.pos(starr.pos),
        k.anchor("center"),
        k.opacity(0.75),
        k.z(starr.z - 1),
        "shield"
      ]);
      shield.onUpdate(() => shield.pos = starr.pos);
      healthBar.src = "./assets/sprites/health-bar/125.png";
      
    }
  },
  { id: "item-speedy", name: "Speedy", currency: "silver-coin", price: 50, icon: "speedy.png",
    info: "Boosts your speed five times on start", bought: false,
    onBuy: () => {
      addBuffIcon("speedy");
      speed = 5;
    }
  },
  { id: "item-stasis", name: "Stasis", currency: "silver-coin", price: 80, icon: "stasis.png",
    info: "Makes nearby obstacles move slower", bought: false,
    onBuy: () => {
      addBuffIcon("stasis");
      isStasis = true;
      
      const stasis = k.add([
        k.sprite("stasis", { width: 150, height: 150 }),
        k.pos(starr.pos),
        k.anchor("center"),
        k.opacity(0.1),
        k.z(starr.z - 1)
      ]);
      stasis.onUpdate(() => stasis.pos = starr.pos);
      
    }
  },
  { id: "item-lucky", name: "Lucky", currency: "silver-coin", price: 100, icon: "lucky.png",
    info: "Spawns more good items and fewer bad ones", bought: false,
    onBuy: () => {
      addBuffIcon("lucky");
      for (const item of GAME_ITEMS) {
        if (item.category === "positive") {
          item.weight *= 1.5;
        } else if (item.category === "negative") {
          item.weight /= 1.5;
        }
      }
    }
  },
  { id: "item-dodge", name: "Dodge", currency: "coin", price: 20, icon: "dodge.png",
    info: "35% of dodging obstacle when hit", bought: false,
    onBuy: () => {
      addBuffIcon("dodge");
      canDodge = true;
    }
  },
  { id: "item-magnet", name: "Magnet", currency: "coin", price: 25, icon: "magnet.png",
    info: "Pulls nearby coins to your position automatically", bought: false,
    onBuy: () => {
      addBuffIcon("magnet");
      k.onUpdate(() => {
        if (!isInGame || died) return;
        const coins = k.get("coin").concat(k.get("silver-coin"));
        
        for (const coin of coins) {
          const dist = coin.pos.dist(starr.pos);
          if (dist <= 175) {
            const dir = starr.pos.sub(coin.pos).unit();
            coin.pos = coin.pos.add(dir.scale(400 * k.dt()));
          }
        }
        
      });
    }
  },
  { id: "item-double", name: "Double", currency: "coin", price: 35, icon: "double.png",
    info: "Double all coins collected by two", bought: false,
    onBuy: () => {
      addBuffIcon("double");
      doubleCoins = true;
    }
  },
];

const SAVED_SHOP_WINDOW = "starr_shop_window";
const SAVED_SHOP_ITEMS = "starr_shop_items";
const REFRESH_INTERVAL = 1000 * 60 * 5;

function getCurrentShopWindow() {
  return Math.floor(Date.now() / REFRESH_INTERVAL).toString();
}

function getShopItems() {
  const currentWindow = getCurrentShopWindow();
  const savedWindow = localStorage.getItem(SAVED_SHOP_WINDOW);
  const savedItemIds = localStorage.getItem(SAVED_SHOP_ITEMS);
  let itemIds = [];

  // If saved date is today return the saved items
  if (savedWindow === currentWindow && savedItemIds) {
    itemIds = JSON.parse(savedItemIds);
  } else {

    // Choose three random items' id
    const newItems = k.chooseMultiple(SHOP_ITEMS, 3);
    itemIds = newItems.map(item => item.id);

    localStorage.setItem(SAVED_SHOP_WINDOW, currentWindow);
    localStorage.setItem(SAVED_SHOP_ITEMS, JSON.stringify(itemIds));
  }

  // Return those ids' item objects
  return itemIds.map(id => SHOP_ITEMS.find(item => item.id === id));
}

const shopItemsContainer = document.getElementById("shop-items");
const shopItemInfoLabel = document.getElementById("shop-item-info");
let focusingItem = null;

function renderShopItems() {
  const todayItems = getShopItems();
  
  // Clear old items
  shopItemsContainer.innerHTML = "";
  
  // Render new items
  todayItems.forEach((item) => {
    const itemElement = document.createElement("button");
    itemElement.id = item.id;
    itemElement.className = "flex flex-col justify-center items-center px-4 py-3 cursor-pointer";
    itemElement.innerHTML = `
      <img src="./assets/sprites/statics/${item.icon}" class="w-12 h-12">
      <span class="block text-lg [-webkit-text-stroke:4px_#000] [paint-order:stroke_fill]">${item.name}</span>
      <div class="flex justify-between items-center gap-2">
        <img src="./assets/sprites/${item.currency}/frame1.png" class="w-4 h-4">
        <span class="text-md [-webkit-text-stroke:3px_#222] [paint-order:stroke_fill]">${item.price}</span>
      </div>
    `;

    // Add item to DOM and click event listener
    shopItemsContainer.appendChild(itemElement);
    itemElement.addEventListener("click", () => {

      // If it's touch device and not focusing the item
      if (isTouchDevice && focusingItem !== item.id) {
        
        // Set focus state and show info
        focusingItem = item.id;
        shopItemInfoLabel.innerHTML = item.info;

        // Remove pixel corner on all other items and add to this item
        for (const itemEl of shopItemsContainer.children) itemEl.classList.remove("pixel-corner");
        itemElement.classList.add("pixel-corner");

        return;
      }

      // Attempt to buy the item
      buyItem(itemElement, item);

    });
    
    // Show item info when mouse hovered, hide when leave
    itemElement.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse") {
        shopItemInfoLabel.innerHTML = item.info;
      }
    });

    itemElement.addEventListener("pointerleave", (e) => {
      if (e.pointerType === "mouse") {
        shopItemInfoLabel.innerHTML = "(Hover to see info)";
      }
    });

  });

}

// ShopItemInfoLabel inner text init
if (isTouchDevice) {
  shopItemInfoLabel.innerHTML = "(Click to see info)";
} else {
  shopItemInfoLabel.innerHTML = "(Hover to see info)";
}

// Shop Timer
const shopTimerLabel = document.getElementById("shop-timer");
let timerInterval = null;

function updateShopTimer() {
  const now = Date.now();
  const timeRemaining = REFRESH_INTERVAL - (now % REFRESH_INTERVAL);

  // Render shop timer
  const totalSeconds = Math.floor(timeRemaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  shopTimerLabel.innerText = `Refresh in ${formattedTime}`;

  // Stop timer if refreshed
  if (totalSeconds === 0) clearInterval(timerInterval);
}

// Set and init timer
timerInterval = setInterval(updateShopTimer, 1000);
updateShopTimer();

// ------------------------------
// Shop
// ------------------------------
const shopBtn = document.getElementById("shop-btn");
const shopUI = document.getElementById("shop-ui");
shopBtn.addEventListener("click", (e) => {
  shopUI.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

function buyItem(btn, item) {
  if (item.bought) return;

  const isGold = item.currency === "coin";
  const currentBalance = isGold ? coins : silverCoins;

  // If enough coins
  if (currentBalance >= item.price) {

    // Buy the item and reduce coins
    changeCoins(-item.price, null, isGold);
    item.bought = true;
    btn.classList.add("opacity-50");
    item.onBuy();

    // Play sfx, vfx, and show success prompt
    k.play(item.currency === "silver-coin" ? "coin1" : "coin2", { volume: 0.5 });
    // ADD VFX
    shopItemInfoLabel.innerHTML = k.choose(["Purchase successful!", "Item acquired!", "A fine choice!"]);

  } else {

    // Play sfx, vfn, and show fail prompt
    k.play("failed", { volume: 0.5 });
    btn.animate(
      [
        { transform: 'translateX(0)', opacity: 0.5, offset: 0 },
        { transform: 'translateX(-8px)', opacity: 0.5, offset: 0.1 },
        { transform: 'translateX(6px)', opacity: 0.6, offset: 0.25 },
        { transform: 'translateX(-4px)', opacity: 0.7, offset: 0.4 },
        { transform: 'translateX(3px)', opacity: 0.8, offset: 0.55 },
        { transform: 'translateX(-2px)', opacity: 0.9, offset: 0.7 },
        { transform: 'translateX(1px)', opacity: 0.95, offset: 0.85 },
        { transform: 'translateX(0)', opacity: 1, offset: 1 }
      ],
      {
        duration: 500,
        easing: 'ease-in-out'
      }
    );
    shopItemInfoLabel.innerHTML = "Not enough coins!";

  }
}

const bottomBar = document.getElementById("bottom-bar");
function addBuffIcon(buffName) {
  const buffIcon = document.createElement("div");
  buffIcon.className = "w-10 h-10 bg-[url('./assets/sprites/statics/buff-icon.png')] bg-cover bg-center flex justify-center items-center p-2";
  buffIcon.innerHTML = `<img src="./assets/sprites/statics/${buffName}.png" class="w-full h-full">`;
  bottomBar.appendChild(buffIcon);
}

// Init shop once
renderShopItems();
