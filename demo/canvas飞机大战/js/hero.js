class Hero {
    constructor() {
        this.canvas = document.querySelector('#heroCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 100;
        this.height = 122;
        this.count = 0;
        this.imageHero1Url = './assets/image/hero1.png'
        this.imageHero2Url = './assets/image/hero2.png'
        this.image = new Image();
        this.init();
    }
    init() {
        this.image.src = this.imageHero1Url;
        this.image.onload = () => {
            this.ctx.drawImage(this.image, this.canvas.width / 2 - this.width / 2, this.canvas.height - this.height / 2, this.width / 2, this.height / 2)
        }
        setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.save();
            if (this.count % 2 === 0) {
                this.image.src = this.imageHero1Url;
            } else {
                this.image.src = this.imageHero2Url;
            }
            this.ctx.restore();
            this.count++;
        }, 100)
    }
}

let hero = new Hero();

export default hero;