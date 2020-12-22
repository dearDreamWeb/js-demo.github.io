let canvas = document.querySelector('#canvas');
if (canvas.getContext) {
    let ctx = canvas.getContext('2d');
    let cW = canvas.width;
    let cH = canvas.height;
    let defaultGameData = {
        isEatFood: false, // 是否吃到食物
        isStart: false, // 是否开始
        num: 40, // 界面分成多少X多少的格子
        startX: 0, // 食物出现的x点
        startY: 0, // 食物出现的y点
        goal: 0, // 游戏得分
        endGame: false, // 游戏结束
        speed: 150, // 速度
        isDir: true, // 方向是否刷新
        timer: null, // 定时器
        bgColor: '#8ead8e' // 背景颜色
    };
    let gameData = { ...defaultGameData };

    // let isEatFood = false; // 是否吃到食物
    // let isStart = false; // 是否开始
    // let num = 40;  // 界面分成多少X多少的格子
    // let startX = 0;  // 食物出现的x点
    // let startY = 0;  // 食物出现的y点
    // let goal = 0;   // 游戏得分
    // let endGame = false; // 游戏结束
    // let speed = 120;  // 速度
    // let isDir = false; // 方向是否刷新
    // let timer;  // 定时器
    // let bgColor = '#8ead8e'; // 背景颜色

    ctx.fillStyle = gameData.bgColor;
    ctx.fillRect(0, 0, cW, cH);

    itemW = cW / gameData.num;
    itemH = cW / gameData.num;

    // 小方块
    class Rect {
        constructor(x, y, width, height, color, strokeColor) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.strokeColor = strokeColor ? strokeColor : gameData.bgColor;
        }
        rDraw() {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.strokeColor;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        // 画食物
        foodDraw() {
            let itemW = this.width / 2;
            let itemH = this.height / 2;
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    let itemX = itemW / 2 + itemW * j + this.x;
                    let itemY = itemH / 2 + itemH * i + this.y;
                    ctx.beginPath();
                    ctx.fillStyle = this.color;
                    ctx.arc(itemX, itemY, itemW / 2, 0, Math.PI * 2);
                    ctx.fillStyle = '#000';
                    ctx.fill();
                    ctx.stroke();
                }
            }

        }
    }

    // 蛇
    class Snake {
        constructor() {
            this.headColor = '#f40';  // 头部颜色
            this.bodyColor = '#000';  // 身体颜色
            // this.direction = 'right'; // 蛇的默认方向
            this.head = new Rect(cW / 2, cH / 2, itemW, itemH, this.headColor);
            let x = this.head.x;
            let y = this.head.y;
            this.body = [];
            // for (let index = 0; index < 8; index++) {
            //     x -= itemW;
            //     let bodyItem = new Rect(x, y, itemW, itemH, this.bodyColor);
            //     this.body.push(bodyItem);
            // }
        }
        sDraw() {
            this.head.rDraw();
            this.body.forEach((item) => {
                item.rDraw();
            })
        };
        move() {
            // 加头
            let newHead = new Rect(this.head.x, this.head.y, this.head.width, this.head.height, this.bodyColor);
            this.body.splice(0, 0, newHead);

            // 吃到食物了
            if (this.head.x === gameData.startX && this.head.y === gameData.startY) {
                gameData.isEatFood = true;
                gameData.goal++;
                if (gameData.goal % 3 === 0 && gameData.speed > 60) {
                    gameData.speed -= 10;
                    clearInterval(gameData.timer)
                    gameData.timer = setInterval(animate, gameData.speed);
                }
                let header = document.querySelector('.header');
                header.innerText = `游戏的得分：${gameData.goal}`;
            }

            // 去尾
            if (!gameData.isEatFood) {
                this.body.pop();
            } else {
                newFoodPosition();
                gameData.isEatFood = false;
            }
            switch (this.direction) {
                case 'left':
                    this.head.x -= this.head.width;
                    break;
                case 'top':
                    this.head.y -= this.head.height;
                    break;
                case 'right':
                    this.head.x += this.head.width;
                    break;
                case 'bottom':
                    this.head.y += this.head.height;
                    break;
            }
        }
    }
    // 生成蛇
    let snake = new Snake();
    snake.sDraw();

    // 暂停界面
    class PausePage {
        constructor() {
            this.canvasWrap = document.querySelector('.canvas_wrap');
            this.pauseDiv = document.createElement('div');
            this.pauseDiv.className = 'pause';
            this.pauseDiv.innerText = '暂停游戏';
        }
        // 显示
        showPause() {
            this.canvasWrap.appendChild(this.pauseDiv);
        }
        // 隐藏
        hidePause() {
            this.canvasWrap.removeChild(this.pauseDiv);
        }
    }
    let pausePage = new PausePage();


    // 生成食物的坐标
    function newFoodPosition() {
        let snakeArr = [snake.head, ...snake.body];
        // 如果食物出现的位置不在蛇身上就算成功，在蛇身上的话递归直到不在蛇身上为止
        function randomPosition() {
            gameData.startX = Math.floor(Math.random() * 40) * itemW;  // 出现的x点
            gameData.startY = Math.floor(Math.random() * 40) * itemH;  // 出现的y点
            snakeArr.forEach((item) => {
                if (item.x === gameData.startX || item.y === gameData.startY) {
                    randomPosition();
                }
            })
        }
        randomPosition();
    }
    newFoodPosition();
    let food = new Rect(gameData.startX, gameData.startY, itemW, itemH, '#f1939c');
    food.foodDraw();

    // 运动
    function animate() {
        if (gameData.isStart) {
            gameData.isDir = true;
            ctx.clearRect(0, 0, cW, cH);
            ctx.fillStyle = gameData.bgColor;
            ctx.fillRect(0, 0, cW, cH);
            snake.sDraw();
            snake.move();
            // 吃到食物，重新生成食物
            if (!gameData.isEatFood) {
                let food = new Rect(gameData.startX, gameData.startY, itemW, itemH, '#f1939c');
                food.foodDraw();
            }
            // 撞到了墙游戏结束
            if (!gameData.endGame && isSnakeHit()) {
                gameData.isStart = false;
                gameData.endGame = true;
                clearInterval(gameData.timer);
                document.removeEventListener('keydown', keydownMove);
                gameOverModal();
                return;
            }

        }
    }
    gameData.timer = setInterval(animate, gameData.speed);

    // 蛇是否撞到了自己的身体或墙壁
    function isSnakeHit() {
        let result = false;
        // 是否撞到了自己的身体
        snake.body.forEach((item) => {
            if (item.x === snake.head.x && item.y === snake.head.y) {
                result = true;
            }
        })
        return result || snake.head.x > cW - itemW || snake.head.x < 0 || snake.head.y > cH - itemH || snake.head.y < 0;
    }

    // 游戏失败弹窗
    function gameOverModal() {
        let newAlert = document.createElement('div');
        let text = document.createElement('span');          // 得分结果
        let reloadBtn = document.createElement('button');  // 重新开始按钮
        text.innerText = `游戏的得分：${gameData.goal}`;
        reloadBtn.innerText = '重新开始';
        newAlert.className = 'goal';
        reloadBtn.className = 'reloadBtn';
        newAlert.appendChild(text);
        newAlert.appendChild(reloadBtn);
        document.querySelector('body').appendChild(newAlert);
        // 点击重新开始按钮，重新开始游戏
        reloadBtn.onclick = () => {
            clearInterval(gameData.timer);
            gameData = { ...defaultGameData };  // 数据初始化
            document.querySelector('body').removeChild(newAlert);
            ctx.clearRect(0, 0, cW, cH);
            snake = new Snake();
            snake.sDraw();
            newFoodPosition()
            document.addEventListener('keydown', keydownMove);
            gameData.timer = setInterval(animate, gameData.speed);
            let header = document.querySelector('.header');
            header.innerText = `游戏的得分：${gameData.goal}`;
            let food = new Rect(gameData.startX, gameData.startY, itemW, itemH, '#f1939c');
            food.foodDraw();
        }
    }

    // 添加键盘事件
    document.addEventListener('keydown', keydownMove);
    // 通过监听键盘事件给出方向
    function keydownMove(e) {
        e.preventDefault();
        if (gameData.isDir) {
            if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
                gameData.isStart = true;
                gameData.isDir = false;
                pausePage.showPause();
                pausePage.hidePause();
            } else if (e.keyCode === 13) {
                gameData.isStart = !gameData.isStart;
                if (!gameData.isStart) {
                    pausePage.showPause();
                } else {
                    pausePage.hidePause();
                }
            }
            switch (e.keyCode) {
                // 左
                case 37:
                    if (snake.direction === 'right') return;
                    snake.direction = 'left';
                    break;
                // 上
                case 38:
                    if (snake.direction === 'bottom') return;
                    snake.direction = 'top';
                    break;
                // 右
                case 39:
                    if (snake.direction === 'left') return;
                    snake.direction = 'right';
                    break;
                // 下
                case 40:
                    if (snake.direction === 'top') return;
                    snake.direction = 'bottom';
                    break;
            }
        }
    }

}