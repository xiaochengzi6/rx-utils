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
})()(
  /**
   * 优化负载函数
   */

  (function () {
    // 通过 self 来去确定在浏览器以及 web worker 中都能正常的工作
    //
    var root =
      (typeof self === 'object' && self.window === self && self) ||
      typeof global === 'object'
  })()
)
