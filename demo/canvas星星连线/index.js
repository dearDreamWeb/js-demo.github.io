(function () {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    let canvasW = canvas.width;
    let canvasH = canvas.height;
    const distance = 50; // 两个小球连线的距离
    let mouseX = 0;
    let mouseY = 0;

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
            if (this.x <= 0 || this.x >= canvasW) {
                this.xSpeed *= -1;
            }
            if (this.y <= 0 || this.y >= canvasH) {
                this.ySpeed *= -1;
            }

            this.x += this.xSpeed;
            this.y += this.ySpeed;
            // if (this.mouse) {
            //     if (Math.abs(this.x - mouseX) >= distance && Math.abs(this.y - mouseY) >= distance) {
            //         const ratex = Math.abs(distance - Math.abs(this.x - mouseX)) / Math.abs(this.xSpeed);
            //         if (mouseX > this.x) {
            //             this.x -= this.xSpeed * ratex
            //         } else {
            //             this.x += this.xSpeed * ratex
            //         }
            //         this.mouse = false
 
            //         const rate = Math.abs(distance - Math.abs(this.y - mouseY)) / Math.abs(this.ySpeed);
            //         if (mouseY > this.Y) {
            //             this.y += this.ySpeed * rate
            //         } else {
            //             this.y -= this.ySpeed * rate
            //         }
            //         this.mouse = false
            //     }

            // } else {
            //     this.x += this.xSpeed;
            //     this.y += this.ySpeed;
            // }
        }
    }

    let arr = []
    for (let i = 0; i < 20; i++) {
        const x = Math.floor(Math.random() * canvasW);
        const y = Math.floor(Math.random() * canvasH);
        const point = new Point(x, y, 3, -1, 1)
        arr.push(point)
    }

    /**
     * 遍历小球
     */
    function drawPoint() {
        ctx.clearRect(0, 0, canvasW, canvasH)
        arr.forEach((item, index) => {
            item.move()
            if (Math.abs(item.x - mouseX) < distance && Math.abs(item.y - mouseY) < distance) {
                ctx.beginPath()
                ctx.strokeStyle = '#fff'
                ctx.moveTo(item.x, item.y)
                ctx.lineTo(mouseX, mouseY)
                ctx.closePath()
                ctx.stroke()
                item.mouse = true
            }
            for (let i = index + 1; i < arr.length; i++) {
                if (Math.abs(item.x - arr[i].x) < distance && Math.abs(item.y - arr[i].y) < distance) {
                    ctx.beginPath()
                    ctx.strokeStyle = '#fff'
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