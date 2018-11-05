class Formator {
    constructor() {

    }

    relativeTime(data) {
        if (!data) { return '参数不能为空' }
        let dateObj
        if (typeof data === 'string' || typeof data === 'number') {
            dateObj = new Date(dateObj)
        } else if (typeof data === 'object') {
            dateObj = data
        } else { return '参数只能是字符串、数字或者日期时间对象' }
        let now = Date.now()
        let time = dateObj.getTime()
        let space = (now - time) / 1000 //秒
        if (space < 60) { return '刚刚' }
        if (space < 60 * 60) {
            return Math.floor(space / 60) + '分钟前'
        }
        if (space < 60 * 60 * 24) {
            return Math.floor(space / (60 * 60)) + '小时前'
        } else {
            return Math.floor(space / (60 * 60 * 24)) + '天前'
        }
    }

    timeStr() {

    }
}

export default Formator