var go = document.getElementById("go");
var main = document.getElementsByClassName("main")[0];
var colors = ["#000", "#f40", "blue", "yellow", "green"];
var time,
  speed = 5,
  num = 0,
  flag = true;
var reset = document.querySelector('#reset');
//重新开始游戏
reset.addEventListener('click', function () {
  document.location.reload();
})
//开始游戏 点击
go.onclick = function () {
  go.style.display = "none";
  move();
};

//填充div
function aDiv() {
  //column 列  row 行
  var row = document.createElement("div");
  row.setAttribute("class", "row");
  var index = Math.floor(Math.random() * 4);
  var random = Math.floor(Math.random() * 5);

  for (var i = 0; i < 4; i++) {
    var column = document.createElement("div");
    row.appendChild(column);
  }
  if (main.childNodes.length == 0) {
    main.appendChild(row);
  } else {
    main.insertBefore(row, main.childNodes[0]);
  }
  var colorDiv = main.childNodes[0].childNodes[index];
  colorDiv.style.backgroundColor = colors[random];
  colorDiv.setAttribute("class", "color");
}
//运动
function move() {
  clearInterval(time);
  time = setInterval(function () {
    var star = parseInt(main.offsetTop) + speed;
    main.style.top = star + "px";
    if (main.offsetTop >= 0) {
      aDiv();
      main.style.top = "-150px";
    }

    var len = main.childNodes.length;
    // if(len == 7){
    //     clearInterval(time);
    // }
    if (len == 7) {
      for (var i = 0; i < 4; i++) {
        if (
          main.childNodes[len - 2].childNodes[i].classList.contains("color")
        ) {
          alert("游戏结束，得分 ： " + num);
          clearInterval(time);
          flag = false;
        }
      }
      main.removeChild(main.childNodes[len - 1]);
    }
  }, 50);
}

//点击
function on() {
  main.onclick = function (e) {
    if (flag) {
      var tar = e.target;
      if (tar.className == "color") {
        num++;
        tar.style.backgroundColor = "#ccc";
        tar.classList.remove("color");
        // 填入得分
        document.querySelector(".goal").innerText="分数："+ num;
      } else {
        alert("游戏结束，得分 ： " + num);
        clearInterval(time);
        flag = false;
      }
      if (num % 2 == 0) {
        speed++;
      }
    }
  };
}
on();
