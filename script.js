const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// Game variables
const paddleWidth = 20;
const paddleHeight = 100;
const ballRadius = 10;

let userScore = 0;
let computerScore = 0;

const userPaddle = {
  x: 20,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 5
};

const computerPaddle = {
  x: canvas.width - 40,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 3
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: ballRadius,
  speedX: 4,
  speedY: 4
};

// User input
let userMoveUp = false;
let userMoveDown = false;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') userMoveUp = true;
  if (e.key === 'ArrowDown') userMoveDown = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp') userMoveUp = false;
  if (e.key === 'ArrowDown') userMoveDown = false;
});

function drawRect(x, y, width, height, color = '#ffffff') {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color = '#ffffff') {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawNet() {
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function updateScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `User: ${userScore} | Computer: ${computerScore}`;
}

function update() {
  // Move user paddle
  if (userMoveUp && userPaddle.y > 0) userPaddle.y -= userPaddle.speed;
  if (userMoveDown && userPaddle.y + paddleHeight < canvas.height) userPaddle.y += userPaddle.speed;

  // Move computer paddle
  if (ball.y < computerPaddle.y + paddleHeight / 2) {
    computerPaddle.y -= computerPaddle.speed;
  } else if (ball.y > computerPaddle.y + paddleHeight / 2) {
    computerPaddle.y += computerPaddle.speed;
  }

  // Ball movement
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Ball collision with top and bottom walls
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.speedY *= -1;
  }

  // Ball collision with paddles
  if (
    ball.x - ball.radius < userPaddle.x + paddleWidth &&
    ball.y > userPaddle.y &&
    ball.y < userPaddle.y + paddleHeight
  ) {
    ball.speedX *= -1;
  }

  if (
    ball.x + ball.radius > computerPaddle.x &&
    ball.y > computerPaddle.y &&
    ball.y < computerPaddle.y + paddleHeight
  ) {
    ball.speedX *= -1;
  }

  // Ball reset if out of bounds
  if (ball.x - ball.radius < 0) {
    computerScore++;
    updateScore();
    resetBall();
  }

  if (ball.x + ball.radius > canvas.width) {
    userScore++;
    updateScore();
    resetBall();
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX *= -1;
  ball.speedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles, ball, and net
  drawRect(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height, '#00ffcc');
  drawRect(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height, '#ff5050');
  drawCircle(ball.x, ball.y, ball.radius, '#ffff00');
  drawNet();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();