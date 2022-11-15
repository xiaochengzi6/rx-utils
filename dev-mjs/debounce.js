
function debounce(fn, wait, advance) {
  var timer = null

  var debounced = function () {
    var context = this
    var result

    if (timer) { clearTimeout(timer) }

    if (advance) {
      var type = !timer
      timer = setTimeout(() => {
        type = true
      }, wait)
      if (type) {
        result = fn.apply(context, arguments)
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(context, arguments)
      }, wait)
    }

    return result
  }

  debounced.cancel = function () {
    clearTimeout(timer)
  }

  return debounced
}

// === test ===

const a = debounce(function () {
  console.log('1')
}, 1000, false)

a()

setTimeout(a, 2000)
setTimeout(a, 4000)