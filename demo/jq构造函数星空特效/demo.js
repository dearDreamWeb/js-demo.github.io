$(function(){
    class Stars{
        constructor(){
            // 获取浏览器的长和宽
            this.dl = $(document).width();
            this.dw = $(document).height();
            this.show();
        }
        show(){
            // 生成200个星星 随机位置，随机大小
            for(let i = 0;i<200; i++){
                this.spanL = Math.random()*this.dl;
                this.spanT = Math.random()*this.dw;
                this.scale = Math.random()*1.5;
                this.span = $('<span></span>');
                $(this.span).appendTo('.wrapper').css({
                    position:'absolute',
                    left:this.spanL,
                    top:this.spanT,
                    width:'2rem',
                    height:'2rem',
                    backgroundImage:`url('./images/star.png')`,
                    backgroundSize:'100% 100%',
                    transform:`scale(${this.scale})`,
                    zIndex:'0',
                })
            }
            this.timer();
        }

       timer(){
           // 设置闪烁时间随机
        setInterval(()=>{
            $('.wrapper span').each((index)=>{
                this.delay = Math.random()*1000 + 500;
                $('.wrapper span').eq(index).fadeOut(this.delay).fadeIn(this.delay);
            })
        }, 100);  
       } 
        
    }

  new Stars();

})