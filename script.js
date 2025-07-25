
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let dogeImg = new Image();
dogeImg.src = "assets/doge.png";

let plantImg = new Image();
plantImg.src = "assets/plant.png";

let bgMusic = new Audio("assets/bg-music.wav");
bgMusic.loop = true;
bgMusic.play();

let doge = { x: 50, y: 300, vy: 0, jumping: false };
let gravity = 0.5;
let score = 0;

let plants = [{ x: 800, y: 320 }];

document.addEventListener("keydown", () => {
    if (!doge.jumping) {
        doge.vy = -10;
        doge.jumping = true;
    }
});

function update() {
    doge.vy += gravity;
    doge.y += doge.vy;

    if (doge.y >= 300) {
        doge.y = 300;
        doge.jumping = false;
    }

    for (let plant of plants) {
        plant.x -= 5;
        if (plant.x < -32) {
            plant.x = 800 + Math.random() * 200;
            score += 10;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(dogeImg, doge.x, doge.y, 64, 64);
    for (let plant of plants) {
        ctx.drawImage(plantImg, plant.x, plant.y, 32, 32);
    }
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 650, 30);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
