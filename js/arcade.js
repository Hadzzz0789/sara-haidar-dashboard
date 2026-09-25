/* ============================================================
   SARA'S & HAIDAR'S ARCADE
   UNIVERSAL GAME ENGINE
   ============================================================ */


/* ============================================================
   AUTOMATICALLY DETECT THE GAME FROM THE HTML FILE
   ============================================================ */

const fileName = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

const GAME_MAP = {
    "snake.html": "snake",
    "flappy.html": "flappy",
    "launcher.html": "launcher",
    "tetris.html": "tetris",
    "pong.html": "pong",
    "breakout.html": "breakout",
    "invaders.html": "invaders",
    "runner.html": "runner",
    "game2048.html": "game2048",
    "minesweeper.html": "minesweeper",
    "maze.html": "maze",
    "asteroids.html": "asteroids",
    "reaction.html": "reaction",
    "penalties.html": "penalties",
    "racing.html": "racing"
};

const GAME = GAME_MAP[fileName];

console.log("S&H Arcade loading:", GAME);


/* ============================================================
   SHARED ELEMENTS
   ============================================================ */

const canvas = document.getElementById("game");

const ctx = canvas
    ? canvas.getContext("2d")
    : null;

const scoreElement =
    document.getElementById("score");

const bestElement =
    document.getElementById("best");

const helpElement =
    document.getElementById("help");


let score = 0;

let best =
    Number(
        localStorage.getItem(
            "sh_best_" + GAME
        )
    ) || 0;


if (bestElement) {
    bestElement.textContent = best;
}


function updateScore(newScore) {

    score = newScore;

    if (scoreElement) {
        scoreElement.textContent = score;
    }

    if (score > best) {

        best = score;

        localStorage.setItem(
            "sh_best_" + GAME,
            best
        );

        if (bestElement) {
            bestElement.textContent = best;
        }
    }
}


function showHelp(message) {

    if (helpElement) {
        helpElement.textContent = message;
    }
}


