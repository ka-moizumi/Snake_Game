const fieldWidth = 35;
const fieldHeight = 35;
const blockSize = 10;
const canWidth = fieldWidth * blockSize; 
const canHeight = fieldHeight * blockSize; 
const color = ['#eeaabb', 'white', '#003030'];
let field = [];
let x, y = 0;
let clickCount = 0;

//canvas
let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');

canvas.width = canWidth;
canvas.height = canHeight;

//difficulty
const diff = document.querySelector('.diff__now');
const diffUp = document.querySelector('.diff-up');
const diffDown = document.querySelector('.diff-down');
const speed = [150, 100, 80, 65, 25];
let diffNow = diff.textContent;
let spNam = 2;
let setSpeed = speed[spNam];

//難易度上
diffUp.onclick = () => {
    if (clickCount === 1) return;

    if (diffNow < 5) {
        diffNow++
        diff.innerHTML = diffNow;
        spNam = diffNow - 1;
        setSpeed = speed[spNam];
    }
}

//難易度下
diffDown.onclick = () => {
    if (clickCount === 1) return;

    if (diffNow > 1) {
        diffNow--
        diff.innerHTML = diffNow;
        spNam = diffNow - 1;
        setSpeed = speed[spNam];
    }
}

//block
const drawBlock = (x, y, c) => {
    let pointX = x * blockSize;
    let pointY = y * blockSize;
    context.fillStyle = color[c];
    context.fillRect(pointX, pointY, blockSize, blockSize);
}

//origin
const origin = () => {
    for (y = 0; y < fieldHeight; y++) {
        field[y] = []
        for (let x = 0; x < fieldWidth; x++) {
            field[y][x] = 0;
        }
    }
    y = fieldHeight / 2 - 0.5;
    x = fieldWidth / 2 - 0.5;
    field[y][x] = 1;

    let origin = field[y][x];
    
    if (origin == true) {
        drawBlock(x, y, 1);
    }
}

//フード描画
let foodY =  Math.floor(Math.random() * fieldHeight);
let foodX =  Math.floor(Math.random() * fieldWidth);

const goal = () => { 
    while (field[foodY][foodX] === 1) {
        foodY =  Math.floor(Math.random() * fieldHeight);
        foodX =  Math.floor(Math.random() * fieldWidth);
    }
    drawBlock(foodX, foodY, 0);
}

//length
let food = 0;
const lenge = document.querySelector('.length__number');
const pX = [];
const pY = [];
const lengNam = () => {
    return lenge.innerHTML = `${food + 1}`;
}

//フード取得時
const reFood = () => {
    if (y === foodY && x === foodX) {
        food++;
        goal();
        lengNam();
    }
}

const pointRec = () => {
    if (pY.length == lengNam()) {
        pY.shift(y);
        pX.shift(x);
    }
    pY.push(y);
    pX.push(x);
}

//start
const start = () => {
    origin();
    goal();
    lengNam();
}

start();

//gameover check
const checkOver = () => {
    if (y < 0 || x < 0 || y > 34 || x > 34) {
        gameOver = true;
        over();
    }
}

const checkBlock = () => {
    if (field[y][x] === 1) {
        gameOver = true;
        over();
    }
}

//gameover
let gameOver = false;

const over = () => {
    btnStr.innerHTML = 'GAMEOVER';
    btnStr.className = 'btn__over';
}

//init
const init = () => {
    context.clearRect(0, 0, canWidth, canHeight);
    clickCount = 0;
    food = 0;
    pY.splice(0);
    pX.splice(0);
    gameOver = false;
    moveY = false;
    moveX = false;
    up = false;
    down = false;
    left = false;
    right = false;
    start();
}

const upSet = function() {
    moveY = !moveY;
    up = !up;
}

const downSet = function() {
    moveY = !moveY;
    down = !down;
}

const leftSet = function() {
    moveX = !moveX;
    left = !left;
}

const rightSet = function() {
    moveX = !moveX;
    right = !right;
}

//direcition
let dire; 

//上
const moveUp = function() {
    dire = direUp;
    pointRec();
    if (pY.length == lengNam() && y > 0 && !gameOver) {
        drawBlock(pX[0], pY[0], 2);
        field[pY[0]][pX[0]] = 0;                        
    }
    y--;
    if (y >= 0) { 
        drawBlock(x, y, 1);
        checkBlock();
        field[y][x] = 1;
    }
    checkOver();
    if (gameOver) {
        clearInterval(direUp);
    }
    reFood();
    if (kyDwn) {
        clearInterval(direUp);
        kyDwn = !kyDwn;
        upSet();
    }
}

