/* ============================================================
   SARA'S & HAIDAR'S ARCADE
   COMPLETE ARCADE.JS
   ============================================================ */

"use strict";


/* ============================================================
   GAME DETECTION
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


const GAME =
    window.GAME ||
    document.body.dataset.game ||
    GAME_MAP[fileName];


console.log("S&H Arcade loading:", GAME);


/* ============================================================
   SHARED ELEMENTS
   ============================================================ */

const canvas =
    document.getElementById("game");


const ctx =
    canvas
        ? canvas.getContext("2d")
        : null;


const scoreElement =
    document.getElementById("score");


const bestElement =
    document.getElementById("best");


const helpElement =
    document.getElementById("help");


const domGame =
    document.getElementById("domgame");


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


/* ============================================================
   SHARED FUNCTIONS
   ============================================================ */

function updateScore(value) {

    score = value;


    if (scoreElement) {
        scoreElement.textContent = score;
    }


    if (score > best) {

        best = score;


        localStorage.setItem(
            "sh_best_" + GAME,
            String(best)
        );


        if (bestElement) {
            bestElement.textContent = best;
        }
    }
}


function addScore(amount) {

    updateScore(
        score + amount
    );
}


function showHelp(message) {

    if (helpElement) {
        helpElement.textContent = message;
    }
}


function clearCanvas(
    colour = "#070b14"
) {

    if (!ctx || !canvas) {
        return;
    }


    ctx.fillStyle = colour;


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}


