const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const restartBtn = document.getElementById("restartBtn");
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

let score = 0;
const gridSize = 20;
let snake, food, dx, dy, gameInterval;

async function getHighScore() {
  const res = await fetch("/highscore");
  const data = await res.json();
  highScoreDisplay.innerText = data.highscore;
}

async function postScore(score) {
  await fetch("/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score }),
  });
}

function initGame() {
  score = 0;
  dx = 1;
  dy = 0;
  snake = [{ x: 10, y: 10 }];
  placeFood();
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 150);
  draw();
  getHighScore();
}

function draw() {
  gameArea.innerHTML = "";
  snake.forEach(part => {
    const div = document.createElement("div");
    div.style.gridColumnStart = part.x;
    div.style.gridRowStart = part.y;
    div.className = "cell snake";
    gameArea.appendChild(div);
  });
  const foodDiv = document.createElement("div");
  foodDiv.style.gridColumnStart = food.x;
  foodDiv.style.gridRowStart = food.y;
  foodDiv.className = "cell food";
  gameArea.appendChild(foodDiv);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 1 || head.y < 1 || head.x > gridSize || head.y > gridSize ||
    snake.some(part => part.x === head.x && part.y === head.y)
  ) {
    gameOverSound.play();
    postScore(score);
    getHighScore();
    alert("Game Over! Your Score: " + score);
    clearInterval(gameInterval);
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    eatSound.play();
    scoreDisplay.innerText = score;
    placeFood();
  } else {
    snake.pop();
  }
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * gridSize) + 1,
    y: Math.floor(Math.random() * gridSize) + 1,
  };
}

function gameLoop() {
  moveSnake();
  draw();
}

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp": if (dy !== 1) { dx = 0; dy = -1; } break;
    case "ArrowDown": if (dy !== -1) { dx = 0; dy = 1; } break;
    case "ArrowLeft": if (dx !== 1) { dx = -1; dy = 0; } break;
    case "ArrowRight": if (dx !== -1) { dx = 1; dy = 0; } break;
  }
});

restartBtn.addEventListener("click", initGame);
initGame();