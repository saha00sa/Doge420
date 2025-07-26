let username = '';
let wallet = '';
let totalTokens = 0;
let score = 0;
let gameStarted = false;

// رابط Google Apps Script تبعك
const scriptURL = "https://script.google.com/macros/s/AKfycbycI-8de_koyjAb0Sj4oGoPI1Glf-rE-vtQEoEjRhQLLcQ5bztwOCZ5lBeK3LM4dicF/exec";

function startGame() {
  username = document.getElementById("username").value.trim();
  wallet = document.getElementById("wallet").value.trim();

  if (username === "" || wallet === "") {
    alert("Please enter both username and Dogecoin wallet address.");
    return;
  }

  if (wallet.length < 25 || wallet.length > 40) {
    alert("Invalid wallet address.");
    return;
  }

  // إخفاء شاشة البداية و إظهار اللعبة
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  // تشغيل الموسيقى
  document.getElementById("bg-music").play();

  // إرسال البيانات للسيرفر
  fetch(scriptURL, {
    method: 'POST',
    body: new URLSearchParams({
      username: username,
      wallet: wallet,
      totalTokens: totalTokens,
      requestWithdraw: 0,
      remainingBalance: 0
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to submit");
    console.log("Registered:", username);
    initGame(); // دالة تبدأ اللعبة فعليًا
  })
  .catch(err => {
    alert("Error sending data to server.");
    console.error(err);
  });
}

function requestWithdraw() {
  if (totalTokens < 1000) {
    alert("You need at least 1000 tokens to withdraw.");
    return;
  }

  const withdrawAmount = totalTokens;
  const remaining = 0;

  fetch(scriptURL, {
    method: 'POST',
    body: new URLSearchParams({
      username: username,
      wallet: wallet,
      totalTokens: totalTokens,
      requestWithdraw: withdrawAmount,
      remainingBalance: remaining
    })
  }).then(() => {
    alert("Withdraw request sent.");
    totalTokens = 0;
    document.getElementById("tokens").textContent = totalTokens;
  });
}

// دالة مبدئية لتشغيل اللعبة
function initGame() {
  gameStarted = true;
  score = 0;
  totalTokens = 0;
  document.getElementById("score").textContent = score;
  document.getElementById("tokens").textContent = totalTokens;
  startGameLoop();
}

// loop بسيط
function startGameLoop() {
  // مثال فقط: عداد نقاط
  setInterval(() => {
    if (!gameStarted) return;
    score += 1;
    if (score % 10 === 0) {
      totalTokens += 10;
      document.getElementById("tokens").textContent = totalTokens;
    }
    document.getElementById("score").textContent = score;
  }, 500);
}

function restartGame() {
  location.reload();
}

// اللمس للموبايل
document.addEventListener("touchstart", () => {
  // نفذ قفز هنا
});
