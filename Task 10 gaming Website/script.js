const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

let bird = {
    x: 50,
    y: 150,
    width: 34,   
    height: 24,  
    gravity: 0.4,  
    lift: -6,     
    velocity: 0
};

let pipes = [];
let pipeWidth = 50;
let pipeGap = 160;  
let frameCount = 0;
let score = 0;
let gameRunning = false;

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const scoreDisplay = document.getElementById('score');

startButton.addEventListener('click', function () {
    startGame();
    startButton.style.display = 'none';  
});

restartButton.addEventListener('click', function () {
    resetGame();
    restartButton.style.display = 'none';  
});

document.addEventListener('keydown', function () {
    if (gameRunning) {
        bird.velocity = bird.lift;
    }
});

function drawBird() {
    ctx.fillStyle = 'blue';  
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);  
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
        endGame();  
    }

    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function updatePipes() {
    if (frameCount % 120 === 0) {  
        let topHeight = Math.random() * (canvas.height / 2);
        let bottomHeight = canvas.height - topHeight - pipeGap;
        pipes.push({ x: canvas.width, top: topHeight, bottom: bottomHeight });
    }

    pipes.forEach(pipe => {
        pipe.x -= 1.5;  
    });

    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function checkCollision() {
    pipes.forEach(pipe => {
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth) {
            if (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom) {
                endGame();  
            }
        }
    });
}

function endGame() {
    gameRunning = false;
    restartButton.style.display = 'block';  

   
    if (score > 5) {
        alert("You played well!");
    } else {
        alert("Improve your gameplay!");
    }
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreDisplay.textContent = "Score: 0";
    frameCount = 0;
    gameRunning = true;
    gameLoop();
}

function updateScore() {
    pipes.forEach(pipe => {
        if (pipe.x + pipeWidth < bird.x && !pipe.passed) {
            score++;
            pipe.passed = true;
            scoreDisplay.textContent = "Score: " + score;
        }
    });
}

function startGame() {
    resetGame();
    gameRunning = true;
    gameLoop();  
}

function gameLoop() {
    if (!gameRunning) return;  

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    updateBird();

    drawPipes();
    updatePipes();

    checkCollision();
    updateScore();

    frameCount++;
    requestAnimationFrame(gameLoop);
}


