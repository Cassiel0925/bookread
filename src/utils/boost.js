// prototype -> 所有的 JavaScript 对象都会从一个 prototype（原型对象）中继承属性和方法。
// indexOf -> indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。如果没有找到匹配的字符串则返回 -1。

Array.prototype.pushWithoutDuplicate = function() {
    for (let i = 0; i < arguments.length; i++) {
        const arg = arguments[i]
        if (this.indexOf(arg) === -1) {
            this.push(arg)
        }
    }
}