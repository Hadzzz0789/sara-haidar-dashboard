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
   BREAKOUT
   ============================================================ */

else if (GAME === "breakout") {

    showHelp("Mouse or ← → to move");

    const paddle = {
        x: 330,
        y: 455,
        width: 140,
        height: 14
    };

    const ball = {
        x: 400,
        y: 410,
        radius: 8,
        vx: 4,
        vy: -4
    };

    const bricks = [];

    const keys = {};

    let finished = false;


    /* CREATE BRICKS */

    for (let row = 0; row < 5; row++) {

        for (let col = 0; col < 10; col++) {

            bricks.push({
                x: 42 + col * 72,
                y: 55 + row * 34,
                width: 64,
                height: 24,
                alive: true,
                hue: 185 + row * 25
            });
        }
    }


    /* KEYBOARD */

    document.addEventListener("keydown", event => {

        keys[event.key] = true;

        if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight"
        ) {
            event.preventDefault();
        }
    });


    document.addEventListener("keyup", event => {

        keys[event.key] = false;

    });


    /* MOUSE */

    canvas.addEventListener("mousemove", event => {

        const rect =
            canvas.getBoundingClientRect();

        const mouseX =
            (event.clientX - rect.left) *
            canvas.width /
            rect.width;

        paddle.x =
            mouseX -
            paddle.width / 2;

    });


    function breakoutLoop() {

        if (finished) {
            return;
        }


        /* PADDLE MOVEMENT */

        if (keys.ArrowLeft) {
            paddle.x -= 8;
        }

        if (keys.ArrowRight) {
            paddle.x += 8;
        }


        paddle.x =
            Math.max(
                0,
                Math.min(
                    canvas.width -
                    paddle.width,
                    paddle.x
                )
            );


        /* BALL */

        ball.x += ball.vx;
        ball.y += ball.vy;


        /* SIDE WALLS */

        if (
            ball.x - ball.radius <= 0 ||
            ball.x + ball.radius >= canvas.width
        ) {

            ball.vx *= -1;
        }


        /* TOP WALL */

        if (
            ball.y - ball.radius <= 0
        ) {

            ball.vy =
                Math.abs(ball.vy);
        }


        /* PADDLE */

        if (
            ball.y + ball.radius >= paddle.y &&
            ball.y - ball.radius <= paddle.y + paddle.height &&
            ball.x >= paddle.x &&
            ball.x <= paddle.x + paddle.width &&
            ball.vy > 0
        ) {

            const hitPosition =
                (
                    ball.x -
                    (
                        paddle.x +
                        paddle.width / 2
                    )
                ) /
                (
                    paddle.width / 2
                );


            ball.vx =
                hitPosition * 6;

            ball.vy =
                -Math.abs(ball.vy);
        }


        /* BRICKS */

        bricks.forEach(brick => {

            if (!brick.alive) {
                return;
            }


            if (
                ball.x + ball.radius > brick.x &&
                ball.x - ball.radius < brick.x + brick.width &&
                ball.y + ball.radius > brick.y &&
                ball.y - ball.radius < brick.y + brick.height
            ) {

                brick.alive = false;

                ball.vy *= -1;

                updateScore(
                    score + 10
                );
            }
        });


        /* LOST BALL */

        if (
            ball.y - ball.radius >
            canvas.height
        ) {

            finished = true;

            drawBreakout();

            showGameOver();

            return;
        }


        /* WIN */

        if (
            bricks.every(
                brick =>
                    !brick.alive
            )
        ) {

            finished = true;

            drawBreakout();

            showGameOver(
                "YOU WIN!"
            );

            return;
        }


        drawBreakout();

        requestAnimationFrame(
            breakoutLoop
        );
    }


    function drawBreakout() {

        ctx.fillStyle = "#070b14";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /* BRICKS */

        bricks.forEach(brick => {

            if (!brick.alive) {
                return;
            }


            ctx.fillStyle =
                `hsl(${brick.hue} 80% 60%)`;

            ctx.shadowColor =
                `hsl(${brick.hue} 80% 60%)`;

            ctx.shadowBlur = 8;


            ctx.fillRect(
                brick.x,
                brick.y,
                brick.width,
                brick.height
            );


            ctx.shadowBlur = 0;

        });


        /* PADDLE */

        ctx.fillStyle = "#55e8ff";

        ctx.shadowColor = "#55e8ff";

        ctx.shadowBlur = 12;


        ctx.fillRect(
            paddle.x,
            paddle.y,
            paddle.width,
            paddle.height
        );


        ctx.shadowBlur = 0;


        /* BALL */

        ctx.fillStyle = "#ffffff";

        ctx.beginPath();

        ctx.arc(
            ball.x,
            ball.y,
            ball.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    drawBreakout();

    breakoutLoop();
}


/* ============================================================
   SPACE ATTACK / INVADERS
   ============================================================ */

else if (GAME === "invaders") {

    showHelp(
        "A / D or ← → to move • SPACE to shoot"
    );


    const player = {
        x: 380,
        y: 450,
        width: 44,
        height: 24
    };


    const keys = {};

    const aliens = [];

    let bullets = [];

    let alienDirection = 1;

    let alienTimer = 0;

    let finished = false;


    /* CREATE ALIENS */

    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 9; col++) {

            aliens.push({
                x: 90 + col * 70,
                y: 60 + row * 48,
                width: 36,
                height: 25,
                alive: true
            });
        }
    }


    document.addEventListener("keydown", event => {

        keys[event.code] = true;


        if (
            event.code === "Space"
        ) {

            event.preventDefault();


            if (
                bullets.length < 5
            ) {

                bullets.push({
                    x:
                        player.x +
                        player.width / 2 -
                        2,

                    y:
                        player.y,

                    width: 4,
                    height: 12
                });
            }
        }
    });


    document.addEventListener("keyup", event => {

        keys[event.code] = false;

    });


    function invadersLoop() {

        if (finished) {
            return;
        }


        /* PLAYER */

        if (
            keys.ArrowLeft ||
            keys.KeyA
        ) {

            player.x -= 6;
        }


        if (
            keys.ArrowRight ||
            keys.KeyD
        ) {

            player.x += 6;
        }


        player.x =
            Math.max(
                0,
                Math.min(
                    canvas.width -
                    player.width,
                    player.x
                )
            );


        /* BULLETS */

        bullets.forEach(bullet => {

            bullet.y -= 8;

        });


        bullets =
            bullets.filter(
                bullet =>
                    bullet.y > -20
            );


        /* ALIEN MOVEMENT */

        alienTimer++;


        if (
            alienTimer >= 28
        ) {

            alienTimer = 0;


            let hitEdge = false;


            aliens.forEach(alien => {

                if (!alien.alive) {
                    return;
                }


                const nextX =
                    alien.x +
                    16 *
                    alienDirection;


                if (
                    nextX <= 15 ||
                    nextX +
                    alien.width >=
                    canvas.width - 15
                ) {

                    hitEdge = true;
                }
            });


            if (hitEdge) {

                alienDirection *= -1;


                aliens.forEach(alien => {

                    if (alien.alive) {
                        alien.y += 18;
                    }

                });

            } else {

                aliens.forEach(alien => {

                    if (alien.alive) {

                        alien.x +=
                            16 *
                            alienDirection;
                    }

                });
            }
        }


        /* BULLET COLLISION */

        bullets.forEach(bullet => {

            aliens.forEach(alien => {

                if (
                    alien.alive &&

                    bullet.x <
                        alien.x +
                        alien.width &&

                    bullet.x +
                        bullet.width >
                        alien.x &&

                    bullet.y <
                        alien.y +
                        alien.height &&

                    bullet.y +
                        bullet.height >
                        alien.y
                ) {

                    alien.alive = false;

                    bullet.y = -100;

                    updateScore(
                        score + 10
                    );
                }
            });
        });


        bullets =
            bullets.filter(
                bullet =>
                    bullet.y > -20
            );


        /* GAME OVER */

        if (
            aliens.some(
                alien =>
                    alien.alive &&
                    alien.y +
                        alien.height >=
                        player.y
            )
        ) {

            finished = true;

            drawInvaders();

            showGameOver();

            return;
        }


        /* WIN */

        if (
            aliens.every(
                alien =>
                    !alien.alive
            )
        ) {

            finished = true;

            drawInvaders();

            showGameOver(
                "EARTH SAVED!"
            );

            return;
        }


        drawInvaders();

        requestAnimationFrame(
            invadersLoop
        );
    }


    function drawInvaders() {

        ctx.fillStyle = "#040711";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /* STARS */

        ctx.fillStyle =
            "rgba(255,255,255,.25)";


        for (
            let i = 0;
            i < 40;
            i++
        ) {

            const x =
                (
                    i * 97
                ) %
                canvas.width;

            const y =
                (
                    i * 53
                ) %
                canvas.height;


            ctx.fillRect(
                x,
                y,
                2,
                2
            );
        }


        /* PLAYER */

        ctx.fillStyle = "#55e8ff";

        ctx.shadowColor = "#55e8ff";

        ctx.shadowBlur = 14;


        ctx.beginPath();

        ctx.moveTo(
            player.x +
            player.width / 2,
            player.y
        );

        ctx.lineTo(
            player.x,
            player.y +
            player.height
        );

        ctx.lineTo(
            player.x +
            player.width,
            player.y +
            player.height
        );

        ctx.closePath();

        ctx.fill();


        ctx.shadowBlur = 0;


        /* ALIENS */

        aliens.forEach(alien => {

            if (!alien.alive) {
                return;
            }


            ctx.fillStyle = "#a879ff";

            ctx.fillRect(
                alien.x,
                alien.y,
                alien.width,
                alien.height
            );


            ctx.fillStyle = "#050812";


            ctx.fillRect(
                alien.x + 8,
                alien.y + 7,
                5,
                5
            );


            ctx.fillRect(
                alien.x + 23,
                alien.y + 7,
                5,
                5
            );
        });


        /* BULLETS */

        ctx.fillStyle = "#ffffff";


        bullets.forEach(bullet => {

            ctx.fillRect(
                bullet.x,
                bullet.y,
                bullet.width,
                bullet.height
            );

        });
    }


    drawInvaders();

    invadersLoop();
}


