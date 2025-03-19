//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

//physics
let velocityX = 0; 
let velocityY = 0;
let initialVelocityY = -8; //Jump height
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;
let dangerousPlatformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw doodler
    // context.fillStyle = "green";
    // context.fillRect(doodler.x, doodler.y, doodler.width, doodler.height);

    //load images
    doodlerRightImg = new Image();
    doodlerRightImg.src = "./doodler-right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function() {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./doodler-left.png";

    platformImg = new Image();
    platformImg.src = "./platform.png";

    dangerousPlatformImg = new Image();
    dangerousPlatformImg.src = "./platform-danger.png";

    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText("Press any key to begin the game", boardWidth/6, boardHeight*5/8);

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);

}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //doodler
    doodler.x += velocityX;
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    }
    else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth;
    }

    velocityY += gravity;
    doodler.y += velocityY;
    if (doodler.y > board.height) {
        gameOver = true;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight*3/4) {
            platform.y -= initialVelocityY; //slide platform down
        }
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            if (platform.dangerous && doodler.y + doodler.height < platform.y + platform.height) {
                gameOver = true; // game over if platform is dangerous
            } else {
                velocityY = initialVelocityY; //jump

                if (doodler.y < boardHeight*3/4) { // small jump
                    new Audio("jumpsound.mp3").play();
                } else {
                    new Audio("jumpsound-reversed.mp3").play(); // big jump
                }
                
            }
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // clear platforms and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); //removes first element from the array
        newPlatform(); //replace with new platform on top
    }

    //score
    updateScore();

    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    // context.fillText(score, 5, 20);
    const scoreElement = document.getElementById("Score");
    if (scoreElement) {
        scoreElement.innerHTML = `<h3>Score: ${score}</h3>`;
    }
    var highScore = localStorage.getItem("highScore") || 0;
    let highScoreElement = document.getElementById("HighScore");
    if (gameOver) {
        new Audio("failsound.mp3").play();
        context.fillText("Game Over: Press 'Space' to Restart", boardWidth / 7, boardHeight * 7 / 8);
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore); 
        }

        if (highScoreElement) {
            highScoreElement.innerHTML = `<h3>Best: ${highScore}</h3>`;
        }
    }


    // background image
    // get the canvas element
    var canvas = document.getElementById('board');
    if (score > 8000) {
        canvas.style.backgroundImage = "url('./doodlejumpbg3.png')";
    } else if (score > 4000) {
        canvas.style.backgroundImage = "url('./doodlejumpbg2.png')";
    } else {
        canvas.style.backgroundImage = "url('./doodlejumpbg.png')";
    }

}

function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { //move right
        velocityX = 5;
        doodler.img = doodlerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -5;
        doodler.img = doodlerLeftImg;
    }
    else if (e.code == "Space" && gameOver) {
        //reset
        doodler = {
            img : doodlerRightImg,
            x : doodlerX,
            y : doodlerY,
            width : doodlerWidth,
            height : doodlerHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
}

function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight,
        dangerous: false // starting platforms are safe
    }

    platformArray.push(platform);

    // platform = {
    //     img : platformImg,
    //     x : boardWidth/2,
    //     y : boardHeight - 150,
    //     width : platformWidth,
    //     height : platformHeight
    // }
    // platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight,
            dangerous: false
        }
    
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
    let evilPlatformDensity = Math.random() < score * 0.00005 // more bad platforms at higher scores
    if (evilPlatformDensity > 0.5) {
        evilPlatformDensity = 0.5; // max so game is not impossible
    };
    let randomState = evilPlatformDensity; 
    let platform = {
        img : randomState ? dangerousPlatformImg : platformImg, // Change image if dangerous
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight,
        dangerous: randomState
    }

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function updateScore() {
    let points = Math.floor(50*Math.random()); //(0-1) *50 --> (0-50)
    if (velocityY < 0) { //negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}