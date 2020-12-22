class Clock{
    /****    speed是控制圆环的速度的         * */
    constructor(speed){
       this.canvs =  $('#myCanvas');
       this.ctx  = this.canvs[0].getContext('2d');
       this.speed = speed;
       this.time();
    };

    init(){
      //绘制矩形 填充渐变色 以及阴影
      this.ctx.strokeStyle = "#05cece";
      this.ctx.lineWidth = 17;
      this.ctx.shadowBlur =8;
      this.ctx.shadowColor = "#00ffff";
      this.graColor = this.ctx.createRadialGradient(250,250,5,250,250,300);
      this.graColor.addColorStop(0,'#03303a');
      this.graColor.addColorStop(1,'#000');
      this.ctx.fillStyle = this.graColor;
      this.ctx.fillRect(0,0,500,500);
        /**       设置文本       */
      this.ctx.font = "20px Helvetica";
    };
    
    /**      获取具体的时间            */
    getTime(){
        this.date = new Date();
        this.day = this.date.toDateString();
        this.h = this.date.getHours();
        this.m = this.date.getMinutes();
        this.s = this.date.getSeconds();
        this.ms = this.date.getMilliseconds();
        this.rs = this.s + this.ms/1000;       //让秒变成小数这样可以解决卡顿问题
        /***       小时      360/24 = 15      */
        this.ctx.beginPath();
        this.ctx.arc(250,250,200,this.deg(270),(this.deg(this.h*15-90)));
        this.ctx.stroke();

        /***   分钟    360/60=6     */
        this.ctx.beginPath();
        this.ctx.arc(250,250,150,this.deg(270),(this.deg(this.m*6-90)));
        this.ctx.stroke();

        /***   秒    360/60=6     */
        this.ctx.beginPath();
        this.ctx.arc(250,250,100,this.deg(270),(this.deg(this.rs*6-90)));  //调用deg(deg)函数
        this.ctx.stroke();

        /***     中间文本          */
        this.ctx.beginPath();
        this.ctx.fillStyle = '#0ff';
        this.ctx.fillText(this.day,170,250);

        this.ctx.beginPath();
        this.ctx.fillStyle = '#0ff';
        /******                                调用fn(hms)函数               ****** */
        this.ctx.fillText(`${this.fn(this.h)}:${this.fn(this.m)}:${this.fn(this.s)}:${this.ms}`,185,290);    
    }

    /**    把度数换成弧度       */
    deg(deg){
        this.dg = (Math.PI/180)*deg;
        return this.dg;
    }

    /***   定时器           */
    time(){
        setInterval(()=>{
            this.init();
            this.getTime();
        },this.speed);    //用bind来改变this指向
    }

    /***  时 分 秒 保留两位             */
    fn(hms){
        this.hms  = ('0' + hms).slice(-2);
        return this.hms;
    }
}
let clock = new Clock(40);
