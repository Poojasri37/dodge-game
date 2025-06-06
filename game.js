const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 180, y: 550, width: 40, height: 40 };
let enemies = [{ x: Math.random() * 360, y: 0 }];
let score = 0;
let enemySpeed = 5;
let gameOver = false;
let keys = {};

function drawPlayer() {
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemies() {
  ctx.fillStyle = "red";
  for (let e of enemies) {
    ctx.fillRect(e.x, e.y, 40, 40);
  }
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function updateEnemies() {
  for (let e of enemies) {
    e.y += enemySpeed;
    if (e.y > 600) {
      e.y = 0;
      e.x = Math.random() * 360;
      score++;
    }

    // Collision detection
    if (
      e.x < player.x + player.width &&
      e.x + 40 > player.x &&
      e.y < player.y + player.height &&
      e.y + 40 > player.y
    ) {
      gameOver = true;
    }
  }

  let expectedEnemies = Math.min(1 + Math.floor(score / 3), 5);
  while (enemies.length < expectedEnemies) {
    enemies.push({ x: Math.random() * 360, y: 0 });
  }

  enemySpeed = 5 + Math.floor(score / 5);
}

function updatePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= 5;
  if (keys["ArrowRight"] && player.x < 360) player.x += 5;
}

function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 600);
    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.fillText("Game Over!", 100, 280);
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 150, 320);
    ctx.fillText("Press R to Restart", 100, 360);
    return;
  }

  ctx.clearRect(0, 0, 400, 600);
  drawPlayer();
  drawEnemies();
  drawScore();
  updateEnemies();
  updatePlayer();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (gameOver && e.key.toLowerCase() === "r") {
    // Restart
    player.x = 180;
    enemies = [{ x: Math.random() * 360, y: 0 }];
    score = 0;
    enemySpeed = 5;
    gameOver = false;
    requestAnimationFrame(gameLoop);
  }
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

requestAnimationFrame(gameLoop);
