function memoize(func, deps){
  if(typeof func !== 'function'){
    throw new Error(`memoized(func, deps) func: no function`)
  }
  function memoized(key) {
    const address = deps ? deps : key 
    const cache = memoized.cache
    if(cache.has(address)){
      return cache.get(address)
    }
    const result = func.apply(this, arguments)
    memoized.cache = cache.set(address, result) || cache
    return result 
  }

  memoized.cache = new Map()
  return memoized
}
var value = 1

const a = memoize(function () {
  console.log('value_a', value)
}, [])

value = 2

function b() {
  console.log('value_b:', value)
}

console.log('memoized:', a(), b())

// 实际上的原理:
// function () { value ++ } ==> function (value) { value ++ }

// 这里很难去呈现出效果