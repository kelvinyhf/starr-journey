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
      ${doubleCoins ? "<span class='text-lg'>(Doubled!)</span>" : ""}
    `;
    bestDistanceLabel.innerHTML = `Best Distance <span class="text-xl text-red-10">${bestDistance}m</span>`;
  }, 1000);

}

function getDifficulty() {
  return Math.min(1 + (meters / 20) * 0.025, 5);
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

let GAME_ITEMS = [

  // Basic Items (Coin and Rocks)
  { name: "coin", type: "coin", weight: 1, anim: { anim: "idle" }, category: "positive" },
  { name: "silver-coin", type: "silver-coin", weight: 3, anim: { anim: "idle" }, category: "positive" },
  { name: "rock-sm", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: [90, 90], category: "negative" },
  { name: "rock-md", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: [90, 90], category: "negative" },
  { name: "rock-lg", type: "rock", weight: 2, scale: [0.1, 0.3], hitbox: [90, 90], category: "negative" },

  // Pickups
  { name: "health-potion", type: "health-potion", weight: 0.05, scale: [1, 1.25], category: "positive" },
  { name: "speed-potion", type: "speed-potion", weight: 0.3, scale: [1, 1.25], category: "positive" },

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
  const baseInterval = isInGame ? 0.35 : 0.75;
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
      k.pos(k.rand(minX, maxX), -500),
      k.scale(randomScale),
      k.rotate(k.rand(0, 360)),
      k.anchor("center"),
      k.area(hitbox),
      k.opacity(1),
      k.z(itemConfig.zIndex || 10),
      itemConfig.type,
      "item"
    ]);

    const spinSpeed = k.rand(-120, 120);

    // Drop and spin
    item.onUpdate(() => {
      
      // Effect of the shop item "stasis"
      item.pos.y += randomSpeed * k.dt() * (itemConfig.type === "rock" && isStasis && item.pos.dist(starr.pos) <= 175 ? 0.85 : 1);
      
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

// Rocks
const healthBar = document.getElementById("health-bar");
function changeHealth(num, rockPos, isShield = false) {
  health += num;
  if (health > 100) {
    if (isShield) {
      health = 125;
    } else {
      health = 100;
    }
  } else if (health < 0) {
    health = 0;
  }

  if (health <= 0) {
    healthBar.src = "./assets/sprites/health-bar/0.png";
  } else if (health <= 25) {
    healthBar.src = "./assets/sprites/health-bar/25.png";
  } else if (health <= 50) {
    healthBar.src = "./assets/sprites/health-bar/50.png";
  } else if (health <= 75) {
    healthBar.src = "./assets/sprites/health-bar/75.png";
  } else if (health <= 100) {
    healthBar.src = "./assets/sprites/health-bar/100.png";
  } else if (health <= 125) {
    healthBar.src = "./assets/sprites/health-bar/125.png";
  }
  
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

  // Effect of the shop item "dodge"
  if (canDodge && k.chance(1)) {
    rock.onUpdate(() => {
      rock.opacity -= 3 * k.dt(); // Add more effects
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

  // Destroy potion and increase health
  potion.destroy();
  recoverEffect();
  if (health > 100) {
    changeHealth(+25, null, true);
  } else {
    changeHealth(+25);
  }
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
overlay.addEventListener("click", (e) => {
  e.stopPropagation();

  // Hide overlay and all modals
  overlay.classList.add("hidden");
  shopUI.classList.add("hidden");

});

// ------------------------------
// Shop Items
// ------------------------------
const SHOP_ITEMS = [
  { id: "item-speedy", name: "Speedy", currency: "silver-coin", price: 1, icon: "speedy.png", // 75
    info: "Boosts your speed five times on start",
    onBuy: () => {
      speed = 5;
    }
  },
  { id: "item-shield", name: "Shield", currency: "silver-coin", price: 1, icon: "shield.png", // 75
    info: "Give Starr a 25 HP shield on start",
    onBuy: () => {
      changeHealth(25, null, true);
    }
  },
  { id: "item-lucky", name: "Lucky", currency: "silver-coin", price: 1, icon: "lucky.png", // 100
    info: "Spawns more good items and fewer bad ones",
    onBuy: () => {
      for (const item of GAME_ITEMS) {
        if (item.category === "positive") {
          item.weight *= 2;
        } else if (item.category === "negative") {
          item.weight /= 2;
        }
      }
    }
  },
  { id: "item-stasis", name: "Stasis", currency: "silver-coin", price: 1, icon: "stasis.png", // 125
    info: "Makes nearby obstacles move slower",
    onBuy: () => {
      isStasis = true;
    }
  },
  { id: "item-dodge", name: "Dodge", currency: "silver-coin", price: 1, icon: "dodge.png", // 20 Gold
    info: "50% of dodging obstacle when hit",
    onBuy: () => {
      canDodge = true;
    }
  },
  { id: "item-magnet", name: "Magnet", currency: "silver-coin", price: 1, icon: "magnet.png", // 25 Gold
    info: "Pulls nearby coins to your position automatically",
    onBuy: () => {
      const MAGNET_RADIUS = 175;
      const MAGNET_SPEED = 400;
      
      k.onUpdate(() => {
        if (!isInGame) return;
        const coins = k.get("coin").concat(k.get("silver-coin"));
        
        for (const coin of coins) {
          const dist = coin.pos.dist(starr.pos);
          if (dist <= MAGNET_RADIUS) {
            const dir = starr.pos.sub(coin.pos).unit();
            coin.pos = coin.pos.add(dir.scale(MAGNET_SPEED * k.dt()));
          }
        }
        
      });
    }
  },
  { id: "item-double", name: "Double", currency: "silver-coin", price: 1, icon: "double.png", // 35 Gold
    info: "Double all coins collected by two",
    onBuy: () => {
      doubleCoins = true;
    }
  },
  /* { id: "item-kaboom", name: "Kaboom", currency: "silver-coin", price: 1, icon: "kaboom.png", // 50 Gold
    info: "Ka? Then Boom!",
    onBuy: () => {
      
    }
  }, */
];

const SAVED_SHOP_WINDOW = "starr_shop_window";
const SAVED_SHOP_ITEMS = "starr_shop_items";
const REFRESH_INTERVAL = 10000;

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

function renderShopItems() {
  const shopItemsContainer = document.getElementById("shop-items");
  const shopItemInfoLabel = document.getElementById("shop-item-info");
  const todayItems = getShopItems();
  
  // Clear old items
  shopItemsContainer.innerHTML = "";
  
  // Render new items
  todayItems.forEach((item) => {
    const itemElement = document.createElement("button");
    itemElement.id = item.id;
    itemElement.className = "flex flex-col justify-center items-center cursor-pointer";
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
      const isGold = item.currency === "coin";
      const currentBalance = isGold ? coins : silverCoins;

      if (currentBalance >= item.price) {
        changeCoins(-item.price, null, isGold);
        boughtItem(itemElement, item.currency, false);
        item.onBuy();
      } else {
        boughtItem(itemElement, item.currency, true);
      }
    });
    
    // Show item info when hovered
    itemElement.addEventListener("pointerenter", () => {
      shopItemInfoLabel.innerText = item.info;
    });
    
  });

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
  e.stopPropagation();
  shopUI.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

shopUI.addEventListener("click", (e) => {
  e.stopPropagation();
});

function boughtItem(btn, currency, failed = false) {
  if (!failed) {
    btn.classList.add("pointer-events-none", "cursor-default", "opacity-50");
    k.play(currency === "silver-coin" ? "coin1" : "coin2", { volume: 0.5 });
    // ADD COIN BOUNCE UP EFFECT
  } else {
    // SHAKE
    // PLAY FAILED SFX
  }
}

// Init shop once
renderShopItems();
