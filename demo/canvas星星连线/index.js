(function () {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    let canvasW = canvas.width;
    let canvasH = canvas.height;
    const distance = 100; // 两个小球连线的距离
    let mouseX = 0;
    let mouseY = 0;
    let mouseMoveX = 0;
    let mouseMoveY = 0;
    const pointR = 3;  // 小球的半径
    const pointCount = 50; // 小球的数量
    let inScreen = false;  // 鼠标是否在屏幕内

    // let canvasW = window.innerWidth;
    // let canvasH = window.innerHeight;
    // canvas.style.width = canvasW + 'px';
    // canvas.style.height = canvasH + 'px';

    // 实时canvas画布的宽和高
    // window.addEventListener('resize', () => {
    //     canvasW = window.innerWidth;
    //     canvasH = window.innerHeight;
    //     canvas.style.width = canvasW + 'px';
    //     canvas.style.height = canvasH + 'px';
    // }, false)

    canvas.addEventListener('mousemove', (e) => {
        const { top, left } = canvas.getBoundingClientRect()
        mouseX = e.clientX - left;
        mouseY = e.clientY - top;
        mouseMoveX = e.movementX;
        mouseMoveY = e.movementY;
    })
    canvas.addEventListener('mouseenter', (e) => {
        inScreen = true;
    })
    canvas.addEventListener('mouseleave', (e) => {
        inScreen = false;
        mouseX = 0;
        mouseY = 0;
    })

    /**
     * 小圆点
     * x： x坐标
     * y： y坐标
     * r： 半径
     * s： 速度
     */
    class Point {
        constructor(x, y, r, minSpeed, maxSpeed) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.mouse = false;
            this.xSpeed = Math.random() * (maxSpeed - minSpeed + 1) + minSpeed;
            this.ySpeed = Math.random() * (maxSpeed - minSpeed + 1) + minSpeed;
        }
        draw() {
            ctx.beginPath()
            ctx.fillStyle = '#fff'
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
            ctx.fill()
        }
        move() {
            this.draw()
            if (this.x <= this.r / 2 || this.x >= canvasW) {
                this.xSpeed *= -1;
            }
            if (this.y <= this.r / 2 || this.y >= canvasH) {
                this.ySpeed *= -1;
            }

            if (this.mouse) {
                if(!inScreen){
                    this.mouse =false;
                    return ;
                }
                console.log(lineDistance(this.x, this.y, mouseX, mouseY) >= distance)
                if (lineDistance(this.x, this.y, mouseX, mouseY) >= distance) {
                    this.mouse = false
                } else {
                    this.x += mouseMoveX;
                    this.y += mouseMoveY;
                    console.log(this.x,this.y)
                }

            } else {
                this.x += this.xSpeed;
                this.y += this.ySpeed;
            }
        }
    }

    let arr = []
    for (let i = 0; i < pointCount; i++) {
        const x = Math.floor(Math.random() * (canvasW - pointR)) + pointR;
        const y = Math.floor(Math.random() * (canvasH - pointR)) + pointR;
        const point = new Point(x, y, pointR, -0.5, 0.5)
        arr.push(point)
    }

    /**
     * 通过勾股定理计算距离
     */
    function lineDistance(x, y, x1, y1) {
        return Math.sqrt(Math.pow(Math.abs(x - x1), 2) + Math.pow(Math.abs(y - y1), 2))
    }

    /**
     * 遍历小球
     */
    function drawPoint() {
        ctx.clearRect(0, 0, canvasW, canvasH)
        arr.forEach((item, index) => {
            item.move()
            if (lineDistance(item.x, item.y, mouseX, mouseY) < distance && inScreen) {
                ctx.beginPath()
                ctx.strokeStyle = '#eee'
                ctx.lineWidth = '0.2'
                ctx.moveTo(item.x, item.y)
                ctx.lineTo(mouseX, mouseY)
                ctx.closePath()
                ctx.stroke()
                item.mouse = true
            }
            for (let i = index + 1; i < arr.length; i++) {
                if (lineDistance(item.x, item.y, arr[i].x, arr[i].y) < distance) {
                    ctx.beginPath()
                    ctx.strokeStyle = '#eee'
                    ctx.lineWidth = '0.2'
                    ctx.moveTo(item.x, item.y)
                    ctx.lineTo(arr[i].x, arr[i].y)
                    ctx.closePath()
                    ctx.stroke()
                }
            }
        })
        window.requestAnimationFrame(drawPoint)
    }
    window.requestAnimationFrame(drawPoint)

})()