//下
const moveDown = function() {
    dire = direDown;
    pointRec();
    if (pY.length == lengNam() && y < 34 && !gameOver) {
        drawBlock(pX[0], pY[0], 2);
        field[pY[0]][pX[0]] = 0;
    }
    y++;
    if (y <= 34) {
        drawBlock(x, y, 1);
        checkBlock();
        field[y][x] = 1;
    }
    checkOver();
    if (gameOver) {
        clearInterval(direDown);
    }
    reFood();
    if (kyDwn) {
        clearInterval(direDown);
        kyDwn = !kyDwn;
        downSet();
    }
}

//左
const moveLeft = function() {                           
    dire = direLeft;
    pointRec();                        
    if (pY.length == lengNam() && x > 0 && !gameOver) {
        drawBlock(pX[0], pY[0], 2);
        field[pY[0]][pX[0]] = 0;
    }
    x--;
    if (x >= 0) {                                
        drawBlock(x, y, 1);
        checkBlock();
        field[y][x] = 1;  
    }
    checkOver();
    if (gameOver) {
        clearInterval(direLeft);
    }
    reFood();
    if (kyDwn) {
        clearInterval(direLeft);
        kyDwn = !kyDwn;
        leftSet();
    }
}

//右
const moveRight = function() {
    dire = direRight;
    pointRec();
    if (pY.length == lengNam() && x < 34 && !gameOver) {
        drawBlock(pX[0], pY[0], 2);
        field[pY[0]][pX[0]] = 0;
    }
    x++;
    if (x <= 34) {
        drawBlock(x, y, 1);
        checkBlock();
        field[y][x] = 1;
    }
    checkOver();
    if (gameOver) {
        clearInterval(direRight);
    }
    reFood();
    if (kyDwn) {
        clearInterval(direRight);
        kyDwn = !kyDwn;
        rightSet();
    }
}

let direUp;
let direDown;
let direLeft;
let direRight;

//push button
const btnColor = ['#ffdd33', '#ccaa22']
const btnStr = document.querySelector('.btn__start');
const upBtn = document.querySelector('.btn-up');
const downBtn = document.querySelector('.btn-down');
const leftBtn = document.querySelector('.btn-left');
const rightBtn = document.querySelector('.btn-right');
let up = false;
let down = false;
let left = false;
let right = false;
let kyDwn = false;

const textChange = () => btnText = btnStr.textContent;

const condiUp = () => {
    if (moveY === false && btnText === 'STOP') {
        upSet();
        kyDwn = !kyDwn;
        direUp = setInterval(moveUp, setSpeed);
    }
}

const condiDown = () => {
    if (moveY === false && btnText === 'STOP') {
        downSet();
        kyDwn = !kyDwn;
        direDown = setInterval(moveDown, setSpeed);
    }
}

const condiLeft = () => {
    if (moveX === false && btnText === 'STOP') {
        leftSet();
        kyDwn = !kyDwn;
        direLeft = setInterval(moveLeft, setSpeed);
    }
}
const condiRight = () => {
    if (moveX === false && btnText === 'STOP') {
        rightSet();
        kyDwn = !kyDwn;
        direRight = setInterval(moveRight, setSpeed);
    }
}

const pushStrBtn = btnStr.onclick = () => {
    textChange();
    
    switch (btnText) {
        case 'START':
            btnStr.innerHTML = 'STOP';
            btnStr.className = 'btn__stop';
            textChange();
            if (clickCount === 0) {
                clickCount++;
                upSet();
                direUp = setInterval(moveUp, setSpeed);
            } else if (clickCount === 1) {
                switch (true) {
                    case up:
                        direUp = setInterval(moveUp, setSpeed);
                        break;
            
                    case down:
                        direDown = setInterval(moveDown, setSpeed);
                        break;
            
                    case left:
                        direLeft = setInterval(moveLeft, setSpeed);    
                        break;
            
                    case right:
                        direRight = setInterval(moveRight, setSpeed);
                        break;
                }
            }
            break;

        case 'STOP':
            btnStr.innerHTML = 'START';
            btnStr.className = 'btn__start';
            textChange();
            clearInterval(dire);
            break;

        case 'GAMEOVER':
            btnStr.innerHTML = 'START';
            btnStr.className = 'btn__start';
            init();
            break;
    }   
}

upBtn.onclick = () => {
    condiUp();
}

downBtn.onclick = () => {
    condiDown();
}

leftBtn.onclick = () => {
    condiLeft();
}

rightBtn.onclick = () => {
    condiRight();
}

//keybord check
let moveY = false;
let moveX = false;

document.onkeydown = (e) => {
    switch (e.key) {
        case "ArrowUp": //上
            condiUp();
            break;

        case "ArrowDown": //下
            condiDown();
            break;

        case "ArrowLeft": //左
            condiLeft();
            break;
  
        case "ArrowRight": //右
            condiRight();
            break;
    } 
}