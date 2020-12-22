var content = document.getElementById("content");
var bottom = document.getElementById("bottom");
var wrapp=document.getElementsByTagName('div')[0];
var code,
    num,
    right=0,
    error=0,
    rate=0;
function show() {
  num = Math.floor(Math.random() * 26 + 65);
  code = String.fromCharCode(num);
  content.innerHTML = code;
}
show();
document.addEventListener(
  "keydown",
  function(e) {
    var key = e.keyCode;
    if (key == num) {
        // flag=true;
      show();
     right++;
     content.className='animated zoomIn';
    } else {
       
        // if(flag){
            content.style.color = "red";
            error++;
            content.className='animated shake';
            show();
            // flag=false;
        // }

    }
    result();
    setTimeout(test,700);
  },
  false
);
function test(){
    content.style.color='aqua';
    content.className='';
}
function result(){
    var rate=right/(right+error)*100;
    bottom.innerHTML="正确"+right+"个"+""+"错误"+error+"个"+""+"正确率"+rate.toFixed(2)+"%";
}
