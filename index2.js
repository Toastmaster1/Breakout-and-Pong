let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let player1Color = document.getElementById("paddleColor1").value;
let player2Color = document.getElementById("paddleColor2").value;
let ballColor = document.getElementById("ballColor").value;
let backgroundColor = document.getElementById("canvasColor").value;
let cheatEnabled1 = document.getElementById("cheat1").checked;
let cheatEnabled2 = document.getElementById("cheat2").checked;
let cheatOffset1 = 0;
let cheatOffset2 = 0;
let pauseEnabled = document.getElementById("pause").checked;

let player1Up = false;
let player1Down = false;
let player2Up = false;
let player2Down = false;

let playerWidth = 3;
let playerHeight = 33;
let player1X = 0;
let player1Y = canvas.height / 2 - playerHeight / 2;
let player2X = canvas.width - playerWidth;
let player2Y = canvas.height / 2 - playerHeight / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 5;
let dx = 2;
let dy = 2;

let player1Score = 0;
let player2Score = 0;

let pointOfContact = 0;
let angleOffset = 0;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function keyDownHandler(e) {
    if (e.code === "KeyW") {
        player1Up = true;
    } else if (e.code === "KeyS") {
        player1Down = true;
    } else if (e.code === "ArrowUp") {
        player2Up = true;
    } else if (e.code === "ArrowDown") {
        player2Down = true;
    }
}

function keyUpHandler(e) {
    if (e.code === "KeyW") {
        player1Up = false;
    } else if (e.code === "KeyS") {
        player1Down = false;
    } else if (e.code === "ArrowUp") {
        player2Up = false;
    } else if (e.code === "ArrowDown") {
        player2Down = false;
    }
}


function drawPaddles() {
    // Player 1
    ctx.beginPath();
    ctx.rect(player1X, player1Y, playerWidth, playerHeight);
    ctx.fillStyle = document.getElementById("paddleColor1").value;
    ctx.fill();
    ctx.closePath();

    // Player 2
    ctx.beginPath();
    ctx.rect(player2X, player2Y, playerWidth, playerHeight);
    ctx.fillStyle = document.getElementById("paddleColor2").value;
    ctx.fill();
    ctx.closePath();
}
 
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = document.getElementById("ballColor").value;
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(player1Score + " : " + player2Score, canvas.width / 2 - 30, canvas.height / 2, 100)
}


function hexToRGBA(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}



function draw() {
    pauseEnabled = document.getElementById("pause").checked;
    if (pauseEnabled) {
        requestAnimationFrame(draw);
        return;
    }

    const canvasColor = document.getElementById("canvasColor").value;
    ctx.fillStyle = hexToRGBA(canvasColor, 0.35);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddles();
    drawScore();

    // Move the paddles
    let paddleSpeed = 2;

    if (player1Up && player1Y > 0) {
        player1Y -= paddleSpeed;
    }
    if (player1Down && player1Y + playerHeight < canvas.height) {
        player1Y += paddleSpeed;
    }
    if (player2Up && player2Y > 0) {
        player2Y -= paddleSpeed;
    }
    if (player2Down && player2Y + playerHeight < canvas.height) {
        player2Y += paddleSpeed;
    }

    ballX += dx;
    ballY += dy;

    // Bounce off top and bottom
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        dy = -dy;
    }

    cheatEnabled1 = document.getElementById("cheat1").checked;
    cheatEnabled2 = document.getElementById("cheat2").checked;

    if (cheatEnabled1) {
        player1Y = ballY + playerHeight / 2 - cheatOffset1
        player1Y = Math.max(0, Math.min(canvas.height - playerHeight, ballY - playerHeight / 2 + cheatOffset1));
    }

    if (cheatEnabled2) {
        player2Y = ballY + playerHeight / 2 - cheatOffset2
        player2Y = Math.max(0, Math.min(canvas.height - playerHeight, ballY - playerHeight / 2 + cheatOffset2));
    }

    if (dx < 0) {
        // player 1 check
        if (ballX - ballRadius <= player1X + playerWidth) {
            if (ballY >= player1Y && ballY <= player1Y + playerHeight) {
                // onhit here
                //--
                pointOfContact = Math.trunc((ballY - player1Y)/3)
                switch (pointOfContact) {
                case 1: dy = -1.5; break;
                case 2: dy = -1.4; break;
                case 3: dy = -1.3; break;
                case 4: dy = -1.2; break;
                case 5: dy = -1.1; break;
                case 6: dy = 0; break;
                case 7: dy = 1.1; break;
                case 8: dy = 1.2; break;
                case 9: dy = 1.3; break;
                case 10: dy = 1.4; break;
                case 11: dy = 1.5; break;
                }
                dx = -dx
                cheatOffset2 = Math.floor(Math.random() * 33) - 16;
            } else {
                ballX = canvas.width/2;
                ballY = canvas.height/2;
                player2Score++;
            }
        }
    } else if (dx > 0) {
        // player 2 check
        if (ballX + ballRadius >= player2X) {
            if (ballY >= player2Y && ballY <= player2Y + playerHeight) {
            pointOfContact = Math.trunc((ballY - player2Y)/3)
                switch (pointOfContact) {
                case 1: dy = -1.5; break;
                case 2: dy = -1.4; break;
                case 3: dy = -1.3; break;
                case 4: dy = -1.2; break;
                case 5: dy = -1.1; break;
                case 6: dy = 0; break;
                case 7: dy = 1.1; break;
                case 8: dy = 1.2; break;
                case 9: dy = 1.3; break;
                case 10: dy = 1.4; break;
                case 11: dy = 1.5; break;
                }
                dx = -dx
                cheatOffset1 = Math.floor(Math.random() * 33) - 16;
            } else {
                ballX = canvas.width/2;
                ballY = canvas.height/2;
                player1Score++;
            }
        }
    }
    requestAnimationFrame(draw);
}



runButton.addEventListener("click", () => {
    draw();
    runButton.disabled = true;
    document.getElementById("runButton").style.display = "none";
});
