(function(){
    class Demo{
        constructor(date){
            this.endDate = date;
            this.second = parseInt(this.endDate / 1000) % 60;//秒
            this.minute = parseInt(this.endDate / 1000 / 60) % 60;//分
            this.hour = parseInt(this.endDate / 1000 / 60/ 60) % 24;//时
            this.day =  parseInt(this.endDate / 1000 / 60/ 60/ 24) % 24;//天
            this.obj = {
                李华:'14758288465',
                韩梅梅:'13633814571',
                康康:'15744466858',
                迈克尔:'1776658243',
                王峻熙:'17542614881',
                严正明:'18596445244',
                范海霞:'14452258930',
                刘晓芒:'19656932001',
                杨煜祺:'15789994478',
                孙正豪:'16330089474',
                吴昊然:'16933333588',
                郭志泽:'12458957896',
                杨弘文:'13895456587',
                靳烨伟:'13966946587',
                马苑博:'14752633645',
                张鹏涛:'19756523020',
                叶红艳:'13864599400',
                孙荣:'13655988745',
            }
            this.arr = [];
            this.arr1 = [];
            this.init();
        }
        init(){
            this.curHead();
            this.star();
        }
        curHead(){
            //   用字符串0来拼接 截取天分秒时后两位，保证是两位
            this.second = ('0'+this.second).slice(-2);
            this.minute = ('0'+this.minute).slice(-2);
            this.hour = ('0'+this.hour).slice(-2);
            this.day = ('0'+this.day).slice(-2);
            /****    插入上面div文字并设置样式        * */
            $('.head').html(`<p>距离抽奖还有:${this.day}天${this.hour}时${this.minute}分${this.second}秒</p>`);
            $('.head p').css({
                fontSize:'3rem',
                textAlign:'center',
                lineHeight:'6rem',
            })
        }
        // 开始倒计时抽奖
        star(){
            this.timer = setInterval(()=>{
                this.curHead();
                //倒计时
                this.second --;
                if(this.second < 0 ){
                    this.minute --;
                    this.second = 59;
                    if(this.minute < 0){
                        this.hour --;
                        this.minute = 59;
                        if(this.hour < 0){
                            this.day -- ;
                            this.hour =24;
                            //当倒计时结束时停止定时器 并 改变内容
                            if(this.second == this.minute == this.hour == this.day == 0 ){
                                clearInterval(this.timer);
                                $('.head p').text('抽奖进行中。。。').css('color','red');
                                /***    启动抽奖程序                         */
                                this.run();
                            }
                        }
                    }
                }
            },1000)
        }
        run(){
            let self = this;
            let num = 0;
            let num1 = 0;
            // 用$.each()来遍历出对象的属性和属性值
            $.each(this.obj,function(key,val){
                self.arr.push(val);
                self.arr1.push(key);
            });
            // 用定时器来显示中奖名单
            clearInterval(this.interval);
            this.interval =setInterval(()=>{
                num++;
                let index = Math.floor(Math.random()*this.arr.length);
                $('.act p').eq(1).html(`姓名${this.arr1[index]}`);
                $('.act p').eq(2).html(`电话${this.arr[index]}`);
                if(num ==10){
                    num = 0;
                    num1++;     
                    $(`<li>${self.arr1[index]}${self.arr[index]}</li>`).appendTo('.name ul');
                    $('.name ul li').css({
                        fontSize:'2rem',
                        margin: '1.5rem auto'
                    });  
                    /**      使用splice方法来删除中奖的名字和电话   防止名字重复被抽中   
                     splice(index,howmany)：index：删除属性的开始位置，howmany：删除的数量 */
                    this.arr1.splice(index,1);
                    this.arr.splice(index,1); 
                    // console.log(this.arr)
                    if(num1==10){
                        clearInterval(this.interval);
                    }
                }
            },100)
        }
    }

    new Demo(5000);

})()