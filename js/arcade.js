
/* ============================================================
   SARA'S & HAIDAR'S ARCADE
   SHARED GAME ENGINE
   ============================================================ */

const GAME = window.GAME;

const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const helpEl = document.getElementById("help");
const canvas = document.getElementById("game");
const ctx = canvas ? canvas.getContext("2d") : null;

let score = 0;

let best =
    Number(localStorage.getItem("sh_" + GAME)) || 0;

if (bestEl) {
    bestEl.textContent = best;
}

function setScore(value) {

    score = value;

    if (scoreEl) {
        scoreEl.textContent = score;
    }

    if (value > best) {

        best = value;

        if (bestEl) {
            bestEl.textContent = best;
        }

        localStorage.setItem(
            "sh_" + GAME,
            best
        );
    }
}

function help(text) {

    if (helpEl) {
        helpEl.textContent = text;
    }
}

function gameOver(text = "GAME OVER") {

    if (!canvas) return;

    ctx.fillStyle =
        "rgba(0,0,0,.72)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "#ffffff";

    ctx.textAlign = "center";

    ctx.font =
        "bold 42px Arial";

    ctx.fillText(
        text,
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.font =
        "18px Arial";

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

    help("Arrow Keys / WASD");

    const size = 20;

    let snake = [
        { x: 20, y: 12 },
        { x: 19, y: 12 },
        { x: 18, y: 12 }
    ];

    let direction = {
        x: 1,
        y: 0
    };

    let food = {
        x: 30,
        y: 12
    };

    let dead = false;


    function newFood() {

        food = {
            x: Math.floor(
                Math.random() * 40
            ),

            y: Math.floor(
                Math.random() * 25
            )
        };
    }


    document.addEventListener(
        "keydown",
        event => {

            const key =
                event.key.toLowerCase();

            let next = null;

            if (
                key === "arrowup" ||
                key === "w"
            ) {

                next = {
                    x: 0,
                    y: -1
                };
            }

            if (
                key === "arrowdown" ||
                key === "s"
            ) {

                next = {
                    x: 0,
                    y: 1
                };
            }

            if (
                key === "arrowleft" ||
                key === "a"
            ) {

                next = {
                    x: -1,
                    y: 0
                };
            }

            if (
                key === "arrowright" ||
                key === "d"
            ) {

                next = {
                    x: 1,
                    y: 0
                };
            }

            if (
                next &&
                !(
                    next.x ===
                    -direction.x &&

                    next.y ===
                    -direction.y
                )
            ) {

                direction = next;
            }
        }
    );


    function snakeLoop() {

        if (dead) return;

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
            head.x >= 40 ||
            head.y < 0 ||
            head.y >= 25 ||

            snake.some(
                part =>
                    part.x === head.x &&
                    part.y === head.y
            )
        ) {

            dead = true;

            gameOver();

            return;
        }


        snake.unshift(head);


        if (
            head.x === food.x &&
            head.y === food.y
        ) {

            setScore(
                score + 1
            );

            newFood();

        } else {

            snake.pop();
        }


        ctx.fillStyle = "#090d17";

        ctx.fillRect(
            0,
            0,
            800,
            500
        );


        ctx.fillStyle = "#ff557f";

        ctx.fillRect(
            food.x * size,
            food.y * size,
            size - 2,
            size - 2
        );


        snake.forEach(
            (part, index) => {

                ctx.fillStyle =
                    index === 0
                        ? "#ffffff"
                        : "#52e7ff";

                ctx.fillRect(
                    part.x * size,
                    part.y * size,
                    size - 2,
                    size - 2
                );
            }
        );
    }


    setInterval(
        snakeLoop,
        90
    );
}


/* ============================================================
   FLAPPY
   ============================================================ */

