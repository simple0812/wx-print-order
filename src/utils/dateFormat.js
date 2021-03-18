import moment from 'moment';

export default function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

// 今天： 1， 周 ： 2 月： 3 全部 4
export function getRangeTimeByType(type = 1 ) {

    let now = moment();
    let end = moment();
    if (type ===1) {
        return {
            start: end.format('YYYY-MM-DD 00:00:00'),
            end:now.format('YYYY-MM-DD 23:59:59'),
        }
    }

    if (type == 2) {
        let week = end.subtract(7, 'days');
        return {
            start: week.format('YYYY-MM-DD 00:00:00'),
            end:now.format('YYYY-MM-DD 23:59:59'),
        }
    }

    if (type == 3) {
        let month = end.subtract(1, 'months');
        return {
            start: month.format('YYYY-MM-DD 00:00:00'),
            end:now.format('YYYY-MM-DD 23:59:59'),
        }
    }

    if (type == 4) {
        return {
            start: '2000-01-01 00:00:00',
            end:now.format('YYYY-MM-DD 23:59:59'),
        }
    }
    return {
        start: '',
        end: ''
    }

}

export const  dateTypes = [{ title: '今天', type: 1 }, { title: '一周内', type: 2 }, { title: '一月内', type: 3 }, { title: '全部', type: 4 }]

