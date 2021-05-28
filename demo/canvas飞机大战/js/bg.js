class GameBg {
    constructor() {
        this.bgCanvas = document.querySelector('#bgCanvas');
        this.ctx = this.bgCanvas.getContext('2d');
        this.width = this.bgCanvas.width;
        this.height = this.bgCanvas.height;
        this.bgOffsetHeight = 0;   // 偏移量
        this.speed = 1;         // 速度
        this.imageUrl = './assets/image/background.png';
        this.audioBgUrl = './assets/sound/game_music.mp3';
        this.imageH = 852;    // 图片的高度
        this.image = new Image();
        this.bgAduio = new Audio(this.audioBgUrl);
        this.init();
    }
    init() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.image.src = this.imageUrl;
        // 加载图片
        this.image.onload = () => {
            this.ctx.drawImage(this.image, 0, 0);
            this.ctx.drawImage(this.image, 0, -this.imageH);
        }

        // 背景音乐设置
        this.bgAduio.loop = true;
        // audio.play();

        this.move();
    }
    move() {
        this.ctx.save()
        this.ctx.translate(0, this.bgOffsetHeight);
        this.ctx.drawImage(this.image, 0, 0);
        this.ctx.drawImage(this.image, 0, -this.imageH);
        this.bgOffsetHeight += this.speed;
        this.ctx.restore();
        if (this.bgOffsetHeight >= this.imageH) {
            this.bgOffsetHeight = 0;
        }
        requestAnimationFrame(this.move.bind(this))
    }
}

let gameBg = new GameBg();

export default gameBg;