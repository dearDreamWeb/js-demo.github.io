let canvas = document.querySelector('#canvas');
if (canvas.getContext) {
    let ctx = canvas.getContext('2d');
    let cW = canvas.width;
    let cH = canvas.height;
    let defaultGameData = {
        isEatFood: false, // 是否吃到食物
        isStart: false, // 是否开始
        eatFoodNum: 0,  // 吃到了多少个食物
        num: 40, // 界面分成多少X多少的格子
        startX: 0, // 食物出现的x点
        startY: 0, // 食物出现的y点
        goal: 0, // 游戏得分
        endGame: false, // 游戏结束
        speed: 120, // 速度
        isDir: true, // 方向是否刷新
        timer: null, // 定时器
        bgColor: '#8ead8e', // 背景颜色
        level: 0,         // 游戏难度
        step: 1,          // 每个食物的分值，根据难度而定
        obstacleArr: [],   // 障碍物坐标
    };
    let gameData = { ...defaultGameData };

    // 初始化画布
    ctx.fillStyle = gameData.bgColor;
    ctx.fillRect(0, 0, cW, cH);
    // 每个单位的宽度和长度
    itemW = cW / gameData.num;
    itemH = cW / gameData.num;
    let snake;  // 蛇

    let footerGoal = document.querySelector('.footer_goal'); // 底部得分情况
    let menu = document.querySelector('.menu_wrap');  // 菜单
    let selectEl = document.querySelector('#menu_level_select'); // select选择框
    let submitBtn = document.querySelector('.submit_btn'); // 开始游戏按钮
    let bgMusicSwitch = document.querySelector('.bgMusicSwitch');  // 背景音乐开关按钮
    let goalMusicSwitch = document.querySelector('.goalMusicSwitch');  // 背景音乐开关按钮
    let gameGoalMusic = document.querySelector('#gameGoal');   // 吃到食物的音效
    let bgMusic = document.querySelector('#bgAudio');   // 背景音乐

    let bgMusicStatus = true;  // 背景音乐是否打开
    let gameGoalMusicStatus = true; // 吃到食物音效是否打开

    // 初始化所有音乐
    function initAllMusic() {
        if (bgMusicStatus) {
            bgMusicSwitch.innerText = '背景音乐：开';
        } else {
            bgMusicSwitch.innerText = '背景音乐：关';
        }

        if (gameGoalMusicStatus) {
            bgMusicSwitch.innerText = '得分音效：开';
        } else {
            bgMusicSwitch.innerText = '得分音效：关';
        }


        // 点击背景音乐开关按钮
        bgMusicSwitch.onclick = () => {
            let isBgMusic = bgMusicSwitch.getAttribute('data-switch') === 'on'; // 背景音乐是否打开
            if (isBgMusic) {
                bgMusicSwitch.setAttribute('data-switch', 'off');
                bgMusicSwitch.innerText = '背景音乐：关';
                bgMusic.pause();
                bgMusicStatus = false;
            } else {
                bgMusicSwitch.setAttribute('data-switch', 'on');
                bgMusicSwitch.innerText = '背景音乐：开';
                bgMusic.currentTime = 0;
                bgMusic.play();
                bgMusicStatus = true;
            }
        }

        // 点击吃到食物音效的开关
        goalMusicSwitch.onclick = () => {
            let isOn = goalMusicSwitch.getAttribute('data-switch') === 'on';
            if (isOn) {
                goalMusicSwitch.setAttribute('data-switch', 'off');
                goalMusicSwitch.innerText = '得分音效：关';
                gameGoalMusic.pause();
                gameGoalMusicStatus = false;
            } else {
                goalMusicSwitch.setAttribute('data-switch', 'on');
                goalMusicSwitch.innerText = '得分音效：开';
                eatFoodMusic()
                gameGoalMusicStatus = true;
            }
        }
    }
    initAllMusic();


    // 吃到食物的音效
    function eatFoodMusic() {
        let audioTimer;
        gameGoalMusic.currentTime = 0;
        gameGoalMusic.play();
        clearTimeout(audioTimer);
        audioTimer = setTimeout(() => {
            gameGoalMusic.pause();
        }, 1000)
    }

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
        // 画身体
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

        // 画障碍物
        obstacleDraw(obstacleX, obstacleY) {
            let itemW = this.width / 2;
            let itemH = this.height / 2;
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    let itemX = itemW * j + obstacleX;
                    let itemY = itemH * i + obstacleY;
                    ctx.beginPath();
                    ctx.fillStyle = this.color;
                    ctx.fillRect(itemX, itemY, itemW, itemH);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = this.strokeColor;
                    ctx.strokeRect(itemX, itemY, itemW, itemH)
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
            this.body = [];
            // let x = this.head.x;
            // let y = this.head.y;
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
                gameData.eatFoodNum++;
                gameData.goal += gameData.step;
                gameGoalMusicStatus ? eatFoodMusic() : false;
                // 当吃食物的个数是3的倍数的时候，速度增加
                if (gameData.eatFoodNum % 3 === 0 && gameData.speed > 60) {
                    gameData.speed -= 10;
                    clearInterval(gameData.timer)
                    gameData.timer = setInterval(animate, gameData.speed);
                }

                footerGoal.innerText = gameData.goal;
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

    // 障碍物
    class ObstacleRect {
        constructor() {
            this.level = gameData.level;  // 游戏难度
            this.startX = 0;  // 起始x坐标
            this.endX = 0;   // 终点x坐标
            this.startY = 0; // y坐标
            this.showX = this.startX; // 障碍物显示的x坐标
            this.levelName = ''; // 等级对应的难度
            this.rect = new Rect(0, 0, itemW, itemH, '#eee');
            this.showObstactle();
            // 难度
            document.querySelector('.footer_level').innerText = this.levelName;
        }

        // 显示障碍物
        showObstactle() {
            gameData.obstacleArr = [];
            switch (this.level) {
                case 0:
                    gameData.obstacleArr = [];
                    gameData.step = 1;
                    this.levelName = '天堂';
                    break;
                case 1:
                    this.levelOne();
                    gameData.step = 2;
                    this.levelName = '普通';
                    break;
                case 2:
                    this.levelTwo();
                    gameData.step = 3;
                    this.levelName = '困难';
                    break;
                case 3:
                    this.levelThree();
                    gameData.step = 4;
                    this.levelName = '地狱';
                    break;
                default:
                    gameData.obstacleArr = [];
                    break;
            }
        }

        // 难度一级， 生成两个y值一样的横条
        levelOne() {
            let obstactleNumber = cW / 2 / itemW - 1;
            this.startY = cH / 2;
            for (let i = 0; i < 2; i++) {
                if (i > 0) {
                    this.showX += itemW * 3;
                    this.startX = this.showX;
                }
                for (let j = 0; j < obstactleNumber; j++) {
                    if (this.showX < cW) {
                        this.rect.obstacleDraw(this.showX, this.startY);
                        this.showX += itemW;
                    }
                }
                this.endX = this.showX;
                gameData.obstacleArr.push({
                    startX: this.startX,
                    endX: this.endX,
                    y: this.startY
                })
            }
        }

        // 难度二级， 生成两个y值不一样的横条
        levelTwo() {
            let topW = cW / 2;   // 上边一层的宽度,1/2占的宽度
            let botoomW = cW / 5 * 4;  // 下边一层的宽度,4/5占的宽度
            let topNumber = topW / itemW;  // 上边一层的数量
            let botoomNumber = botoomW / itemW;  // 下边一层的数量
            // 上一层
            this.startX = cW / 4;
            this.showX = this.startX;
            this.startY = cH / 5 * 2;
            for (let i = 0; i < topNumber; i++) {
                this.rect.obstacleDraw(this.showX, this.startY);
                this.showX += itemW;
            }
            gameData.obstacleArr.push({
                startX: this.startX,
                endX: this.showX,
                y: this.startY
            })

            // 下一层
            this.startX = cW / 5 * 1 / 2;
            this.showX = this.startX;
            this.startY = cH / 5 * 3;
            this.showX = this.startX;
            for (let i = 0; i < botoomNumber; i++) {
                this.rect.obstacleDraw(this.showX, this.startY);
                this.showX += itemW;
            }
            gameData.obstacleArr.push({
                startX: this.startX,
                endX: this.showX,
                y: this.startY
            })
        }

        // 难度三级， 生成三个y值不一样的横条
        levelThree() {
            let topW = cW / 3;   // 上边一层的宽度,1/3占的宽度
            let centerW = cW / 2 // 中间层的宽度，占1/2的宽度
            let botoomW = cW / 5 * 4;  // 下边一层的宽度,4/5占的宽度
            let topNumber = topW / itemW;  // 上边一层的数量
            let centerNumber = centerW / itemW;  // 中间层的数量
            let botoomNumber = botoomW / itemW;  // 下边一层的数量

            // 上一层
            this.startX = cW / 4 + itemW * 2;
            this.showX = this.startX;
            this.startY = cH / 5 * 2;
            this.showX = this.startX;
            for (let i = 0; i < topNumber; i++) {
                this.rect.obstacleDraw(this.showX, this.startY);
                this.showX += itemW;
            }
            gameData.obstacleArr.push({
                startX: this.startX,
                endX: this.showX,
                y: this.startY
            })

            // 中间层
            this.startX = cW / 4;
            this.showX = this.startX;
            this.startY = cH / 5 * 3;
            this.showX = this.startX;
            for (let i = 0; i < centerNumber; i++) {
                this.rect.obstacleDraw(this.showX, this.startY);
                this.showX += itemW;
            }
            gameData.obstacleArr.push({
                startX: this.startX,
                endX: this.showX,
                y: this.startY
            })

            // 下一层
            this.startX = cW / 5 * 1 / 2;
            this.showX = this.startX;
            this.startY = cH / 5 * 4;
            this.showX = this.startX;
            for (let i = 0; i < botoomNumber; i++) {
                this.rect.obstacleDraw(this.showX, this.startY);
                this.showX += itemW;
            }
            gameData.obstacleArr.push({
                startX: this.startX,
                endX: this.showX,
                y: this.startY
            })
        }
    }


    // 暂停界面
    class PausePage {
        constructor() {
            this.canvasWrap = document.querySelector('.canvas_wrap');
            this.pauseDiv = document.createElement('div');
            this.pauseMessage = document.createElement('div');
            this.pauseDiv.className = 'pause';
            this.pauseDiv.innerHTML = `
                <p>暂停游戏</p>
                <p>按上下左右键或回车键继续游戏</p>`
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
        // 如果食物出现的位置不在蛇身上和障碍物身上就算成功，在蛇身上的话递归直到不在蛇身上为止
        function randomPosition() {
            gameData.startX = Math.floor(Math.random() * 40) * itemW;  // 出现的x点
            gameData.startY = Math.floor(Math.random() * 40) * itemH;  // 出现的y点
            snakeArr.forEach((item) => {
                if (item.x === gameData.startX && item.y === gameData.startY) {
                    randomPosition();
                    return;
                }
            })
            gameData.obstacleArr.forEach((obstacleItem) => {
                if (gameData.startX >= obstacleItem.startX && gameData.startX <= obstacleItem.endX && gameData.startY === obstacleItem.y) {
                    randomPosition();
                }
            })
        }
        randomPosition();
    }

    // 运动
    function animate() {
        if (gameData.isStart) {
            gameData.isDir = true;
            ctx.clearRect(0, 0, cW, cH);
            ctx.fillStyle = gameData.bgColor;
            ctx.fillRect(0, 0, cW, cH);
            snake.sDraw();
            snake.move();
            new ObstacleRect()
            // 吃到食物，重新生成食物
            if (!gameData.isEatFood) {
                let food = new Rect(gameData.startX, gameData.startY, itemW, itemH, '#f1939c');
                food.foodDraw();
            }
            // 撞到了墙游戏结束
            if (!gameData.endGame && isSnakeHit()) {
                gameOverModal();
                return;
            }

        }
    }


    // 蛇是否撞到了自己的身体或墙壁或者障碍物
    function isSnakeHit() {
        let result = false;
        // 是否撞到了自己的身体
        snake.body.forEach((item) => {
            if (item.x === snake.head.x && item.y === snake.head.y) {
                result = true;
            }
        })
        // 是否撞到了障碍物
        gameData.obstacleArr.forEach((obstacleItem) => {
            if (snake.head.x >= obstacleItem.startX && snake.head.x < obstacleItem.endX && snake.head.y === obstacleItem.y) {
                result = true;
            }
        })
        return result || snake.head.x > cW - itemW || snake.head.x < 0 || snake.head.y > cH - itemH || snake.head.y < 0;
    }

    // 游戏失败弹窗
    function gameOverModal() {
        gameData.isStart = false;
        gameData.endGame = true;
        clearInterval(gameData.timer);
        document.removeEventListener('keydown', keydownMove);
        // 生成弹窗信息
        let newAlert = document.createElement('div');
        let message = document.createElement('p');
        let btnWrap = document.createElement('div');        // 按钮的部分
        let reloadBtn = document.createElement('button');  // 重新开始按钮
        let returnMenu = document.createElement('button'); // 返回菜单按钮
        reloadBtn.innerText = '重新开始';
        returnMenu.innerText = '返回菜单';
        message.innerText = `游戏得分：${gameData.goal}`
        reloadBtn.className = 'reloadBtn';
        returnMenu.className = 'returnMenu';
        newAlert.className = 'goal';
        btnWrap.appendChild(reloadBtn);
        btnWrap.appendChild(returnMenu);
        newAlert.appendChild(message);
        newAlert.appendChild(btnWrap);
        document.querySelector('.canvas_wrap').appendChild(newAlert);

        // 点击返回菜单
        returnMenu.onclick = () => {
            menu.style.display = 'block';
            document.querySelector('.canvas_wrap').removeChild(newAlert);
        }

        // 点击重新开始按钮，重新开始游戏
        reloadBtn.onclick = () => {
            document.querySelector('.canvas_wrap').removeChild(newAlert);
            reloadGame({ ...defaultGameData, level: gameData.level });
        };
    }

    // 重新加载游戏
    function reloadGame(newGameData) {
        clearInterval(gameData.timer);
        gameData = newGameData;  // 数据初始化
        ctx.clearRect(0, 0, cW, cH);
        // 生成障碍物
        new ObstacleRect();
        // 生成蛇
        snake = new Snake();
        snake.sDraw();
        // 生成食物的坐标
        newFoodPosition();
        // 添加键盘事件
        document.addEventListener('keydown', keydownMove);
        // 启动定时器
        gameData.timer = setInterval(animate, gameData.speed);
        footerGoal.innerText = gameData.goal;
        let food = new Rect(gameData.startX, gameData.startY, itemW, itemH, '#f1939c');
        food.foodDraw();
    }


    // 通过监听键盘事件给出方向
    function keydownMove(e) {
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

    // 点击开始游戏
    submitBtn.onclick = () => {
        let level = Number(selectEl.value);
        menu.style.display = 'none';
        // 生成蛇
        snake = new Snake();
        snake.sDraw();
        // 生成障碍物，把障碍物的点遍历出来
        new ObstacleRect();
        // 生成食物的坐标
        newFoodPosition();
        reloadGame({
            ...defaultGameData,
            obstacleArr: gameData.obstactleArr,
            startX: gameData.startX,
            startY: gameData.startY,
            level
        });
    }
}