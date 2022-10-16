/**
 * 克隆函数 
 * @param {*} func 
 * @returns 
 */
export default function cloneFunction(func){
  return func || {}
}

/**
 * 克隆函数这里也有许多问题 我深度研究过
 * 具体方法两种 但这两种都明显不科学
 * 1、使用 eval 
 * 2、使用 new Function ()
 * 
 * @see https://github.com/xiaochengzi6/Blog/issues/5#issuecomment-1272406786
 * 如果深入的学习过函数作用域的都知道 函数在创建或者说在书写的时候就已经明确函数的作用域了
 * 你在重新创建函数岂不是会丢失 this 以及其内部标识符查询时无法按照原先的作用域链访问索引符
 * 还是就是使用 new Function () 它不能够为 箭头函数创建函数，第二个就是使用 new Function ()创建的函数
 * 作用域链的查找过程是 scope = Ao + globAO  因为 new Function 是在全局定义的有且只有一个...
 */


/**
 * 使用 eval 克隆函数的实现 
 * 
 * 
 * 复制函数
 * 缺点：丢失 this 丢失 prototype 丢失很多东西 只能往外面传不能收
 * 函数的参数不能接收 因为被 ()() 包裹 函数的返回值也不能在合适的位置收到
 * @param {*} target 
 * @param {*} context 
 * @returns 
 */
 function cloneFunc_test_demo_bad(target){
  if(!target.toString) return function (){}
  if(!target.name) {
    console.log('sss')
    var funcName = 'RANDOM_FUNCTION_NAME_' + Math.random(1).toString(32).slice(2)
    /**
     * @see 修改函数名 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/name
     */
    Object.defineProperty(target, 'name', {value: funcName,configurable: true}) 
  }
  var funcToString = target.toString()
  // 将函数包裹成IIFE类型从而能够子调用
  funcToString = '(' + funcToString + `)()`
  var result = eval.bind(Object.create({}), funcToString)
  return result
}