/* ============================================================
   RUNNER
   ============================================================ */

else if (GAME === "runner") {

    showHelp(
        "SPACE, ↑ or click to jump"
    );


    const groundY = 430;


    const player = {
        x: 110,
        y: groundY - 55,
        width: 44,
        height: 55,
        vy: 0
    };


    let obstacles = [];

    let frame = 0;

    let finished = false;


    function jump() {

        if (
            player.y >=
            groundY -
            player.height -
            1
        ) {

            player.vy = -13;
        }
    }


    document.addEventListener("keydown", event => {

        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {

            event.preventDefault();

            jump();
        }
    });


    canvas.addEventListener(
        "click",
        jump
    );


    function runnerLoop() {

        if (finished) {
            return;
        }


        frame++;


        /* GRAVITY */

        player.vy += 0.7;

        player.y += player.vy;


        if (
            player.y >
            groundY -
            player.height
        ) {

            player.y =
                groundY -
                player.height;

            player.vy = 0;
        }


        /* SPAWN */

        if (
            frame % 95 === 0
        ) {

            const height =
                35 +
                Math.random() *
                45;


            obstacles.push({
                x: canvas.width + 30,
                y: groundY - height,
                width:
                    24 +
                    Math.random() *
                    22,
                height
            });
        }


        /* MOVE OBSTACLES */

        obstacles.forEach(obstacle => {

            obstacle.x -=
                6 +
                Math.min(
                    score / 300,
                    3
                );

        });


        obstacles =
            obstacles.filter(
                obstacle =>
                    obstacle.x +
                    obstacle.width >
                    -20
            );


        /* COLLISION */

        if (
            obstacles.some(obstacle =>

                player.x <
                    obstacle.x +
                    obstacle.width &&

                player.x +
                    player.width >
                    obstacle.x &&

                player.y <
                    obstacle.y +
                    obstacle.height &&

                player.y +
                    player.height >
                    obstacle.y
            )
        ) {

            finished = true;

            drawRunner();

            showGameOver();

            return;
        }


        updateScore(
            Math.floor(
                frame / 8
            )
        );


        drawRunner();

        requestAnimationFrame(
            runnerLoop
        );
    }


    function drawRunner() {

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height
            );


        gradient.addColorStop(
            0,
            "#071528"
        );

        gradient.addColorStop(
            1,
            "#10253a"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /* MOON */

        ctx.fillStyle =
            "rgba(255,255,255,.12)";

        ctx.beginPath();

        ctx.arc(
            670,
            100,
            55,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* GROUND */

        ctx.fillStyle = "#162b25";

        ctx.fillRect(
            0,
            groundY,
            canvas.width,
            canvas.height -
            groundY
        );


        ctx.fillStyle = "#58e99b";

        ctx.fillRect(
            0,
            groundY,
            canvas.width,
            4
        );


        /* PLAYER */

        ctx.fillStyle = "#55e8ff";

        ctx.fillRect(
            player.x,
            player.y,
            player.width,
            player.height
        );


        ctx.fillStyle = "#050812";

        ctx.fillRect(
            player.x + 29,
            player.y + 11,
            6,
            6
        );


        /* OBSTACLES */

        ctx.fillStyle = "#ff4f87";


        obstacles.forEach(obstacle => {

            ctx.fillRect(
                obstacle.x,
                obstacle.y,
                obstacle.width,
                obstacle.height
            );

        });
    }


    drawRunner();

    runnerLoop();
}


/* ============================================================
   MAZE CHASE
   ============================================================ */

else if (GAME === "maze") {

    showHelp(
        "Arrow Keys / WASD • Collect every dot"
    );


    const maze = [

        "###################",
        "#........#........#",
        "#.###.##.#.##.###.#",
        "#.................#",
        "#.##.#.#####.#.##.#",
        "#....#...#...#....#",
        "####.###.#.###.####",
        "#.................#",
        "#.###.#.###.#.###.#",
        "#.....#.....#.....#",
        "###################"

    ].map(
        row =>
            row.split("")
    );


    const CELL = 36;

    const mazeWidth =
        maze[0].length *
        CELL;

    const mazeHeight =
        maze.length *
        CELL;


    const offsetX =
        Math.floor(
            (
                canvas.width -
                mazeWidth
            ) /
            2
        );


    const offsetY =
        Math.floor(
            (
                canvas.height -
                mazeHeight
            ) /
            2
        );


    const player = {
        x: 1,
        y: 1
    };


    let totalDots = 0;


    maze.forEach(row => {

        row.forEach(cell => {

            if (cell === ".") {
                totalDots++;
            }

        });

    });


    function moveMaze(dx, dy) {

        const nextX =
            player.x + dx;

        const nextY =
            player.y + dy;


        if (
            !maze[nextY] ||
            maze[nextY][nextX] === "#"
        ) {

            return;
        }


        player.x = nextX;
        player.y = nextY;


        if (
            maze[nextY][nextX] === "."
        ) {

            maze[nextY][nextX] = " ";

            updateScore(
                score + 1
            );


            if (
                score >=
                totalDots
            ) {

                drawMaze();

                showGameOver(
                    "MAZE CLEARED!"
                );

                return;
            }
        }


        drawMaze();
    }


    document.addEventListener("keydown", event => {

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
            key === "arrowup" ||
            key === "w"
        ) {

            moveMaze(
                0,
                -1
            );
        }


        else if (
            key === "arrowdown" ||
            key === "s"
        ) {

            moveMaze(
                0,
                1
            );
        }


        else if (
            key === "arrowleft" ||
            key === "a"
        ) {

            moveMaze(
                -1,
                0
            );
        }


        else if (
            key === "arrowright" ||
            key === "d"
        ) {

            moveMaze(
                1,
                0
            );
        }
    });


    function drawMaze() {

        ctx.fillStyle = "#050812";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        maze.forEach(
            (row, y) => {

                row.forEach(
                    (cell, x) => {

                        const px =
                            offsetX +
                            x * CELL;

                        const py =
                            offsetY +
                            y * CELL;


                        if (
                            cell === "#"
                        ) {

                            ctx.fillStyle =
                                "#3048d8";

                            ctx.fillRect(
                                px + 1,
                                py + 1,
                                CELL - 2,
                                CELL - 2
                            );
                        }


                        else if (
                            cell === "."
                        ) {

                            ctx.fillStyle =
                                "#ffffff";


                            ctx.beginPath();

                            ctx.arc(
                                px +
                                CELL / 2,

                                py +
                                CELL / 2,

                                3,

                                0,

                                Math.PI * 2
                            );

                            ctx.fill();
                        }
                    }
                );
            }
        );


        /* PLAYER */

        ctx.fillStyle = "#ffd447";

        ctx.shadowColor = "#ffd447";

        ctx.shadowBlur = 12;


        ctx.beginPath();

        ctx.arc(

            offsetX +
            player.x *
            CELL +
            CELL / 2,

            offsetY +
            player.y *
            CELL +
            CELL / 2,

            13,

            0,

            Math.PI * 2

        );

        ctx.fill();


        ctx.shadowBlur = 0;
    }


    /* REMOVE STARTING DOT */

    if (
        maze[player.y][player.x] === "."
    ) {

        maze[player.y][player.x] = " ";

        totalDots--;
    }


    drawMaze();
}


