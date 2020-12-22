(function () {
    class Canvas {
        constructor() {
            this.myCanvas = document.querySelector("#canvas");
            this.ctx = this.myCanvas.getContext("2d");
            // 获取屏幕的宽高并赋值给canvas的宽高
            this.canvasW = window.innerWidth;
            this.canvasH = window.innerHeight;
            this.myCanvas.width = this.canvasW;
            this.myCanvas.height = this.canvasH;
            this.ctx.fillRect(0, 0, this.canvasW, this.canvasH);
            this.init();
        }
        init() {
            this.randomConfig();
            this.animationMove();
        }

        /**
         * 获取随机的配置
         */
        randomConfig() {
            this.x = this.randomValue(20, this.canvasW);
            this.y = this.randomValue(0, 20);
            this.r = 0; //圆的半径 
            this.maxR = this.randomValue(5, 20); // 圆的透明度开始减少的最大随机半径
            this.t = 1; // 圆的不透明度
            this.waterSpeed = this.randomValue(3, 7); //雨滴下落的速度
            this.waterW = this.randomValue(3, 3.5); // 雨滴的宽度
            this.waterH = this.randomValue(3, 5); // 雨滴的长度
            this.overLine = this.randomValue(this.canvasH * 0.8, this.canvasH * 0.9); // 雨滴结束的位置


        }

        /**
         * 雨滴形状
         */
        drawWater() {
            let r = this.randomValue(0, 255);
            let g = this.randomValue(0, 255);
            let b = this.randomValue(0, 255);
            this.ctx.fillStyle = `rgb(${r},${g},${b})`;
            this.ctx.fillRect(this.x, this.y, this.waterW, this.waterH);
        }

        /**
        * 圆形状
        */
        drawCircle() {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(0,255,255,${this.t})`
            this.ctx.closePath();
            this.ctx.stroke();
        }

        /**
         * 动画开始
         */
        animationMove() {
            // 当this.y没有到结束位置时，this.y继续增加
            // 当this.y 到了结束位置时，this.y停止增加并且园开始出现，圆扩散
            // 圆扩散结束时，重新调用init，无限死循环
            if (this.y > this.overLine) {
                this.r++;
                if (this.t > 0.03) {
                    if (this.r > this.maxR) {
                        this.t *= 0.96;
                    }
                    this.drawCircle();
                } else {
                    this.init();
                    return;
                }

            } else {
                this.y += this.waterSpeed;
                this.drawWater();
            }

        }

        // 随机值
        randomValue(min, max) {
            return Math.random() * (max - min) + min;
        }


    }

    /**
     * 继承类Canvas 来让遍历雨滴
     */
    class Move extends Canvas {
        constructor(count) {
            super();
            this.arr = [];
            this.count = count;
            for (let i = 0; i < this.count; i++) {
                let canvasWater = new Canvas();
                this.arr.push(canvasWater);
            }
            this.rain()

        }

        /**
         * 存放的所有雨滴一起运行
         */
        rain() {
            this.ctx.fillStyle = "rgba(0,0,0,0.15)"
            this.ctx.fillRect(0, 0, this.canvasW, this.canvasH);
            this.arr.forEach(item => {
                item.animationMove();
            })
            window.requestAnimationFrame(this.rain.bind(this));
        }


    }

    //  参数代表雨滴的数量
    new Move(50);
}())