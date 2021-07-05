(function () {
    let gameOver = false;
    /**
     * 排行榜面板
     */
    const listBox = document.querySelector('.ranking_list_box');  // 排行榜列表
    const skillDom = document.querySelector('.skill');   // 技能图标
    const skillLoading = document.querySelector('.skill_loading');  // 技能冷却显示
    let localData = window.localStorage.getItem('list');
    localData = localData ? JSON.parse(localData) : [];
    appendGold(localData)
    /*
    * 填充排行榜
    */
    function appendGold(arrData) {
        listBox.innerHTML = '';
        arrData.forEach((item, index) => {
            let liDom = document.createElement('li');
            liDom.innerHTML = `${index + 1}：${item}s`
            listBox.appendChild(liDom)
        })
    }

    /***************************************************************************************************************************/

    /**
     * 游戏结束面板
     */
    const goldBox = document.querySelector('.gold_box');
    const goldText = document.querySelector('.gold_text');
    const goldBtn = document.querySelector('.gold_btn');
    goldBtn.addEventListener('click', () => {
        window.location.reload()
    })

    /***************************************************************************************************************************/

    /**
     * 地图图层
    */
    const bgCanvas = document.querySelector('#bgCanvas');
    const bgCtx = bgCanvas.getContext('2d');
    let bgCanvasW = bgCanvas.width;
    let bgCanvasH = bgCanvas.height;
    let imgBg = new Image();
    let goldTimer = null;    // 得分定时器
    let goldNum = 0;  // 得分

    imgBg.src = './images/bg.png';
    imgBg.onload = () => {
        bgCtx.drawImage(imgBg, 0, 0, bgCanvasW, bgCanvasH)
    }
    // 得分定时器启动
    goldTimer = setInterval(() => {
        let seconds = (goldNum / 1000).toFixed(1);
        // 游戏结束得分计时器停止
        if (gameOver) {
            clearInterval(goldTimer)
            document.onkeydown = null;
            // 游戏面板展示
            goldBox.style.display = 'flex';
            goldText.innerHTML = `得分：${seconds}s`
            // 本地排行榜面板更新
            localData.push(seconds);
            localData.sort((a, b) => {
                return b - a;
            })
            let newData = localData.slice(0, 10)
            window.localStorage.setItem('list', JSON.stringify(newData))
            appendGold(newData);
            return;
        }
        goldNum += 100;
        bgCtx.clearRect(0, 0, bgCanvasW, bgCanvasH)
        bgCtx.drawImage(imgBg, 0, 0, bgCanvasW, bgCanvasH)
        bgCtx.font = "50px sans-serif"
        bgCtx.fillStyle = '#fff';
        bgCtx.fillText(`${seconds}s`, bgCanvasW / 2 - 75, 50);
    }, 100)

    /***************************************************************************************************************************/

    /**
     * 主角图层
    */
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    let canvasW = canvas.width;
    let canvasH = canvas.height;
    let personW = 64;   // 主角的宽度
    let personH = 64;   // 主角的高度
    let personX = canvasW / 2 - personW / 2;  // 主角的X点
    let personY = canvasH / 2 - personH / 2;  // 主角的Y点
    let zSpeed = 3;    // 主角的速度
    let quadrant = 0;   // 角色在第几象限移动
    let animationHandler = null;  // 动画
    let personImgIndex = 1;  //  角色图片的下坐标
    let isJump = false;   // 是否位移
    let jumpTime = 0;  // 触发位移技能的时间
    let skillTime = 3000; // 技能冷却时间
    let skillLoadingTime = skillTime;
    let imgPerson = new Image();
    imgPerson.src = './images/person1-1.png';
    imgPerson.onload = () => {
        ctx.drawImage(imgPerson, personX, personY, personW, personH)
    }

    canvas.onclick = (e) => {
        let dx = e.pageX - canvas.getBoundingClientRect().left
        let dy = e.pageY - canvas.getBoundingClientRect().top
        if (dx > canvasW - personW) {
            dx = canvasW - personW / 2;
        } else if (dx <= personW) {
            dx = personW - personW / 2;
        }

        if (dy > canvasH - personH) {
            dy = canvasH - personH / 2;
        } else if (dy <= personH) {
            dy = personH - personH / 2;
        }

        moveMouse(personX, personY, dx - personW / 2, dy - personH / 2)
    }

    // 监听键盘w是否触发技能
    let skillTimer = null;
    document.onkeydown = (e) => {
        const nowDateTime = new Date().getTime();
        if (e.keyCode === 87 && (nowDateTime - jumpTime) > skillTime) {
            jumpTime = nowDateTime;
            isJump = true;
            // 技能图标进入冷却倒计时
            skillDom.classList.add('loading');
            clearInterval(skillTimer)
            skillLoading.style.display = 'flex';
            skillTimer = setInterval(() => {
                // 冷却结束，恢复原来的样子
                if (skillLoadingTime < 0) {
                    clearInterval(skillTimer)
                    skillLoadingTime = skillTime;
                    skillDom.classList.remove('loading');
                    skillLoading.style.display = 'none'
                    return;
                }
                skillLoading.innerHTML = `${(skillLoadingTime / 1000).toFixed(1)}s`;
                skillLoadingTime -= 100;

            }, 100)
        }
    }


    // 主角移动
    function moveMouse(startX, startY, endX, endY) {

        window.cancelAnimationFrame(animationHandler);
        // 如果点击的位置和主角的位置一样的话，不变
        if (endX === personX && endY === personY) {
            return;
        }

        const distanceLen = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const allTimes = distanceLen / zSpeed;
        let xSpeed = (endX - startX) / allTimes;
        let ySpeed = (endY - startY) / allTimes;
        // 第一象限
        if (endX <= startX && endY <= startY) {
            quadrant = 1
            // 第二象限
        } else if (endX >= startX && endY <= startY) {
            quadrant = 2
            // 第三象限
        } else if (endX >= startX && endY >= startY) {
            quadrant = 3
            // 第四象限
        } else if (endX <= startX && endY >= startY) {
            quadrant = 4
        }

        animationHandler = window.requestAnimationFrame(timeMove)

        // 角色动起来节流定时器
        let timerPersonImage = null;
        // 根据quadrant判断在第几象限移动，在根据第几象限的判定决定是否继续移动
        function timeMove() {
            if (gameOver) {
                window.cancelAnimationFrame(animationHandler);
                return;
            }

            // 触发技能速度加速至3倍
            xSpeed = isJump ? xSpeed * 3 : xSpeed;
            ySpeed = isJump ? ySpeed * 3 : ySpeed;

            if (quadrant === 1) {
                if ((startX <= endX && startY <= endY)) {
                    window.cancelAnimationFrame(animationHandler);
                    return;
                }
                if (startX > endX) {
                    startX = (startX + xSpeed) <= endX ? endX : (startX + xSpeed);
                    personX = startX;
                }
                if (startY > endY) {
                    startY = (startY + ySpeed) <= endY ? endY : (startY + ySpeed);
                    personY = startY;
                }
            } else if (quadrant === 2) {
                if ((startX >= endX && startY <= endY)) {
                    window.cancelAnimationFrame(animationHandler);
                    return;
                }
                if (startX < endX) {
                    startX = (startX + xSpeed) >= endX ? endX : (startX + xSpeed);
                    personX = startX;
                }
                if (startY > endY) {
                    startY = (startY + ySpeed) <= endY ? endY : (startY + ySpeed);
                    personY = startY;
                }
            } else if (quadrant === 3) {
                if ((startX >= endX && startY >= endY)) {
                    window.cancelAnimationFrame(animationHandler);
                    return;
                }
                if (startX < endX) {
                    startX = (startX + xSpeed) >= endX ? endX : (startX + xSpeed);
                    personX = startX;
                }
                if (startY < endY) {
                    startY = (startY + ySpeed) >= endY ? endY : (startY + ySpeed);
                    personY = startY;
                }
            }
            else if (quadrant === 4) {
                if ((startX <= endX && startY >= endY)) {
                    window.cancelAnimationFrame(animationHandler);
                    return;
                }
                if (startX > endX) {
                    startX = (startX + xSpeed) <= endX ? endX : (startX + xSpeed);
                    personX = startX;
                }
                if (startY < endY) {
                    startY = (startY + ySpeed) >= endY ? endY : (startY + ySpeed);
                    personY = startY;
                }
            }
            ctx.clearRect(0, 0, canvasW, canvasH)
            // 节流，让人物动起来比较平缓
            clearTimeout(timerPersonImage)
            timerPersonImage = setTimeout(() => {
                ctx.clearRect(0, 0, canvasW, canvasH)
                personImgIndex = personImgIndex > 7 ? 1 : personImgIndex + 1;
                imgPerson.src = `./images/person1-${personImgIndex}.png`
            }, 20)

            ctx.drawImage(imgPerson, startX, startY, personW, personH)
            // 技能进入冷却
            isJump = false;
            animationHandler = window.requestAnimationFrame(timeMove)
        }
    }

    /***************************************************************************************************************************/

    /**
     * 子弹图层
     */
    const bulletCanvas = document.querySelector('#bulletCanvas');
    const bulletCtx = bulletCanvas.getContext('2d');
    let bulletCanvasW = bulletCanvas.width;
    let bulletCanvasH = bulletCanvas.height;
    let bulletW = 50;   // 子弹的宽度
    let bulletH = 50;   // 子弹的高度 
    let minSpeed = 2;
    let maxSpeed = 3;
    let max = 5;

    class Bullet {
        constructor(bulletCanvasW, bulletCanvasH, bulletW, bulletH, minSpeed, maxSpeed, max) {
            this.bulletCanvasW = bulletCanvasW;
            this.bulletCanvasH = bulletCanvasH;
            this.bulletW = bulletW;
            this.bulletH = bulletH;
            this.minSpeed = minSpeed;
            this.maxSpeed = maxSpeed;
            this.max = max;
            this.bulletObj = {}
            this.animationBullet = null;
            this.init()
        }
        init() {
            for (let i = 0; i < this.max; i++) {
                this.newBullet('top');
                this.newBullet('left');
            }
            window.cancelAnimationFrame(this.animationBullet)
            const allBulletMove = () => {
                // 判断游戏是否结束
                if (gameOver) {
                    window.cancelAnimationFrame(this.animationBullet);
                    return;
                }
                bulletCtx.clearRect(0, 0, this.bulletCanvasW, this.bulletCanvasH)
                // 如果没有子弹就不再遍历
                let keys = Object.keys(this.bulletObj);
                if (keys.length < 1) {
                    window.cancelAnimationFrame(this.animationBullet)
                    return;
                }
                for (let key in this.bulletObj) {
                    let item = this.bulletObj[key];
                    item.bulletX += item.bulletXSpeed;
                    item.bulletY += item.bulletYSpeed;
                    this.isHit(item);
                    this.move(key, item.bulletImg, item.bulletX, item.bulletY, item.bulletXSpeed, item.bulletYSpeed)
                }

                this.animationBullet = window.requestAnimationFrame(allBulletMove)
            }
            window.requestAnimationFrame(allBulletMove)

        }
        //  碰撞检测
        isHit(item) {
            let bulletCenterX = item.bulletX + this.bulletW / 2;
            let bulletCenterY = item.bulletY + this.bulletH / 2;
            let personCenterX = personX + personW / 2;
            let personCenterY = personY + personH / 2;
            // 碰撞检测，当人物和子弹的中心点的x和y的之前距离大于人物和子弹的宽度或者高度之和的一半说明发送了碰撞    除以的是4不是2的原因是为了让视觉看起来重合了
            if (Math.abs(personCenterX - bulletCenterX) <= (Math.abs(this.bulletW + personW) / 4) && Math.abs(personCenterY - bulletCenterY) <= (Math.abs(this.bulletH + personH) / 4)) {
                gameOver = true;
                return;
            }
        }
        // 子弹移动
        move(bulletId, bulletImg, bulletX, bulletY) {
            if (bulletX < -this.bulletW || bulletX > this.bulletCanvasW || bulletY < -this.bulletH || bulletY > this.bulletCanvasH) {
                let newBulletType = this.bulletObj[bulletId].type;
                delete this.bulletObj[bulletId]
                this.newBullet(newBulletType)
                return;
            }
            bulletCtx.drawImage(bulletImg, bulletX, bulletY, this.bulletW, this.bulletH)
        }
        // 子弹的属性,如果type为top说明子弹是从上面出现的，为left说明是从左边出现的
        newBullet(type) {
            // 随着分数的提升，最大速度和最小速度提升
            this.minSpeed += Math.ceil(goldNum / 200000) * 0.01;
            this.maxSpeed += Math.ceil(goldNum / 200000) * 0.01;

            let bulletSpeed = this.randomNum(this.minSpeed, this.maxSpeed);
            let bulletY = type === 'top' ? -this.bulletH : this.randomNum(this.bulletH, this.bulletCanvasH);
            let bulletX = type === 'top' ? this.randomNum(this.bulletW, this.bulletCanvasW) : -this.bulletW;
            let bulletCenterX = bulletX + this.bulletW / 2;
            let bulletCenterY = bulletY + this.bulletH / 2;
            let personCenterX = personX + personW / 2;
            let personCenterY = personY + personH / 2;
            // 人物和子弹之间的斜边
            let hypotenuse = Math.sqrt(Math.pow(personCenterX - bulletCenterX, 2) + Math.pow(personCenterY - bulletCenterY, 2));
            // 人物和子弹的夹角的角度
            let angle = Math.asin(Math.abs(personCenterY - bulletCenterY) / hypotenuse) * 180 / Math.PI;
            let totalTime = hypotenuse / bulletSpeed;
            let bulletXSpeed = (personCenterX - bulletCenterX) / totalTime;
            let bulletYSpeed = (personCenterY - bulletCenterY) / totalTime;
            let bulletId = this.randomNum(new Date().getTime(), new Date().getTime() * 2)
            let bulletImg = new Image();   // 创建img元素
            bulletImg.src = './images/bullet.png'
            this.bulletObj[bulletId] = {
                type,
                bulletX,
                bulletY,
                bulletXSpeed,
                bulletYSpeed,
                bulletImg
            }

        }
        randomNum(minNum, maxNum) {
            return Math.random() * (maxNum - minNum) + minNum
        }
    }
    new Bullet(bulletCanvasW, bulletCanvasH, bulletW, bulletH, minSpeed, maxSpeed, max)


})()