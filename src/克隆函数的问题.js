/**
 * 一般都是克隆函数的引用就行 实打实的克隆可能不太显示
 * 
 * 克隆函数有两个方法 但是都互有利弊
 * 
 * 1、使用 function.toString() 获得函数的 字符串类型 然后使用 eval() 去执行 但
 *    这里明显的缺点就是会丢失参数、this、返回值等不是特别的好
 * 2、使用 new Function() 去创建，使用正则去匹配函数，但是缺点就是不能处理箭头函数。。。
 * 
 * 
 * 这里写了一个基于第一种方式创建的函数 但是问题很严重
 * 
 * 
 * @param {Function} func 参数为函数
 * @returns {*} 
 */

 function clone_func(func){
  // 没有toStirng 方法就会直接返回
  if(!func.toString) return function (){}
  
  // 没有函数名就会导致 eval() 不能正常的执行
  if(!func.name) {
    var funcName = 'RANDOM_FUNCTION_NAME_' + Math.random(1).toString(32).slice(2)

    // @see 修改函数名 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/name
    Object.defineProperty(func, 'name', {value: funcName, configurable: true}) 
  }

  var functionString = func.toString()
  // 让函数被自调用函数包裹起来这样 eval 在执行的时候就会自动的执行函数
  functionString = '(' + functionString + ')()'

  // 使用 bind() 函数返回一个被包裹后的函数 到时候通过调用后就能执行改函数
  return eval.bind(void 0, functionString)
}