/* ============================================================
   ASTEROIDS
   ============================================================ */

else if (GAME === "asteroids") {

    showHelp(
        "← → rotate • ↑ thrust • SPACE fire"
    );


    const ship = {
        x: 400,
        y: 250,
        angle: -Math.PI / 2,
        vx: 0,
        vy: 0,
        radius: 12
    };


    const keys = {};

    let bullets = [];

    let asteroids = [];

    let finished = false;


    function createAsteroid() {

        let asteroid;


        do {

            asteroid = {
                x:
                    Math.random() *
                    canvas.width,

                y:
                    Math.random() *
                    canvas.height,

                vx:
                    Math.random() *
                    2.5 -
                    1.25,

                vy:
                    Math.random() *
                    2.5 -
                    1.25,

                radius:
                    20 +
                    Math.random() *
                    25
            };

        } while (

            Math.hypot(
                asteroid.x -
                ship.x,

                asteroid.y -
                ship.y
            ) < 130

        );


        return asteroid;
    }


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        asteroids.push(
            createAsteroid()
        );
    }


    document.addEventListener("keydown", event => {

        keys[event.code] = true;


        if (
            event.code === "Space" &&
            !event.repeat
        ) {

            event.preventDefault();


            bullets.push({

                x:
                    ship.x +
                    Math.cos(
                        ship.angle
                    ) *
                    18,

                y:
                    ship.y +
                    Math.sin(
                        ship.angle
                    ) *
                    18,

                vx:
                    Math.cos(
                        ship.angle
                    ) *
                    8,

                vy:
                    Math.sin(
                        ship.angle
                    ) *
                    8,

                life: 70
            });
        }
    });


    document.addEventListener("keyup", event => {

        keys[event.code] = false;

    });


    function wrap(object) {

        if (object.x < 0) {
            object.x =
                canvas.width;
        }

        if (
            object.x >
            canvas.width
        ) {
            object.x = 0;
        }

        if (object.y < 0) {
            object.y =
                canvas.height;
        }

        if (
            object.y >
            canvas.height
        ) {
            object.y = 0;
        }
    }


    function asteroidLoop() {

        if (finished) {
            return;
        }


        if (keys.ArrowLeft) {
            ship.angle -= 0.065;
        }


        if (keys.ArrowRight) {
            ship.angle += 0.065;
        }


        if (keys.ArrowUp) {

            ship.vx +=
                Math.cos(
                    ship.angle
                ) *
                0.12;


            ship.vy +=
                Math.sin(
                    ship.angle
                ) *
                0.12;
        }


        ship.vx *= 0.995;
        ship.vy *= 0.995;


        ship.x += ship.vx;
        ship.y += ship.vy;


        wrap(ship);


        asteroids.forEach(asteroid => {

            asteroid.x +=
                asteroid.vx;

            asteroid.y +=
                asteroid.vy;

            wrap(asteroid);

        });


        bullets.forEach(bullet => {

            bullet.x += bullet.vx;
            bullet.y += bullet.vy;

            bullet.life--;

            wrap(bullet);

        });


        bullets =
            bullets.filter(
                bullet =>
                    bullet.life > 0
            );


        /* BULLET / ASTEROID */

        bullets.forEach(bullet => {

            asteroids.forEach(asteroid => {

                if (
                    asteroid.dead
                ) {
                    return;
                }


                if (
                    Math.hypot(
                        bullet.x -
                        asteroid.x,

                        bullet.y -
                        asteroid.y
                    ) <
                    asteroid.radius
                ) {

                    asteroid.dead = true;

                    bullet.life = 0;

                    updateScore(
                        score + 10
                    );
                }
            });
        });


        asteroids =
            asteroids.filter(
                asteroid =>
                    !asteroid.dead
            );


        /* SHIP COLLISION */

        if (
            asteroids.some(
                asteroid =>

                    Math.hypot(
                        ship.x -
                        asteroid.x,

                        ship.y -
                        asteroid.y
                    ) <
                    asteroid.radius +
                    ship.radius
            )
        ) {

            finished = true;

            drawAsteroids();

            showGameOver();

            return;
        }


        if (
            asteroids.length === 0
        ) {

            finished = true;

            drawAsteroids();

            showGameOver(
                "SECTOR CLEAR!"
            );

            return;
        }


        drawAsteroids();

        requestAnimationFrame(
            asteroidLoop
        );
    }


    function drawAsteroids() {

        ctx.fillStyle = "#03050c";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /* STARS */

        ctx.fillStyle =
            "rgba(255,255,255,.28)";


        for (
            let i = 0;
            i < 50;
            i++
        ) {

            ctx.fillRect(
                (
                    i * 83
                ) %
                canvas.width,

                (
                    i * 47
                ) %
                canvas.height,

                1.5,
                1.5
            );
        }


        /* ASTEROIDS */

        ctx.strokeStyle = "#ffffff";

        ctx.lineWidth = 2;


        asteroids.forEach(asteroid => {

            ctx.beginPath();

            ctx.arc(
                asteroid.x,
                asteroid.y,
                asteroid.radius,
                0,
                Math.PI * 2
            );

            ctx.stroke();

        });


        /* SHIP */

        ctx.save();

        ctx.translate(
            ship.x,
            ship.y
        );

        ctx.rotate(
            ship.angle
        );


        ctx.strokeStyle = "#55e8ff";

        ctx.lineWidth = 2;


        ctx.beginPath();

        ctx.moveTo(
            18,
            0
        );

        ctx.lineTo(
            -12,
            -11
        );

        ctx.lineTo(
            -7,
            0
        );

        ctx.lineTo(
            -12,
            11
        );

        ctx.closePath();

        ctx.stroke();


        ctx.restore();


        /* BULLETS */

        ctx.fillStyle = "#ffffff";


        bullets.forEach(bullet => {

            ctx.beginPath();

            ctx.arc(
                bullet.x,
                bullet.y,
                3,
                0,
                Math.PI * 2
            );

            ctx.fill();

        });
    }


    drawAsteroids();

    asteroidLoop();
}


