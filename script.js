<!DOCTYPE html><html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=800, user-scalable=no">
  <title>Doge420 Game</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="game-container">
    <div id="start-screen">
      <h1>Doge420 Game</h1>
      <input type="text" id="username" placeholder="Username" />
      <input type="text" id="wallet" placeholder="Dogecoin Wallet Address" />
      <button onclick="startGame()">Start Game</button>
    </div><div id="game-screen" style="display:none;">
  <canvas id="gameCanvas" width="800" height="300"></canvas>
  <div id="score-panel">
    <p><strong>Score:</strong> <span id="score">0</span></p>
    <p><strong>Total Tokens:</strong> <span id="tokens">0</span></p>
    <button id="withdraw-btn" onclick="requestWithdraw()">Request Withdraw</button>
    <p id="withdraw-note">* Minimum 1000 tokens to withdraw</p>
    <button id="restart-btn" onclick="restartGame()" style="display: none;">Restart</button>
  </div>
</div>

  </div>  <audio id="bg-music" loop>
    <source src="music/mario_theme.mp3" type="audio/mp3" />
  </audio>  <script src="script.js"></script></body>
</html>
