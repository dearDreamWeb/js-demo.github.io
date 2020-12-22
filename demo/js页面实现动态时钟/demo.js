/**********    面向对象                **************** */
function Index(dom,use24Hours){
    this.creatDiv();
    this.column = Array.from(dom);
    this.use24Hours = use24Hours;
    this.start();
}
//      创建div
Index.prototype.creatDiv = function () {

    for(var i = 0;i<6;i++){
        var oDiv ='<div>'+i+'</div>';
        $('.six').append(oDiv);
    }
    for(var i = 0;i<10;i++){
        var iDiv ='<div>'+i+'</div>';
        $('.ten').append(iDiv);
    }
  }
  //    开始
Index.prototype.start = function(){
    //  如果在定时器里直接调用this的话，this指向的是window ，在这里先将this指向index原型上，再调用再定时器里面
    var self = this;
    setInterval(function(){
        var slice = self.getClock();
        //用foreach来遍历
        self.column.forEach(function (ele,index){
            // 因为本来是数组，用parseInt()来转换
            var n = parseInt(slice[index]);
            var offset  = (n * 86)+'px';
            $(ele).css({
                "transform":'translateY(calc(50vh - '+offset+' - 43px))'
            });
            /**********        利用for循环遍历div添加class名，再用css来改变透明度   ***************** */
            for(var i = 0;i<10; i++){
                var num = (Math.abs(i-n));
                if(num==1){
                    $($(ele).children()[i]).addClass('close')
                                           .removeClass('now far')
                }else if(num < 9 && num > 1){
                    $($(ele).children()[i]).addClass('far')
                                           .removeClass('now close')
                }else if(num==0){
                    $($(ele).children()[i]).addClass('now')
                                           .removeClass('far close')
                }
            }

        });
    },1000);
}
//   获取时间   处理成六位字符
Index.prototype.getClock = function(){
    var date = new Date();
    // 用了reduce()方法
    return[this.use24Hours?date.getHours():date.getHours() % 12||12,date.getMinutes(),date.getSeconds()].reduce(function (p,n) {
       //    slice()方法是为了截取字符用的，-2是从后往前截取2位
        return p + ('0'+n).slice(-2);

      },'')
}
 new Index($('.column'),true);