let username = "";
let walletAddress = "";
let score = 0;
let totalTokens = 0;
let gameStarted = false;

function startGame() {
  username = document.getElementById("username").value.trim();
  walletAddress = document.getElementById("wallet").value.trim();

  if (username === "" || walletAddress.length < 25) {
    alert("Please enter a valid username and wallet address.");
    return;
  }

  // Save to Google Sheets
  fetch("https://script.google.com/macros/s/AKfycbycI-8de_koyjAb0Sj4oGoPI1Glf-rE-vtQEoEjRhQLLcQ5bztwOCZ5lBeK3LM4dicF/exec", {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      username: username,
      wallet: walletAddress,
      score: 0,
      tokens: 0,
      withdraw: 0,
      balance: 0
    })
  });

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  document.getElementById("bg-music").play();

  initGame();
}

function requestWithdraw() {
  if (totalTokens < 1000) {
    alert("Minimum withdraw is 1000 tokens.");
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbycI-8de_koyjAb0Sj4oGoPI1Glf-rE-vtQEoEjRhQLLcQ5bztwOCZ5lBeK3LM4dicF/exec", {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      username: username,
      wallet: walletAddress,
      score: score,
      tokens: totalTokens,
      withdraw: totalTokens,
      balance: 0
    })
  });

  alert("Withdraw request sent!");
  totalTokens = 0;
  document.getElementById("tokens").textContent = totalTokens;
}

function restartGame() {
  document.getElementById("restart-btn").style.display = "none";
  score = 0;
  totalTokens = 0;
  player.y = 250;
  obstacles = [];
  gameStarted = true;
  document.getElementById("score").textContent = score;
  document.getElementById("tokens").textContent = totalTokens;
  update();
}

// ===== Game Logic =====

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
  x: 50,
  y: 250,
  width: 50,
  height: 50,
  velocityY: 0,
  gravity: 1.5,
  jumpPower: -18,
  grounded: true
};

let obstacles = [];

function drawPlayer() {
  ctx.fillStyle = "#ffcc00"; // Replace with Doge image later
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function jump() {
  if (player.grounded) {
    player.velocityY = player.jumpPower;
    player.grounded = false;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});
document.addEventListener("touchstart", jump);

function spawnObstacle() {
  obstacles.push({
    x: 800,
    y: 260,
    width: 40,
    height: 40
  });
}

function drawObstacles() {
  ctx.fillStyle = "red"; // Replace with police image later
  obstacles.forEach((obs) => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
}

function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function gameOver() {
  gameStarted = false;
  document.getElementById("restart-btn").style.display = "block";
}

function update() {
  if (!gameStarted) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.velocityY += player.gravity;
  player.y += player.velocityY;

  if (player.y >= 250) {
    player.y = 250;
    player.velocityY = 0;
    player.grounded = true;
  }

  drawPlayer();

  obstacles.forEach((obs) => {
    obs.x -= 6;
    if (checkCollision(player, obs)) gameOver();
  });

  drawObstacles();

  obstacles = obstacles.filter((obs) => obs.x + obs.width > 0);

  requestAnimationFrame(update);
}

function initGame() {
  gameStarted = true;
  score = 0;
  totalTokens = 0;
  document.getElementById("score").textContent = score;
  document.getElementById("tokens").textContent = totalTokens;

  setInterval(() => {
    if (gameStarted) spawnObstacle();
  }, 2000);

  setInterval(() => {
    if (gameStarted) {
      score += 1;
      if (score % 10 === 0) {
        totalTokens += 10;
        document.getElementById("tokens").textContent = totalTokens;
      }
      document.getElementById("score").textContent = score;
    }
  }, 500);

  update();
}
