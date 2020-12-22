$(function () {
    var num = 0,
        timer;
        timer=setInterval(function(){
            var $full = $(".full")[0];
            var $loading = $(".loading")[0];
            var $face = $("#face")[0];
            var $word = $(".word")[0];
            num++;
            $($full).css("width",num+"%");
            // if(num==80){
            //     $($face).css({
            //         "transform":"rotateY(180deg)",
            //         "transition":"0.2s"
            //          });
            // }else
             if(num==100){
                clearInterval(timer);
                setTimeout(function(){
                    $($word).html("<h1>CSS3<h1><h2>loading动画：加载页面<h2>")
                },3000);
                /*****************          fadeout淡出的效果     **************** */
                    // setTimeout(function(){

                    // },0);     
                    $($loading).fadeOut(500); 
        }
        },50);
})