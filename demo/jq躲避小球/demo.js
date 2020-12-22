$(function () {
    class Go {
        constructor(num,spaceTime) {
            this.num = num;
            this.spaceTime = spaceTime;
            this.wrapperW = $('.wrapper').width();
            this.wrapperH = $('.wrapper').height();
            //将wrapper分为20*20的格子
            this.perW = this.wrapperW / this.num;
            this.perH = this.wrapperH / this.num;
            this.init();
        };
        init() {
            this.createPerson();
        };
        //创建小人
        createPerson() {
            $('.wrapper').append(`<div class='person'></div>`);
            $('.person').css({
                'width': this.perW + 'px',
                'height': this.perH + 'px'
            })
            //创建键盘事件
            $(document).off('keydown').on('keydown', (e) => {
                this.movePerson(e);
                $(document).on('keyup', (e) => {
                    $(document).off('keydow')
                })
            });
            this.pro(this.spaceTime);
        }
        /**
         * 移动小人
         * 通过e.keyCode 来判断上下左右
         */
        movePerson(e) {
            //获取小人的left  和 top
            this.personL = parseInt($('.person').css('left'));
            this.personT = parseInt($('.person').css('top'));

            //左键
            if (e.keyCode == 37) {
                if (this.personL <= 0) {
                    return;
                } else {
                    $('.person').css('left', this.personL - this.perW + 'px');
                }
            } else if (e.keyCode == 38) {  //  上键
                if (this.personT <= 0) {
                    return;
                } else {
                    $('.person').css('top', this.personT - this.perH + 'px');
                }
            } else if (e.keyCode == 39) {   //  右键
                if (this.personL >= this.wrapperW - this.perW) {
                    return;
                } else {
                    $('.person').css('left', this.personL + this.perW + 'px');
                }
            } else if (e.keyCode == 40) { //  下键
                if (this.personT >= this.wrapperH - this.perH) {
                    return;
                } else {
                    $('.person').css('top', this.personT + this.perH + 'px');
                }
            }

        }
        /**
         * 创建障碍物
         */
        modle(speed) {
            this.flag = true;// 设置一个flag 防止事件多少次触发
            let self = this;
            $(`<div class='ai'></div>`).clone().appendTo('.wrapper').css({
                'width': this.perW + 'px',
                'height': this.perH + 'px',
                'left': Math.floor(Math.random() * this.num) * this.perW + 'px',
                'top': '0px'
            }).animate({
                'top': this.wrapperH - this.perH + 'px',
            }, speed, function () {
                if (self.flag) {
                    /** 当小球下落的时候触碰到了红球，结束游戏 */
                    if ($(this).css('left') == $('.person').css('left')) {
                        self.flag = false;
                        clearInterval(self.timer1);
                        clearInterval(self.timer);
                        alert('游戏结束，得分：' + self.timerStop + '秒');
                        $('.ai').remove();
                    }
                    $(this).remove();
                }
            });

        }
        pro(spaceTime) {
            //游戏计时开始
            this.timerStop = 0;
            this.timer1 = setInterval(() => {
                this.timerStop++;
            }, 1000)
            //游戏开始
            this.timer = setInterval(() => {
                let speed = Math.random() * 500 + 300;
                this.modle(speed);
            }, this.spaceTime);
        }

    }
    new Go(10,300);//第一个参数代表着几乘几的格子，第二个参数代表多少毫秒生成一个下落的障碍物

})