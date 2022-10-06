// 链式调用例子
var _ = function (obj) {
  if(obj instanceof _) return obj
  if (!(this instanceof _)) return new _(obj)
  this._wrapped = obj
}
_.chain = function (obj) {
  var instance =  _(obj)
  instance._chain = true
  return instance
}
_.prototype.chain = function(obj){
  var instance =  _(obj)
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

var chainFunc = function (instance, obj) {
  return instance._chain ? _.chain(obj) : obj
}
var result = _.chain([1, 2, 3, 4, 5]).push(1).shift().value()
console.log(result)


