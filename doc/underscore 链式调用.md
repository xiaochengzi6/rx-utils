## underscore 中链式调用

简单的例子

~~~js
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

console.log(result) // [ 2, 3, 4, 5, 1 ]
~~~

到这里没什么问题，每一次函数处理都是对 this._wrapped 中进行处理，处理后如果是链式调用就会返回一个对象 `{_wrapped: Value, _chain: true}` 这个对象是 `_` 的实例 在 underscore 源码中我们可以发现 

~~~ js
var chainFunc = function (instance, obj) {
  // ----------------------- V -- 这里和我们写的不一样
  return instance._chain ? _(obj).chain() : obj
}
~~~

当我们去替换过来时就会发现它会抛错，原因是 underscore 会将所有绑定到 `_` 对象的方法全部挂载到 原型链上 这就导致 `chain` 函数也被同样的方式挂载了，现在主要看一下处理的思路

~~~js
var chainFunc = function (instance, obj) {
  // 2. 这里 chain() 这里传入的参数为空 
  return instance._chain ? _(obj).chain() : obj
}

_.chain = function (obj) {
  // 3. 重点在这里 通过第一步的 this._wrapped 传入后会创建一个对象
  var instance =  _(obj)
  instance._chain = true
  return instance
}

_.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
        var func = _[name] = obj[name];
        _.prototype[name] = function() {
            // 1. 注意这里 它将 this._wrapped 也传入进去
            var args = [this._wrapped];
            push.apply(args, arguments);
            return chainResult(this, func.apply(_, args));
        };
    });
    return _;
};

_.mixin(_);
~~~

现在就清楚明了了 为什么 underscore会这样写`_(cahin).chain()` 通过置空 chain() 中的参数让其获得"纯净"(这里的纯净可以理解为最新的数据)的 `this._wrapped` 



当然这里有点小技巧很容易去忽略这个问题，写的很巧妙以致于大家都会以为想当然是这样但结果很容易"差之千里"

看一段代码

~~~js
var push = Array.prototype.push


function demo(value){
  var arr = [1, 2]
   push.call(arr, arguments)
   return arr
}
var result = demo(3)

function test(a){
  console.log('value:',a)
}

// 注意这里
test.apply(this, result) // 不妨假设一下这里打印什么
~~~

答案是 1 

猜错的话就说明是忽略了这个问题了 源码中也这样写到

~~~js
var args = [this._wrapped];
push.apply(args, arguments);
return chainResult(this, func.apply(_, args));
~~~

所以就很容易能够理解了 `function chain(obj)` 是如何获得 `this._wrapped`



