/**
 * 提供负载对象 包装功能函数
 */
;(function () {
  var root = this

  var _ = {}

  root._ = _

  // 添加函数 所有的函数都通过 _ 去挂载
  _.reverse = function (string) {
    return string.split('').reverse().join('')
  }
})()
function isFunction(obj) {
  return typeof obj === 'function'
}
/**
 * 优化负载函数
 */
;(function () {
  // 通过 self 来去确定在浏览器以及 web worker 中都能正常的工作
  var root =
    (typeof self === 'object' && self.window === self && self) ||
    (typeof global === 'object' && global.global === global && global) ||
    this ||
    {}

  var _ = function (obj) {
    if (obj instanceof _) return obj
    if (!(this instanceof _)) return new _(obj)
    this._wrapped = obj
  }

  var ArrayProto = Array.prototype
  var push = ArrayProto.push

  /**
   * --------------- 添加功能函数 ---------------
   * 由于这里都是将功能函数挂载到 _ 对象上面 但并不能直接使用还需要将其复制到原型链上才能使用
   */
  _.log = function (obj) {
    console.log(obj)
  }
  // --------------- 结束 ---------------

  /**
   * 这里先获取 _ 对象上面的函数然后存放在 原型链 上
   */
  _.functions = function (obj) {
    var names = []
    for (var key in obj) {
      if (isFunction(key)) {
        names.push(key)
      }
    }
    return names.sort()
  }

  _.each = function (obj, callback) {
    var length,
      i = 0

    if (isArrayLike(obj)) {
      length = obj.length
      for (; i < length; i++) {
        if (callback.call(obj[i], i, obj[i]) === false) {
          break
        }
        d
      }
    } else {
      for (i in obj) {
        if (callback.call(obj[i], i, obj[i] == false)) {
          break
        }
      }
    }

    return obj
  }

  /**
   * 链式调用的核心是功能函数能够返回它对 _ 对象(也就是 this)处理的结果 this._wrapped
   * 每个函数都会去判断当前的属性 _chain 是否 true 这样 就能使用 chain() 函数包裹然后返回一个
   * 带有 _._wrapped 值的对象
   * @param {*} obj
   */
  _.chain = function (obj) {
    if (!(this instanceof _)) return new _(obj)
    var instance = _(obj)
    instance._chain = true
    return instance
  }

  var chainFunc = function (instance, obj) {
    // 这里 _ 是默认不进行链式调用的 使用链式调用后才能通过这样的方式使用
    return instance._chain ? _.chain(obj) : obj
  }

  _.value = function () {
    return this._wrapped
  }
  /**
   * 这里就将 _ 对象上的函数全部复制到了原型链上
   * @param {*} obj
   */
  _.mixin = function (obj) {
    _.each(_.functions(obj), function (name) {
      var func = (_[name] = obj[name])
      _.prototype[name] = function () {
        var args = [this._wrapped]
        push.apply(args, arguments)
        return chainFunc(this, func.apply(_, args))
      }
    })
  }

  /**
   * 导出
   * 为了防止id= 'export' 的元素 会挂载到 window 上 typeof window.export === 'object'
   */
  if (typeof exports != 'function' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _
    }
    exports._ = _
  } else {
    root._ = _
  }
})()
