function debounceAsync(callback, wait) {
  let timeoutId = null 
  return (...args) => {
    if(timeoutId){
      clearTimeout(timeoutId)
    }

    return new Promise((resolve) => {
      const timeoutPromise = new Promise((resolve) => {
        timeoutId = setTimeout(resolve, wait)
      })
      // 上一个 promise 等待 wait 后会调用 callback 函数
      timeoutPromise.then(async () => {
        resolve(await callback(...args))
      })
    })
  }
}

// 使用

const a = async () => 7

const run = debounceAsync(a, 900)
const y = run()

console.log('y', y)

y.then(()=>{
  console.log('success')
})