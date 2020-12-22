$(function () {
    class Song {
        constructor() {
            this.obj = {}//存放歌词
            this.music = $('#music');
            this.init();
        }
        init() {
            this.songStr = `[00:00.00]好好说再见-陶喆&关诗敏
[00:00.99]我爱过妳笑的脸庞
[00:07.28]我爱过妳心的善良
[00:14.21]这些年有妳的时光
[00:19.23]把我的孤独都照亮
[00:27.59]我记得妳说过的话
[00:31.64]时间留不住一句话
[00:34.32]我记得曾为妳疯狂
[00:37.47]何时过了年少轻狂
[00:41.01]当情太深而缘太浅
[00:43.97]当你离开我的世界
[00:47.60]至少要好好说再见
[00:50.58]要怎么好好说再见
[00:55.49]一直以为真爱能直到永远
[01:02.19]彼此相爱的每一天都是永远
[01:08.83]一直以为我们有同一个明天
[01:15.48]你曾是我的世界不完整的世界
[01:27.63]如果花谢了会再开
[01:31.38]如果错了的还能改
[01:40.87]这些年累积的关怀
[01:45.28]怎能说不在就不在
[01:54.30]感情不该一直受伤
[01:57.59]为何爱总是带着伤
[02:00.92]我不愿让妳再失望
[02:04.39]有期望才会有失望
[02:07.64]当幸福碎成一片片
[02:11.04]一颗心碎成一片片
[02:14.24]至少要好好说再见
[02:17.19]要怎么好好说再见
[02:22.18]一直以为真爱能直到永远
[02:28.90]彼此相爱的每一天都是永远
[02:35.38]一直以为我们有同一个明天
[02:42.16]你曾是我的世界不完整的世界
[02:57.49]相信妳会过得更好
[03:02.53]我还不想把你忘掉
[03:10.84]别丢弃妳无邪的笑
[03:15.24]再见面还可以拥抱
[03:24.42]我记得妳说过的话
[03:27.78]时间留不住一句话
[03:31.03]我记得曾为妳疯狂
[03:33.85]何时过了年少轻狂
[03:37.64]当爱情不再像从前
[03:41.42]你永远是我的从前
[03:47.77]原谅我沉默的再见
[03:55.18]歌词分享QQ122121036
[04:05.09]`
            this.getLyric();
            this.musicPlay();
        }
        /**
         * 把歌词分割完
         * 分割完的歌词放入对象里面
         */
        getLyric() {
            let parts = this.songStr.split('\n'); // 用回车分割歌词，把每一句放入数组
            let reg = /\[/; // 正则判断 [ 
            for (let i = 0; i < parts.length; i++) {
                //获取歌词时间
                let time = parts[i].split(']')[0];
                // 用正则找到 [  再用replace替换成 ''
                let index = time.match(reg).index;
                time = time.replace(time[index], '');
                // 把时间转换成秒
                let timeParts = time.split(':');
                time = parseInt(timeParts[0]) * 60 + parseFloat(timeParts[1]);
                //获取歌词
                let words = parts[i].split(']')[1];
                this.obj[time] = words;
            }
            this.setLi();
        }
        /**
         * 把歌词放进li中
         * */
        setLi() {
            for (let key in this.obj) {
                $('ul').append($(`<li>${this.obj[key]}</li>`))
            }
        }
        /**
         * 根据时间来给相应的歌词添加样式
         * 想要调用currentTime要用this.music[0]
         * 移动ul的top值
         */
        musicPlay() {
            let ulTop = parseFloat($('ul').css('top'));
            this.timer = setInterval(() => {
                this.currentLi = 0;
                for (let key in this.obj) {
                    if (this.music[0].currentTime < key) {
                        $('ul li').removeClass('active');
                        $($('ul li').get(this.currentLi - 1)).addClass('active');
                        // 移动ul的top值
                        $('ul').css({
                            top: ulTop - $('ul li').height() * (this.currentLi - 1)
                        })
                        return;
                    } else {
                        this.currentLi++;
                    }
                }
            }, 1000)
        }



    }
    new Song()
})