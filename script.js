let username = "", wallet = "", score = 0, tokens = 0;
let isJumping = false, velocityY = 0;
const gravity = 0.5;
const doge = { x: 50, y: 230, width: 50, height: 50 };
let obstacles = [], leaves = [];
let gameRunning = true;
const requestUrl = "https://script.google.com/macros/s/AKfycby4c3w7LpvxR6ncn4kbSCSxujJNiLmgCumai83gqIzN20VyUeGP_zh8-ildiky1lIs/exec";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump);

function jump() {
  if (!isJumping) {
    velocityY = -10;
    isJumping = true;
  }
}

async function startGame() {
  username = document.getElementById("username").value.trim();
  wallet = document.getElementById("wallet").value.trim();

  if (!username || !wallet) {
    alert("Please fill in all fields.");
    return;
  }

  if (!/^[a-zA-Z0-9]{25,50}$/.test(wallet)) {
    alert("Invalid wallet address.");
    return;
  }

  const valid = await checkDuplicate(username, wallet);
  if (!valid) {
    alert("Username or wallet already registered.");
    return;
  }

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  document.getElementById("bg-music").play();

  initGame();
}

function initGame() {
  score = 0;
  tokens = 0;
  obstacles = [];
  leaves = [];
  doge.y = 230;
  gameRunning = true;
  update();
}

function update() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // gravity
  velocityY += gravity;
  doge.y += velocityY;

  if (doge.y > 230) {
    doge.y = 230;
    isJumping = false;
  }

  // draw doge
  ctx.fillStyle = "#0f0";
  ctx.fillRect(doge.x, doge.y, doge.width, doge.height);

  // generate obstacles
  if (Math.random() < 0.02) {
    obstacles.push({ x: 800, y: 230, width: 30, height: 50 });
  }

  // draw obstacles
  ctx.fillStyle = "#f00";
  obstacles.forEach((ob, i) => {
    ob.x -= 5;
    ctx.fillRect(ob.x, ob.y, ob.width, ob.height);

    if (collision(doge, ob)) {
      gameOver();
    }
  });

  // generate leaves
  if (Math.random() < 0.01) {
    leaves.push({ x: 800, y: 200, size: 20 });
  }

  // draw leaves
  ctx.fillStyle = "#0f5";
  leaves.forEach((leaf, i) => {
    leaf.x -= 5;
    ctx.beginPath();
    ctx.arc(leaf.x, leaf.y, leaf.size, 0, Math.PI * 2);
    ctx.fill();

    if (collision(doge, { x: leaf.x - 10, y: leaf.y - 10, width: 20, height: 20 })) {
      tokens += 10;
      leaves.splice(i, 1);
    }
  });

  // update score
  score++;
  document.getElementById("score").innerText = score;
  document.getElementById("tokens").innerText = tokens;

  requestAnimationFrame(update);
}

function collision(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
}

function gameOver() {
  gameRunning = false;
  alert(`Game Over!\nScore: ${score}`);
  sendData(tokens, 0, tokens);
  document.getElementById("restart-btn").style.display = "inline-block";
}

function restartGame() {
  location.reload();
}

function requestWithdraw() {
  if (tokens < 1000) {
    alert("Minimum withdrawal is 1000 tokens.");
    return;
  }
  sendData(tokens, tokens, 0);
  tokens = 0;
  alert("Withdrawal requested!");
}

async function checkDuplicate(username, wallet) {
  const res = await fetch(requestUrl + `?username=${username}&wallet=${wallet}&check=1`);
  const txt = await res.text();
  return txt !== "DUPLICATE";
}

function sendData(total, withdraw, remaining) {
  fetch(requestUrl + `?username=${username}&wallet=${wallet}&total=${total}&withdraw=${withdraw}&remaining=${remaining}`);
}
