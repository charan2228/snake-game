const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");

let score = 0;
const gridSize = 20; // The game grid is 20x20 cells
let snake = [{ x: 10, y: 10 }]; // Initial snake position [3]
let food = { x: 5, y: 5 }; // Initial food position [3]
let dx = 0; // Initial x-direction of snake movement [3]
let dy = 0; // Initial y-direction of snake movement [3]

function draw() {
    gameArea.innerHTML = ""; // Clears the game area for redrawing

    // Draw snake
    snake.forEach(part => {
        const div = document.createElement("div");
        div.style.gridColumnStart = part.x; // Positions snake part on the grid
        div.style.gridRowStart = part.y; // Positions snake part on the grid
        div.className = "cell snake"; // Applies styling for snake cells
        gameArea.appendChild(div);
    });

    // Draw food
    const foodDiv = document.createElement("div");
    foodDiv.style.gridColumnStart = food.x;
    foodDiv.style.gridRowStart = food.y;
    foodDiv.className = "cell food"; // Applies styling for food cells
    gameArea.appendChild(foodDiv);
}

function moveSnake() {
    const head = { x: snake.x + dx, y: snake.y + dy }; // Calculates new head position [4]

    // **Game over logic**: checks if snake hits wall or itself [4]
    if (
        head.x < 1 || head.y < 1 || head.x > gridSize || head.y > gridSize ||
        snake.some(part => part.x === head.x && part.y === head.y)
    ) {
        alert("Game Over! Score: " + score); // Displays game over message [4]
        location.reload(); // Reloads the page to restart the game [4]
        return;
    }

    snake.unshift(head); // Adds new head to the front of the snake array

    // Checks if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++; // Increments score
        scoreDisplay.innerText = score; // Updates score display
        placeFood(); // Places new food
    } else {
        snake.pop(); // Removes tail if no food is eaten, simulating movement
    }
}

function placeFood() {
    // Randomly determines new food coordinates within the grid [5]
    food = {
        x: Math.floor(Math.random() * gridSize) + 1,
        y: Math.floor(Math.random() * gridSize) + 1,
    };
}

function gameLoop() {
    moveSnake(); // Updates snake position
    draw(); // Redraws the game
}

// **Event listener for keyboard input**: controls snake direction
document.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":
            if (dy !== 1) { dx = 0; dy = -1; } // Prevents immediate reverse
            break;
        case "ArrowDown":
            if (dy !== -1) { dx = 0; dy = 1; } // Prevents immediate reverse
            break;
        case "ArrowLeft":
            if (dx !== 1) { dx = -1; dy = 0; } // Prevents immediate reverse
            break;
        case "ArrowRight":
            if (dx !== -1) { dx = 1; dy = 0; } // Prevents immediate reverse
            break;
    }
});