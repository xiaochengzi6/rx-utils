/**
 * 节流函数
 * 1. 使用 flag
 * 2. 使用时间
 */

function throttle(fn, delay = 300) {
  var isThrottling = false

  return function () {
    var context = this
    if (!isThrottling) {
      isThrottling = true
      setTimeout(() => {
        fn.apply(context, arguments)
      }, delay)
    }
  }
}

function throttle(fn, delay = 300) {
  var timer

  var throttleFn = function () {
    var context = this
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(context, arguments)
    }, delay)
  }

  throttleFn.cancel = function () {
    clearTimeout(timer)
  }

  return throttleFn
}

function throttle(fn, delay = 300) {
  var timerDate = + new Date()

  var throttleFn = function () {
    var context = this,
      current = + new Date()
    if (delay < current - timerDate) {
      // 修改设备事件
      if (delay < 0) {
        return fn.apply(context, arguments)
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(context, arguments)
      }, delay)
    }
  }

  throttleFn.cancel = function () {
    clearTimeout(timer)
  }

  return throttleFn
}