/* ============================================================
   PENALTY SHOOTOUT
   ============================================================ */

else if (GAME === "penalties") {

    showHelp(
        "Click inside the goal to shoot • You get 5 penalties"
    );


    let keeperX = 378;

    let attempts = 0;

    let ball = {
        x: 400,
        y: 435
    };

    let message = "";

    let finished = false;


    function drawPenalty() {

        /* PITCH */

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height
            );


        gradient.addColorStop(
            0,
            "#102a1b"
        );

        gradient.addColorStop(
            1,
            "#185b2d"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /* GOAL */

        ctx.strokeStyle = "#ffffff";

        ctx.lineWidth = 6;


        ctx.strokeRect(
            145,
            70,
            510,
            270
        );


        /* NET */

        ctx.strokeStyle =
            "rgba(255,255,255,.18)";

        ctx.lineWidth = 1;


        for (
            let x = 170;
            x < 650;
            x += 35
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x,
                75
            );

            ctx.lineTo(
                x,
                335
            );

            ctx.stroke();
        }


        for (
            let y = 100;
            y < 340;
            y += 30
        ) {

            ctx.beginPath();

            ctx.moveTo(
                150,
                y
            );

            ctx.lineTo(
                650,
                y
            );

            ctx.stroke();
        }


        /* KEEPER */

        ctx.fillStyle = "#ffd447";


        ctx.fillRect(
            keeperX,
            230,
            44,
            82
        );


        ctx.beginPath();

        ctx.arc(
            keeperX + 22,
            215,
            16,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* BALL */

        ctx.fillStyle = "#ffffff";


        ctx.beginPath();

        ctx.arc(
            ball.x,
            ball.y,
            15,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* MESSAGE */

        if (message) {

            ctx.fillStyle =
                message === "GOAL!"
                    ? "#55e8ff"
                    : "#ff4f87";


            ctx.textAlign = "center";

            ctx.font =
                "900 38px Arial";


            ctx.fillText(
                message,
                canvas.width / 2,
                390
            );
        }


        ctx.fillStyle =
            "rgba(255,255,255,.7)";


        ctx.font =
            "600 15px Arial";


        ctx.fillText(
            `Penalty ${Math.min(
                attempts + 1,
                5
            )} of 5`,
            canvas.width / 2,
            35
        );
    }


    canvas.addEventListener("click", event => {

        if (finished) {
            return;
        }


        const rect =
            canvas.getBoundingClientRect();


        const targetX =

            (
                event.clientX -
                rect.left
            ) *

            canvas.width /
            rect.width;


        const targetY =

            (
                event.clientY -
                rect.top
            ) *

            canvas.height /
            rect.height;


        /* MUST CLICK GOAL */

        if (
            targetX < 145 ||
            targetX > 655 ||
            targetY < 70 ||
            targetY > 340
        ) {

            return;
        }


        attempts++;


        /*
           Keeper chooses where to dive.
        */

        const keeperTarget =
            165 +
            Math.random() *
            450;


        const saved =
            Math.abs(
                targetX -
                keeperTarget
            ) < 75;


        keeperX =
            keeperTarget - 22;


        ball.x = targetX;
        ball.y = targetY;


        if (saved) {

            message = "SAVED!";

        } else {

            message = "GOAL!";

            updateScore(
                score + 1
            );
        }


        drawPenalty();


        if (
            attempts >= 5
        ) {

            finished = true;


            setTimeout(
                () => {

                    showGameOver(
                        score >= 3
                            ? "YOU WIN!"
                            : "FULL TIME"
                    );

                },
                650
            );


            return;
        }


        setTimeout(
            () => {

                ball.x = 400;
                ball.y = 435;

                message = "";

                keeperX =
                    378;

                drawPenalty();

            },
            650
        );
    });


    drawPenalty();
}


/* ============================================================
   NEON RACER
   ============================================================ */

else if (GAME === "racing") {

    showHelp(
        "← → or A / D to steer"
    );


    const roadLeft = 205;
    const roadRight = 595;


    const player = {
        x: 376,
        y: 405,
        width: 48,
        height: 75
    };


    const keys = {};

    let traffic = [];

    let frame = 0;

    let finished = false;


    document.addEventListener("keydown", event => {

        keys[event.code] = true;


        if (
            event.code === "ArrowLeft" ||
            event.code === "ArrowRight"
        ) {

            event.preventDefault();
        }
    });


    document.addEventListener("keyup", event => {

        keys[event.code] = false;

    });


    function racingLoop() {

        if (finished) {
            return;
        }


        frame++;


        /* PLAYER */

        if (
            keys.ArrowLeft ||
            keys.KeyA
        ) {

            player.x -= 6;
        }


        if (
            keys.ArrowRight ||
            keys.KeyD
        ) {

            player.x += 6;
        }


        player.x =
            Math.max(
                roadLeft + 10,

                Math.min(
                    roadRight -
                    player.width -
                    10,

                    player.x
                )
            );


        /* SPAWN TRAFFIC */

        if (
            frame % 58 === 0
        ) {

            const lanes = [
                235,
                320,
                405,
                490
            ];


            const lane =
                lanes[
                    Math.floor(
                        Math.random() *
                        lanes.length
                    )
                ];


            traffic.push({
                x: lane,
                y: -90,
                width: 48,
                height: 75,
                speed:
                    5 +
                    Math.random() *
                    2
            });
        }


        traffic.forEach(car => {

            car.y +=
                car.speed +
                Math.min(
                    score / 500,
                    3
                );

        });


        traffic =
            traffic.filter(
                car =>
                    car.y <
                    canvas.height +
                    100
            );


        /* COLLISION */

        if (
            traffic.some(car =>

                player.x <
                    car.x +
                    car.width &&

                player.x +
                    player.width >
                    car.x &&

                player.y <
                    car.y +
                    car.height &&

                player.y +
                    player.height >
                    car.y
            )
        ) {

            finished = true;

            drawRacing();

            showGameOver(
                "CRASH!"
            );

            return;
        }


        updateScore(
            Math.floor(
                frame / 7
            )
        );


        drawRacing();

        requestAnimationFrame(
            racingLoop
        );
    }


    function drawCar(
        x,
        y,
        colour
    ) {

        ctx.fillStyle = colour;

        ctx.fillRect(
            x,
            y,
            48,
            75
        );


        ctx.fillStyle =
            "#0b1220";


        ctx.fillRect(
            x + 8,
            y + 12,
            32,
            19
        );


        ctx.fillRect(
            x + 8,
            y + 45,
            32,
            17
        );


        ctx.fillStyle =
            "#ffffff";


        ctx.fillRect(
            x + 5,
            y + 3,
            8,
            5
        );


        ctx.fillRect(
            x + 35,
            y + 3,
            8,
            5
        );
    }


    function drawRacing() {

        /* GRASS */

        ctx.fillStyle = "#07150e";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /* ROAD */

        ctx.fillStyle = "#171c27";

        ctx.fillRect(
            roadLeft,
            0,
            roadRight -
            roadLeft,
            canvas.height
        );


        /* ROAD EDGES */

        ctx.fillStyle = "#55e8ff";


        ctx.fillRect(
            roadLeft,
            0,
            4,
            canvas.height
        );


        ctx.fillRect(
            roadRight - 4,
            0,
            4,
            canvas.height
        );


        /* LANE MARKERS */

        ctx.fillStyle =
            "rgba(255,255,255,.35)";


        const offset =
            (
                frame * 7
            ) %
            60;


        for (
            let laneX = 290;
            laneX <= 510;
            laneX += 80
        ) {

            for (
                let y = -60 + offset;
                y < canvas.height;
                y += 60
            ) {

                ctx.fillRect(
                    laneX,
                    y,
                    4,
                    30
                );
            }
        }


        /* PLAYER */

        drawCar(
            player.x,
            player.y,
            "#55e8ff"
        );


        /* TRAFFIC */

        traffic.forEach(
            (car, index) => {

                drawCar(
                    car.x,
                    car.y,

                    index % 2
                        ? "#ff4f87"
                        : "#a879ff"
                );
            }
        );
    }


    drawRacing();

    racingLoop();
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
