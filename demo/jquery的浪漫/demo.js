star();
function star() {
  starTop();
  creatLi();
  bottom();
  snow();
}
function starTop() {
  var topW = $(".top").width();
  var spanW = $(".top span").width();
        $(".top span").animate({
            left: topW - spanW + "px"
        },5000,function(){
            $(this).animate({
                left:  "0px"
                },5000)
                setTimeout(starTop, 1000);// setTimeout()在此次可以实现animate循环，setInterval()能实现,但是会有延迟
        });
    }
function creatLi(){
    liMove();
/********    遍历出li         ********* */
   var ul =  $("<ul></ul>").appendTo($(".box"));
   for(var i = 0;i<6;i++){
       $("<li></li>").appendTo(ul);
   };
   /*******     用each来遍历背景图片    ****** */
   $("ul li").each(function(i){
       $(this).css({
           "background":"url('./images/"+(i+1)+".png')"+"100%/100%"+"no-repeat"
       })
   });
/*******        让整个ul旋转起来                **** */
   function liMove(){
       var speed = 0;
       var ulSpeed = 0;
       setInterval(function(){
           ulSpeed++;
           /***      让li整体散开        ****** */
           speed=360/$("ul li").length;
           $("ul li").each(function(i){
            $(this).css({
                "transform":"rotateY("+speed*i+"deg)"+"translateZ(300px)"
           })
        })
        /********              让ul自身沿y轴旋转         **** */
        $("ul").css({
            "transform":"rotateY("+ulSpeed+"deg)"
        })
       },50)
          
   }
}
/****    利用slice来截取字符串来实现逐个出现         ** */
function bottom(){
    var foot = $(".foot");
    var str = " 弱水三千，只取一瓢；花开满园，只摘一朵；红颜无数，只恋一个。你的笑容，是我一生的美丽。我不奢不贪，只愿守候你幸福到底。";
    var i = 1;
    var timer = setInterval(function(){
        $(foot).text(str.slice(0,i));
        i++;
        if(i>str.length){
            clearInterval(timer);
        }
    },100)
}
/***   雪花的特效           ** */
function snow(){
    var flak = $("<div>❉</div>").css({"position":"absolute","top":"0"});
    var minSize = 5;
    var maxSize = 50;
    var dh = $(window).height();
    var dw = $(window).width();
    var snowTime = 100;//雪花生成的时间间隔
    var flakColor = "#fff";
    setInterval(function(){
        var snowSize = minSize +Math.random()*maxSize;
        var stopTop = dh-50;
        var starLeft = Math.random()*dw;
        var stopLeft = Math.random()*dw;
        var starOpcity = 0.7+Math.random()*0.3;
        var snowSpeed = 5000+Math.random()*3000;//雪花下落的速度
        /******     在调用body时应该用$("body")          * */
        $(flak).clone().appendTo($("body")).css({
            "left":starLeft,
            "opcity":starOpcity,
            "font-size":snowSize,
            "color":flakColor,
        }).animate({
            "top":stopTop,
            "left":stopLeft,
            "opcity":"0.1",
        },snowSpeed,function(){
            $(this).remove();
        })
    },snowTime)
}

