(function () {
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    let windowW = 800;
    let windowH = 600;
    // let windowW = window.innerWidth;
    // let windowH = window.innerHeight;
    // canvas.style.width = windowW + 'px';
    // canvas.style.height = windowH + 'px';

    // 实时canvas画布的宽和高
    // window.addEventListener('resize', () => {
    //     windowW = window.innerWidth;
    //     windowH = window.innerHeight;
    //     canvas.style.width = windowW + 'px';
    //     canvas.style.height = windowH + 'px';
    // }, false)

    /**
     * 小圆点
     * x x坐标
     * y y坐标
     * r 半径
     * s 速度
     */
    class Point {
        constructor(x, y, r, minSpeed, maxSpeed) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.xSpeed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1) + minSpeed) === 0 ? 1 : Math.floor(Math.random() * (maxSpeed - minSpeed + 1) + minSpeed);;
            this.ySpeed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1) + minSpeed) === 0 ? 1 : Math.floor(Math.random() * (maxSpeed - minSpeed + 1) + minSpeed);;
            this.draw()
            window.requestAnimationFrame(this.move.bind(this))
        }
        draw() {
            ctx.beginPath()
            ctx.fillStyle = '#fff'
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
            ctx.fill()
        }
        move() {
            if (this.x <= 0 || this.x >= windowW) {
                this.xSpeed *= -1;
            }
            if (this.y <= 0 || this.y >= windowH) {
                this.ySpeed *= -1;
            }
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            this.draw()
            window.requestAnimationFrame(this.move.bind(this))
        }
    }
    const x = Math.floor(Math.random() * windowW);
    const y = Math.floor(Math.random() * windowH);
    new Point(x, y, 3, -3,3)
})()