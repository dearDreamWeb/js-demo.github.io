(function () {
    class Calendar {
        constructor() {
            this.year = document.querySelector(".calendar-wrapper .calendar-header .year"); // 年份的选项
            this.month = document.querySelector(".calendar-wrapper .calendar-header .month"); // 月份的选项
            this.btn = document.querySelector(".calendar-wrapper .calendar-header .btn"); // 今天的按钮
            this.content = document.querySelector(".calendar-wrapper .calendar-content");  // 填充日期
            this.selectYear; // 选中的年
            this.selectMonth; // 选中的月 
            this.init();
        }
        init() {
            this.setYearMonth();
            this.selectFresh();
            this.today();
            this.selectYear = this.year.value; // 初始化选中的年
            this.selectMonth = this.month.value; // 初始化选中的月 
            this.createElementSpan();
            this.selectToday();
        }
        /**
         * 填充每个月的日期和第一行显示上个月的月末日期
         */
        createElementSpan() {
            this.content.innerHTML = "";
            let date = new Date(this.selectYear, this.selectMonth, 0);
            let days = date.getDate(); // 获取这个月有多少天
            let date1 = new Date(this.selectYear, (this.selectMonth - 1));
            let week = date1.getDay();  // 获取这个月的一号是星期几
            let date2 = new Date(this.selectYear, (this.selectMonth - 1), 0);
            let lastMonthDays = date2.getDate(); // 获取上个月总共有多少天
            week === 0 ? week = 7 : week;
            // 空出几个上个月的格子,并把给个class类名，并填充上个月日期
            for (let i = (week - 1); i > 0; i--) {
                let day = lastMonthDays - i + 1;
                let span = document.createElement("span");
                span.innerText = day;
                span.className = "lastMonth";
                this.content.appendChild(span);
            }
            // 遍历这个月的日期
            for (let i = 1; i <= days; i++) {
                let span = document.createElement("span");
                span.innerText = i;
                this.content.appendChild(span);

                // 当是今天的日期的话，添加class类名
                if (new Date().getDate() == i
                    && new Date().getFullYear() == this.selectYear
                    && (new Date().getMonth() + 1) == this.selectMonth) {
                    span.className = "today";
                }
            }
        }

        /**
         * 选择年和月时,刷新一下日期
         */
        selectFresh() {
            // 选择的年
            this.year.onclick = null;
            this.year.onclick = () => {
                this.selectYear = this.year.value;
                this.createElementSpan();
            }
            // 选择的月
            this.month.onclick = null;
            this.month.onclick = () => {
                this.selectMonth = this.month.value;
                this.createElementSpan();
            }
        }

        /**
         * 创建选项中年和月
         */
        setYearMonth() {
            for (let i = 1980; i < 2081; i++) {
                let optionYear = document.createElement("option");
                optionYear.value = i;
                optionYear.innerText = i;
                this.year.appendChild(optionYear);
            }
            for (let i = 1; i < 13; i++) {
                let optionMonth = document.createElement("option");
                optionMonth.value = i;
                optionMonth.innerText = i;
                this.month.appendChild(optionMonth);
            }
        }

        /**
         * 显示今天日期
         */
        today() {
            this.year.value = new Date().getFullYear();
            this.month.value = new Date().getMonth() + 1;
        }

        /**
         * 点击按钮回到今天的日期
         */
        selectToday() {
            this.btn.onclick = null;
            this.btn.onclick = () => {
                this.today();
                this.selectYear = this.year.value;
                this.selectMonth = this.month.value;
                this.createElementSpan();
            }
        }
    }
    new Calendar();
}())