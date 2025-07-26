const sheetURL = "https://script.google.com/macros/s/AKfycby4c3w7LpvxR6ncn4kbSCSxujJNiLmgCumai83gqIzN20VyUeGP_zh8-ildiky1lIs/exec";

let score = 0;
let tokens = 0;
let isGameOver = false;
let username = "";
let wallet = "";

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", jump);
  document.addEventListener("touchstart", jump);
});

function startGame() {
  username = document.getElementById("username").value.trim();
  wallet = document.getElementById("wallet").value.trim();

  if (!username || !wallet) {
    alert("Please enter both username and wallet address.");
    return;
  }

  if (wallet.length < 30) {
    alert("Invalid Dogecoin wallet address (too short).");
    return;
  }

  // منع تكرار الاسم أو المحفظة
  fetch(`${sheetURL}?check=1&username=${username}&wallet=${wallet}`)
    .then(res => res.json())
    .then(data => {
      if (data.exists) {
        alert("Username or wallet already exists.");
      } else {
        document.getElementById("start-screen").style.display = "none";
        document.getElementById("game-screen").style.display = "block";
        document.getElementById("bg-music").play();
        initGame();
      }
    })
    .catch(err => alert("Connection error. Try again."));
}

function initGame() {
  score = 0;
  tokens = 0;
  isGameOver = false;
  // بدء اللعبة هنا...
}

function jump() {
  if (isGameOver) return;
  // منطق القفز هنا
}

function endGame() {
  isGameOver = true;
  tokens = Math.floor(score / 10) * 10;
  document.getElementById("tokens").textContent = tokens;
  document.getElementById("restart-btn").style.display = "block";

  fetch(sheetURL, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      wallet: wallet,
      score: score,
      tokens: tokens
    }),
    headers: { "Content-Type": "application/json" }
  });
}

function restartGame() {
  document.getElementById("restart-btn").style.display = "none";
  initGame();
}

function requestWithdraw() {
  if (tokens < 1000) {
    alert("Minimum 1000 tokens required to withdraw.");
    return;
  }

  fetch(sheetURL, {
    method: "POST",
    body: JSON.stringify({
      withdraw: true,
      username: username,
      wallet: wallet,
      amount: tokens
    }),
    headers: { "Content-Type": "application/json" }
  });

  tokens = 0;
  document.getElementById("tokens").textContent = tokens;
  alert("Withdrawal request sent!");
}
