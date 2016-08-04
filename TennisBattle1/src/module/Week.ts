/**
 * Created by WangChong on 16/2/19.
 */
/**
 * Created by WangChong on 15/11/4.
 */
module Week
{
    export function getWeek(sdate) {
        var d = new Date(sdate);
        var myYear = d.getFullYear();
        var firstDate = new Date(myYear + "-01-01");
        var dayofyear = 0;
        for (var i = 0; i < d.getMonth(); i++) {
            switch (i) {
                case 0:
                case 2:
                case 4:
                case 6:
                case 7:
                case 9:
                    dayofyear += 31;
                    break;
                case 1:
                    if (isLeapYear(d)) {
                        dayofyear += 29;
                    }
                    else {
                        dayofyear += 28;
                    }
                    break;
                case 3:
                case 5:
                case 8:
                case 10:
                    dayofyear += 30;
                    break;
            }
        }
        dayofyear += d.getDate();
        var week = firstDate.getDay();
        var dayNum = dayofyear - (7 - week);
        var weekNum = 1;
        weekNum = weekNum + (dayNum / 7);
        if (dayNum % 7 != 0)
            weekNum = weekNum + 1;


        return parseInt(weekNum.toString());
    }
    function isLeapYear(date) {
        return (0 == date.getFullYear() % 4 && ((date.getFullYear() % 100 != 0) || (date.getFullYear() % 400 == 0)));
    }
}
