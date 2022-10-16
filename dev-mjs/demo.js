var a = Symbol('default')
var b = Symbol.prototype.valueOf
var c = b.call(a)

console.log(a == c )
console.log(a === c )