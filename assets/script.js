let doge = document.getElementById("doge");
let plant = document.getElementById("plant");
let scoreDisplay = document.getElementById("score");
let score = 0;
let isJumping = false;

document.body.onkeyup = function(e){
  if(e.code === "Space" || e.key === " "){
    jump();
  }
}

function jump() {
  if (isJumping) return;
  isJumping = true;
  let jumpHeight = 100;
  doge.style.bottom = jumpHeight + "px";
  setTimeout(() => {
    doge.style.bottom = "0px";
    isJumping = false;
  }, 400);
}

function movePlant() {
  let plantLeft = 300;
  plant.style.right = plantLeft + "px";

  let interval = setInterval(() => {
    plantLeft += 5;
    plant.style.right = plantLeft + "px";

    if (plantLeft > window.innerWidth) {
      plantLeft = -50;
      score += 10;
      scoreDisplay.innerText = "Score: " + score;
    }

    let dogeBottom = parseInt(doge.style.bottom);
    if (
      plantLeft > (window.innerWidth - 120) && plantLeft < (window.innerWidth - 60) &&
      dogeBottom < 60
    ) {
      alert("Game Over!\nYour Score: " + score);
      clearInterval(interval);
    }

  }, 30);
}

movePlant();