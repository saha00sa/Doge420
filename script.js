let canvas, ctx;
let doge, obstacles = [], leaves = [];
let score = 0, tokens = 0;
let isJumping = false, velocityY = 0, gravity = 0.5;
let username = '', wallet = '';
let requestUrl = "https://script.google.com/macros/s/AKfycby4c3w7LpvxR6ncn4kbSCSxujJNiLmgCumai83gqIzN20VyUeGP_zh8-ildiky1lIs/exec";

function startGame() {
  username = document.getElementById("username").value.trim();
  wallet = document.getElementById("wallet").value.trim();

  if (!username || !wallet) {
    alert("Please fill in all fields.");
    return;
  }

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  doge = { x: 50, y: 250, w: 40, h: 40 };

  document.getElementById("bg-music").play();
  spawnObstacles();
  spawnLeaves();
  gameLoop();
}

function spawnObstacles() {
  setInterval(() => {
    obstacles.push({ x: canvas.width, y: 260, w: 20, h: 40 });
  }, 2000);
}

function spawnLeaves() {
  setInterval(() => {
    leaves.push({ x: canvas.width, y: 230, w: 20, h: 20 });
  }, 1500);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Gravity
  velocityY += gravity;
  doge.y += velocityY;
  if (doge.y > 250) {
    doge.y = 250;
    isJumping = false;
  }

  // Draw doge
  ctx.fillStyle = "orange";
  ctx.fillRect(doge.x, doge.y, doge.w, doge.h);

  // Draw obstacles (police)
  ctx.fillStyle = "blue";
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let ob = obstacles[i];
    ob.x -= 5;
    ctx.fillRect(ob.x, ob.y, ob.w, ob.h);

    if (collision(doge, ob)) {
      alert("Game Over!\nScore: " + score);
      sendData();
      location.reload();
    }

    if (ob.x + ob.w < 0) obstacles.splice(i, 1);
  }

  // Draw leaves
  ctx.fillStyle = "green";
  for (let i = leaves.length - 1; i >= 0; i--) {
    let lf = leaves[i];
    lf.x -= 4;
    ctx.fillRect(lf.x, lf.y, lf.w, lf.h);

    if (collision(doge, lf)) {
      score += 10;
      tokens += 10;
      document.getElementById("score").innerText = score;
      document.getElementById("tokens").innerText = tokens;
      leaves.splice(i, 1);
    }

    if (lf.x + lf.w < 0) leaves.splice(i, 1);
  }

  requestAnimationFrame(gameLoop);
}

function collision(a, b) {
  return a.x < b.x + b.w &&
         a.x + a.w > b.x &&
         a.y < b.y + b.h &&
         a.y + a.h > b.y;
}

document.addEventListener("keydown", (e) => {
  if ((e.code === "Space" || e.code === "ArrowUp") && !isJumping) {
    velocityY = -10;
    isJumping = true;
  }
});

function sendData(withdraw = 0) {
  let remaining = tokens - withdraw;
  fetch(requestUrl + `?username=${username}&wallet=${wallet}&total=${tokens}&withdraw=${withdraw}&remaining=${remaining}`);
}

function requestWithdraw() {
  if (tokens < 1000) {
    alert("You need at least 1000 tokens to withdraw.");
    return;
  }
  sendData(tokens);
  alert("Withdrawal request sent!");
  tokens = 0;
  document.getElementById("tokens").innerText = tokens;
}