function showGameOver(
    title = "GAME OVER"
) {

    if (!ctx || !canvas) {
        return;
    }

    ctx.fillStyle =
        "rgba(3, 6, 15, 0.82)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.textAlign = "center";

    ctx.fillStyle = "#ffffff";

    ctx.font =
        "700 46px Arial";

    ctx.fillText(
        title,
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.font =
        "18px Arial";

    ctx.fillStyle =
        "#9ca9c9";

    ctx.fillText(
        "Press Restart to play again",
        canvas.width / 2,
        canvas.height / 2 + 45
    );
}


/* ============================================================
   SNAKE
   ============================================================ */

if (GAME === "snake") {

    showHelp(
        "Arrow Keys / WASD"
    );

    const GRID = 20;

    const COLS =
        canvas.width / GRID;

    const ROWS =
        canvas.height / GRID;


    let snake = [

        { x: 15, y: 12 },

        { x: 14, y: 12 },

        { x: 13, y: 12 }

    ];


    let direction = {
        x: 1,
        y: 0
    };


    let nextDirection = {
        x: 1,
        y: 0
    };


    let food;

    let dead = false;


    function createFood() {

        do {

            food = {

                x:
                    Math.floor(
                        Math.random() *
                        COLS
                    ),

                y:
                    Math.floor(
                        Math.random() *
                        ROWS
                    )
            };

        } while (

            snake.some(
                segment =>
                    segment.x === food.x &&
                    segment.y === food.y
            )

        );
    }


    function drawSnakeBackground() {

        ctx.fillStyle =
            "#090d18";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.strokeStyle =
            "rgba(255,255,255,0.035)";

        ctx.lineWidth = 1;


        for (
            let x = 0;
            x <= canvas.width;
            x += GRID
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x,
                0
            );

            ctx.lineTo(
                x,
                canvas.height
            );

            ctx.stroke();
        }


        for (
            let y = 0;
            y <= canvas.height;
            y += GRID
        ) {

            ctx.beginPath();

            ctx.moveTo(
                0,
                y
            );

            ctx.lineTo(
                canvas.width,
                y
            );

            ctx.stroke();
        }
    }


    function drawSnake() {

        drawSnakeBackground();


        /* FOOD */

        ctx.fillStyle =
            "#ff4f87";

        ctx.shadowColor =
            "#ff4f87";

        ctx.shadowBlur = 15;

        ctx.beginPath();

        ctx.arc(

            food.x * GRID +
                GRID / 2,

            food.y * GRID +
                GRID / 2,

            7,

            0,

            Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur = 0;


        /* SNAKE */

        snake.forEach(
            (segment, index) => {

                if (index === 0) {

                    ctx.fillStyle =
                        "#ffffff";

                    ctx.shadowColor =
                        "#57e9ff";

                    ctx.shadowBlur = 15;

                } else {

                    ctx.fillStyle =
                        "#57e9ff";

                    ctx.shadowColor =
                        "#57e9ff";

                    ctx.shadowBlur = 6;
                }


                ctx.fillRect(

                    segment.x *
                        GRID +
                        2,

                    segment.y *
                        GRID +
                        2,

                    GRID - 4,

                    GRID - 4
                );


                ctx.shadowBlur = 0;
            }
        );
    }


    function updateSnake() {

        if (dead) {
            return;
        }


        direction =
            nextDirection;


        const newHead = {

            x:
                snake[0].x +
                direction.x,

            y:
                snake[0].y +
                direction.y
        };


        /* WALL COLLISION */

        if (

            newHead.x < 0 ||

            newHead.x >= COLS ||

            newHead.y < 0 ||

            newHead.y >= ROWS

        ) {

            dead = true;

            showGameOver();

            return;
        }


        /* BODY COLLISION */

        if (

            snake.some(
                segment =>
                    segment.x ===
                        newHead.x &&

                    segment.y ===
                        newHead.y
            )

        ) {

            dead = true;

            showGameOver();

            return;
        }


        snake.unshift(
            newHead
        );


        /* FOOD COLLISION */

        if (

            newHead.x ===
                food.x &&

            newHead.y ===
                food.y

        ) {

            updateScore(
                score + 1
            );

            createFood();

        } else {

            snake.pop();
        }


        drawSnake();
    }


    document.addEventListener(
        "keydown",
        event => {

            const key =
                event.key.toLowerCase();


            if (
                [
                    "arrowup",
                    "arrowdown",
                    "arrowleft",
                    "arrowright"
                ].includes(key)
            ) {

                event.preventDefault();
            }


            if (

                (
                    key === "arrowup" ||
                    key === "w"
                ) &&

                direction.y !== 1

            ) {

                nextDirection = {
                    x: 0,
                    y: -1
                };
            }


            else if (

                (
                    key === "arrowdown" ||
                    key === "s"
                ) &&

                direction.y !== -1

            ) {

                nextDirection = {
                    x: 0,
                    y: 1
                };
            }


            else if (

                (
                    key === "arrowleft" ||
                    key === "a"
                ) &&

                direction.x !== 1

            ) {

                nextDirection = {
                    x: -1,
                    y: 0
                };
            }


            else if (

                (
                    key === "arrowright" ||
                    key === "d"
                ) &&

                direction.x !== -1

            ) {

                nextDirection = {
                    x: 1,
                    y: 0
                };
            }
        }
    );


    createFood();

    drawSnake();


    setInterval(
        updateSnake,
        90
    );
}


/* ============================================================
   FLAPPY
   ============================================================ */

else if (GAME === "flappy") {

    showHelp(
        "SPACE or click to flap"
    );


    let bird = {

        x: 150,

        y: 250,

        radius: 17,

        velocity: 0
    };


    let pipes = [];

    let frame = 0;

    let dead = false;


    const gravity = 0.42;

    const flapStrength = -7.5;

    const pipeGap = 160;

    const pipeWidth = 70;


    function flap() {

        if (!dead) {

            bird.velocity =
                flapStrength;
        }
    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.code === "Space"
            ) {

                event.preventDefault();

                flap();
            }
        }
    );


    canvas.addEventListener(
        "click",
        flap
    );


    function addPipe() {

        const minimum = 70;

        const maximum = 270;


        const height =

            minimum +

            Math.random() *

            (
                maximum -
                minimum
            );


        pipes.push({

            x: canvas.width,

            top: height,

            passed: false
        });
    }


    function flappyLoop() {

        if (dead) {
            return;
        }


        frame++;


        bird.velocity +=
            gravity;

        bird.y +=
            bird.velocity;


        if (
            frame % 100 === 0
        ) {

            addPipe();
        }


        pipes.forEach(
            pipe => {

                pipe.x -= 3;


                if (

                    !pipe.passed &&

                    pipe.x +
                        pipeWidth <
                        bird.x

                ) {

                    pipe.passed =
                        true;

                    updateScore(
                        score + 1
                    );
                }


                const insidePipe =

                    bird.x +
                        bird.radius >
                        pipe.x &&

                    bird.x -
                        bird.radius <
                        pipe.x +
                        pipeWidth;


                const collision =

                    bird.y -
                        bird.radius <
                        pipe.top ||

                    bird.y +
                        bird.radius >
                        pipe.top +
                        pipeGap;


                if (
                    insidePipe &&
                    collision
                ) {

                    dead = true;
                }
            }
        );


        pipes =
            pipes.filter(
                pipe =>
                    pipe.x +
                        pipeWidth >
                    0
            );


        if (

            bird.y -
                bird.radius <
                0 ||

            bird.y +
                bird.radius >
                canvas.height

        ) {

            dead = true;
        }


        /* BACKGROUND */

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height
            );


        gradient.addColorStop(
            0,
            "#07192d"
        );

        gradient.addColorStop(
            1,
            "#153f5d"
        );


        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /* PIPES */

        pipes.forEach(
            pipe => {

                ctx.fillStyle =
                    "#42d67d";


                ctx.fillRect(
                    pipe.x,
                    0,
                    pipeWidth,
                    pipe.top
                );


                ctx.fillRect(
                    pipe.x,
                    pipe.top +
                        pipeGap,
                    pipeWidth,
                    canvas.height
                );
            }
        );


        /* BIRD */

        ctx.fillStyle =
            "#ffd447";

        ctx.shadowColor =
            "#ffd447";

        ctx.shadowBlur = 15;


        ctx.beginPath();

        ctx.arc(
            bird.x,
            bird.y,
            bird.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.shadowBlur = 0;


        if (dead) {

            showGameOver();

        } else {

            requestAnimationFrame(
                flappyLoop
            );
        }
    }


    flappyLoop();
}


