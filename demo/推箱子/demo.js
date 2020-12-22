$(function () {
    class Game {
        constructor() {
            this.game = $('#game');
            this.width = $(this.game).width();
            this.height = $(this.game).height();
            this.init();

        }
        init() {
            /**
             * 地图数据，当前地图有哪些东西，位置在哪
             * 0、空白
             * 1、玩家
             * 2、墙
             * 3、箱子
             * 4、正确位置
             */
            this.map = [
                [0, 0, 2, 2, 2, 2, 2, 0, 0],
                [0, 0, 2, 0, 1, 0, 2, 0, 0],
                [0, 0, 2, 0, 3, 0, 2, 0, 0],
                [2, 2, 2, 0, 0, 0, 2, 2, 2],
                [2, 0, 0, 0, 3, 0, 0, 0, 2],
                [2, 0, 3, 3, 3, 3, 3, 0, 2],
                [2, 0, 0, 0, 3, 0, 0, 0, 2],
                [2, 2, 0, 3, 3, 3, 0, 2, 2],
                [0, 0, 2, 0, 0, 0, 2, 0, 0],
                [0, 0, 2, 0, 3, 0, 2, 0, 0],
                [0, 0, 2, 0, 0, 0, 2, 0, 0],
                [0, 0, 2, 2, 2, 2, 2, 0, 0]
            ]
            /**
             * 记录箱子的正确位置
             */
            this.correct = [
                { row: 3, col: 4 },
                { row: 4, col: 4 },
                { row: 5, col: 2 },
                { row: 5, col: 3 },
                { row: 5, col: 4 },
                { row: 5, col: 5 },
                { row: 5, col: 6 },
                { row: 6, col: 4 },
                { row: 7, col: 4 },
                { row: 8, col: 4 },
                { row: 9, col: 4 },
                { row: 10, col: 4 },
            ]
            /**
             * 记录玩家的初始位置
             */
            this.playerPoint = {
                row: 1,
                col: 4
            }
            this.curDisplay();
            this.moveStar();
        }
        /**
         * 遍历div
         */
        curDisplay() {

            $(this.game).html('');//每次加载游戏前先清空

            for (let i = 0; i < 12; i++) {
                // 一行的数组
                let row = this.map[i];
                for (let j = 0; j < 9; j++) {
                    if (row[j] == 0 && !this.isCorrect(i, j)) {  //当时是空白且不是箱子正确位置的时候
                        continue; //不创建div了 ，继续下一步
                    }
                    //添加div进入$(this.game)
                    this.item = $('<div class="item"></div>');
                    $(this.game).append(this.item);

                    //每个div的排版
                    $(this.item).css({
                        left: parseInt(this.width / 9 * j) + 'px',
                        top: parseInt(this.height / 12 * i) + 'px',
                        width: parseInt(this.width / 9) + 'px',
                        height: parseInt(this.height / 12) + 'px',
                    })

                    //判断每个位置是什么
                    if (row[j] == 2) {
                        this.item.addClass('wall');
                    } else if (row[j] == 1) {
                        this.item.addClass('player');
                    } else if (row[j] == 3) {
                        /**
                         * 判断箱子是不是进入到了正确位置
                         */
                        if (this.isCorrect(i, j)) {
                            this.item.addClass('right');
                        } else {
                            this.item.addClass('error');
                        }

                    } else {
                        this.item.addClass('wait');
                    }
                }
            }
        }
        /**
         * 判断箱子是否在正确的位置
         * row：行的编号
         * col：列的编号
         */
        isCorrect(row, col) {
            for (let i = 0; i < this.correct.length; i++) {
                let point = this.correct[i];
                if (point.row == row && point.col == col) {
                    return true;
                }
            }
            // return false;
        }
        /**
         * 绑定键盘事件
         */
        moveStar() {
            $(window).off('keydown');
            $(window).on('keydown', (e) => {
                if (e.key === 'ArrowUp') {
                    this.playerMove('up');
                } else if (e.key === 'ArrowDown') {
                    this.playerMove('down');
                } else if (e.key === 'ArrowLeft') {
                    this.playerMove('left');
                } else if (e.key === 'ArrowRight') {
                    this.playerMove('right');
                }
                //判断游戏是否胜利
                if (this.isWin()) {
                    setTimeout(() => {
                        alert('游戏胜利');
                    }, 100)

                    $(window).off('keydown')
                }
            })
        }
        /**
         * 玩家移动
         */
        playerMove(direction) {
            //得到移动到目标点的坐标
            let targetPoint = this.getPoint(this.playerPoint.row, this.playerPoint.col, direction);
            //从地图中取出该位置的内容
            let target = this.map[targetPoint.row][targetPoint.col];
            //判断
            if (target == 0) {
                //要移动的位置如果是空白，交换位置
                this.changePiont(this.playerPoint, targetPoint);
                //更新玩家的坐标
                this.playerPoint.row = targetPoint.row;
                this.playerPoint.col = targetPoint.col;
                this.curDisplay();

            } else if (target == 3) {
                //目标位箱子时，判断要移动的箱子下一位是不是空白
                let boxForwardPoint = this.getPoint(targetPoint.row, targetPoint.col, direction);
                let boxForward = this.map[boxForwardPoint.row][boxForwardPoint.col];
                if (boxForward == 0) {
                    //只有箱子前面是空白才可以移动
                    this.changePiont(targetPoint, boxForwardPoint);
                    this.changePiont(this.playerPoint, targetPoint);
                    //更新玩家的坐标
                    this.playerPoint.row = targetPoint.row;
                    this.playerPoint.col = targetPoint.col;
                    this.curDisplay();

                }

            }
        }
        /**
         * 交换位置，实现移动效果
         *  */
        changePiont(point1, point2) {
            let change = this.map[point1.row][point1.col];
            this.map[point1.row][point1.col] = this.map[point2.row][point2.col];
            this.map[point2.row][point2.col] = change;
        }
        /**
         * 判断要移动的方向并计算出要移动的位置
         */
        getPoint(row, col, direction) {
            //point为玩家移动到的位置
            let point;
            if (direction == 'up') {
                point = {
                    row: row - 1,
                    col: col
                }
            } else if (direction == 'down') {
                point = {
                    row: row + 1,
                    col: col
                }
            } else if (direction == 'left') {
                point = {
                    row: row,
                    col: col - 1
                }
            } else if (direction == 'right') {
                point = {
                    row: row,
                    col: col + 1
                }
            }
            return point;
        }
        /**
         * 游戏是否胜利
         * 每次移动都会触发循环，只要有一个不等于3就会return false 终止循环，
         * 只有所有都等于3之后for循环才能进行完，才会触发return true
         */
        isWin() {
            for (let i = 0; i < this.correct.length; i++) {
                let cr = this.correct[i];
                if (this.map[cr.row][cr.col] != 3) {
                    return false;
                }
            }
            return true;
        }
    }
    new Game();
})