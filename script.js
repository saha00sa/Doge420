const sheetURL = "https://script.google.com/macros/s/AKfycbzUaphanndtbt6rTlGU9fMIHtNMZH9sNW_mmi2WNLo5yX7is78Unuv69KJryRv8tjFw/exec";

let username = "";
let wallet = "";
let score = 0;
let tokens = 0;
let isGameOver = false;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const jumpSound = new Audio();
const bgMusic = document.getElementById("bg-music");

let doge = { x: 50, y: 220, width: 50, height: 50, dy: 0, jumping: false };
let obstacles = [];
let leaves = [];

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

canvas.addEventListener("touchstart", jump, false);

function startGame() {
  username = document.getElementById("username").value.trim();
  wallet = document.getElementById("wallet").value.trim();

  if (!username || !wallet || wallet.length < 25) {
    alert("Please enter valid username and Dogecoin wallet (at least 25 characters).");
    return;
  }

  fetch(`${sheetURL}?check=1&username=${username}&wallet=${wallet}`)
    .then(res => res.json())
    .then(data => {
      if (data.exists) {
        alert("Username or Wallet already registered!");
      } else {
        document.getElementById("start-screen").style.display = "none";
        document.getElementById("game-screen").style.display = "block";
        bgMusic.play();
        init();
      }
    })
    .catch(err => {
      alert("Connection error. Try again.");
      console.error(err);
    });
}

function init() {
  doge.y = 220;
  doge.dy = 0;
  doge.jumping = false;
  score = 0;
  tokens = 0;
  isGameOver = false;
  obstacles = [];
  leaves = [];
  spawnObstacles();
  requestAnimationFrame(update);
}

function jump() {
  if (!doge.jumping) {
    doge.dy = -10;
    doge.jumping = true;
  }
}

function spawnObstacles() {
  setInterval(() => {
    if (!isGameOver) {
      obstacles.push({ x: 800, y: 240, width: 30, height: 30 });
    }
  }, 2000);

  setInterval(() => {
    if (!isGameOver) {
      leaves.push({ x: 800, y: 200, width: 20, height: 20 });
    }
  }, 3000);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Doge
  doge.y += doge.dy;
  doge.dy += 0.5;
  if (doge.y > 220) {
    doge.y = 220;
    doge.dy = 0;
    doge.jumping = false;
  }
  ctx.fillStyle = "gold";
  ctx.fillRect(doge.x, doge.y, doge.width, doge.height);

  // Obstacles
  ctx.fillStyle = "red";
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= 5;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    if (isColliding(doge, obs)) {
      gameOver();
      return;
    }
  }

  // Leaves
  ctx.fillStyle = "green";
  for (let i = 0; i < leaves.length; i++) {
    let leaf = leaves[i];
    leaf.x -= 5;
    ctx.fillRect(leaf.x, leaf.y, leaf.width, leaf.height);

    if (isColliding(doge, leaf)) {
      leaves.splice(i, 1);
      tokens += 10;
      document.getElementById("tokens").innerText = tokens;
    }
  }

  score++;
  document.getElementById("score").innerText = score;
  requestAnimationFrame(update);
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function gameOver() {
  isGameOver = true;
  document.getElementById("restart-btn").style.display = "inline-block";
  sendData();
}

function restartGame() {
  document.getElementById("restart-btn").style.display = "none";
  init();
}

function sendData() {
  fetch(sheetURL, {
    method: "POST",
    body: JSON.stringify({
      username,
      wallet,
      score,
      tokens,
    }),
  })
    .then(res => res.text())
    .then(() => console.log("Data sent"))
    .catch(err => console.error("Send error:", err));
}

function requestWithdraw() {
  if (tokens < 1000) {
    alert("Minimum 1000 tokens required to withdraw.");
    return;
  }

  fetch(sheetURL, {
    method: "POST",
    body: JSON.stringify({
      username,
      wallet,
      amount: tokens,
      withdraw: true,
    }),
  })
    .then(res => res.text())
    .then(() => {
      alert("Withdraw request sent.");
      tokens = 0;
      document.getElementById("tokens").innerText = tokens;
    })
    .catch(err => {
      alert("Withdraw error.");
      console.error(err);
    });
}
