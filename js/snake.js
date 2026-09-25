const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
const gridSize = canvas.width / box;

let snake;
let food;
let dx;
let dy;
let score;
let gameLoop;
let running = true;

let highScore = Number(localStorage.getItem("snakeHighScore")) || 0;

document.getElementById("highScore").textContent = highScore;

function randomFood() {

    let newFood;

    do {

        newFood = {
            x: Math.floor(Math.random() * gridSize) * box,
            y: Math.floor(Math.random() * gridSize) * box
        };

    } while (
        snake.some(segment =>
            segment.x === newFood.x &&
            segment.y === newFood.y
        )
    );

    return newFood;
}

function restartGame() {

    snake = [
        {x: 200, y: 200},
        {x: 180, y: 200},
        {x: 160, y: 200}
    ];

    dx = box;
    dy = 0;

    score = 0;

    running = true;

    document.getElementById("score").textContent = score;

    food = randomFood();

    clearInterval(gameLoop);

    gameLoop = setInterval(update, 100);
}

function update() {

    if (!running) return;

    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        snake.some(segment =>
            segment.x === head.x &&
            segment.y === head.y
        )
    ) {

        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {

        score++;

        document.getElementById("score").textContent = score;

        food = randomFood();

    } else {

        snake.pop();
    }

    draw();
}

function draw() {

    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // grid

    ctx.strokeStyle = "#1f2937";

    for (let i = 0; i <= canvas.width; i += box) {

        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // food

    ctx.fillStyle = "#ff3b6b";

    ctx.beginPath();
    ctx.arc(
        food.x + box / 2,
        food.y + box / 2,
        box / 2.5,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // snake

    snake.forEach((segment, index) => {

        ctx.fillStyle =
            index === 0
                ? "#5ef4ff"
                : "#21cbd7";

        ctx.fillRect(
            segment.x + 1,
            segment.y + 1,
            box - 2,
            box - 2
        );
    });
}

function gameOver() {

    running = false;

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "snakeHighScore",
            highScore
        );

        document.getElementById("highScore").textContent =
            highScore;
    }

    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "bold 38px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.font = "20px Arial";

    ctx.fillText(
        "Score: " + score,
        canvas.width / 2,
        canvas.height / 2 + 40
    );
}

document.addEventListener("keydown", event => {

    const key = event.key.toLowerCase();

    if (
        (key === "arrowup" || key === "w") &&
        dy === 0
    ) {

        dx = 0;
        dy = -box;
    }

    else if (
        (key === "arrowdown" || key === "s") &&
        dy === 0
    ) {

        dx = 0;
        dy = box;
    }

    else if (
        (key === "arrowleft" || key === "a") &&
        dx === 0
    ) {

        dx = -box;
        dy = 0;
    }

    else if (
        (key === "arrowright" || key === "d") &&
        dx === 0
    ) {

        dx = box;
        dy = 0;
    }
});

restartGame();