else if (GAME === "flappy") {

    help(
        "SPACE or click to flap"
    );

    let bird = {

        x: 130,
        y: 250,
        velocity: 0
    };

    let pipes = [];

    let frame = 0;

    let dead = false;


    function flap() {

        if (!dead) {
            bird.velocity = -7.5;
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


    function loop() {

        if (dead) return;


        bird.velocity += 0.42;

        bird.y +=
            bird.velocity;


        frame++;


        if (
            frame % 95 === 0
        ) {

            pipes.push({

                x: 800,

                height:
                    80 +
                    Math.random() *
                    250,

                passed: false
            });
        }


        pipes.forEach(
            pipe => {

                pipe.x -= 3;


                if (
                    !pipe.passed &&
                    pipe.x < 100
                ) {

                    pipe.passed =
                        true;

                    setScore(
                        score + 1
                    );
                }


                const touchingX =

                    130 >
                        pipe.x - 18 &&

                    130 <
                        pipe.x + 68;


                const touchingY =

                    bird.y <
                        pipe.height ||

                    bird.y >
                        pipe.height +
                        155;


                if (
                    touchingX &&
                    touchingY
                ) {

                    dead = true;
                }
            }
        );


        pipes =
            pipes.filter(
                pipe =>
                    pipe.x > -70
            );


        if (
            bird.y < 0 ||
            bird.y > 500
        ) {

            dead = true;
        }


        ctx.fillStyle =
            "#102d46";

        ctx.fillRect(
            0,
            0,
            800,
            500
        );


        ctx.fillStyle =
            "#4bd06d";


        pipes.forEach(
            pipe => {

                ctx.fillRect(
                    pipe.x,
                    0,
                    68,
                    pipe.height
                );

                ctx.fillRect(
                    pipe.x,
                    pipe.height +
                        155,
                    68,
                    500
                );
            }
        );


        ctx.fillStyle =
            "#ffd84c";

        ctx.beginPath();

        ctx.arc(
            bird.x,
            bird.y,
            18,
            0,
            Math.PI * 2
        );

        ctx.fill();


        if (dead) {

            gameOver();

        } else {

            requestAnimationFrame(
                loop
            );
        }
    }


    loop();
}


/* ============================================================
   PONG
   ============================================================ */

else if (GAME === "pong") {

    help(
        "Move mouse over court or use W / S"
    );

    let playerY = 210;

    let aiY = 210;

    let ballX = 400;
    let ballY = 250;

    let velocityX = 5;
    let velocityY = 3;

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

                500 /
                rect.height -

                45;
        }
    );


    function loop() {

        if (keys.w) {
            playerY -= 6;
        }

        if (keys.s) {
            playerY += 6;
        }


        playerY =
            Math.max(
                0,
                Math.min(
                    410,
                    playerY
                )
            );


        aiY +=
            Math.sign(
                ballY -
                (aiY + 45)
            ) *
            3.4;


        ballX += velocityX;

        ballY += velocityY;


        if (
            ballY < 8 ||
            ballY > 492
        ) {

            velocityY *= -1;
        }


        if (
            ballX < 45 &&
            ballY > playerY &&
            ballY <
                playerY + 90
        ) {

            velocityX =
                Math.abs(
                    velocityX
                ) *
                1.04;

            setScore(
                score + 1
            );
        }


        if (
            ballX > 755 &&
            ballY > aiY &&
            ballY <
                aiY + 90
        ) {

            velocityX =
                -Math.abs(
                    velocityX
                ) *
                1.02;
        }


        if (ballX < 0) {

            gameOver(
                "AI WINS"
            );

            return;
        }


        if (ballX > 800) {

            ballX = 400;
            ballY = 250;

            velocityX = -5;
        }


        ctx.fillStyle =
            "#080b14";

        ctx.fillRect(
            0,
            0,
            800,
            500
        );


        ctx.strokeStyle =
            "rgba(255,255,255,.15)";

        ctx.setLineDash(
            [10, 15]
        );

        ctx.beginPath();

        ctx.moveTo(
            400,
            0
        );

        ctx.lineTo(
            400,
            500
        );

        ctx.stroke();

        ctx.setLineDash([]);


        ctx.fillStyle =
            "#52e7ff";

        ctx.fillRect(
            28,
            playerY,
            12,
            90
        );


        ctx.fillStyle =
            "#ff557f";

        ctx.fillRect(
            760,
            aiY,
            12,
            90
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.beginPath();

        ctx.arc(
            ballX,
            ballY,
            9,
            0,
            Math.PI * 2
        );

        ctx.fill();


        requestAnimationFrame(
            loop
        );
    }


    loop();
}


/* ============================================================
   BREAKOUT
   ============================================================ */

else if (GAME === "breakout") {

    help(
        "Mouse or ← → to move"
    );

    let paddleX = 330;

    let ballX = 400;
    let ballY = 410;

    let velocityX = 4;
    let velocityY = -4;

    const bricks = [];

    const keys = {};


    for (
        let row = 0;
        row < 5;
        row++
    ) {

        for (
            let column = 0;
            column < 10;
            column++
        ) {

            bricks.push({

                x:
                    45 +
                    column * 72,

                y:
                    55 +
                    row * 32,

                alive: true
            });
        }
    }


    canvas.addEventListener(
        "mousemove",
        event => {

            const rect =
                canvas.getBoundingClientRect();

            paddleX =

                (
                    event.clientX -
                    rect.left
                ) *

                800 /
                rect.width -

                70;
        }
    );


    document.addEventListener(
        "keydown",
        event => {

            keys[event.key] =
                true;
        }
    );


    document.addEventListener(
        "keyup",
        event => {

            keys[event.key] =
                false;
        }
    );


    function loop() {

        if (keys.ArrowLeft) {
            paddleX -= 7;
        }

        if (keys.ArrowRight) {
            paddleX += 7;
        }


        paddleX =
            Math.max(
                0,
                Math.min(
                    660,
                    paddleX
                )
            );


        ballX += velocityX;

        ballY += velocityY;


        if (
            ballX < 8 ||
            ballX > 792
        ) {

            velocityX *= -1;
        }


        if (ballY < 8) {

            velocityY *= -1;
        }


        if (
            ballY > 450 &&
            ballY < 480 &&
            ballX > paddleX &&
            ballX <
                paddleX + 140
        ) {

            velocityY =
                -Math.abs(
                    velocityY
                );
        }


        bricks.forEach(
            brick => {

                if (
                    brick.alive &&
                    ballX >
                        brick.x &&
                    ballX <
                        brick.x + 62 &&
                    ballY >
                        brick.y &&
                    ballY <
                        brick.y + 22
                ) {

                    brick.alive =
                        false;

                    velocityY *= -1;

                    setScore(
                        score + 10
                    );
                }
            }
        );


        if (ballY > 510) {

            gameOver();

            return;
        }


        ctx.fillStyle =
            "#090c16";

        ctx.fillRect(
            0,
            0,
            800,
            500
        );


        bricks.forEach(
            (brick, index) => {

                if (!brick.alive) {
                    return;
                }

                ctx.fillStyle =
                    `hsl(${
                        190 +
                        index * 3
                    } 80% 60%)`;

                ctx.fillRect(
                    brick.x,
                    brick.y,
                    62,
                    22
                );
            }
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.fillRect(
            paddleX,
            465,
            140,
            12
        );


        ctx.beginPath();

        ctx.arc(
            ballX,
            ballY,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();


        if (
            bricks.every(
                brick =>
                    !brick.alive
            )
        ) {

            gameOver(
                "YOU WIN!"
            );

            return;
        }


        requestAnimationFrame(
            loop
        );
    }


    loop();
}


/* ============================================================
   RUNNER
   ============================================================ */

else if (GAME === "runner") {

    help(
        "SPACE or click to jump"
    );

    let playerY = 390;
    let velocity = 0;

    let obstacles = [];

    let frame = 0;

    let dead = false;


    function jump() {

        if (
            playerY >= 390
        ) {

            velocity = -13;
        }
    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.code ===
                "Space"
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


    function loop() {

        if (dead) return;


        playerY += velocity;

        velocity += 0.65;


        if (
            playerY > 390
        ) {

            playerY = 390;

            velocity = 0;
        }


        frame++;


        if (
            frame % 85 === 0
        ) {

            obstacles.push({

                x: 820,

                width:
                    25 +
                    Math.random() *
                    25,

                height:
                    35 +
                    Math.random() *
                    45
            });
        }


        obstacles.forEach(
            obstacle => {

                obstacle.x -= 6;
            }
        );


        obstacles =
            obstacles.filter(
                obstacle =>
                    obstacle.x >
                    -60
            );


        if (
            obstacles.some(
                obstacle =>

                    obstacle.x <
                        150 &&

                    obstacle.x +
                        obstacle.width >
                        105 &&

                    playerY + 55 >
                        445 -
                        obstacle.height
            )
        ) {

            dead = true;
        }


        setScore(
            Math.floor(
                frame / 10
            )
        );


        ctx.fillStyle =
            "#0b1521";

        ctx.fillRect(
            0,
            0,
            800,
            500
        );


        ctx.fillStyle =
            "#3cdd83";

        ctx.fillRect(
            0,
            445,
            800,
            55
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.fillRect(
            105,
            playerY,
            45,
            55
        );


        ctx.fillStyle =
            "#ff6b6b";


        obstacles.forEach(
            obstacle => {

                ctx.fillRect(
                    obstacle.x,
                    445 -
                        obstacle.height,
                    obstacle.width,
                    obstacle.height
                );
            }
        );


        if (dead) {

            gameOver();

        } else {

            requestAnimationFrame(
                loop
            );
        }
    }


    loop();
}


/* ============================================================
   SPACE ATTACK
   ============================================================ */

else if (GAME === "invaders") {

    help(
        "A / D or ← → move • SPACE shoots"
    );

    let playerX = 380;

    let shots = [];

    const aliens = [];

    let frame = 0;

    let direction = 1;

    let dead = false;


    for (
        let row = 0;
        row < 4;
        row++
    ) {

        for (
            let column = 0;
            column < 9;
            column++
        ) {

            aliens.push({

                x:
                    90 +
                    column * 70,

                y:
                    55 +
                    row * 48,

                alive: true
            });
        }
    }


    document.addEventListener(
        "keydown",
        event => {

            const key =
                event.key.toLowerCase();


            if (
                key ===
                    "arrowleft" ||
                key === "a"
            ) {

                playerX -= 25;
            }


            if (
                key ===
                    "arrowright" ||
                key === "d"
            ) {

                playerX += 25;
            }


            if (
                event.code ===
                "Space"
            ) {

                event.preventDefault();

                shots.push({

                    x:
                        playerX +
                        18,

                    y: 430
                });
            }
        }
    );


    function loop() {

        if (dead) return;


        playerX =
            Math.max(
                0,
                Math.min(
                    760,
                    playerX
                )
            );


        frame++;


        if (
            frame % 35 === 0
        ) {

            const edge =
                aliens.some(
                    alien =>

                        alien.alive &&
                        (
                            alien.x >
                                740 ||

                            alien.x <
                                20
                        )
                );


            if (edge) {

                direction *= -1;

                aliens.forEach(
                    alien => {

                        alien.y +=
                            15;
                    }
                );
            }


            aliens.forEach(
                alien => {

                    alien.x +=
                        18 *
                        direction;
                }
            );
        }


        shots.forEach(
            shot => {

                shot.y -= 8;
            }
        );


        shots.forEach(
            shot => {

                aliens.forEach(
                    alien => {

                        if (
                            alien.alive &&

                            shot.x >
                                alien.x &&

                            shot.x <
                                alien.x +
                                34 &&

                            shot.y >
                                alien.y &&

                            shot.y <
                                alien.y +
                                24
                        ) {

                            alien.alive =
                                false;

                            shot.y = -20;

                            setScore(
                                score +
                                10
                            );
                        }
                    }
                );
            }
        );


        shots =
            shots.filter(
                shot =>
                    shot.y >
                    -20
            );


        if (
            aliens.some(
                alien =>
                    alien.alive &&
                    alien.y >
                        400
            )
        ) {

            dead = true;
        }


        ctx.fillStyle =
            "#050812";

        ctx.fillRect(
            0,
            0,
            800,
            500
        );


        ctx.fillStyle =
            "#52e7ff";

        ctx.fillRect(
            playerX,
            450,
            40,
            18
        );


        ctx.fillStyle =
            "#ffffff";


        shots.forEach(
            shot => {

                ctx.fillRect(
                    shot.x,
                    shot.y,
                    3,
                    10
                );
            }
        );


        ctx.fillStyle =
            "#b17cff";


        aliens.forEach(
            alien => {

                if (
                    alien.alive
                ) {

                    ctx.fillRect(
                        alien.x,
                        alien.y,
                        34,
                        24
                    );
                }
            }
        );


        if (
            aliens.every(
                alien =>
                    !alien.alive
            )
        ) {

            gameOver(
                "EARTH SAVED!"
            );

            return;
        }


        if (dead) {

            gameOver();

        } else {

            requestAnimationFrame(
                loop
            );
        }
    }


    loop();
}


/* ============================================================
   ASTEROIDS
   ============================================================ */

else if (GAME === "asteroids") {

    help(
        "← → rotate • ↑ thrust • SPACE fire"
    );

    const ship = {

        x: 400,
        y: 250,

        angle: -1.57,

        vx: 0,
        vy: 0
    };


    let rocks = [];

    let bullets = [];

    const keys = {};


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        rocks.push({

            x:
                Math.random() *
                800,

            y:
                Math.random() *
                500,

            vx:
                Math.random() *
                2 -
                1,

            vy:
                Math.random() *
                2 -
                1,

            radius:
                20 +
                Math.random() *
                25
        });
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

                bullets.push({

                    x: ship.x,
                    y: ship.y,

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


    function loop() {

        if (keys.ArrowLeft) {
            ship.angle -= 0.07;
        }

        if (keys.ArrowRight) {
            ship.angle += 0.07;
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


        ship.x =
            (
                ship.x +
                ship.vx +
                800
            ) %
            800;


        ship.y =
            (
                ship.y +
                ship.vy +
                500
            ) %
            500;


        rocks.forEach(
            rock => {

                rock.x =
                    (
                        rock.x +
                        rock.vx +
                        800
                    ) %
                    800;

                rock.y =
                    (
                        rock.y +
                        rock.vy +
                        500
                    ) %
                    500;
            }
        );


        bullets.forEach(
            bullet => {

                bullet.x +=
                    bullet.vx;

                bullet.y +=
                    bullet.vy;

                bullet.life--;
            }
        );


        bullets =
            bullets.filter(
                bullet =>
                    bullet.life >
                    0
            );


        bullets.forEach(
            bullet => {

                rocks.forEach(
                    rock => {

                        if (
                            rock.radius &&

                            Math.hypot(
                                bullet.x -
                                    rock.x,

                                bullet.y -
                                    rock.y
                            ) <
                                rock.radius
                        ) {

                            rock.radius =
                                0;

                            bullet.life =
                                0;

                            setScore(
                                score +
                                10
                            );
                        }
                    }
                );
            }
        );


        if (
            rocks.some(
                rock =>

                    rock.radius &&

                    Math.hypot(
                        ship.x -
                            rock.x,

                        ship.y -
                            rock.y
                    ) <
                        rock.radius +
                        10
            )
        ) {

            gameOver();

            return;
        }


        ctx.fillStyle =
            "#03050c";

        ctx.fillRect(
            0,
            0,
            800,
            500
        );


        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth = 2;


        rocks.forEach(
            rock => {

                if (
                    rock.radius
                ) {

                    ctx.beginPath();

                    ctx.arc(
                        rock.x,
                        rock.y,
                        rock.radius,
                        0,
                        Math.PI * 2
                    );

                    ctx.stroke();
                }
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

        ctx.beginPath();

        ctx.moveTo(
            16,
            0
        );

        ctx.lineTo(
            -12,
            -10
        );

        ctx.lineTo(
            -7,
            0
        );

        ctx.lineTo(
            -12,
            10
        );

        ctx.closePath();

        ctx.stroke();

        ctx.restore();


        ctx.fillStyle =
            "#52e7ff";


        bullets.forEach(
            bullet => {

                ctx.fillRect(
                    bullet.x,
                    bullet.y,
                    3,
                    3
                );
            }
        );


        if (
            rocks.every(
                rock =>
                    !rock.radius
            )
        ) {

            gameOver(
                "SECTOR CLEAR!"
            );

            return;
        }


        requestAnimationFrame(
            loop
        );
    }


    loop();
}


/* ============================================================
   NEON RACER
   ============================================================ */

else if (GAME === "racing") {

    help(
        "← → or A / D to steer"
    );

    let playerX = 375;

    let cars = [];

    let frame = 0;

    let dead = false;


    document.addEventListener(
        "keydown",
        event => {

            const key =
                event.key.toLowerCase();


            if (
                key ===
                    "arrowleft" ||
                key === "a"
            ) {

                playerX -= 45;
            }


            if (
                key ===
                    "arrowright" ||
                key === "d"
            ) {

                playerX += 45;
            }
        }
    );


    function loop() {

        if (dead) return;


        playerX =
            Math.max(
                235,
                Math.min(
                    525,
                    playerX
                )
            );


        frame++;


        if (
            frame % 55 === 0
        ) {

            const lanes = [
                250,
                330,
                410,
                490
            ];


            cars.push({

                x:
                    lanes[
                        Math.floor(
                            Math.random() *
                            lanes.length
                        )
                    ],

                y: -80
            });
        }


        cars.forEach(
            car => {

                car.y += 7;
            }
        );


        cars =
            cars.filter(
                car =>
                    car.y <
                    560
            );


        if (
            cars.some(
                car =>

                    Math.abs(
                        car.x -
                        playerX
                    ) <
                        42 &&

                    car.y >
                        390 &&

                    car.y <
                        485
            )
        ) {

            dead = true;
        }


        setScore(
            Math.floor(
                frame / 10
            )
        );


        ctx.fillStyle =
            "#0a1520";

        ctx.fillRect(
            0,
            0,
            800,
            500
        );


        ctx.fillStyle =
            "#262b35";

        ctx.fillRect(
            210,
            0,
            380,
            500
        );


        ctx.strokeStyle =
            "rgba(255,255,255,.3)";

        ctx.setLineDash(
            [30, 30]
        );


        for (
            let lane = 290;
            lane < 590;
            lane += 80
        ) {

            ctx.beginPath();

            ctx.moveTo(
                lane,
                0
            );

            ctx.lineTo(
                lane,
                500
            );

            ctx.stroke();
        }


        ctx.setLineDash([]);


        ctx.fillStyle =
            "#52e7ff";

        ctx.fillRect(
            playerX,
            410,
            48,
            75
        );


        ctx.fillStyle =
            "#ff557f";


        cars.forEach(
            car => {

                ctx.fillRect(
                    car.x,
                    car.y,
                    48,
                    75
                );
            }
        );


        if (dead) {

            gameOver(
                "CRASH!"
            );

        } else {

            requestAnimationFrame(
                loop
            );
        }
    }


    loop();
}


/* ============================================================
   PENALTY SHOOTOUT
   ============================================================ */

else if (GAME === "penalties") {

    help(
        "Click inside the goal to shoot • 5 penalties"
    );

    let keeperX = 380;

    let attempts = 0;


    function drawPenalty() {

        ctx.fillStyle =
            "#12351f";

        ctx.fillRect(
            0,
            0,
            800,
            500
        );


        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth = 6;

        ctx.strokeRect(
            150,
            70,
            500,
            260
        );


        ctx.fillStyle =
            "#ffcc45";

        ctx.fillRect(
            keeperX,
            230,
            45,
            85
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.beginPath();

        ctx.arc(
            400,
            430,
            16,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    drawPenalty();


    canvas.addEventListener(
        "click",
        event => {

            if (
                attempts >= 5
            ) {

                return;
            }


            const rect =
                canvas.getBoundingClientRect();


            const targetX =

                (
                    event.clientX -
                    rect.left
                ) *

                800 /
                rect.width;


            const targetY =

                (
                    event.clientY -
                    rect.top
                ) *

                500 /
                rect.height;


            if (
                targetY > 330
            ) {

                return;
            }


            attempts++;


            const saved =

                Math.abs(
                    targetX -
                    (
                        keeperX +
                        22
                    )
                ) <
                85;


            keeperX =
                170 +
                Math.random() *
                440;


            if (!saved) {

                setScore(
                    score + 1
                );
            }


            drawPenalty();


            ctx.fillStyle =
                saved
                    ? "#ff557f"
                    : "#57ff9a";


            ctx.font =
                "bold 34px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(

                saved
                    ? "SAVED!"
                    : "GOAL!",

                400,
                390
            );


            if (
                attempts === 5
            ) {

                setTimeout(
                    () => {

                        gameOver(

                            score >= 3
                                ? "YOU WIN!"
                                : "FULL TIME"
                        );

                    },
                    350
                );
            }
        }
    );
}


/* ============================================================
   BIRD LAUNCHER
   ============================================================ */

else if (GAME === "launcher") {

    help(
        "Drag the bird backwards and release"
    );

    const startX = 150;
    const startY = 365;


    let bird = {

        x: startX,
        y: startY,

        vx: 0,
        vy: 0
    };


    let dragging = false;

    let launched = false;


    const targets = [

        {
            x: 650,
            y: 400,
            alive: true
        },

        {
            x: 710,
            y: 400,
            alive: true
        },

        {
            x: 680,
            y: 345,
            alive: true
        }
    ];


    function pointerPosition(
        event
    ) {

        const rect =
            canvas.getBoundingClientRect();


        return {

            x:
                (
                    event.clientX -
                    rect.left
                ) *

                800 /
                rect.width,

            y:
                (
                    event.clientY -
                    rect.top
                ) *

                500 /
                rect.height
        };
    }


    canvas.addEventListener(
        "pointerdown",
        event => {

            const point =
                pointerPosition(
                    event
                );


            if (
                !launched &&

                Math.hypot(
                    point.x -
                        bird.x,

                    point.y -
                        bird.y
                ) <
                40
            ) {

                dragging = true;
            }
        }
    );


    canvas.addEventListener(
        "pointermove",
        event => {

            if (
                !dragging
            ) {

                return;
            }


            const point =
                pointerPosition(
                    event
                );


            let dx =
                point.x -
                startX;

            let dy =
                point.y -
                startY;


            const distance =
                Math.hypot(
                    dx,
                    dy
                );


            if (
                distance > 110
            ) {

                dx *=
                    110 /
                    distance;

                dy *=
                    110 /
                    distance;
            }


            bird.x =
                startX +
                dx;

            bird.y =
                startY +
                dy;
        }
    );


    canvas.addEventListener(
        "pointerup",
        () => {

            if (
                !dragging
            ) {

                return;
            }


            dragging = false;

            launched = true;


            bird.vx =
                (
                    startX -
                    bird.x
                ) *
                0.12;


            bird.vy =
                (
                    startY -
                    bird.y
                ) *
                0.12;
        }
    );


    function loop() {

        if (launched) {

            bird.vy += 0.35;

            bird.x += bird.vx;

            bird.y += bird.vy;


            if (
                bird.y > 425
            ) {

                bird.y = 425;

                bird.vy *=
                    -0.45;

                bird.vx *=
                    0.8;
            }


            targets.forEach(
                target => {

                    if (
                        target.alive &&

                        Math.hypot(
                            bird.x -
                                target.x,

                            bird.y -
                                target.y
                        ) <
                        42
                    ) {

                        target.alive =
                            false;

                        setScore(
                            score + 1
                        );
                    }
                }
            );
        }


        ctx.fillStyle =
            "#143650";

        ctx.fillRect(
            0,
            0,
            800,
            500
        );


        ctx.fillStyle =
            "#55a83d";

        ctx.fillRect(
            0,
            445,
            800,
            55
        );


        ctx.strokeStyle =
            "#6d3f20";

        ctx.lineWidth = 12;


        ctx.beginPath();

        ctx.moveTo(
            130,
            445
        );

        ctx.lineTo(
            140,
            340
        );

        ctx.moveTo(
            170,
            445
        );

        ctx.lineTo(
            160,
            340
        );

        ctx.stroke();


        if (
            !launched
        ) {

            ctx.strokeStyle =
                "#2a1712";

            ctx.lineWidth = 5;

            ctx.beginPath();

            ctx.moveTo(
                140,
                340
            );

            ctx.lineTo(
                bird.x,
                bird.y
            );

            ctx.lineTo(
                160,
                340
            );

            ctx.stroke();
        }


        ctx.fillStyle =
            "#e94a4a";

        ctx.beginPath();

        ctx.arc(
            bird.x,
            bird.y,
            22,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#7bd34e";


        targets.forEach(
            target => {

                if (
                    target.alive
                ) {

                    ctx.beginPath();

                    ctx.arc(
                        target.x,
                        target.y,
                        22,
                        0,
                        Math.PI * 2
                    );

                    ctx.fill();
                }
            }
        );


        if (
            targets.every(
                target =>
                    !target.alive
            )
        ) {

            gameOver(
                "LEVEL CLEAR!"
            );

            return;
        }


        requestAnimationFrame(
            loop
        );
    }


    loop();
}


/* ============================================================
   MAZE CHASE
   ============================================================ */

else if (GAME === "maze") {

    help(
        "Arrow Keys / WASD • Collect every dot"
    );


    let grid = [

        "####################",
        "#........#.........#",
        "#.####.#.#.#####.#.#",
        "#......#.#.......#.#",
        "######.#.#######.#.#",
        "#......#.....#.....#",
        "#.#########.#.###..#",
        "#...........#......#",
        "####################"
    ];


    const cellSize = 38;

    const offsetX = 20;
    const offsetY = 75;


    let player = {
        x: 1,
        y: 1
    };


    const totalDots =

        [
            ...grid.join("")
        ].filter(
            character =>
                character === "."
        ).length;


    function drawMaze() {

        ctx.fillStyle =
            "#050713";

        ctx.fillRect(
            0,
            0,
            800,
            500
        );


        for (
            let y = 0;
            y < grid.length;
            y++
        ) {

            for (
                let x = 0;
                x <
                grid[y].length;
                x++
            ) {

                if (
                    grid[y][x] ===
                    "#"
                ) {

                    ctx.fillStyle =
                        "#4f65ff";

                    ctx.fillRect(

                        offsetX +
                            x *
                            cellSize,

                        offsetY +
                            y *
                            cellSize,

                        cellSize - 2,

                        cellSize - 2
                    );
                }


                else if (
                    grid[y][x] ===
                    "."
                ) {

                    ctx.fillStyle =
                        "#ffffff";

                    ctx.beginPath();

                    ctx.arc(

                        offsetX +
                            x *
                            cellSize +
                            19,

                        offsetY +
                            y *
                            cellSize +
                            19,

                        3,

                        0,

                        Math.PI *
                            2
                    );

                    ctx.fill();
                }
            }
        }


        ctx.fillStyle =
            "#ffd84c";

        ctx.beginPath();

        ctx.arc(

            offsetX +
                player.x *
                cellSize +
                19,

            offsetY +
                player.y *
                cellSize +
                19,

            14,

            0,

            Math.PI * 2
        );

        ctx.fill();
    }


    document.addEventListener(
        "keydown",
        event => {

            const key =
                event.key.toLowerCase();


            let dx = 0;
            let dy = 0;


            if (
                key ===
                    "arrowright" ||
                key === "d"
            ) {

                dx = 1;
            }


            if (
                key ===
                    "arrowleft" ||
                key === "a"
            ) {

                dx = -1;
            }


            if (
                key ===
                    "arrowdown" ||
                key === "s"
            ) {

                dy = 1;
            }


            if (
                key ===
                    "arrowup" ||
                key === "w"
            ) {

                dy = -1;
            }


            const nextX =
                player.x + dx;

            const nextY =
                player.y + dy;


            if (
                grid[nextY] &&
                grid[nextY][nextX] !==
                    "#"
            ) {

                player = {

                    x: nextX,
                    y: nextY
                };


                if (
                    grid[nextY][nextX] ===
                    "."
                ) {

                    grid[nextY] =

                        grid[nextY]
                            .slice(
                                0,
                                nextX
                            ) +

                        " " +

                        grid[nextY]
                            .slice(
                                nextX +
                                1
                            );


                    setScore(
                        score + 1
                    );


                    if (
                        score ===
                        totalDots
                    ) {

                        setTimeout(
                            () =>
                                gameOver(
                                    "MAZE CLEARED!"
                                ),
                            10
                        );
                    }
                }


                drawMaze();
            }
        }
    );


    drawMaze();
}


/* ============================================================
   BLOCK DROP / TETRIS
   ============================================================ */

else if (GAME === "tetris") {

    help(
        "← → move • ↓ drop • ↑ rotate • SPACE hard drop"
    );


    const WIDTH = 10;
    const HEIGHT = 20;
    const BLOCK = 24;


    canvas.width =
        WIDTH * BLOCK;

    canvas.height =
        HEIGHT * BLOCK;


    let board =
        Array.from(
            {
                length:
                    HEIGHT
            },

            () =>
                Array(
                    WIDTH
                ).fill(0)
        );


    const pieces = [

        [
            [1, 1, 1, 1]
        ],

        [
            [1, 1],
            [1, 1]
        ],

        [
            [0, 1, 0],
            [1, 1, 1]
        ],

        [
            [1, 0, 0],
            [1, 1, 1]
        ],

        [
            [0, 0, 1],
            [1, 1, 1]
        ],

        [
            [0, 1, 1],
            [1, 1, 0]
        ],

        [
            [1, 1, 0],
            [0, 1, 1]
        ]
    ];


    let piece;

    let stopped = false;


    function spawnPiece() {

        const shape =

            pieces[
                Math.floor(
                    Math.random() *
                    pieces.length
                )
            ];


        piece = {

            matrix:
                shape.map(
                    row =>
                        row.slice()
                ),

            x: 3,

            y: 0
        };
    }


    function collision(

        nextX =
            piece.x,

        nextY =
            piece.y,

        matrix =
            piece.matrix

    ) {

        return matrix.some(
            (row, y) =>

                row.some(
                    (value, x) =>

                        value &&

                        (
                            nextY +
                                y >=
                                HEIGHT ||

                            nextX +
                                x <
                                0 ||

                            nextX +
                                x >=
                                WIDTH ||

                            board[
                                nextY +
                                    y
                            ]?.[
                                nextX +
                                    x
                            ]
                        )
                )
        );
    }


    function lockPiece() {

        piece.matrix.forEach(
            (row, y) => {

                row.forEach(
                    (value, x) => {

                        if (value) {

                            board[
                                piece.y +
                                    y
                            ][
                                piece.x +
                                    x
                            ] = 1;
                        }
                    }
                );
            }
        );


        let cleared = 0;


        board =
            board.filter(
                row => {

                    const full =
                        row.every(
                            value =>
                                value
                        );

                    if (full) {
                        cleared++;
                    }

                    return !full;
                }
            );


        while (
            board.length <
            HEIGHT
        ) {

            board.unshift(

                Array(
                    WIDTH
                ).fill(0)
            );
        }


        if (cleared) {

            setScore(

                score +

                (
                    cleared === 1
                        ? 100

                    : cleared === 2
                        ? 300

                    : cleared === 3
                        ? 500

                    : 800
                )
            );
        }


        spawnPiece();


        if (
            collision()
        ) {

            stopped = true;

            drawTetris();

            gameOver();

            return;
        }
    }


    function rotatePiece() {

        const rotated =

            piece.matrix[0]
                .map(
                    (_, index) =>

                        piece.matrix
                            .map(
                                row =>
                                    row[
                                        index
                                    ]
                            )
                            .reverse()
                );


        if (
            !collision(
                piece.x,
                piece.y,
                rotated
            )
        ) {

            piece.matrix =
                rotated;
        }
    }


    function hardDrop() {

        while (
            !collision(
                piece.x,
                piece.y + 1
            )
        ) {

            piece.y++;
        }

        lockPiece();
    }


    document.addEventListener(
        "keydown",
        event => {

            if (stopped) return;


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
                event.key ===
                    "ArrowLeft" &&

                !collision(
                    piece.x - 1
                )
            ) {

                piece.x--;
            }


            if (
                event.key ===
                    "ArrowRight" &&

                !collision(
                    piece.x + 1
                )
            ) {

                piece.x++;
            }


            if (
                event.key ===
                "ArrowDown"
            ) {

                if (
                    !collision(
                        piece.x,
                        piece.y + 1
                    )
                ) {

                    piece.y++;

                } else {

                    lockPiece();
                }
            }


            if (
                event.key ===
                "ArrowUp"
            ) {

                rotatePiece();
            }


            if (
                event.code ===
                "Space"
            ) {

                hardDrop();
            }


            drawTetris();
        }
    );


    function drawTetris() {

        ctx.fillStyle =
            "#080b14";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.strokeStyle =
            "rgba(255,255,255,.04)";


        for (
            let x = 0;
            x <= WIDTH;
            x++
        ) {

            ctx.beginPath();

            ctx.moveTo(
                x * BLOCK,
                0
            );

            ctx.lineTo(
                x * BLOCK,
                canvas.height
            );

            ctx.stroke();
        }


        for (
            let y = 0;
            y <= HEIGHT;
            y++
        ) {

            ctx.beginPath();

            ctx.moveTo(
                0,
                y * BLOCK
            );

            ctx.lineTo(
                canvas.width,
                y * BLOCK
            );

            ctx.stroke();
        }


        ctx.fillStyle =
            "#52e7ff";


        board.forEach(
            (row, y) => {

                row.forEach(
                    (value, x) => {

                        if (value) {

                            ctx.fillRect(

                                x *
                                    BLOCK +
                                    1,

                                y *
                                    BLOCK +
                                    1,

                                BLOCK -
                                    2,

                                BLOCK -
                                    2
                            );
                        }
                    }
                );
            }
        );


        ctx.fillStyle =
            "#b17cff";


        piece.matrix.forEach(
            (row, y) => {

                row.forEach(
                    (value, x) => {

                        if (value) {

                            ctx.fillRect(

                                (
                                    piece.x +
                                    x
                                ) *
                                    BLOCK +
                                    1,

                                (
                                    piece.y +
                                    y
                                ) *
                                    BLOCK +
                                    1,

                                BLOCK -
                                    2,

                                BLOCK -
                                    2
                            );
                        }
                    }
                );
            }
        );
    }


    spawnPiece();

    drawTetris();


    setInterval(
        () => {

            if (stopped) return;


            if (
                !collision(
                    piece.x,
                    piece.y + 1
                )
            ) {

                piece.y++;

            } else {

                lockPiece();
            }


            drawTetris();

        },
        500
    );
}


/* ============================================================
   2048
   ============================================================ */

else if (GAME === "game2048") {

    help(
        "Arrow Keys / WASD"
    );


    const container =
        document.getElementById(
            "domgame"
        );


    container.innerHTML =
        '<div class="board2048" id="board2048"></div>';


    let tiles =
        Array(16).fill(0);


    function addTile() {

        const empty =

            tiles
                .map(
                    (value, index) =>
                        value
                            ? null
                            : index
                )
                .filter(
                    value =>
                        value !== null
                );


        if (
            !empty.length
        ) {

            return;
        }


        const position =

            empty[
                Math.floor(
                    Math.random() *
                    empty.length
                )
            ];


        tiles[position] =
            Math.random() <
                0.9
                ? 2
                : 4;
    }


    function slideRow(row) {

        const result =
            row.filter(Boolean);


        for (
            let i = 0;
            i <
            result.length - 1;
            i++
        ) {

            if (
                result[i] ===
                result[i + 1]
            ) {

                result[i] *= 2;


                setScore(
                    score +
                    result[i]
                );


                result.splice(
                    i + 1,
                    1
                );
            }
        }


        while (
            result.length < 4
        ) {

            result.push(0);
        }


        return result;
    }


    function move(direction) {

        const before =
            tiles.join(",");


        const result =
            Array(16).fill(0);


        for (
            let line = 0;
            line < 4;
            line++
        ) {

            let row = [];


            for (
                let i = 0;
                i < 4;
                i++
            ) {

                const index =

                    (
                        direction ===
                            "left" ||

                        direction ===
                            "right"
                    )

                    ? line * 4 + i

                    : i * 4 + line;


                row.push(
                    tiles[index]
                );
            }


            if (
                direction ===
                    "right" ||

                direction ===
                    "down"
            ) {

                row.reverse();
            }


            row =
                slideRow(row);


            if (
                direction ===
                    "right" ||

                direction ===
                    "down"
            ) {

                row.reverse();
            }


            for (
                let i = 0;
                i < 4;
                i++
            ) {

                const index =

                    (
                        direction ===
                            "left" ||

                        direction ===
                            "right"
                    )

                    ? line * 4 + i

                    : i * 4 + line;


                result[index] =
                    row[i];
            }
        }


        tiles = result;


        if (
            tiles.join(",") !==
            before
        ) {

            addTile();
        }


        draw2048();
    }


    function draw2048() {

        const board =
            document.getElementById(
                "board2048"
            );


        board.innerHTML = "";


        tiles.forEach(
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
                        `hsl(${
                            45 -
                            Math.log2(
                                value
                            ) *
                            3
                        } 70% 55%)`;


                    tile.style.color =
                        "#101018";
                }


                board.appendChild(
                    tile
                );
            }
        );
    }


    document.addEventListener(
        "keydown",
        event => {

            const key =
                event.key.toLowerCase();


            let direction = null;


            if (
                key ===
                    "arrowleft" ||
                key === "a"
            ) {

                direction =
                    "left";
            }


            if (
                key ===
                    "arrowright" ||
                key === "d"
            ) {

                direction =
                    "right";
            }


            if (
                key ===
                    "arrowup" ||
                key === "w"
            ) {

                direction =
                    "up";
            }


            if (
                key ===
                    "arrowdown" ||
                key === "s"
            ) {

                direction =
                    "down";
            }


            if (direction) {

                event.preventDefault();

                move(direction);
            }
        }
    );


    addTile();
    addTile();

    draw2048();
}


/* ============================================================
   MINESWEEPER
   ============================================================ */

else if (GAME === "minesweeper") {

    help(
        "Left click reveal • Right click flag"
    );


    const container =
        document.getElementById(
            "domgame"
        );


    container.innerHTML =
        '<div class="minegrid" id="minegrid"></div>';


    const SIZE = 10;
    const MINES = 15;


    const cells =
        Array.from(
            {
                length:
                    SIZE *
                    SIZE
            },

            (_, index) => ({

                mine: false,

                revealed: false,

                flagged: false,

                index
            })
        );


    const minePositions =

        [
            ...Array(
                SIZE *
                SIZE
            ).keys()
        ]
        .sort(
            () =>
                Math.random() -
                0.5
        )
        .slice(
            0,
            MINES
        );


    minePositions.forEach(
        index => {

            cells[index].mine =
                true;
        }
    );


    function neighbours(index) {

        const x =
            index %
            SIZE;

        const y =
            Math.floor(
                index /
                SIZE
            );


        const output = [];


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

                const nextX =
                    x + dx;

                const nextY =
                    y + dy;


                if (
                    nextX >= 0 &&
                    nextX < SIZE &&
                    nextY >= 0 &&
                    nextY < SIZE &&
                    (
                        dx !== 0 ||
                        dy !== 0
                    )
                ) {

                    output.push(

                        nextY *
                            SIZE +
                            nextX
                    );
                }
            }
        }


        return output;
    }


    function reveal(index) {

        const cell =
            cells[index];


        if (
            cell.revealed ||
            cell.flagged
        ) {

            return;
        }


        cell.revealed =
            true;


        if (cell.mine) {

            cells.forEach(
                item => {

                    item.revealed =
                        true;
                }
            );


            renderMines();


            if (scoreEl) {
                scoreEl.textContent =
                    "BOOM";
            }


            return;
        }


        setScore(
            score + 1
        );


        const nearbyMines =

            neighbours(index)
                .filter(
                    item =>
                        cells[item]
                            .mine
                )
                .length;


        if (
            nearbyMines === 0
        ) {

            neighbours(index)
                .forEach(
                    reveal
                );
        }


        renderMines();


        const safeRevealed =

            cells.filter(
                cell =>
                    !cell.mine &&
                    cell.revealed
            ).length;


        if (
            safeRevealed ===
            SIZE *
                SIZE -
                MINES
        ) {

            if (scoreEl) {
                scoreEl.textContent =
                    "WIN";
            }
        }
    }


    function renderMines() {

        const grid =
            document.getElementById(
                "minegrid"
            );


        grid.innerHTML = "";


        cells.forEach(
            cell => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "cell";


                if (
                    cell.revealed
                ) {

                    button.style.background =
                        "rgba(255,255,255,.09)";


                    const count =

                        neighbours(
                            cell.index
                        )
                        .filter(
                            index =>
                                cells[index]
                                    .mine
                        )
                        .length;


                    button.textContent =

                        cell.mine
                            ? "💣"
                            : count ||
                              "";

                } else if (
                    cell.flagged
                ) {

                    button.textContent =
                        "🚩";
                }


                button.onclick =
                    () =>
                        reveal(
                            cell.index
                        );


                button.oncontextmenu =
                    event => {

                        event.preventDefault();


                        if (
                            !cell.revealed
                        ) {

                            cell.flagged =
                                !cell.flagged;

                            renderMines();
                        }
                    };


                grid.appendChild(
                    button
                );
            }
        );
    }


    renderMines();
}


/* ============================================================
   REACTION TIME
   ============================================================ */

else if (GAME === "reaction") {

    const container =
        document.getElementById(
            "domgame"
        );


    container.innerHTML =
        '<div class="reaction" id="reactionBox">Click to start</div>';


    const box =
        document.getElementById(
            "reactionBox"
        );


    let state = 0;

    let timer;

    let startTime;


    const savedReaction =

        Number(
            localStorage.getItem(
                "reactionBest"
            )
        );


    if (
        bestEl
    ) {

        bestEl.textContent =
            savedReaction
                ? savedReaction +
                  " ms"
                : "—";
    }


    help(
        "Wait for green, then click as fast as possible"
    );


    box.addEventListener(
        "click",
        () => {

            if (
                state === 0
            ) {

                state = 1;

                box.className =
                    "reaction";

                box.textContent =
                    "Wait for green…";


                timer =
                    setTimeout(
                        () => {

                            state = 2;

                            startTime =
                                performance.now();


                            box.className =
                                "reaction go";

                            box.textContent =
                                "CLICK!";
                        },

                        1200 +
                        Math.random() *
                        2800
                    );
            }


            else if (
                state === 1
            ) {

                clearTimeout(
                    timer
                );


                state = 0;


                box.className =
                    "reaction bad";


                box.textContent =
                    "Too early! Click to retry.";
            }


            else {

                const milliseconds =

                    Math.round(
                        performance.now() -
                        startTime
                    );


                if (scoreEl) {

                    scoreEl.textContent =
                        milliseconds +
                        " ms";
                }


                const currentBest =

                    Number(
                        localStorage.getItem(
                            "reactionBest"
                        )
                    );


                if (
                    !currentBest ||
                    milliseconds <
                        currentBest
                ) {

                    localStorage.setItem(
                        "reactionBest",
                        milliseconds
                    );


                    if (bestEl) {

                        bestEl.textContent =
                            milliseconds +
                            " ms";
                    }
                }


                state = 0;


                box.className =
                    "reaction";


                box.textContent =

                    milliseconds +
                    " ms — click to go again";
            }
        }
    );
}
