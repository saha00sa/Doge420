// script.js let username = ""; let wallet = ""; let totalTokens = 0; let score = 0; let tokenPerLeaf = 10; const minWithdraw = 1000; let isJumping = false; let gameStarted = false; let sentUsers = {};

function startGame() { username = document.getElementById("username").value.trim(); wallet = document.getElementById("wallet").value.trim();

if (username === "" || wallet === "") { alert("Please enter your username and wallet address."); return; }

if (wallet.length < 25) { alert("Invalid wallet address. Must be at least 25 characters."); return; }

if (localStorage.getItem("user_" + username) || localStorage.getItem("wallet_" + wallet)) { alert("Username or wallet already used."); return; }

localStorage.setItem("user_" + username, true); localStorage.setItem("wallet_" + wallet, true);

document.getElementById("start-screen").style.display = "none"; document.getElementById("game-screen").style.display = "block"; document.getElementById("bg-music").play();

gameStarted = true; score = 0; totalTokens = 0; document.getElementById("score").innerText = score; document.getElementById("tokens").innerText = totalTokens; runGameLoop(); }

function runGameLoop() { // Placeholder: add your full game logic here const canvas = document.getElementById("gameCanvas"); const ctx = canvas.getContext("2d"); ctx.fillStyle = "#444"; ctx.fillRect(0, 0, canvas.width, canvas.height); // Add game animations, character, obstacles etc. }

function requestWithdraw() { if (totalTokens < minWithdraw) { alert("Minimum 1000 tokens required to withdraw."); return; } const remaining = totalTokens - minWithdraw; fetch("https://script.google.com/macros/s/AKfycbycI-8de_koyjAb0Sj4oGoPI1Glf-rE-vtQEoEjRhQLLcQ5bztwOCZ5lBeK3LM4dicF/exec", { method: "POST", mode: "no-cors", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ username: username, wallet: wallet, total_tokens: totalTokens, requested_withdraw: minWithdraw, remaining_tokens: remaining }) }); totalTokens = remaining; document.getElementById("tokens").innerText = totalTokens; alert("Withdraw request sent!"); }

function restartGame() { document.getElementById("restart-btn").style.display = "none"; document.getElementById("bg-music").play(); runGameLoop(); }

document.addEventListener("keydown", function (e) { if (e.code === "Space" || e.code === "ArrowUp") { jump(); } });

document.addEventListener("touchstart", function () { jump(); });

function jump() { if (isJumping) return; isJumping = true; // jump animation here setTimeout(() => isJumping = false, 500); }

