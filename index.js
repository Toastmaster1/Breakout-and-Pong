var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 5;
var x = canvas.width/2;
var y = canvas.height-30;

var dx = 0.1;
var dy = -1;

var paddleHeight = 3;
var paddleWidth = 66;
var paddleYOffset = 10;
var paddleSpeed = 3;
var paddleX = (canvas.width-paddleWidth)/2;
var pointOfContact = x - paddleX;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 12;
var brickColumnCount = 5;
var brickWidth = 20;
var brickHeight = 6;
var brickPadding = 1;
var brickOffsetTop = 30;
var brickOffsetLeft = 25;
const brickColors = [
    document.getElementById("row1").value,
    document.getElementById("row2").value,
    document.getElementById("row3").value,
    document.getElementById("row4").value,
    document.getElementById("row5").value];
var score = 0;
var lives = 3;
var round = 1;
var bricks = [];
var angleOffset = 0;
var cheatEnabled = document.getElementById("cheat").checked;
var cheatOffset = 0;
var pauseEnabled = document.getElementById("pause").checked;

for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.code  == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.code == 'ArrowLeft') {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.code == 'ArrowRight') {
        rightPressed = false;
    }
    else if(e.code == 'ArrowLeft') {
        leftPressed = false;
    }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if(score == brickRowCount*brickColumnCount*round) {
              round++;
              if (round <= 5) {
              if (dy < 0) {
                dy-=0.5;
              }
              else {
                dy+=0.5
              }
              lives = 3;
              drawBricks(true)
              }
              else {
                alert("YOU WIN, CONGRATS!");
              }
                    }
                }
            }
        }
    }
}
    

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = document.getElementById("ballColor").value;
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight - paddleYOffset, paddleWidth, paddleHeight);
    ctx.fillStyle = document.getElementById("paddleColor").value;
    ctx.fill();
    ctx.closePath();
}
function drawBricks(repop) {
    if (repop) {
        for(var c=0; c<brickColumnCount; c++) {
            bricks[c] = [];
            for(var r=0; r<brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }

    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                const brickColors = [
                    document.getElementById("row1").value,
                    document.getElementById("row2").value,
                    document.getElementById("row3").value,
                    document.getElementById("row4").value,
                    document.getElementById("row5").value];
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColors[c];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawScore() {
    ctx.font = "8px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "8px Arial";
    ctx.fillStyle = "#FFFFFF";
    if (round != 6) {
        ctx.fillText("Lives: "+lives, canvas.width-45, 20);
    }
    else {
        ctx.fillText("Game Finish", canvas.width-45, 20);
    }
}
function drawRound() {
    ctx.font = "8px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Round: "+round, canvas.width-170, 20);
}


function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


function draw() {
    pauseEnabled = document.getElementById("pause").checked;
    if (pauseEnabled){
        requestAnimationFrame(draw);
        return;
    }
    else {
        const canvasColor = document.getElementById("canvasColor").value;
        ctx.fillStyle = hexToRGBA(canvasColor, 0.35)
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawBricks(false);
        drawBall();
        drawPaddle();
        drawScore();
        drawLives();
        drawRound();
        collisionDetection();

        cheatEnabled = document.getElementById("cheat").checked;
        if (cheatEnabled) {
            paddleX = x - paddleWidth / 2 + cheatOffset
            paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, paddleX));
        }
        if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if(y + dy < ballRadius) {
            dy = -dy;
        }
        else if(y + dy > canvas.height-ballRadius-paddleYOffset) {
            if(x > paddleX && x < paddleX + paddleWidth && y + dy < canvas.height - paddleYOffset) {
                dy = -dy;
                pointOfContact = Math.trunc((x - paddleX)/6) - 5
                angleOffset = pointOfContact/10
                if (angleOffset < 0) {
                    dx = -round + angleOffset
                }
                else if (angleOffset > 0) {
                    dx = round + angleOffset
                }
                else {
                    dx = 0
                }
                cheatOffset = (Math.floor(Math.random() * 60) - 30);
            }
            else {
                lives--;
                if(!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                }
                else {
                    x = canvas.width/2;
                    y = canvas.height-30;

                    if (score % 2 == 0) {
                    dx = -dx;
                    }
                    if (dy > 0) {
                    dy = -dy;
                    }

                    paddleX = (canvas.width-paddleWidth)/2;
                }
            }
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) { 
        paddleX += paddleSpeed + round;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed + round;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

const runButton = document.getElementById("runButton");
runButton.addEventListener("click", () => {
  draw();
  runButton.disabled = true;
  document.getElementById("runButton").style.display = "none"
});