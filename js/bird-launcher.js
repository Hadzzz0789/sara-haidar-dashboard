const canvas =
document.getElementById("game");

const ctx =
canvas.getContext("2d");

const groundY = 440;

const startX = 160;
const startY = 360;

const gravity = 0.35;

let bird;

let dragging = false;
let launched = false;

let score = 0;

let targets = [];

function resetLevel() {

    bird = {
        x: startX,
        y: startY,
        radius: 22,
        vx: 0,
        vy: 0
    };

    dragging = false;
    launched = false;

    score = 0;

    document.getElementById("score").textContent =
        score;

    targets = [
        {
            x: 650,
            y: groundY - 35,
            radius: 25,
            alive: true
        },

        {
            x: 720,
            y: groundY - 35,
            radius: 25,
            alive: true
        },

        {
            x: 685,
            y: groundY - 90,
            radius: 25,
            alive: true
        }
    ];
}

function getMouse(event) {

    const rect =
        canvas.getBoundingClientRect();

    return {

        x:
        (event.clientX - rect.left) *
        (canvas.width / rect.width),

        y:
        (event.clientY - rect.top) *
        (canvas.height / rect.height)
    };
}

canvas.addEventListener(
    "mousedown",
    event => {

        if (launched) return;

        const mouse =
            getMouse(event);

        const distance =
            Math.hypot(
                mouse.x - bird.x,
                mouse.y - bird.y
            );

        if (distance < bird.radius + 20) {

            dragging = true;
        }
    }
);

canvas.addEventListener(
    "mousemove",
    event => {

        if (!dragging) return;

        const mouse =
            getMouse(event);

        let dx =
            mouse.x - startX;

        let dy =
            mouse.y - startY;

        const maxDrag = 110;

        const distance =
            Math.hypot(dx, dy);

        if (distance > maxDrag) {

            dx =
                dx / distance *
                maxDrag;

            dy =
                dy / distance *
                maxDrag;
        }

        bird.x =
            startX + dx;

        bird.y =
            startY + dy;
    }
);

canvas.addEventListener(
    "mouseup",
    () => {

        if (!dragging) return;

        dragging = false;
        launched = true;

        bird.vx =
            (startX - bird.x) * 0.13;

        bird.vy =
            (startY - bird.y) * 0.13;
    }
);

function update() {

    if (launched) {

        bird.vy += gravity;

        bird.x += bird.vx;
        bird.y += bird.vy;

        // ground collision

        if (
            bird.y + bird.radius >
            groundY
        ) {

            bird.y =
                groundY -
                bird.radius;

            bird.vy *= -0.45;

            bird.vx *= 0.75;

            if (
                Math.abs(bird.vy) < 0.5
            ) {
                bird.vy = 0;
            }
        }

        targets.forEach(target => {

            if (!target.alive) return;

            const distance =
                Math.hypot(
                    bird.x - target.x,
                    bird.y - target.y
                );

            if (
                distance <
                bird.radius +
                target.radius
            ) {

                target.alive =
                    false;

                score++;

                document.getElementById(
                    "score"
                ).textContent = score;

                bird.vx *= 0.75;
            }
        });
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
        "#54b8ff"
    );

    gradient.addColorStop(
        1,
        "#d7f2ff"
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // grass

    ctx.fillStyle =
        "#56a832";

    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        canvas.height - groundY
    );
}

function drawSlingshot() {

    // wooden slingshot

    ctx.strokeStyle =
        "#663b1e";

    ctx.lineWidth = 15;

    ctx.beginPath();

    ctx.moveTo(
        startX - 20,
        groundY
    );

    ctx.lineTo(
        startX - 15,
        startY - 20
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        startX + 20,
        groundY
    );

    ctx.lineTo(
        startX + 15,
        startY - 20
    );

    ctx.stroke();

    if (!launched) {

        ctx.strokeStyle =
            "#392018";

        ctx.lineWidth = 6;

        ctx.beginPath();

        ctx.moveTo(
            startX - 15,
            startY - 20
        );

        ctx.lineTo(
            bird.x,
            bird.y
        );

        ctx.lineTo(
            startX + 15,
            startY - 20
        );

        ctx.stroke();
    }
}

function drawBird() {

    ctx.fillStyle =
        "#e63b35";

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

    ctx.fillStyle =
        "white";

    ctx.beginPath();

    ctx.arc(
        bird.x + 8,
        bird.y - 6,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
        "black";

    ctx.beginPath();

    ctx.arc(
        bird.x + 10,
        bird.y - 6,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // beak

    ctx.fillStyle =
        "#ffb300";

    ctx.beginPath();

    ctx.moveTo(
        bird.x + 18,
        bird.y
    );

    ctx.lineTo(
        bird.x + 38,
        bird.y + 7
    );

    ctx.lineTo(
        bird.x + 18,
        bird.y + 13
    );

    ctx.fill();
}

function drawTargets() {

    targets.forEach(target => {

        if (!target.alive)
            return;

        ctx.fillStyle =
            "#79c943";

        ctx.beginPath();

        ctx.arc(
            target.x,
            target.y,
            target.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // eyes

        ctx.fillStyle =
            "white";

        ctx.beginPath();

        ctx.arc(
            target.x - 8,
            target.y - 5,
            6,
            0,
            Math.PI * 2
        );

        ctx.arc(
            target.x + 8,
            target.y - 5,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle =
            "black";

        ctx.beginPath();

        ctx.arc(
            target.x - 8,
            target.y - 5,
            2,
            0,
            Math.PI * 2
        );

        ctx.arc(
            target.x + 8,
            target.y - 5,
            2,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}

function drawTrajectory() {

    if (!dragging)
        return;

    const vx =
        (startX - bird.x) *
        0.13;

    const vy =
        (startY - bird.y) *
        0.13;

    ctx.fillStyle =
        "rgba(255,255,255,0.7)";

    for (
        let t = 5;
        t < 50;
        t += 5
    ) {

        const x =
            startX +
            vx * t;

        const y =
            startY +
            vy * t +
            0.5 *
            gravity *
            t *
            t;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}

function draw() {

    drawBackground();

    drawTrajectory();

    drawSlingshot();

    drawTargets();

    drawBird();

    if (
        targets.every(
            target =>
            !target.alive
        )
    ) {

        ctx.fillStyle =
            "rgba(0,0,0,0.5)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.fillStyle =
            "white";

        ctx.font =
            "bold 50px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "LEVEL COMPLETE!",
            canvas.width / 2,
            220
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

resetLevel();

gameLoop();