function showGameOver(
    title = "GAME OVER",
    subtitle = "Press Restart to play again"
) {

    if (!ctx || !canvas) {
        return;
    }


    ctx.fillStyle =
        "rgba(3, 6, 15, 0.86)";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.textAlign = "center";


    ctx.fillStyle = "#ffffff";


    ctx.font =
        "900 44px Arial";


    ctx.fillText(
        title,
        canvas.width / 2,
        canvas.height / 2 - 5
    );


    ctx.fillStyle = "#9ca9c9";


    ctx.font =
        "600 17px Arial";


    ctx.fillText(
        subtitle,
        canvas.width / 2,
        canvas.height / 2 + 38
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
        Math.floor(
            canvas.width / GRID
        );


    const ROWS =
        Math.floor(
            canvas.height / GRID
        );


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

        clearCanvas(
            "#080d18"
        );


        ctx.strokeStyle =
            "rgba(255,255,255,.035)";


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

                ctx.fillStyle =
                    index === 0
                        ? "#ffffff"
                        : "#55e8ff";


                ctx.shadowColor =
                    "#55e8ff";


                ctx.shadowBlur =
                    index === 0
                        ? 14
                        : 6;


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


        const head = {

            x:
                snake[0].x +
                direction.x,

            y:
                snake[0].y +
                direction.y
        };


        if (

            head.x < 0 ||

            head.x >= COLS ||

            head.y < 0 ||

            head.y >= ROWS ||

            snake.some(
                segment =>
                    segment.x === head.x &&
                    segment.y === head.y
            )

        ) {

            dead = true;

            showGameOver();

            return;
        }


        snake.unshift(
            head
        );


        if (

            head.x === food.x &&
            head.y === food.y

        ) {

            addScore(1);

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


    const bird = {
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

        const top =
            70 +
            Math.random() *
            200;


        pipes.push({
            x: canvas.width,
            top,
            passed: false
        });
    }


    function drawFlappy() {

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

        pipes.forEach(pipe => {

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
        });


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


        pipes.forEach(pipe => {

            pipe.x -= 3;


            if (

                !pipe.passed &&

                pipe.x +
                    pipeWidth <
                    bird.x

            ) {

                pipe.passed = true;

                addScore(1);
            }


            const insidePipe =

                bird.x +
                    bird.radius >
                    pipe.x &&

                bird.x -
                    bird.radius <
                    pipe.x +
                    pipeWidth;


            const hitsPipe =

                bird.y -
                    bird.radius <
                    pipe.top ||

                bird.y +
                    bird.radius >
                    pipe.top +
                    pipeGap;


            if (
                insidePipe &&
                hitsPipe
            ) {

                dead = true;
            }
        });


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


        drawFlappy();


        if (dead) {

            showGameOver();

            return;
        }


        requestAnimationFrame(
            flappyLoop
        );
    }


    flappyLoop();
}


/* ============================================================
   BIRD LAUNCHER
   ============================================================ */

else if (GAME === "launcher") {

    showHelp(
        "Drag the bird backwards and release"
    );


    const start = {
        x: 150,
        y: 365
    };


    const bird = {
        x: start.x,
        y: start.y,
        radius: 18,
        vx: 0,
        vy: 0
    };


    const targets = [

        {
            x: 590,
            y: 390,
            radius: 24,
            alive: true
        },

        {
            x: 650,
            y: 390,
            radius: 24,
            alive: true
        },

        {
            x: 620,
            y: 330,
            radius: 24,
            alive: true
        }

    ];


    let dragging = false;


    let launched = false;


    let finished = false;


    canvas.addEventListener(
        "mousedown",
        event => {

            if (
                launched ||
                finished
            ) {
                return;
            }


            const rect =
                canvas.getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                ) *
                canvas.width /
                rect.width;


            const y =
                (
                    event.clientY -
                    rect.top
                ) *
                canvas.height /
                rect.height;


            if (
                Math.hypot(
                    x - bird.x,
                    y - bird.y
                ) <
                35
            ) {

                dragging = true;
            }
        }
    );


    canvas.addEventListener(
        "mousemove",
        event => {

            if (!dragging) {
                return;
            }


            const rect =
                canvas.getBoundingClientRect();


            let x =
                (
                    event.clientX -
                    rect.left
                ) *
                canvas.width /
                rect.width;


            let y =
                (
                    event.clientY -
                    rect.top
                ) *
                canvas.height /
                rect.height;


            const dx =
                x - start.x;


            const dy =
                y - start.y;


            const distance =
                Math.hypot(
                    dx,
                    dy
                );


            const maxPull = 100;


            if (
                distance >
                maxPull
            ) {

                x =
                    start.x +
                    dx /
                    distance *
                    maxPull;


                y =
                    start.y +
                    dy /
                    distance *
                    maxPull;
            }


            bird.x = x;

            bird.y = y;


            drawLauncher();
        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            if (!dragging) {
                return;
            }


            dragging = false;

            launched = true;


            bird.vx =
                (
                    start.x -
                    bird.x
                ) *
                0.12;


            bird.vy =
                (
                    start.y -
                    bird.y
                ) *
                0.12;
        }
    );


    function drawLauncher() {

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height
            );


        gradient.addColorStop(
            0,
            "#132846"
        );


        gradient.addColorStop(
            1,
            "#294f69"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        /* GROUND */

        ctx.fillStyle =
            "#223c28";


        ctx.fillRect(
            0,
            420,
            canvas.width,
            80
        );


        /* SLINGSHOT */

        ctx.strokeStyle =
            "#8b5a2b";


        ctx.lineWidth = 12;


        ctx.beginPath();


        ctx.moveTo(
            140,
            420
        );


        ctx.lineTo(
            140,
            345
        );


        ctx.stroke();


        if (dragging) {

            ctx.strokeStyle =
                "#33200f";


            ctx.lineWidth = 5;


            ctx.beginPath();


            ctx.moveTo(
                140,
                350
            );


            ctx.lineTo(
                bird.x,
                bird.y
            );


            ctx.stroke();
        }


        /* TARGETS */

        targets.forEach(target => {

            if (!target.alive) {
                return;
            }


            ctx.fillStyle =
                "#58e99b";


            ctx.beginPath();


            ctx.arc(
                target.x,
                target.y,
                target.radius,
                0,
                Math.PI * 2
            );


            ctx.fill();


            ctx.fillStyle =
                "#07100b";


            ctx.beginPath();


            ctx.arc(
                target.x - 8,
                target.y - 5,
                3,
                0,
                Math.PI * 2
            );


            ctx.arc(
                target.x + 8,
                target.y - 5,
                3,
                0,
                Math.PI * 2
            );


            ctx.fill();
        });


        /* BIRD */

        ctx.fillStyle =
            "#ff4f57";


        ctx.shadowColor =
            "#ff4f57";


        ctx.shadowBlur = 12;


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
    }


    function launcherLoop() {

        if (finished) {
            return;
        }


        if (launched) {

            bird.vy += 0.35;


            bird.x += bird.vx;


            bird.y += bird.vy;


            targets.forEach(target => {

                if (
                    target.alive &&
                    Math.hypot(
                        bird.x -
                        target.x,

                        bird.y -
                        target.y
                    ) <
                    bird.radius +
                    target.radius
                ) {

                    target.alive = false;

                    addScore(1);
                }
            });


            if (
                targets.every(
                    target =>
                        !target.alive
                )
            ) {

                finished = true;

                drawLauncher();

                showGameOver(
                    "ALL TARGETS DOWN!"
                );

                return;
            }


            if (

                bird.x >
                    canvas.width + 80 ||

                bird.y >
                    canvas.height + 80 ||

                bird.x < -80

            ) {

                bird.x =
                    start.x;

                bird.y =
                    start.y;

                bird.vx = 0;

                bird.vy = 0;

                launched = false;
            }
        }


        drawLauncher();


        requestAnimationFrame(
            launcherLoop
        );
    }


    drawLauncher();

    launcherLoop();
}


/* ============================================================
   TETRIS / BLOCK DROP
   ============================================================ */

else if (GAME === "tetris") {

    showHelp(
        "← → Move • ↓ Drop • ↑ Rotate • SPACE Hard Drop"
    );


    const COLS = 10;


    const ROWS = 20;


    const BLOCK =
        canvas.width /
        COLS;


    const board =
        Array.from(
            {
                length: ROWS
            },
            () =>
                Array(
                    COLS
                ).fill(0)
        );


    const colours = [
        null,
        "#55e8ff",
        "#ffd447",
        "#a879ff",
        "#58e99b",
        "#ff4f87",
        "#ff8c42",
        "#5271ff"
    ];


    const pieces = [

        [
            [1, 1, 1, 1]
        ],

        [
            [2, 2],
            [2, 2]
        ],

        [
            [0, 3, 0],
            [3, 3, 3]
        ],

        [
            [0, 4, 4],
            [4, 4, 0]
        ],

        [
            [5, 5, 0],
            [0, 5, 5]
        ],

        [
            [6, 0, 0],
            [6, 6, 6]
        ],

        [
            [0, 0, 7],
            [7, 7, 7]
        ]

    ];


    let current;


    let dropCounter = 0;


    let lastTime = 0;


    let dead = false;


    function randomPiece() {

        const matrix =
            pieces[
                Math.floor(
                    Math.random() *
                    pieces.length
                )
            ];


        current = {

            matrix:
                matrix.map(
                    row =>
                        [...row]
                ),

            x:
                Math.floor(
                    COLS / 2
                ) -
                Math.floor(
                    matrix[0].length /
                    2
                ),

            y: 0
        };


        if (
            collides(
                current.matrix,
                current.x,
                current.y
            )
        ) {

            dead = true;
        }
    }


    function collides(
        matrix,
        offsetX,
        offsetY
    ) {

        for (
            let y = 0;
            y < matrix.length;
            y++
        ) {

            for (
                let x = 0;
                x < matrix[y].length;
                x++
            ) {

                if (
                    matrix[y][x] === 0
                ) {
                    continue;
                }


                const boardX =
                    offsetX + x;


                const boardY =
                    offsetY + y;


                if (

                    boardX < 0 ||

                    boardX >= COLS ||

                    boardY >= ROWS ||

                    (
                        boardY >= 0 &&
                        board[boardY][boardX]
                    )

                ) {

                    return true;
                }
            }
        }


        return false;
    }


    function mergePiece() {

        current.matrix.forEach(
            (row, y) => {

                row.forEach(
                    (value, x) => {

                        if (value) {

                            board[
                                current.y + y
                            ][
                                current.x + x
                            ] = value;
                        }
                    }
                );
            }
        );
    }


    function clearLines() {

        let lines = 0;


        outer:

        for (
            let y =
                ROWS - 1;

            y >= 0;

            y--
        ) {

            for (
                let x = 0;
                x < COLS;
                x++
            ) {

                if (
                    board[y][x] === 0
                ) {

                    continue outer;
                }
            }


            const row =
                board.splice(
                    y,
                    1
                )[0];


            row.fill(0);


            board.unshift(
                row
            );


            y++;

            lines++;
        }


        if (lines > 0) {

            const points = [
                0,
                100,
                300,
                500,
                800
            ];


            addScore(
                points[lines] ||
                lines * 200
            );
        }
    }


    function playerDrop() {

        current.y++;


        if (
            collides(
                current.matrix,
                current.x,
                current.y
            )
        ) {

            current.y--;

            mergePiece();

            clearLines();

            randomPiece();
        }


        dropCounter = 0;
    }


    function hardDrop() {

        while (
            !collides(
                current.matrix,
                current.x,
                current.y + 1
            )
        ) {

            current.y++;
        }


        playerDrop();
    }


    function rotateMatrix(
        matrix
    ) {

        return matrix[0].map(
            (_, index) =>
                matrix.map(
                    row =>
                        row[index]
                ).reverse()
        );
    }


    function rotatePiece() {

        const rotated =
            rotateMatrix(
                current.matrix
            );


        if (
            !collides(
                rotated,
                current.x,
                current.y
            )
        ) {

            current.matrix =
                rotated;
        }
    }


    function drawTetrisBlock(
        x,
        y,
        value
    ) {

        ctx.fillStyle =
            colours[value];


        ctx.fillRect(

            x * BLOCK + 1,

            y * BLOCK + 1,

            BLOCK - 2,

            BLOCK - 2

        );
    }


    function drawTetris() {

        clearCanvas(
            "#080d18"
        );


        ctx.strokeStyle =
            "rgba(255,255,255,.035)";


        for (
            let x = 0;
            x <= canvas.width;
            x += BLOCK
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
            y += BLOCK
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


        board.forEach(
            (row, y) => {

                row.forEach(
                    (value, x) => {

                        if (value) {

                            drawTetrisBlock(
                                x,
                                y,
                                value
                            );
                        }
                    }
                );
            }
        );


        current.matrix.forEach(
            (row, y) => {

                row.forEach(
                    (value, x) => {

                        if (value) {

                            drawTetrisBlock(

                                current.x +
                                    x,

                                current.y +
                                    y,

                                value

                            );
                        }
                    }
                );
            }
        );
    }


    document.addEventListener(
        "keydown",
        event => {

            if (dead) {
                return;
            }


            if (
                [
                    "ArrowLeft",
                    "ArrowRight",
                    "ArrowDown",
                    "ArrowUp",
                    "Space"
                ].includes(
                    event.code
                )
            ) {

                event.preventDefault();
            }


            if (
                event.code ===
                "ArrowLeft"
            ) {

                current.x--;


                if (
                    collides(
                        current.matrix,
                        current.x,
                        current.y
                    )
                ) {

                    current.x++;
                }
            }


            else if (
                event.code ===
                "ArrowRight"
            ) {

                current.x++;


                if (
                    collides(
                        current.matrix,
                        current.x,
                        current.y
                    )
                ) {

                    current.x--;
                }
            }


            else if (
                event.code ===
                "ArrowDown"
            ) {

                playerDrop();
            }


            else if (
                event.code ===
                "ArrowUp"
            ) {

                rotatePiece();
            }


            else if (
                event.code ===
                "Space"
            ) {

                hardDrop();
            }
        }
    );


    function tetrisLoop(
        time = 0
    ) {

        if (dead) {

            drawTetris();

            showGameOver();

            return;
        }


        const delta =
            time -
            lastTime;


        lastTime = time;


        dropCounter +=
            delta;


        if (
            dropCounter >
            650
        ) {

            playerDrop();
        }


        drawTetris();


        requestAnimationFrame(
            tetrisLoop
        );
    }


    randomPiece();

    tetrisLoop();
}


/* ============================================================
   PONG
   ============================================================ */

else if (GAME === "pong") {

    showHelp(
        "Mouse or W / S"
    );


    let playerY = 205;


    let cpuY = 205;


    const paddleHeight = 90;


    const ball = {
        x: 400,
        y: 250,
        vx: 5,
        vy: 3,
        radius: 9
    };


    const keys = {};


    let finished = false;


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

                paddleHeight /
                2;
        }
    );


    function drawPong() {

        clearCanvas(
            "#070b14"
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
            paddleHeight
        );


        ctx.fillStyle =
            "#ff4f87";


        ctx.fillRect(
            canvas.width - 42,
            cpuY,
            12,
            paddleHeight
        );


        ctx.fillStyle =
            "#ffffff";


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


    function pongLoop() {

        if (finished) {
            return;
        }


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
                    canvas.height -
                    paddleHeight,
                    playerY
                )
            );


        cpuY +=

            Math.sign(

                ball.y -

                (
                    cpuY +
                    paddleHeight / 2
                )

            ) *

            3.3;


        cpuY =
            Math.max(
                0,
                Math.min(
                    canvas.height -
                    paddleHeight,
                    cpuY
                )
            );


        ball.x +=
            ball.vx;


        ball.y +=
            ball.vy;


        if (

            ball.y -
                ball.radius <=
                0 ||

            ball.y +
                ball.radius >=
                canvas.height

        ) {

            ball.vy *= -1;
        }


        if (

            ball.x -
                ball.radius <
                42 &&

            ball.x >
                25 &&

            ball.y >
                playerY &&

            ball.y <
                playerY +
                paddleHeight &&

            ball.vx < 0

        ) {

            ball.vx =
                Math.abs(
                    ball.vx
                ) *
                1.03;


            addScore(1);
        }


        if (

            ball.x +
                ball.radius >
                canvas.width -
                42 &&

            ball.x <
                canvas.width -
                25 &&

            ball.y >
                cpuY &&

            ball.y <
                cpuY +
                paddleHeight &&

            ball.vx > 0

        ) {

            ball.vx =
                -Math.abs(
                    ball.vx
                ) *
                1.02;
        }


        if (
            ball.x < -20
        ) {

            finished = true;

            drawPong();

            showGameOver(
                "CPU WINS"
            );

            return;
        }


        if (
            ball.x >
            canvas.width + 20
        ) {

            ball.x = 400;

            ball.y = 250;

            ball.vx = -5;

            ball.vy = 3;
        }


        drawPong();


        requestAnimationFrame(
            pongLoop
        );
    }


    drawPong();

    pongLoop();
}


