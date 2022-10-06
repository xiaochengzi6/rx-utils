/**
 * 传入的剩余参数 
 * 
 * 如果传入超过函数原本的参数那么都会以 rest 参数的方式传入进去
 * 原理：(1, 2, ...res) => apply(x, [1, 2, [x, x, x]])
 * @param {*} func 函数 
 * @param {*} startIndex 从第几位开始指定 rest  
 */
export default function restArguments(func, startIndex){
  startIndex = startIndex == null ? func.length - 1 : +startIndex
  return function (){
    var length = Math.max(arguments - startIndex, 0),
        rest = Array(length),
        index = 0
    for(; index < length; index++){
      rest[index] = arguments[length + index]
    }

    // 当传入的函数的参数小于等于1时就不会进入到这里面
    switch(startIndex){
      case 0: return func.call(this, rest)
      case 1: return func.call(this, arguments[0], rest)
      case 2: return func.call(this, arguments[0], arguments[1], rest)
    }

    var args = Array(length + 1)
    for(index = 0; index < startIndex; index++){
      args[index] = arguments[index]
    }
    args[startIndex] = rest
    return func.apply(this, args)
  }
}