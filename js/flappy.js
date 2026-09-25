const canvas =
document.getElementById("game");

const ctx =
canvas.getContext("2d");

let bird;
let pipes;
let score;
let gameOver;

let best =
Number(localStorage.getItem("flappyBest")) || 0;

document.getElementById("best").textContent = best;

const gravity = 0.45;
const flapPower = -7.5;

const pipeWidth = 65;
const pipeGap = 155;
const pipeSpeed = 2.7;

function resetGame() {

    bird = {
        x: 90,
        y: 280,
        radius: 17,
        velocity: 0
    };

    pipes = [];

    score = 0;

    gameOver = false;

    document.getElementById("score").textContent = score;
}

function flap() {

    if (gameOver) {

        resetGame();
        return;
    }

    bird.velocity = flapPower;
}

function createPipe() {

    const minHeight = 70;

    const maxHeight =
        canvas.height -
        pipeGap -
        120;

    const topHeight =
        Math.floor(
            Math.random() *
            (maxHeight - minHeight)
        ) + minHeight;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        passed: false
    });
}

function update() {

    if (gameOver) return;

    bird.velocity += gravity;
    bird.y += bird.velocity;

    if (
        pipes.length === 0 ||
        pipes[pipes.length - 1].x <
        canvas.width - 220
    ) {
        createPipe();
    }

    pipes.forEach(pipe => {

        pipe.x -= pipeSpeed;

        if (
            !pipe.passed &&
            pipe.x + pipeWidth < bird.x
        ) {

            pipe.passed = true;

            score++;

            document.getElementById("score").textContent =
                score;
        }

        const insideX =
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius <
            pipe.x + pipeWidth;

        const hitsTop =
            bird.y - bird.radius <
            pipe.top;

        const hitsBottom =
            bird.y + bird.radius >
            pipe.top + pipeGap;

        if (
            insideX &&
            (hitsTop || hitsBottom)
        ) {

            endGame();
        }
    });

    pipes =
        pipes.filter(
            pipe =>
            pipe.x + pipeWidth > 0
        );

    if (
        bird.y + bird.radius >
        canvas.height ||
        bird.y - bird.radius < 0
    ) {

        endGame();
    }
}

function endGame() {

    gameOver = true;

    if (score > best) {

        best = score;

        localStorage.setItem(
            "flappyBest",
            best
        );

        document.getElementById("best").textContent =
            best;
    }
}

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );

    gradient.addColorStop(
        0,
        "#58c9ff"
    );

    gradient.addColorStop(
        1,
        "#c6f4ff"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

function draw() {

    drawBackground();

    // pipes

    pipes.forEach(pipe => {

        ctx.fillStyle = "#32b44a";

        ctx.fillRect(
            pipe.x,
            0,
            pipeWidth,
            pipe.top
        );

        ctx.fillRect(
            pipe.x,
            pipe.top + pipeGap,
            pipeWidth,
            canvas.height
        );

        ctx.strokeStyle = "#147125";
        ctx.lineWidth = 4;

        ctx.strokeRect(
            pipe.x,
            0,
            pipeWidth,
            pipe.top
        );

        ctx.strokeRect(
            pipe.x,
            pipe.top + pipeGap,
            pipeWidth,
            canvas.height
        );
    });

    // bird

    ctx.fillStyle = "#ffd633";

    ctx.beginPath();

    ctx.arc(
        bird.x,
        bird.y,
        bird.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // eye

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        bird.x + 7,
        bird.y - 5,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "black";

    ctx.beginPath();

    ctx.arc(
        bird.x + 9,
        bird.y - 5,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // beak

    ctx.fillStyle = "#ff7a00";

    ctx.beginPath();

    ctx.moveTo(
        bird.x + 15,
        bird.y
    );

    ctx.lineTo(
        bird.x + 30,
        bird.y + 5
    );

    ctx.lineTo(
        bird.x + 15,
        bird.y + 10
    );

    ctx.fill();

    if (gameOver) {

        ctx.fillStyle =
            "rgba(0,0,0,0.55)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle = "white";

        ctx.font =
            "bold 40px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "GAME OVER",
            canvas.width / 2,
            270
        );

        ctx.font =
            "20px Arial";

        ctx.fillText(
            "Click or press SPACE",
            canvas.width / 2,
            315
        );
    }
}

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(
        gameLoop
    );
}

document.addEventListener(
    "keydown",
    event => {

        if (event.code === "Space") {

            event.preventDefault();

            flap();
        }
    }
);

canvas.addEventListener(
    "mousedown",
    flap
);

canvas.addEventListener(
    "touchstart",
    event => {

        event.preventDefault();

        flap();
    }
);

resetGame();

gameLoop();
