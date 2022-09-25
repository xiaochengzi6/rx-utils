;(function () {
  /**
   * self 浏览器环境和 web Worker，当self.window = self 等同于 window.window = window
   * 支持 global node 环境
   * 在沙箱中没有 window 也没有 global 所以使用 this
   * 小程序中没有 window 也没有 global 会启用严格模式 禁止使用 this 作为全局对象 所以是 {}
   */
  var root =
    (typeof self === 'object' && self === self.window && self) ||
    (typeof global === 'object' && global.global === global && global) ||
    this ||
    {}

  var _ = function (obj) {
    if (obj instanceof _) return obj
    if (!(this instanceof _)) return new _(obj)
    this._wrapped = obj
  }

  root._ = _
})()
