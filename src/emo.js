// 链式调用
var _ = function (obj) {
  if (!(this instanceof _)) return new _(obj)
  this._wrapped = obj
}

/**
 * 返回一个对象
 * @param {*} obj
 * @returns
 */
_.chain = function (obj) {
  var instance = new _(obj)
  instance._chain = true
  return instance
}

_.prototype.push = function (obj) {
  this._wrapped.push(obj)
  return chainFunc(this, this._wrapped)
}

_.prototype.shift = function (obj) {
  this._wrapped.shift(obj)
  return chainFunc(this, this._wrapped)
}
_.prototype.value = function () {
  return this._wrapped
}
// _.chain([1,2,3,4,5]).push(5).shift()
var chainFunc = function (instance, obj) {
  return instance._chain ? _.chain(obj) : obj
}
const result = _.chain([1, 2, 3, 4, 5]).push(6).shift().value()
const result1 = _.chain(result).shift()
console.log(result)
