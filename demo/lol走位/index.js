(function () {
    /**
     * 地图图层
    */
    const bgCanvas = document.querySelector('#bgCanvas');
    const bgCtx = bgCanvas.getContext('2d');
    let bgCanvasW = bgCanvas.width;
    let bgCanvasH = bgCanvas.height;
    let imgBg = new Image();
    imgBg.src = './images/bg.png';
    imgBg.onload = () => {
        bgCtx.drawImage(imgBg, 0, 0, bgCanvasW, bgCanvasH)
    }

    /**
     * 主角图层
    */
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    let canvasW = canvas.width;
    let canvasH = canvas.height;
    let personW = 80;   // 主角的宽度
    let personH = 80;   // 主角的高度
    let personX = canvasW / 2 - personW / 2;  // 主角的X点
    let personY = canvasH / 2 - personH / 2;  // 主角的Y点
    let zSpeed = 5;    // 主角的速度
    let quadrant = 0;   // 角色在第几象限移动
    let imgPerson = new Image();
    imgPerson.src = './images/person.gif';
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

    // 主角移动
    function moveMouse(startX, startY, endX, endY) {
        // 如果点击的位置和主角的位置一样的话，不变
        if (endX === personX && endY === personY) {
            return;
        }

        window.cancelAnimationFrame(timeMove);
        const distanceLen = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const allTimes = distanceLen / zSpeed;
        const xSpeed = (endX - startX) / allTimes;
        const ySpeed = (endY - startY) / allTimes;
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

        window.requestAnimationFrame(timeMove)

        function timeMove() {
            if (quadrant === 1) {
                if ((startX <= endX && startY <= endY)) {
                    window.cancelAnimationFrame(timeMove);
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
                    window.cancelAnimationFrame(timeMove);
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
                    window.cancelAnimationFrame(timeMove);
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
                    window.cancelAnimationFrame(timeMove);
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
            ctx.drawImage(imgPerson, startX, startY, personW, personH)
            window.requestAnimationFrame(timeMove)
        }
    }


    /**
     * 子弹图层
     */
    const bulletCanvas = document.querySelector('#bulletCanvas');
    const bulletCtx = bulletCanvas.getContext('2d');
    let bulletCanvasW = bulletCanvas.width;
    let bulletCanvasH = bulletCanvas.height;
    let bulletW = 50;   // 子弹的宽度
    let bulletH = 50;   // 子弹的高度 
    class Bullet {
        constructor() {

        }
    }
    let bulletImg = new Image();   // 创建img元素
    bulletImg.src = './images/bullet.png'
    bulletImg.onload = function () {
        bulletCtx.drawImage(bulletImg, 0, 0, 30, 30)
    }

})()