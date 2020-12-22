$(function () {
    /**
     * 创造怪物
     * 并且设置移动
     */
    class Mon {
        constructor(num, minSpeedMonster, maxSpeedMonster) {
            this.num = num; //把人物和怪兽分成 1/num 的宽和高
            this.minSpeedMonster = minSpeedMonster; //怪物的最小速度
            this.maxSpeedMonster = maxSpeedMonster;//怪物的最大速度
            //游戏范围的宽和高
            this.wrapperW = $('.wrapper').width();
            this.wrapperH = $('.wrapper').height();
            //英雄和怪物的宽和高 1/num  按整体宽度和高度计算，保证是个正方形，为了美观
            this.perW = this.wrapperW / 20 * this.num;
            this.perH = this.wrapperH / 20 * this.num;
            this.moveMonster();
        }

        /**      ***********************************************          */
        /**
         * 根据给定的最大值和最小值来取二者之间随机数
         */
        getRandom(min, max) {
            return Math.random() * (max - min) + min;
        }
        //创建怪物
        createMonster() {
            this.xSpeedMonster = this.getRandom(this.minSpeedMonster, this.maxSpeedMonster);//怪物的左右移动速度随机值
            this.ySpeedMonster = this.getRandom(this.minSpeedMonster, this.maxSpeedMonster);//怪物的上下移动速度随机值
            this.monster = $(`<div class = 'monster'></div>`);
            $(this.monster).appendTo($('.wrapper'));
            $(this.monster).css({
                position: 'absolute',
                //让英雄初始化在中间
                left: 0,
                top: 0,
                width: this.perW,
                height: this.perH,
                background: `url('./images/monster.png')`,
                backgroundSize: '100% 100%'
            })

        }
        //怪物移动
        monsterMove() {

            //获取怪物现在的left和top值
            let nowLeft = parseInt($(this.monster).css('left'));
            let nowTop = parseInt($(this.monster).css('top'));
            /*
             * 当怪物要超出游戏范围时候停止移动
             * 并且反向移动
             */
            if (nowLeft > this.wrapperW - this.perW) {
                nowLeft = this.wrapperW - this.perW;
                this.xSpeedMonster = -this.xSpeedMonster;
            } else if (nowLeft < 0) {
                nowLeft = 0;
                this.xSpeedMonster = -this.xSpeedMonster;
            }
            if (nowTop > this.wrapperH - this.perH) {
                nowTop = this.wrapperH - this.perH;
                this.ySpeedMonster = -this.ySpeedMonster;
            } else if (nowTop < 0) {
                nowTop = 0;
                this.ySpeedMonster = -this.ySpeedMonster;
            }
            //获取要移动到目的地的left和top
            nowLeft += this.xSpeedMonster;
            nowTop += this.ySpeedMonster;
            $(this.monster).css('left', nowLeft);
            $(this.monster).css('top', nowTop);
        }
        moveMonster() {
            this.timer = setInterval(() => {
                this.monsterMove();
            }, 16)
        }

    }

    /********************************************************************************** */

    /**
     * 创造英雄
     * 并且设置移动
     */
    class Hero {
        constructor(num, lastSpeed) {
            this.num = num; //把人物和怪兽分成 1/num 的宽和高
            this.lastSpeed = lastSpeed;//选择英雄的移动速度
            //游戏范围的宽和高
            this.wrapperW = $('.wrapper').width();
            this.wrapperH = $('.wrapper').height();
            //英雄和怪物的宽和高 1/num  按整体宽度和高度计算，保证是个正方形，为了美观
            this.perW = this.wrapperW / 20 * this.num;
            this.perH = this.wrapperH / 20 * this.num;
            this.init();
        }
        init() {
            this.createHero();
            this.addEvent(this.lastSpeed);
            this.moveHero();
        }
        /**
         * 创建一个英雄
         */
        createHero() {
            //创建并插入游戏里面
            this.hero = $(`<div id = 'hero'></div>`);
            this.xSpeedHero = 0;//控制英雄的左右的速度
            this.ySpeedHero = 0;//控制英雄的上下的速度
            $('.wrapper').append(this.hero);
            $(this.hero).css({
                position: 'absolute',
                //让英雄初始化在中间
                left: this.wrapperW / 2 - this.perW / 2,
                top: this.wrapperH / 2 - this.perH / 2,
                width: this.perW,
                height: this.perH,
                background: `url('./images/hero.png')`,
                backgroundSize: '100% 100%'
            })
        }
        //手机端移动英雄

        movePhone() {
            $(this.hero).on('touchstart', (e) => {
                e = e || window.event;
                let startX = e.clientX - parseInt($(this.hero).css('left'));
                let startY = e.clientY - parseInt($(this.hero).css('top'));
                $(this.hero).on('touchmove', (e) => {
                    let endX = e.clientX;
                    let endY = e.clientY;
                    let distanceX = endX - startX;
                    let distanceY = endY - startY;
                    $(this.hero).css({
                        left: distanceX,
                        top: distanceY
                    })
                }).on('touchend', (e) => {
                    // $(this.hero).off('touchstart');
                    $(this.hero).off('touchmove');
                })
            })
        }
        //移动
        move() {
            //获取英雄现在的left和top值
            let nowLeft = parseInt($(this.hero).css('left'));
            let nowTop = parseInt($(this.hero).css('top'));
            //当英雄要超出游戏范围时候停止移动
            if (nowLeft > this.wrapperW - this.perW) {
                nowLeft = this.wrapperW - this.perW;
            } else if (nowLeft < 0) {
                nowLeft = 0;
            }
            if (nowTop > this.wrapperH - this.perH) {
                nowTop = this.wrapperH - this.perH;
            } else if (nowTop < 0) {
                nowTop = 0;
            }
            //获取要移动到目的地的left和top
            nowLeft += this.xSpeedHero;
            nowTop += this.ySpeedHero;
            $(this.hero).css('left', nowLeft);
            $(this.hero).css('top', nowTop);
        }
        /**
         * 添加键盘事件           
         *上下左右来控制英雄移动
         */
        addEvent(lastSpeed) {
            /**
             * 解决按上键不松的时候再按下键英雄往下走的bug
             * arr数组里面放入四个true    例如当按上键的时候把下键变成false，让下键不能使用
             */
            let arr = [true, true, true, true];//数组里面四项按顺序分别代表[上,下,左,右]
            $(window).off('keydown').on('keydown', (e) => {

                if (e.key == 'ArrowUp') {
                    e.preventDefault();//阻止默认事件，防止浏览器滚动条滚动
                    if (arr[0]) {
                        arr[1] = false;
                        this.ySpeedHero = -lastSpeed;
                    }
                } else if (e.key == 'ArrowDown') {
                    e.preventDefault();//阻止默认事件，防止浏览器滚动条滚动
                    if (arr[1]) {
                        arr[0] = false;
                        this.ySpeedHero = lastSpeed;
                    }
                } else if (e.key == 'ArrowLeft') {
                    e.preventDefault();//阻止默认事件，防止浏览器滚动条滚动
                    if (arr[2]) {
                        arr[3] = false;
                        this.xSpeedHero = -lastSpeed;
                    }
                } else if (e.key == 'ArrowRight') {
                    e.preventDefault();//阻止默认事件，防止浏览器滚动条滚动
                    if (arr[3]) {
                        arr[2] = false;
                        this.xSpeedHero = lastSpeed;
                    }
                }
            }).on('keyup', (e) => {

                if (e.key == 'ArrowUp') {
                    if (arr[0]) {
                        this.ySpeedHero = 0;
                        arr[1] = true;
                    }
                } else if (e.key == 'ArrowDown') {
                    if (arr[1]) {
                        this.ySpeedHero = 0;
                        arr[0] = true;
                    }
                } else if (e.key == 'ArrowLeft') {
                    if (arr[2]) {
                        this.xSpeedHero = 0;
                        arr[3] = true;
                    }
                } else if (e.key == 'ArrowRight') {
                    if (arr[3]) {
                        this.xSpeedHero = 0;
                        arr[2] = true;
                    }
                }
            })

        }
        //设置英雄移动
        moveHero() {
            setInterval(() => {
                this.move();
                this.movePhone();
            }, 16)
        }
    }
    // new Hero(10, 3);

    /********************************************************************************** */
    /**
     * 判定游戏是否结束，并且计时
     */
    class OverGame {
        constructor(monsterSize, minSpeedMonster, maxSpeedMonster, createMonsterTime, num, monsterTotal) {
            this.monsterSize = monsterSize;//这设怪物的大小，和英雄大小同理
            this.minSpeedMonster = minSpeedMonster; //怪物的最小速度
            this.maxSpeedMonster = maxSpeedMonster;//怪物的最大速度
            this.num = num;//允许的误差范围
            this.monsterTotal = monsterTotal; //生成怪物的总数
            this.createMonsterTime = createMonsterTime * 1000;//生成怪物的时间间隔，单位：毫秒
            this.hero = $('#hero');
            this.gameTime()
            this.refresh();
        }
        /**
         * div碰撞结束游戏
        * 两个div水平中心点之差小于两个div的宽度之和的1/2 ，
        * 两个div垂直中心点之差小于两个div的高度之和的1/2  说明两个div相交
        */
        over(monster) {
            let heroContentX = parseInt($(this.hero).css('left')) + $(this.hero).width() / 2;
            let heroContentY = parseInt($(this.hero).css('top')) + $(this.hero).height() / 2;
            let monsterContentX = parseInt(monster.css('left')) + monster.width() / 2;
            let monsterContentY = parseInt(monster.css('top')) + monster.height() / 2;
            // let num = 30;  //  允许的误差范围
            if (Math.abs(heroContentX - monsterContentX) < ($(this.hero).width() + monster.width()) / 2 - this.num &&
                Math.abs(heroContentY - monsterContentY) < ($(this.hero).height() + monster.height()) / 2 - this.num
            ) {
                // 结束游戏   清除 定时器、英雄和怪物
                clearInterval(this.timer);
                clearInterval(this.overTime);
                clearInterval(this.timeMonsters);
                setTimeout(() => {
                    alert(`游戏结束 \n ${this.lastMinute}:${this.lastSecond}:${this.lastMilliSecond}`);
                    $('#hero').remove();
                    $('.monster').remove();
                    // 结束游戏 提示出现 计时消失
                    $('#gameTime').html("").css({ display: "none" });
                    $(".tips").css({ display: "flex" });
                }, 10)

            }
        }
        /**
         * 游戏计时
         */
        gameTime() {
            $('#gameTime').css({
                display:"block",
                width: $('.wrapper').width(),
                height: '3rem',
                lineHeight: '3rem',
                textAlign: 'center',
                fontSize: '2rem'
            });
            this.milliSecond = 0; //毫秒
            this.second = 0;//秒
            this.minute = 0;//分钟
            //开启计时定时器
            this.overTime = setInterval(() => {
                this.milliSecond++;
                if (this.milliSecond > 99) {
                    this.milliSecond = 0;
                    this.second++;
                    if (this.second > 59) {
                        this.second = 0;
                        this.minute++;
                    }

                }
                /**
                 * 结束时间
                 * 用padStart来向字符串前加位数凑够两位
                 */
                this.lastMilliSecond = String(this.milliSecond).padStart(2, '0');
                this.lastSecond = String(this.second).padStart(2, '0');
                this.lastMinute = String(this.minute).padStart(2, '0');
                $('#gameTime').text(`${this.lastMinute}:${this.lastSecond}:${this.lastMilliSecond}`);
            }, 10)
        }
        //定时器刷新坐标点 
        refresh() {
            let self = this;
            let monsterNum = 0;//生成怪物的总数
            /** 定时生成怪物    */
            this.timeMonsters = setInterval(() => {
                monsterNum++;
                new Mon(this.monsterSize, this.minSpeedMonster, this.maxSpeedMonster).createMonster();
                //控制生成的怪物数量
                if (monsterNum >= this.monsterTotal) {
                    clearInterval(this.timeMonsters);
                }
            }, this.createMonsterTime);
            //启动定时器
            this.timer = setInterval(() => {
                // 遍历每一只怪物，并且移动它们
                $('.monster').each(function () {
                    self.over($(this));
                })
            }, 16)
        }
    }
    /********************************************************* */
    /**
     * 界面出现设置选项
     */
    class Options {
        constructor() {
            //设置界面的宽和高
            this.optionsW = $('.options').width();
            this.optionsH = $('.options').height();
            //游戏范围的left和top
            this.wrapperL = parseInt($('.wrapper').css('marginLeft'));
            this.wrapperT = parseInt($('.wrapper').css('top'));

            this.init();
        }
        init() {
            this.createOptions();
        }
        createOptions() {
            //点击开始游戏
            $('#start').on('click', this.think);
        }
        /**
         * 做足判断
         */
        think() {
            let arr = [];
            let correct = 0;//看正确输入的input个数
            let flag = false;
            let reg = /^([1-9]|(10))$/;// 正则1到10之间的数
            let reg1 = /^([0-9]|([1-9][0-9]))$/; //正则0到99之间的数
            let reg2 = /^([1-5])$/; //正则1到5之间的数
            let objIndex = 0; // 计算obj 
            let obj = {
                heroSize: 0,   //英雄大小
                monsterSize: 0,//怪物大小
                heroSpeed: 0,  //英雄速度
                minSpeed: 0,   //怪物最小速度
                maxSpeed: 0,   //怪物最大速度
                time: 0,       //生成怪物时间间隔
                error: 0,      //怪物和英雄碰撞误差
                count: 0      //怪物总数
            };
            // 遍历每一input，并且通过正则等判断 显示错误或者正确
            $('ul li input').each(function (index) {
                if (index == 0 || index == 1) {
                    if ($(this).val() == '' || !reg2.test($(this).val())) {
                        $(this).css('borderColor', '#f40');
                        flag = false;
                    } else {
                        correct++;
                        $(this).css('borderColor', '#3bea5a');
                        arr.push($(this).val());
                    }
                } else if (index == 6) {
                    if ($(this).val() == '' || !reg1.test($(this).val())) {
                        $(this).css('borderColor', '#f40');
                        flag = false;
                    } else {
                        correct++;
                        $(this).css('borderColor', '#3bea5a');
                        arr.push($(this).val());
                    }
                } else {
                    //当不输入任何数字或者不是1到10之间的数时提醒 
                    if ($(this).val() == '' || !reg.test($(this).val())) {
                        $(this).css('borderColor', '#f40');
                        flag = false;
                    } else {
                        correct++;
                        arr.push($(this).val());
                        $(this).css('borderColor', '#3bea5a');
                    }
                }

            })
            //当correct值等于$('ul li input').length代表input值都正确
            if (correct == $('ul li input').length) {
                // 开始游戏 提示消失
                $(".tips").css({ display: "none" });
                flag = true;
                if (flag) {
                    // 利用for in 循环来遍历obj，再用objIndex值给obj对象赋值
                    for (let key in obj) {
                        obj[key] = parseInt(arr[objIndex]);
                        objIndex++;
                    }
                    /**
                     * 赋值正式开始
                     * 
                     */
                    new Hero(obj.heroSize, obj.heroSpeed);
                    new OverGame(obj.monsterSize, obj.minSpeed, obj.maxSpeed, obj.time, obj.error, obj.count);
                    /**
                     * 第一个参数：英雄的大小   
                     * 第二个参数：英雄的速度  单位：像素/16毫秒
                     */
                    // new Hero(10, 3)
                    /**
                     * 第一个参数：怪物的大小  
                     * 第二个参数：怪物的最小速度   单位：像素/16毫秒  
                     * 第三个参数：怪物的最大速度   单位：像素/16毫秒
                     * 第四个参数：生成怪物的时间间隔，单位：秒
                     * 第五个参数：允许怪物和英雄碰撞的误差范围 单位：像素 （ 如果把英雄和怪物都调小的话，该参数一定要调一下，
                     * 英雄和怪物调大了，该值也要调大 ；英雄和怪物调小了，该值也要调小 ）
                     * 第六个参数：生成怪物的总数
                     */
                    // new OverGame(10, 3, 5, 1000, 30, 8);
                }
            } else {
                alert('请输出正确的数字');
            }
        }
    }
    new Options()
    /**
     * 第一个参数：英雄的大小   
     * 第二个参数：英雄的速度  单位：像素/16毫秒
     */
    // new Hero(10, 3)
    /**
     * 第一个参数：怪物的大小  
     * 第二个参数：怪物的最小速度   单位：像素/16毫秒  
     * 第三个参数：怪物的最大速度   单位：像素/16毫秒
     * 第四个参数：生成怪物的时间间隔，单位：秒
     * 第五个参数：允许怪物和英雄碰撞的误差范围 单位：像素 （ 如果把英雄和怪物都调小的话，该参数一定要调一下，
     * 英雄和怪物调大了，该值也要调大 ；英雄和怪物调小了，该值也要调小 ）
     * 第六个参数：生成怪物的总数
     */
    // new OverGame(10, 3, 5, 1000, 30, 8);
})