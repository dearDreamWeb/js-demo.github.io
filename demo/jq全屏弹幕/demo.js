$(function () {
    class Fly {
        constructor() {
            this.main = $('#main');
            this.text = $('#text');
            this.send = $('#send');
            this.main = $('#main');
            this.mainW = parseInt($(this.main).css('width'));
            this.mainH = parseInt($(this.main).css('height'));
            this.init();
        };
        init() {
            this.sumbit();
        };
        sumbit() {
            $(document).on('keydown', (e) => {
                e = e || window.event;
                if(e.keyCode == 13){
                    this.span = $('<span></span>');
                    //用正则表达式写是否全部是空格   /^\s+$/gi.test()
                    if ($(this.text).val() == '' || /^\s+$/gi.test($(this.text).val())) {
                        alert('请输入内容');
                    } else {

                        this.spanStyle();
                        $(this.text).val('');
                    }
                }

            });
            $(this.send).on('click', () => {
                this.span = $('<span></span>');
                //用正则表达式写是否全部是空格   /^\s+$/gi.test()
                if ($(this.text).val() == '' || /^\s+$/gi.test($(this.text).val())) {
                    alert('请输入内容');
                } else {

                    this.spanStyle();
                    $(this.text).val('');
                }
            });

        }
        check() {

        }
        //添加span和设置基本样式，建立一些东西的随机值
        spanStyle() {
            this.post = Math.floor(Math.random() * (this.mainH - 32));
            this.size = Math.floor(Math.random() * 16 + 16);
            this.speed = Math.floor(Math.random() * 2000 + 4000);
            this.colorR = Math.floor(Math.random() * 255);
            this.colorG = Math.floor(Math.random() * 255);
            this.colorB = Math.floor(Math.random() * 255);
            $(this.main).append(this.span);
            $(this.span).append($(this.text).val()).css({
                position: 'absolute',
                marginLeft: this.mainW,
                color: `rgb(${this.colorR},${this.colorG},${this.colorB})`,
                fontSize: this.size,
                top: this.post,
                whiteSpace: 'nowrap'
            });
            // this.timer = setInterval(this.fly,this.speed);
            this.fly();
        };
        //用jq中的animate动画实现弹幕移动
        fly() {
            this.spanW = parseInt($(this.span).css('width'));
            $(this.span).animate({
                marginLeft: -(this.spanW + 15)
            }, this.speed, function () {
                //移动完成后，消除该弹幕
                $(this).remove();
            })
        }
    }
    new Fly();
})