/* ============================================================
   BREAKOUT
   ============================================================ */

else if (GAME === "breakout") {

    showHelp(
        "Mouse or ← → to move"
    );


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


    for (
        let row = 0;
        row < 5;
        row++
    ) {

        for (
            let col = 0;
            col < 10;
            col++
        ) {

            bricks.push({

                x:
                    42 +
                    col * 72,

                y:
                    55 +
                    row * 34,

                width: 64,

                height: 24,

                alive: true,

                hue:
                    185 +
                    row * 25

            });
        }
    }


    document.addEventListener(
        "keydown",
        event => {

            keys[event.key] =
                true;


            if (
                event.key ===
                    "ArrowLeft" ||

                event.key ===
                    "ArrowRight"
            ) {

                event.preventDefault();
            }
        }
    );


    document.addEventListener(
        "keyup",
        event => {

            keys[event.key] =
                false;
        }
    );


    canvas.addEventListener(
        "mousemove",
        event => {

            const rect =
                canvas.getBoundingClientRect();


            const mouseX =

                (
                    event.clientX -
                    rect.left
                ) *

                canvas.width /
                rect.width;


            paddle.x =
                mouseX -
                paddle.width / 2;
        }
    );


    function drawBreakout() {

        clearCanvas(
            "#070b14"
        );


        bricks.forEach(
            brick => {

                if (!brick.alive) {
                    return;
                }


                ctx.fillStyle =
                    `hsl(${brick.hue} 80% 60%)`;


                ctx.shadowColor =
                    ctx.fillStyle;


                ctx.shadowBlur = 8;


                ctx.fillRect(
                    brick.x,
                    brick.y,
                    brick.width,
                    brick.height
                );


                ctx.shadowBlur = 0;
            }
        );


        ctx.fillStyle =
            "#55e8ff";


        ctx.fillRect(
            paddle.x,
            paddle.y,
            paddle.width,
            paddle.height
        );


        ctx.fillStyle =
            "#ffffff";


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


    function breakoutLoop() {

        if (finished) {
            return;
        }


        if (
            keys.ArrowLeft
        ) {

            paddle.x -= 8;
        }


        if (
            keys.ArrowRight
        ) {

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


        ball.x += ball.vx;

        ball.y += ball.vy;


        if (

            ball.x -
                ball.radius <=
                0 ||

            ball.x +
                ball.radius >=
                canvas.width

        ) {

            ball.vx *= -1;
        }


        if (
            ball.y -
                ball.radius <=
                0
        ) {

            ball.vy =
                Math.abs(
                    ball.vy
                );
        }


        if (

            ball.y +
                ball.radius >=
                paddle.y &&

            ball.y -
                ball.radius <=
                paddle.y +
                paddle.height &&

            ball.x >=
                paddle.x &&

            ball.x <=
                paddle.x +
                paddle.width &&

            ball.vy > 0

        ) {

            const hit =

                (
                    ball.x -

                    (
                        paddle.x +
                        paddle.width /
                        2
                    )

                ) /

                (
                    paddle.width /
                    2
                );


            ball.vx =
                hit * 6;


            ball.vy =
                -Math.abs(
                    ball.vy
                );
        }


        bricks.forEach(
            brick => {

                if (!brick.alive) {
                    return;
                }


                if (

                    ball.x +
                        ball.radius >
                        brick.x &&

                    ball.x -
                        ball.radius <
                        brick.x +
                        brick.width &&

                    ball.y +
                        ball.radius >
                        brick.y &&

                    ball.y -
                        ball.radius <
                        brick.y +
                        brick.height

                ) {

                    brick.alive =
                        false;


                    ball.vy *= -1;


                    addScore(10);
                }
            }
        );


        if (
            ball.y >
            canvas.height + 20
        ) {

            finished = true;

            drawBreakout();

            showGameOver();

            return;
        }


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
        x: 378,
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


    for (
        let row = 0;
        row < 4;
        row++
    ) {

        for (
            let col = 0;
            col < 9;
            col++
        ) {

            aliens.push({

                x:
                    90 +
                    col * 70,

                y:
                    60 +
                    row * 48,

                width: 36,

                height: 25,

                alive: true

            });
        }
    }


    document.addEventListener(
        "keydown",
        event => {

            keys[event.code] =
                true;


            if (
                event.code ===
                "Space"
            ) {

                event.preventDefault();


                if (
                    !event.repeat &&
                    bullets.length < 5
                ) {

                    bullets.push({

                        x:
                            player.x +
                            player.width /
                            2 -
                            2,

                        y:
                            player.y,

                        width: 4,

                        height: 12

                    });
                }
            }
        }
    );


    document.addEventListener(
        "keyup",
        event => {

            keys[event.code] =
                false;
        }
    );


    function drawInvaders() {

        clearCanvas(
            "#040711"
        );


        ctx.fillStyle =
            "rgba(255,255,255,.25)";


        for (
            let i = 0;
            i < 40;
            i++
        ) {

            ctx.fillRect(

                (
                    i * 97
                ) %
                canvas.width,

                (
                    i * 53
                ) %
                canvas.height,

                2,

                2

            );
        }


        /* PLAYER */

        ctx.fillStyle =
            "#55e8ff";


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


        /* ALIENS */

        aliens.forEach(
            alien => {

                if (!alien.alive) {
                    return;
                }


                ctx.fillStyle =
                    "#a879ff";


                ctx.fillRect(
                    alien.x,
                    alien.y,
                    alien.width,
                    alien.height
                );


                ctx.fillStyle =
                    "#050812";


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
            }
        );


        ctx.fillStyle =
            "#ffffff";


        bullets.forEach(
            bullet => {

                ctx.fillRect(
                    bullet.x,
                    bullet.y,
                    bullet.width,
                    bullet.height
                );
            }
        );
    }


    function invadersLoop() {

        if (finished) {
            return;
        }


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


        bullets.forEach(
            bullet => {

                bullet.y -= 8;
            }
        );


        bullets =
            bullets.filter(
                bullet =>
                    bullet.y > -20
            );


        alienTimer++;


        if (
            alienTimer >= 28
        ) {

            alienTimer = 0;


            let edge = false;


            aliens.forEach(
                alien => {

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
                            canvas.width -
                            15

                    ) {

                        edge = true;
                    }
                }
            );


            if (edge) {

                alienDirection *= -1;


                aliens.forEach(
                    alien => {

                        if (alien.alive) {
                            alien.y += 18;
                        }
                    }
                );

            } else {

                aliens.forEach(
                    alien => {

                        if (alien.alive) {

                            alien.x +=

                                16 *
                                alienDirection;
                        }
                    }
                );
            }
        }


        bullets.forEach(
            bullet => {

                aliens.forEach(
                    alien => {

                        if (
                            !alien.alive
                        ) {
                            return;
                        }


                        if (

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

                            alien.alive =
                                false;


                            bullet.y = -100;


                            addScore(10);
                        }
                    }
                );
            }
        );


        bullets =
            bullets.filter(
                bullet =>
                    bullet.y > -20
            );


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


    document.addEventListener(
        "keydown",
        event => {

            if (

                event.code ===
                    "Space" ||

                event.code ===
                    "ArrowUp"

            ) {

                event.preventDefault();

                jump();
            }
        }
    );


    canvas.addEventListener(
        "click",
        jump
    );


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


        ctx.fillStyle =
            "#162b25";


        ctx.fillRect(
            0,
            groundY,
            canvas.width,
            canvas.height -
                groundY
        );


        ctx.fillStyle =
            "#58e99b";


        ctx.fillRect(
            0,
            groundY,
            canvas.width,
            4
        );


        ctx.fillStyle =
            "#55e8ff";


        ctx.fillRect(
            player.x,
            player.y,
            player.width,
            player.height
        );


        ctx.fillStyle =
            "#050812";


        ctx.fillRect(
            player.x + 29,
            player.y + 11,
            6,
            6
        );


        ctx.fillStyle =
            "#ff4f87";


        obstacles.forEach(
            obstacle => {

                ctx.fillRect(
                    obstacle.x,
                    obstacle.y,
                    obstacle.width,
                    obstacle.height
                );
            }
        );
    }


    function runnerLoop() {

        if (finished) {
            return;
        }


        frame++;


        player.vy += 0.7;

        player.y +=
            player.vy;


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


        if (
            frame % 95 === 0
        ) {

            const height =
                35 +
                Math.random() *
                45;


            obstacles.push({

                x:
                    canvas.width +
                    30,

                y:
                    groundY -
                    height,

                width:
                    24 +
                    Math.random() *
                    22,

                height

            });
        }


        obstacles.forEach(
            obstacle => {

                obstacle.x -=

                    6 +

                    Math.min(
                        score / 300,
                        3
                    );
            }
        );


        obstacles =
            obstacles.filter(
                obstacle =>
                    obstacle.x +
                        obstacle.width >
                    -20
            );


        const collision =
            obstacles.some(
                obstacle =>

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
            );


        if (collision) {

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


    drawRunner();

    runnerLoop();
}


/* ============================================================
   2048
   ============================================================ */

else if (GAME === "game2048") {

    showHelp(
        "Arrow Keys / WASD"
    );


    if (!domGame) {

        console.error(
            "2048 requires #domgame"
        );

    } else {

        const size = 4;


        let grid =
            Array.from(
                {
                    length: size
                },
                () =>
                    Array(
                        size
                    ).fill(0)
            );


        function add2048Tile() {

            const empty = [];


            for (
                let y = 0;
                y < size;
                y++
            ) {

                for (
                    let x = 0;
                    x < size;
                    x++
                ) {

                    if (
                        grid[y][x] === 0
                    ) {

                        empty.push({
                            x,
                            y
                        });
                    }
                }
            }


            if (
                empty.length === 0
            ) {
                return;
            }


            const spot =
                empty[
                    Math.floor(
                        Math.random() *
                        empty.length
                    )
                ];


            grid[
                spot.y
            ][
                spot.x
            ] =
                Math.random() <
                0.9
                    ? 2
                    : 4;
        }


        function render2048() {

            domGame.innerHTML =
                "";


            const board =
                document.createElement(
                    "div"
                );


            board.className =
                "board2048";


            grid.flat().forEach(
                value => {

                    const tile =
                        document.createElement(
                            "div"
                        );


                    tile.className =
                        "tile";


                    tile.textContent =
                        value || "";


                    if (value) {

                        tile.style.background =

                            value >= 128
                                ? "rgba(255,79,135,.35)"
                                : value >= 32
                                    ? "rgba(168,121,255,.30)"
                                    : "rgba(85,232,255,.18)";
                    }


                    board.appendChild(
                        tile
                    );
                }
            );


            domGame.appendChild(
                board
            );
        }


        function compressLine(
            line
        ) {

            const values =
                line.filter(
                    value =>
                        value !== 0
                );


            const result = [];


            for (
                let i = 0;
                i < values.length;
                i++
            ) {

                if (
                    values[i] ===
                    values[i + 1]
                ) {

                    const merged =
                        values[i] * 2;


                    result.push(
                        merged
                    );


                    addScore(
                        merged
                    );


                    i++;

                } else {

                    result.push(
                        values[i]
                    );
                }
            }


            while (
                result.length <
                size
            ) {

                result.push(0);
            }


            return result;
        }


        function move2048(
            direction
        ) {

            const before =
                JSON.stringify(
                    grid
                );


            if (
                direction === "left"
            ) {

                grid =
                    grid.map(
                        row =>
                            compressLine(
                                row
                            )
                    );
            }


            else if (
                direction === "right"
            ) {

                grid =
                    grid.map(
                        row =>
                            compressLine(
                                [...row]
                                    .reverse()
                            ).reverse()
                    );
            }


            else if (
                direction === "up"
            ) {

                for (
                    let x = 0;
                    x < size;
                    x++
                ) {

                    const column =
                        grid.map(
                            row =>
                                row[x]
                        );


                    const compressed =
                        compressLine(
                            column
                        );


                    for (
                        let y = 0;
                        y < size;
                        y++
                    ) {

                        grid[y][x] =
                            compressed[y];
                    }
                }
            }


            else if (
                direction === "down"
            ) {

                for (
                    let x = 0;
                    x < size;
                    x++
                ) {

                    const column =
                        grid.map(
                            row =>
                                row[x]
                        ).reverse();


                    const compressed =
                        compressLine(
                            column
                        ).reverse();


                    for (
                        let y = 0;
                        y < size;
                        y++
                    ) {

                        grid[y][x] =
                            compressed[y];
                    }
                }
            }


            if (
                before !==
                JSON.stringify(
                    grid
                )
            ) {

                add2048Tile();

                render2048();
            }
        }


        document.addEventListener(
            "keydown",
            event => {

                const key =
                    event.key.toLowerCase();


                const controls = {

                    arrowleft: "left",
                    a: "left",

                    arrowright: "right",
                    d: "right",

                    arrowup: "up",
                    w: "up",

                    arrowdown: "down",
                    s: "down"

                };


                if (
                    controls[key]
                ) {

                    event.preventDefault();

                    move2048(
                        controls[key]
                    );
                }
            }
        );


        add2048Tile();

        add2048Tile();

        render2048();
    }
}


/* ============================================================
   MINESWEEPER
   ============================================================ */

else if (GAME === "minesweeper") {

    showHelp(
        "Click to reveal • Right-click to flag"
    );


    if (!domGame) {

        console.error(
            "Minesweeper requires #domgame"
        );

    } else {

        const width = 10;


        const height = 10;


        const mineCount = 14;


        let ended = false;


        const cells =
            Array.from(
                {
                    length:
                        width *
                        height
                },
                (_, index) => ({

                    index,

                    mine: false,

                    open: false,

                    flag: false,

                    number: 0

                })
            );


        const mineIndexes =
            new Set();


        while (
            mineIndexes.size <
            mineCount
        ) {

            mineIndexes.add(
                Math.floor(
                    Math.random() *
                    cells.length
                )
            );
        }


        mineIndexes.forEach(
            index => {

                cells[index].mine =
                    true;
            }
        );


        function neighbours(
            index
        ) {

            const x =
                index %
                width;


            const y =
                Math.floor(
                    index /
                    width
                );


            const result = [];


            for (
                let dy = -1;
                dy <= 1;
                dy++
            ) {

                for (
                    let dx = -1;
                    dx <= 1;
                    dx++
                ) {

                    if (
                        dx === 0 &&
                        dy === 0
                    ) {
                        continue;
                    }


                    const nx =
                        x + dx;


                    const ny =
                        y + dy;


                    if (

                        nx >= 0 &&
                        nx < width &&
                        ny >= 0 &&
                        ny < height

                    ) {

                        result.push(
                            ny *
                            width +
                            nx
                        );
                    }
                }
            }


            return result;
        }


        cells.forEach(
            cell => {

                if (!cell.mine) {

                    cell.number =
                        neighbours(
                            cell.index
                        ).filter(
                            index =>
                                cells[index].mine
                        ).length;
                }
            }
        );


        function revealMineCell(
            index
        ) {

            const cell =
                cells[index];


            if (
                cell.open ||
                cell.flag ||
                ended
            ) {

                return;
            }


            cell.open = true;


            if (cell.mine) {

                ended = true;

                renderMines();

                setTimeout(
                    () =>
                        alert(
                            "Boom! Restart to try again."
                        ),
                    50
                );

                return;
            }


            addScore(1);


            if (
                cell.number === 0
            ) {

                neighbours(
                    index
                ).forEach(
                    revealMineCell
                );
            }


            const safeOpened =
                cells.filter(
                    item =>
                        item.open &&
                        !item.mine
                ).length;


            if (
                safeOpened ===
                cells.length -
                mineCount
            ) {

                ended = true;
            }


            renderMines();


            if (ended) {

                setTimeout(
                    () =>
                        alert(
                            "Minefield cleared!"
                        ),
                    50
                );
            }
        }


        function renderMines() {

            domGame.innerHTML =
                "";


            const grid =
                document.createElement(
                    "div"
                );


            grid.className =
                "minegrid";


            cells.forEach(
                cell => {

                    const button =
                        document.createElement(
                            "button"
                        );


                    button.className =
                        "cell";


                    if (cell.open) {

                        button.style.background =
                            "#0c1321";


                        if (cell.mine) {

                            button.textContent =
                                "💣";

                        } else if (
                            cell.number
                        ) {

                            button.textContent =
                                cell.number;
                        }

                    } else if (
                        cell.flag
                    ) {

                        button.textContent =
                            "🚩";
                    }


                    button.addEventListener(
                        "click",
                        () =>
                            revealMineCell(
                                cell.index
                            )
                    );


                    button.addEventListener(
                        "contextmenu",
                        event => {

                            event.preventDefault();


                            if (
                                cell.open ||
                                ended
                            ) {
                                return;
                            }


                            cell.flag =
                                !cell.flag;


                            renderMines();
                        }
                    );


                    grid.appendChild(
                        button
                    );
                }
            );


            domGame.appendChild(
                grid
            );
        }


        renderMines();
    }
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


    let remainingDots = 0;


    maze.forEach(
        row => {

            row.forEach(
                cell => {

                    if (
                        cell === "."
                    ) {

                        remainingDots++;
                    }
                }
            );
        }
    );


    if (
        maze[player.y][player.x] ===
        "."
    ) {

        maze[player.y][player.x] =
            " ";


        remainingDots--;
    }


    function drawMaze() {

        clearCanvas(
            "#050812"
        );


        maze.forEach(
            (row, y) => {

                row.forEach(
                    (cell, x) => {

                        const px =
                            offsetX +
                            x *
                            CELL;


                        const py =
                            offsetY +
                            y *
                            CELL;


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


        ctx.fillStyle =
            "#ffd447";


        ctx.shadowColor =
            "#ffd447";


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


    function moveMaze(
        dx,
        dy
    ) {

        const nextX =
            player.x +
            dx;


        const nextY =
            player.y +
            dy;


        if (
            !maze[nextY] ||
            maze[nextY][nextX] ===
                "#"
        ) {

            return;
        }


        player.x =
            nextX;


        player.y =
            nextY;


        if (
            maze[nextY][nextX] ===
            "."
        ) {

            maze[nextY][nextX] =
                " ";


            remainingDots--;


            addScore(1);
        }


        drawMaze();


        if (
            remainingDots <= 0
        ) {

            showGameOver(
                "MAZE CLEARED!"
            );
        }
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
        }
    );


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


    document.addEventListener(
        "keydown",
        event => {

            keys[event.code] =
                true;


            if (
                event.code ===
                    "Space" &&
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
        }
    );


    document.addEventListener(
        "keyup",
        event => {

            keys[event.code] =
                false;
        }
    );


    function wrap(
        object
    ) {

        if (
            object.x < 0
        ) {

            object.x =
                canvas.width;
        }


        if (
            object.x >
            canvas.width
        ) {

            object.x = 0;
        }


        if (
            object.y < 0
        ) {

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


    function drawAsteroids() {

        clearCanvas(
            "#03050c"
        );


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


        ctx.strokeStyle =
            "#ffffff";


        ctx.lineWidth = 2;


        asteroids.forEach(
            asteroid => {

                ctx.beginPath();


                ctx.arc(
                    asteroid.x,
                    asteroid.y,
                    asteroid.radius,
                    0,
                    Math.PI * 2
                );


                ctx.stroke();
            }
        );


        ctx.save();


        ctx.translate(
            ship.x,
            ship.y
        );


        ctx.rotate(
            ship.angle
        );


        ctx.strokeStyle =
            "#55e8ff";


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


        ctx.fillStyle =
            "#ffffff";


        bullets.forEach(
            bullet => {

                ctx.beginPath();


                ctx.arc(
                    bullet.x,
                    bullet.y,
                    3,
                    0,
                    Math.PI * 2
                );


                ctx.fill();
            }
        );
    }


    function asteroidLoop() {

        if (finished) {
            return;
        }


        if (
            keys.ArrowLeft
        ) {

            ship.angle -=
                0.065;
        }


        if (
            keys.ArrowRight
        ) {

            ship.angle +=
                0.065;
        }


        if (
            keys.ArrowUp
        ) {

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


        asteroids.forEach(
            asteroid => {

                asteroid.x +=
                    asteroid.vx;


                asteroid.y +=
                    asteroid.vy;


                wrap(
                    asteroid
                );
            }
        );


        bullets.forEach(
            bullet => {

                bullet.x +=
                    bullet.vx;


                bullet.y +=
                    bullet.vy;


                bullet.life--;


                wrap(
                    bullet
                );
            }
        );


        bullets =
            bullets.filter(
                bullet =>
                    bullet.life > 0
            );


        bullets.forEach(
            bullet => {

                asteroids.forEach(
                    asteroid => {

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

                            asteroid.dead =
                                true;


                            bullet.life = 0;


                            addScore(10);
                        }
                    }
                );
            }
        );


        asteroids =
            asteroids.filter(
                asteroid =>
                    !asteroid.dead
            );


        const collision =
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
            );


        if (collision) {

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


    drawAsteroids();

    asteroidLoop();
}


/* ============================================================
   REACTION TIME
   ============================================================ */

else if (GAME === "reaction") {

    showHelp(
        "Wait for green, then click as fast as possible"
    );


    if (!domGame) {

        console.error(
            "Reaction requires #domgame"
        );

    } else {

        const area =
            document.createElement(
                "div"
            );


        area.className =
            "reaction";


        area.textContent =
            "Click to start";


        domGame.appendChild(
            area
        );


        let state =
            "idle";


        let timer;


        let startTime = 0;


        area.addEventListener(
            "click",
            () => {

                if (
                    state === "idle" ||
                    state === "result" ||
                    state === "bad"
                ) {

                    state = "waiting";


                    area.className =
                        "reaction";


                    area.textContent =
                        "Wait for green...";


                    const delay =

                        1200 +

                        Math.random() *
                        2800;


                    timer =
                        setTimeout(
                            () => {

                                state = "go";


                                startTime =
                                    performance.now();


                                area.className =
                                    "reaction go";


                                area.textContent =
                                    "CLICK!";

                            },
                            delay
                        );


                    return;
                }


                if (
                    state === "waiting"
                ) {

                    clearTimeout(
                        timer
                    );


                    state = "bad";


                    area.className =
                        "reaction bad";


                    area.textContent =
                        "Too early! Click to retry.";


                    return;
                }


                if (
                    state === "go"
                ) {

                    const reaction =
                        Math.round(

                            performance.now() -
                            startTime

                        );


                    state =
                        "result";


                    area.className =
                        "reaction";


                    area.textContent =
                        `${reaction} ms — click to try again`;


                    const reactionScore =
                        Math.max(
                            1,
                            1000 -
                            reaction
                        );


                    updateScore(
                        reactionScore
                    );
                }
            }
        );
    }
}


/* ============================================================
   PENALTY SHOOTOUT
   ============================================================ */

else if (GAME === "penalties") {

    showHelp(
        "Click inside the goal to shoot • 5 penalties"
    );


    let keeperX = 378;


    let attempts = 0;


    const ball = {
        x: 400,
        y: 435
    };


    let message = "";


    let finished = false;


    function drawPenalty() {

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

        ctx.strokeStyle =
            "#ffffff";


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

        ctx.fillStyle =
            "#ffd447";


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

        ctx.fillStyle =
            "#ffffff";


        ctx.beginPath();


        ctx.arc(
            ball.x,
            ball.y,
            15,
            0,
            Math.PI * 2
        );


        ctx.fill();


        if (message) {

            ctx.fillStyle =

                message === "GOAL!"
                    ? "#55e8ff"
                    : "#ff4f87";


            ctx.textAlign =
                "center";


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


        ctx.textAlign =
            "center";


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


    canvas.addEventListener(
        "click",
        event => {

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


            if (

                targetX < 145 ||

                targetX > 655 ||

                targetY < 70 ||

                targetY > 340

            ) {

                return;
            }


            attempts++;


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
                keeperTarget -
                22;


            ball.x =
                targetX;


            ball.y =
                targetY;


            if (saved) {

                message =
                    "SAVED!";

            } else {

                message =
                    "GOAL!";


                addScore(1);
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
                                : "FULL TIME",

                            `Final score: ${score}/5`

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

                    keeperX = 378;

                    drawPenalty();

                },
                650
            );
        }
    );


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


    document.addEventListener(
        "keydown",
        event => {

            keys[event.code] =
                true;


            if (

                event.code ===
                    "ArrowLeft" ||

                event.code ===
                    "ArrowRight"

            ) {

                event.preventDefault();
            }
        }
    );


    document.addEventListener(
        "keyup",
        event => {

            keys[event.code] =
                false;
        }
    );


    function drawCar(
        x,
        y,
        colour
    ) {

        ctx.fillStyle =
            colour;


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

        ctx.fillStyle =
            "#07150e";


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle =
            "#171c27";


        ctx.fillRect(
            roadLeft,
            0,
            roadRight -
                roadLeft,
            canvas.height
        );


        ctx.fillStyle =
            "#55e8ff";


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


        drawCar(
            player.x,
            player.y,
            "#55e8ff"
        );


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


    function racingLoop() {

        if (finished) {
            return;
        }


        frame++;


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


        traffic.forEach(
            car => {

                car.y +=

                    car.speed +

                    Math.min(
                        score / 500,
                        3
                    );
            }
        );


        traffic =
            traffic.filter(
                car =>
                    car.y <
                    canvas.height +
                    100
            );


        const collision =
            traffic.some(
                car =>

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
            );


        if (collision) {

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


    drawRacing();

    racingLoop();
}


/* ============================================================
   UNKNOWN GAME
   ============================================================ */

else {

    console.error(
        "No game configured for:",
        GAME,
        fileName
    );


    if (ctx && canvas) {

        clearCanvas(
            "#080d18"
        );


        ctx.fillStyle =
            "#ffffff";


        ctx.textAlign =
            "center";


        ctx.font =
            "700 28px Arial";


        ctx.fillText(
            "Game not configured",
            canvas.width / 2,
            canvas.height / 2
        );


        ctx.fillStyle =
            "#8d98b5";


        ctx.font =
            "15px Arial";


        ctx.fillText(
            `Detected: ${GAME || "unknown"}`,
            canvas.width / 2,
            canvas.height / 2 + 35
        );
    }


    if (
        !ctx &&
        domGame
    ) {

        domGame.textContent =
            "Game not configured.";
    }
}