/* ============================================================
   PONG
   ============================================================ */

else if (GAME === "pong") {

    showHelp(
        "Move mouse over the court or use W / S"
    );


    let playerY = 205;

    let computerY = 205;


    let ball = {

        x: 400,

        y: 250,

        vx: 5,

        vy: 3
    };


    const keys = {};


    document.addEventListener(
        "keydown",
        event => {

            keys[
                event.key.toLowerCase()
            ] = true;
        }
    );


    document.addEventListener(
        "keyup",
        event => {

            keys[
                event.key.toLowerCase()
            ] = false;
        }
    );


    canvas.addEventListener(
        "mousemove",
        event => {

            const rect =
                canvas.getBoundingClientRect();


            playerY =

                (
                    event.clientY -
                    rect.top
                ) *

                canvas.height /
                rect.height -

                45;
        }
    );


    function pongLoop() {

        if (keys.w) {
            playerY -= 7;
        }

        if (keys.s) {
            playerY += 7;
        }


        playerY =
            Math.max(
                0,
                Math.min(
                    410,
                    playerY
                )
            );


        computerY +=

            Math.sign(

                ball.y -

                (
                    computerY +
                    45
                )

            ) *

            3.3;


        ball.x +=
            ball.vx;

        ball.y +=
            ball.vy;


        if (

            ball.y <= 8 ||

            ball.y >=
                canvas.height - 8

        ) {

            ball.vy *= -1;
        }


        if (

            ball.x < 50 &&

            ball.x > 25 &&

            ball.y >
                playerY &&

            ball.y <
                playerY + 90

        ) {

            ball.vx =
                Math.abs(
                    ball.vx
                ) *
                1.03;


            updateScore(
                score + 1
            );
        }


        if (

            ball.x >
                canvas.width - 50 &&

            ball.x <
                canvas.width - 20 &&

            ball.y >
                computerY &&

            ball.y <
                computerY + 90

        ) {

            ball.vx =
                -Math.abs(
                    ball.vx
                ) *
                1.02;
        }


        if (
            ball.x < 0
        ) {

            showGameOver(
                "CPU WINS"
            );

            return;
        }


        if (
            ball.x >
            canvas.width
        ) {

            ball.x = 400;

            ball.y = 250;

            ball.vx = -5;

            ball.vy = 3;
        }


        ctx.fillStyle =
            "#070b14";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.strokeStyle =
            "rgba(255,255,255,.15)";

        ctx.setLineDash(
            [10, 15]
        );


        ctx.beginPath();

        ctx.moveTo(
            canvas.width / 2,
            0
        );

        ctx.lineTo(
            canvas.width / 2,
            canvas.height
        );

        ctx.stroke();

        ctx.setLineDash([]);


        ctx.fillStyle =
            "#55e8ff";

        ctx.fillRect(
            30,
            playerY,
            12,
            90
        );


        ctx.fillStyle =
            "#ff4f87";

        ctx.fillRect(
            canvas.width - 42,
            computerY,
            12,
            90
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.beginPath();

        ctx.arc(
            ball.x,
            ball.y,
            9,
            0,
            Math.PI * 2
        );

        ctx.fill();


        requestAnimationFrame(
            pongLoop
        );
    }


    pongLoop();
}


/* ============================================================
   UNKNOWN GAME ERROR
   ============================================================ */

else {

    console.error(
        "No game found for:",
        fileName
    );


    if (ctx) {

        ctx.fillStyle =
            "#090d18";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.textAlign =
            "center";

        ctx.font =
            "28px Arial";


        ctx.fillText(
            "Game not configured",
            canvas.width / 2,
            canvas.height / 2
        );
    }
}
